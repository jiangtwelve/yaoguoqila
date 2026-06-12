import type { ItemImage } from '@/domain/models';
import type {
  ChooseImagesInput,
  ChooseImagesResult,
  EditableImage,
  ImageStorage,
  PrepareItemImagesInput,
  PreparedItemImagesResult,
  PreviewImagesInput
} from '@/services/contracts/imageStorage';
import { chooseLocalImages, previewLocalImages } from '@/services/platform/uniImage';

let localCounter = 0;

export class MockImageStorage implements ImageStorage {
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

  /** mock 模式直接把本地图片转换为可保存资源，不做云上传。 */
  async prepareItemImages(input: PrepareItemImagesInput): Promise<PreparedItemImagesResult> {
    return {
      images: input.images.map((image) => toItemImage(image)),
      uploadedFileIds: []
    };
  }

  /** mock 模式无需清理云存储。 */
  async deleteFiles(): Promise<void> {}

  /** 调用平台图片预览能力。 */
  previewImages(input: PreviewImagesInput): void {
    previewLocalImages(input.urls, input.current);
  }
}

function createLocalEditableImages(paths: string[]): EditableImage[] {
  return paths.map((path) => ({
    kind: 'local',
    localId: createLocalImageId(),
    localPath: path
  }));
}

/** 转换为可保存的 ItemImage。 */
function toItemImage(image: EditableImage): ItemImage {
  if (image.kind === 'remote') {
    const { kind: _kind, ...itemImage } = image;
    return itemImage;
  }

  return {
    id: image.localId,
    fileId: image.localPath,
    md5: null,
    thumbnailFileId: image.localPath,
    thumbnailMd5: null,
    createdAt: new Date().toISOString()
  };
}

/** 创建本地图片临时 ID。 */
function createLocalImageId(): string {
  localCounter += 1;
  return `local_${Date.now()}_${localCounter}`;
}
