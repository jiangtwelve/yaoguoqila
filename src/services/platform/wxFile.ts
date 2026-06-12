interface WxFileSystemManager {
  readFile: (opts: { filePath: string; success: (result: { data: string | ArrayBuffer }) => void; fail: (error: unknown) => void }) => void;
}

interface WxFileGlobalScope {
  wx?: {
    getFileSystemManager?: () => WxFileSystemManager;
    compressImage?: (opts: {
      src: string;
      quality: number;
      success: (result: { tempFilePath: string }) => void;
      fail: (error: unknown) => void;
    }) => void;
  };
}

/** 获取微信小程序文件 API。 */
function getWxFileApi() {
  return (globalThis as unknown as WxFileGlobalScope).wx ?? null;
}

/** 将平台失败回调转换为可读错误。 */
function getFileErrorMessage(error: unknown, fallback: string): string {
  if (error && typeof error === 'object' && 'errMsg' in error) {
    return String((error as { errMsg: unknown }).errMsg);
  }

  return fallback;
}

/** 读取本地文件为 ArrayBuffer。 */
export function readLocalFileBuffer(filePath: string): Promise<ArrayBuffer> {
  return new Promise((resolve, reject) => {
    const fileApi = getWxFileApi();
    const manager = fileApi?.getFileSystemManager?.();
    if (!manager) {
      reject(new Error('文件读取仅支持微信小程序运行时'));
      return;
    }

    manager.readFile({
      filePath,
      success: (result) => {
        if (typeof result.data === 'string') {
          resolve(new TextEncoder().encode(result.data).buffer);
          return;
        }

        resolve(result.data);
      },
      fail: (error) => {
        reject(new Error(getFileErrorMessage(error, '读取图片失败')));
      }
    });
  });
}

/** 压缩本地图片并返回压缩后的临时路径。 */
export function compressLocalImage(filePath: string, quality: number): Promise<string> {
  return new Promise((resolve) => {
    const fileApi = getWxFileApi();
    if (!fileApi?.compressImage) {
      resolve(filePath);
      return;
    }

    fileApi.compressImage({
      src: filePath,
      quality,
      success: (result) => {
        resolve(result.tempFilePath || filePath);
      },
      fail: () => {
        resolve(filePath);
      }
    });
  });
}
