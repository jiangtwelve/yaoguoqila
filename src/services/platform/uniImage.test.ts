import { afterEach, describe, expect, it, vi } from 'vitest';
import { chooseLocalImages, previewLocalImages } from './uniImage';

describe('uni image platform wrapper', () => {
  afterEach(() => {
    vi.unstubAllGlobals();
  });

  it('uses global wx.chooseImage and returns selected temp paths', async () => {
    const chooseImage = vi.fn((options: { success: (result: { tempFilePaths: string[] }) => void }) => {
      options.success({ tempFilePaths: ['wxfile://tmp/a.jpg'] });
    });
    vi.stubGlobal('wx', { chooseImage });

    await expect(chooseLocalImages(1)).resolves.toEqual({ paths: ['wxfile://tmp/a.jpg'], rejectedFormatCount: 0 });
    expect(chooseImage).toHaveBeenCalledWith(expect.objectContaining({ count: 1 }));
  });

  it('returns empty array when user cancels image picking', async () => {
    vi.stubGlobal('wx', {
      chooseImage: (options: { fail: (error: { errMsg: string }) => void }) => {
        options.fail({ errMsg: 'chooseImage:fail cancel' });
      }
    });

    await expect(chooseLocalImages(1)).resolves.toEqual({ paths: [], rejectedFormatCount: 0 });
  });

  it('filters gif files when temp path exposes extension', async () => {
    const chooseImage = vi.fn((options: { success: (result: { tempFilePaths: string[] }) => void }) => {
      options.success({ tempFilePaths: ['wxfile://tmp/a.jpg', 'wxfile://tmp/animated.GIF'] });
    });
    vi.stubGlobal('wx', { chooseImage });

    await expect(chooseLocalImages(2)).resolves.toEqual({ paths: ['wxfile://tmp/a.jpg'], rejectedFormatCount: 1 });
  });

  it('uses global wx.previewImage', () => {
    const previewImage = vi.fn();
    vi.stubGlobal('wx', { previewImage });

    previewLocalImages(['cloud://env/a.jpg'], 'cloud://env/a.jpg');

    expect(previewImage).toHaveBeenCalledWith({
      urls: ['cloud://env/a.jpg'],
      current: 'cloud://env/a.jpg'
    });
  });
});
