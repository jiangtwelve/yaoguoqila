import type { ItemImage } from '@/domain/models';
import type { ChooseImagesResult, EditableImage, PreparedItemImagesResult } from './contracts/imageStorage';
import { imageStorage } from './adapters/imageStorage';

export interface ChooseItemImagesInput {
  currentImages: EditableImage[];
  previousImages: ItemImage[];
  maxCount: number;
}

export interface PrepareItemImagesForSaveInput {
  familyId: string;
  itemId?: string;
  draftId: string;
  images: EditableImage[];
  previousImages: ItemImage[];
}

export interface PreviewItemImagesInput {
  urls: string[];
  current: string;
}

/** 选择物品图片并返回新增图片资源。 */
export async function chooseItemImages(input: ChooseItemImagesInput): Promise<ChooseImagesResult> {
  return imageStorage.chooseImages(input);
}

/** 保存物品前准备可持久化的图片资源。 */
export async function prepareItemImagesForSave(input: PrepareItemImagesForSaveInput): Promise<PreparedItemImagesResult> {
  return imageStorage.prepareItemImages(input);
}

/** 清理本次保存失败后产生的云存储图片。 */
export async function deleteUploadedItemImages(fileIds: string[]): Promise<void> {
  return imageStorage.deleteFiles(fileIds);
}

/** 预览物品图片。 */
export function previewItemImages(input: PreviewItemImagesInput): Promise<void> | void {
  return imageStorage.previewImages(input);
}
