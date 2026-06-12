import { beforeEach, describe, expect, it, vi } from 'vitest';
import type { EditableImage } from '@/services/contracts/imageStorage';
import { CloudImageStorage, createItemImageCloudPath, createItemThumbnailCloudPath, filterCloudFileIds, shouldUploadImage } from './cloudImageStorage';
import { deleteCloudFiles, uploadCloudFile } from './wechatCloudClient';

vi.mock('./wechatCloudClient', () => ({
  deleteCloudFiles: vi.fn(),
  uploadCloudFile: vi.fn()
}));

vi.mock('@/services/platform/wxFile', () => ({
  compressLocalImage: vi.fn(async () => 'wxfile://tmp/thumb.jpg'),
  readLocalFileBuffer: vi.fn(async () => new Uint8Array([1, 2, 3]).buffer)
}));

const uploadCloudFileMock = vi.mocked(uploadCloudFile);
const deleteCloudFilesMock = vi.mocked(deleteCloudFiles);

const localImage: EditableImage = {
  kind: 'local',
  localId: 'local-1',
  localPath: 'wxfile://tmp/photo.jpg'
};

const remoteImage: EditableImage = {
  kind: 'remote',
  id: 'img-existing',
  fileId: 'cloud://env/existing.jpg',
  md5: 'md5-existing',
  thumbnailFileId: 'cloud://env/existing-thumb.jpg',
  thumbnailMd5: 'md5-thumb',
  createdAt: '2026-06-12T00:00:00.000Z'
};

describe('CloudImageStorage', () => {
  beforeEach(() => {
    uploadCloudFileMock.mockReset();
    deleteCloudFilesMock.mockReset();
    uploadCloudFileMock.mockImplementation(async ({ cloudPath }) => `cloud://env/${cloudPath}`);
  });

  it('uploads local image and thumbnail for cover before saving', async () => {
    const storage = new CloudImageStorage();

    const result = await storage.prepareItemImages({
      familyId: 'family-1',
      draftId: 'draft-1',
      images: [localImage],
      previousImages: []
    });

    expect(uploadCloudFileMock).toHaveBeenCalledTimes(2);
    expect(uploadCloudFileMock).toHaveBeenNthCalledWith(1, expect.objectContaining({ filePath: 'wxfile://tmp/photo.jpg' }));
    expect(uploadCloudFileMock).toHaveBeenNthCalledWith(2, expect.objectContaining({ filePath: 'wxfile://tmp/thumb.jpg' }));
    expect(result.images[0].fileId).toMatch(/^cloud:\/\/env\/item-images\/family-1\/\d{4}-\d{2}-\d{2}\/draft-1\/img_/);
    expect(result.images[0].thumbnailFileId).toMatch(/^cloud:\/\/env\/item-thumbnails\/family-1\/\d{4}-\d{2}-\d{2}\/draft-1\/img_/);
    expect(result.uploadedFileIds).toHaveLength(2);
  });

  it('keeps remote image without uploading again', async () => {
    const storage = new CloudImageStorage();

    const result = await storage.prepareItemImages({
      familyId: 'family-1',
      itemId: 'item-1',
      draftId: 'draft-1',
      images: [remoteImage],
      previousImages: [remoteImage]
    });

    expect(uploadCloudFileMock).not.toHaveBeenCalled();
    expect(result.images[0]).toEqual(expect.objectContaining({ id: 'img-existing', fileId: 'cloud://env/existing.jpg' }));
  });

  it('deletes only cloud file ids', async () => {
    const storage = new CloudImageStorage();

    await storage.deleteFiles(['cloud://env/a.jpg', '/static/mock/a.jpg', 'cloud://env/a.jpg', 'https://example.com/a.jpg']);

    expect(deleteCloudFilesMock).toHaveBeenCalledWith(['cloud://env/a.jpg']);
  });
});

describe('shouldUploadImage', () => {
  it('detects local paths that require cloud upload', () => {
    expect(shouldUploadImage('wxfile://tmp/photo.jpg')).toBe(true);
    expect(shouldUploadImage('http://tmp/photo.jpg')).toBe(true);
    expect(shouldUploadImage('/tmp/photo.jpg')).toBe(true);
  });

  it('detects stable urls that should not be uploaded again', () => {
    expect(shouldUploadImage('cloud://env/photo.jpg')).toBe(false);
    expect(shouldUploadImage('https://example.com/photo.jpg')).toBe(false);
    expect(shouldUploadImage('/static/mock/photo.jpg')).toBe(false);
  });
});

describe('cloud path helpers', () => {
  it('creates scoped original and thumbnail paths', () => {
    const input = { familyId: 'family-1', itemId: 'item-1', draftId: 'draft-1' };

    expect(createItemImageCloudPath(input, 'wxfile://tmp/photo.PNG?size=small', 'img-1')).toMatch(/^item-images\/family-1\/\d{4}-\d{2}-\d{2}\/item-1\/img-1\.png$/);
    expect(createItemThumbnailCloudPath(input, 'img-1')).toMatch(/^item-thumbnails\/family-1\/\d{4}-\d{2}-\d{2}\/item-1\/img-1\.jpg$/);
  });

  it('deduplicates cloud file ids', () => {
    expect(filterCloudFileIds(['cloud://env/a.jpg', 'cloud://env/a.jpg', '/static/a.jpg'])).toEqual(['cloud://env/a.jpg']);
  });
});
