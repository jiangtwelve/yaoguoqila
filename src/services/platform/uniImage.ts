export interface ChooseLocalImagesResult {
  paths: string[];
  rejectedFormatCount: number;
}

interface WxImageApi {
  chooseImage?: (opts: {
    count: number;
    sizeType: string[];
    sourceType: string[];
    success: (result: { tempFilePaths: string[] | string }) => void;
    fail: (error: unknown) => void;
  }) => void;
  previewImage?: (opts: { urls: string[]; current: string }) => void;
}

interface WxGlobalScope {
  wx?: WxImageApi;
}

/** 获取微信小程序原生图片 API，避免 service 模块中的 uni 代理编译到不可用上下文。 */
function getWxImageApi(): WxImageApi | null {
  const scope = globalThis as unknown as WxGlobalScope;
  return scope.wx ?? null;
}

/** 判断用户是否主动取消图片选择。 */
function isChooseImageCancel(error: unknown): boolean {
  if (!error || typeof error !== 'object' || !('errMsg' in error)) return false;

  return String((error as { errMsg: unknown }).errMsg).includes('cancel');
}

/** 将平台失败回调转换为可读错误。 */
function getPlatformErrorMessage(error: unknown, fallback: string): string {
  if (error && typeof error === 'object' && 'errMsg' in error) {
    return String((error as { errMsg: unknown }).errMsg);
  }

  return fallback;
}

function isSupportedStaticImagePath(filePath: string): boolean {
  const cleanPath = filePath.split('?')[0]?.toLowerCase() ?? '';
  return !cleanPath.endsWith('.gif');
}

/** 通过微信小程序原生能力选择图片并返回临时路径。 */
export function chooseLocalImages(count: number): Promise<ChooseLocalImagesResult> {
  return new Promise((resolve, reject) => {
    const wxApi = getWxImageApi();
    if (!wxApi?.chooseImage) {
      reject(new Error('图片选择仅支持微信小程序运行时'));
      return;
    }

    wxApi.chooseImage({
      count,
      sizeType: ['compressed'],
      sourceType: ['album', 'camera'],
      success: (result) => {
        const tempFilePaths = Array.isArray(result.tempFilePaths) ? result.tempFilePaths : [result.tempFilePaths];
        const paths = tempFilePaths.filter(Boolean);
        const supportedPaths = paths.filter(isSupportedStaticImagePath);

        resolve({ paths: supportedPaths, rejectedFormatCount: paths.length - supportedPaths.length });
      },
      fail: (error) => {
        if (isChooseImageCancel(error)) {
          resolve({ paths: [], rejectedFormatCount: 0 });
          return;
        }

        reject(new Error(getPlatformErrorMessage(error, '选择图片失败')));
      }
    });
  });
}

/** 调用微信小程序原生能力预览图片。 */
export function previewLocalImages(urls: string[], current: string): void {
  if (!urls.length) return;

  const wxApi = getWxImageApi();
  if (!wxApi?.previewImage) {
    throw new Error('图片预览仅支持微信小程序运行时');
  }

  wxApi.previewImage({
    urls,
    current
  });
}
