import type { ItemImage } from '@/domain/models';

export interface ChooseImagesInput {
  currentImages: EditableImage[];
  previousImages: ItemImage[];
  maxCount: number;
}

export interface PrepareItemImagesInput {
  familyId: string;
  itemId?: string;
  draftId: string;
  images: EditableImage[];
  previousImages: ItemImage[];
}

export interface ChooseImagesResult {
  images: EditableImage[];
  ignoredDuplicateCount: number;
  rejectedFormatCount: number;
}

export interface PreparedItemImagesResult {
  images: ItemImage[];
  uploadedFileIds: string[];
}

export interface PreviewImagesInput {
  urls: string[];
  current: string;
}

export type EditableImage = RemoteEditableImage | LocalEditableImage;

export interface RemoteEditableImage extends ItemImage {
  kind: 'remote';
}

export interface LocalEditableImage {
  kind: 'local';
  localId: string;
  localPath: string;
}

export interface ImageStorage {
  /** 选择图片并返回本次应加入表单的图片资源。 */
  chooseImages(input: ChooseImagesInput): Promise<ChooseImagesResult>;
  /** 在保存物品前准备可持久化的图片资源。 */
  prepareItemImages(input: PrepareItemImagesInput): Promise<PreparedItemImagesResult>;
  /** 清理一组云存储文件。 */
  deleteFiles(fileIds: string[]): Promise<void>;
  /** 预览一组图片。 */
  previewImages(input: PreviewImagesInput): Promise<void> | void;
}
