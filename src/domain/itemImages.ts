import type { Item, ItemImage } from './models';

/** 返回物品结构化图片，兼容旧 imageUrls/imageUrl 字段。 */
export function getItemImages(item: Pick<Item, 'id' | 'imageUrl' | 'imageUrls' | 'images' | 'createdAt'>): ItemImage[] {
  if (item.images?.length) return item.images;

  const urls = item.imageUrls.length ? item.imageUrls : item.imageUrl ? [item.imageUrl] : [];
  return urls.map((url, index) => ({
    id: `legacy_${item.id}_${index}`,
    fileId: url,
    md5: '',
    thumbnailFileId: null,
    thumbnailMd5: null,
    createdAt: item.createdAt
  }));
}

/** 返回用于详情预览的原图地址列表。 */
export function getItemImageFileIds(item: Pick<Item, 'id' | 'imageUrl' | 'imageUrls' | 'images' | 'createdAt'>): string[] {
  const images = getItemImages(item);
  if (images.length) return images.map((image) => image.fileId);

  return item.imageUrls.length ? item.imageUrls : item.imageUrl ? [item.imageUrl] : [];
}

/** 返回首页封面图，优先使用缩略图。 */
export function getItemThumbnail(item: Pick<Item, 'id' | 'imageUrl' | 'imageUrls' | 'images' | 'createdAt'>): string | null {
  const firstImage = getItemImages(item)[0];
  return firstImage?.thumbnailFileId ?? firstImage?.fileId ?? item.imageUrls[0] ?? item.imageUrl ?? null;
}
