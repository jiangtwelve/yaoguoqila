import { afterEach, describe, expect, it, vi } from 'vitest';
import { callCloudFunction, resetCloudInit, uploadCloudFile } from './wechatCloudClient';

describe('wechat cloud client', () => {
  afterEach(() => {
    vi.restoreAllMocks();
    vi.unstubAllGlobals();
    resetCloudInit();
  });

  it('calls wx.cloud.callFunction with action and payload', async () => {
    const callFunction = vi.fn().mockResolvedValue({
      result: { ok: true },
      errMsg: 'cloud.callFunction:ok'
    });
    vi.stubGlobal('wx', { cloud: { callFunction, init: vi.fn() } });

    const result = await callCloudFunction({
      name: 'home.getFamilyHome',
      payload: {}
    });

    expect(result).toEqual({ ok: true });
    expect(callFunction).toHaveBeenCalledWith({
      name: 'yaoguoqiApi',
      data: {
        action: 'home.getFamilyHome',
        payload: {}
      }
    });
  });

  it('initializes wx.cloud before first call', async () => {
    const init = vi.fn();
    const callFunction = vi.fn().mockResolvedValue({
      result: { ok: true },
      errMsg: 'cloud.callFunction:ok'
    });
    vi.stubGlobal('wx', { cloud: { callFunction, init } });

    await callCloudFunction({ name: 'home.getFamilyHome', payload: {} });

    expect(init).toHaveBeenCalled();
  });

  it('throws the cloud function error message when result contains error', async () => {
    vi.stubGlobal('wx', {
      cloud: {
        callFunction: vi.fn().mockResolvedValue({ result: { error: '无法获取用户身份' } }),
        init: vi.fn()
      }
    });

    await expect(callCloudFunction({ name: 'home.getFamilyHome', payload: {} })).rejects.toThrow('无法获取用户身份');
  });

  it('returns null cloud results for void actions', async () => {
    vi.stubGlobal('wx', {
      cloud: {
        callFunction: vi.fn().mockResolvedValue({ result: null }),
        init: vi.fn()
      }
    });

    await expect(callCloudFunction({ name: 'item.deleteItem', payload: { itemId: 'item-1' } })).resolves.toBeNull();
  });

  it('throws error when wx is not available (non-WeChat runtime)', async () => {
    vi.stubGlobal('wx', undefined);

    await expect(callCloudFunction({ name: 'home.getFamilyHome', payload: {} })).rejects.toThrow('WeChat cloud adapter is only available in WeChat Mini Program runtime.');
  });

  it('throws error when wx.cloud is missing', async () => {
    vi.stubGlobal('wx', {});

    await expect(callCloudFunction({ name: 'home.getFamilyHome', payload: {} })).rejects.toThrow('WeChat cloud adapter is only available in WeChat Mini Program runtime.');
  });

  it('throws error when wx.cloud.callFunction is missing', async () => {
    vi.stubGlobal('wx', { cloud: {} });

    await expect(callCloudFunction({ name: 'home.getFamilyHome', payload: {} })).rejects.toThrow('WeChat cloud adapter is only available in WeChat Mini Program runtime.');
  });

  it('uploads cloud files and returns fileID', async () => {
    const uploadFile = vi.fn().mockResolvedValue({ fileID: 'cloud://env/item-images/a.jpg' });
    vi.stubGlobal('wx', { cloud: { uploadFile, callFunction: vi.fn(), init: vi.fn() } });

    const fileID = await uploadCloudFile({ cloudPath: 'item-images/a.jpg', filePath: 'wxfile://tmp/a.jpg' });

    expect(fileID).toBe('cloud://env/item-images/a.jpg');
    expect(uploadFile).toHaveBeenCalledWith({
      cloudPath: 'item-images/a.jpg',
      filePath: 'wxfile://tmp/a.jpg'
    });
  });

  it('throws error when wx.cloud.uploadFile is missing', async () => {
    vi.stubGlobal('wx', { cloud: { callFunction: vi.fn(), init: vi.fn() } });

    await expect(uploadCloudFile({ cloudPath: 'item-images/a.jpg', filePath: 'wxfile://tmp/a.jpg' })).rejects.toThrow('WeChat cloud storage adapter is only available in WeChat Mini Program runtime.');
  });

  it('throws error when upload response has no fileID', async () => {
    vi.stubGlobal('wx', {
      cloud: {
        uploadFile: vi.fn().mockResolvedValue({ errMsg: 'cloud.uploadFile:fail' }),
        callFunction: vi.fn(),
        init: vi.fn()
      }
    });

    await expect(uploadCloudFile({ cloudPath: 'item-images/a.jpg', filePath: 'wxfile://tmp/a.jpg' })).rejects.toThrow('cloud.uploadFile:fail');
  });
});