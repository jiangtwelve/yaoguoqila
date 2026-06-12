import type { ItemImage } from '@/domain/models';
import type {
  ChooseImagesInput,
  ChooseImagesResult,
  EditableImage,
  ImageStorage,
  PrepareItemImagesInput,
  PreparedItemImagesResult,
  PreviewImagesInput,
  RemoteEditableImage
} from '@/services/contracts/imageStorage';
import { chooseLocalImages, previewLocalImages } from '@/services/platform/uniImage';
import { compressLocalImage } from '@/services/platform/wxFile';
import { deleteCloudFiles, uploadCloudFile } from './wechatCloudClient';

const ITEM_IMAGE_STORAGE_DIR = 'item-images';
const ITEM_THUMBNAIL_STORAGE_DIR = 'item-thumbnails';
const CLOUD_FILE_PREFIX = 'cloud://';
const HTTP_FILE_PREFIX = 'http';
const STATIC_FILE_PREFIX = '/static/';
const WX_FILE_PREFIX = 'wxfile://';
const LOCAL_TEMP_PREFIX = 'http://tmp/';
const THUMBNAIL_QUALITY = 65;
let localCounter = 0;
let remoteCounter = 0;

export class CloudImageStorage implements ImageStorage {
  /** 选择图片并立即返回本地预览资源。 */
  async chooseImages(input: ChooseImagesInput): Promise<ChooseImagesResult> {
    const remainingCount = Math.max(0, input.maxCount - input.currentImages.length);
    if (remainingCount <= 0) return { images: [], ignoredDuplicateCount: 0, rejectedFormatCount: 0 };

    const result = await chooseLocalImages(remainingCount);
    return {
      images: createLocalEditableImages(result.paths),
      ignoredDuplicateCount: 0,
      rejectedFormatCount: result.rejectedFormatCount
    };
  }

  /** 上传本地图片并返回可保存到物品记录的图片资源列表。 */
  async prepareItemImages(input: PrepareItemImagesInput): Promise<PreparedItemImagesResult> {
    const uploadedFileIds: string[] = [];
    const images: ItemImage[] = [];

    for (const image of input.images) {
      if (image.kind === 'remote') {
        images.push(toItemImage(image));
        continue;
      }

      const imageId = createRemoteImageId();
      const fileId = await uploadCloudFile({
        filePath: image.localPath,
        cloudPath: createItemImageCloudPath(input, image.localPath, imageId)
      });
      uploadedFileIds.push(fileId);

      let thumbnailFileId: string | null = null;
      if (images.length === 0) {
        const thumbnailPath = await compressLocalImage(image.localPath, THUMBNAIL_QUALITY);
        thumbnailFileId = await uploadCloudFile({
          filePath: thumbnailPath,
          cloudPath: createItemThumbnailCloudPath(input, imageId)
        });
        uploadedFileIds.push(thumbnailFileId);
      }

      images.push({
        id: imageId,
        fileId,
        md5: null,
        thumbnailFileId,
        thumbnailMd5: null,
        createdAt: new Date().toISOString()
      });
    }

    return { images, uploadedFileIds };
  }

  /** 删除一组云存储文件。 */
  async deleteFiles(fileIds: string[]): Promise<void> {
    await deleteCloudFiles(filterCloudFileIds(fileIds));
  }

  /** 调用平台图片预览能力。 */
  previewImages(input: PreviewImagesInput): void {
    previewLocalImages(input.urls, input.current);
  }
}

/** 判断图片地址是否需要上传到云存储。 */
export function shouldUploadImage(url: string): boolean {
  if (!url) return false;
  if (url.startsWith(LOCAL_TEMP_PREFIX)) return true;
  if (url.startsWith(CLOUD_FILE_PREFIX)) return false;
  if (url.startsWith(HTTP_FILE_PREFIX)) return false;
  if (url.startsWith(STATIC_FILE_PREFIX)) return false;

  return url.startsWith(WX_FILE_PREFIX) || !url.includes('://');
}

/** 过滤出可删除的云存储 fileID。 */
export function filterCloudFileIds(fileIds: string[]): string[] {
  return [...new Set(fileIds.filter((fileId) => fileId.startsWith(CLOUD_FILE_PREFIX)))];
}

/** 生成原图云存储路径。 */
export function createItemImageCloudPath(input: Pick<PrepareItemImagesInput, 'familyId' | 'itemId' | 'draftId'>, filePath: string, imageId: string): string {
  return `${ITEM_IMAGE_STORAGE_DIR}/${input.familyId}/${getCurrentDateSegment()}/${getScopeSegment(input)}/${imageId}${getFileSuffix(filePath)}`;
}

/** 生成缩略图云存储路径。 */
export function createItemThumbnailCloudPath(input: Pick<PrepareItemImagesInput, 'familyId' | 'itemId' | 'draftId'>, imageId: string): string {
  return `${ITEM_THUMBNAIL_STORAGE_DIR}/${input.familyId}/${getCurrentDateSegment()}/${getScopeSegment(input)}/${imageId}.jpg`;
}

function createLocalEditableImages(paths: string[]): EditableImage[] {
  return paths.map((path) => ({
    kind: 'local',
    localId: createLocalImageId(),
    localPath: path
  }));
}

/** 转换为远程可编辑图片。 */
function toRemoteEditableImage(image: ItemImage): RemoteEditableImage {
  return { ...image, kind: 'remote' };
}

/** 转换为可保存的 ItemImage。 */
function toItemImage(image: RemoteEditableImage): ItemImage {
  const { kind: _kind, ...itemImage } = image;
  return itemImage;
}

/** 创建本地图片临时 ID。 */
function createLocalImageId(): string {
  localCounter += 1;
  return `local_${Date.now()}_${localCounter}`;
}

/** 创建远程图片资源 ID。 */
function createRemoteImageId(): string {
  remoteCounter += 1;
  return `img_${Date.now()}_${remoteCounter}`;
}

/** 返回云存储路径中的日期分区。 */
function getCurrentDateSegment(now = new Date()): string {
  const year = now.getFullYear();
  const month = `${now.getMonth() + 1}`.padStart(2, '0');
  const day = `${now.getDate()}`.padStart(2, '0');

  return `${year}-${month}-${day}`;
}

/** 返回云存储路径中的物品范围片段。 */
function getScopeSegment(input: Pick<PrepareItemImagesInput, 'itemId' | 'draftId'>): string {
  if (input.itemId) return input.itemId.startsWith('item') ? input.itemId : `item-${input.itemId}`;
  if (input.draftId.startsWith('draft')) return input.draftId;

  return `draft-${input.draftId}`;
}

/** 从本地路径中提取文件后缀。 */
function getFileSuffix(filePath: string): string {
  const cleanPath = filePath.split('?')[0] ?? '';
  const dotIndex = cleanPath.lastIndexOf('.');
  if (dotIndex < 0) return '.jpg';

  const suffix = cleanPath.slice(dotIndex).toLowerCase();
  return suffix.length > 1 && suffix.length <= 6 ? suffix : '.jpg';
}
