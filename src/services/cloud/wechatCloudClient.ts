type CloudFunctionName =
  | 'user.updateProfile'
  | 'family.listMyFamilies'
  | 'family.createFamily'
  | 'family.switchFamily'
  | 'family.renameFamily'
  | 'family.getMembers'
  | 'family.removeMember'
  | 'family.leaveFamily'
  | 'family.dissolveFamily'
  | 'home.getFamilyHome'
  | 'item.getFormOptions'
  | 'item.listItems'
  | 'item.getItemDetail'
  | 'item.createItem'
  | 'item.updateItem'
  | 'item.consumeItem'
  | 'item.deleteItem';

declare const wx: {
  cloud: {
    init: () => void;
    callFunction: (opts: Record<string, unknown>) => Promise<{ result: unknown; errMsg: string }>;
    uploadFile?: (opts: { cloudPath: string; filePath: string }) => Promise<{ fileID?: string; statusCode?: number; errMsg?: string }>;
    deleteFile?: (opts: { fileList: string[] }) => Promise<{ fileList?: Array<{ fileID: string; status: number; errMsg?: string }>; errMsg?: string }>;
  };
};

const CLOUD_API_FUNCTION_NAME = 'yaoguoqiApi';

let cloudInitialized = false;

/** Reset cloud init state for test isolation. */
export function resetCloudInit() {
  cloudInitialized = false;
}

function ensureCloudInit() {
  if (cloudInitialized) return;
  if (typeof wx === 'undefined' || !wx.cloud) return;

  wx.cloud.init();
  cloudInitialized = true;
}

export interface CloudFunctionRequest<TPayload> {
  name: CloudFunctionName;
  payload: TPayload;
}

export interface CloudFileUploadRequest {
  cloudPath: string;
  filePath: string;
}

export interface CloudFileDeleteRequest {
  fileIds: string[];
}

/** 调用统一云函数入口并返回业务结果。 */
export async function callCloudFunction<TPayload, TResult>(request: CloudFunctionRequest<TPayload>): Promise<TResult> {
  if (typeof wx === 'undefined' || !wx.cloud || !wx.cloud.callFunction) {
    throw new Error('WeChat cloud adapter is only available in WeChat Mini Program runtime.');
  }

  ensureCloudInit();

  const response = await wx.cloud.callFunction({
    name: CLOUD_API_FUNCTION_NAME,
    data: {
      action: request.name,
      payload: request.payload
    }
  });

  if (response.result && typeof response.result === 'object' && 'error' in (response.result as Record<string, unknown>)) {
    throw new Error(String((response.result as { error: unknown }).error));
  }

  return response.result as TResult;
}

/** 上传本地文件到微信云存储并返回 fileID。 */
export async function uploadCloudFile(request: CloudFileUploadRequest): Promise<string> {
  if (typeof wx === 'undefined' || !wx.cloud || !wx.cloud.uploadFile) {
    throw new Error('WeChat cloud storage adapter is only available in WeChat Mini Program runtime.');
  }

  ensureCloudInit();

  const response = await wx.cloud.uploadFile({
    cloudPath: request.cloudPath,
    filePath: request.filePath
  });

  if (!response.fileID) {
    throw new Error(response.errMsg || '图片上传失败');
  }

  return response.fileID;
}

/** 删除一组微信云存储文件。 */
export async function deleteCloudFiles(fileIds: string[]): Promise<void> {
  if (!fileIds.length) return;
  if (typeof wx === 'undefined' || !wx.cloud || !wx.cloud.deleteFile) {
    throw new Error('WeChat cloud storage adapter is only available in WeChat Mini Program runtime.');
  }

  ensureCloudInit();

  const response = await wx.cloud.deleteFile({ fileList: fileIds });
  const failed = response.fileList?.filter((file) => file.status !== 0) ?? [];
  if (failed.length) {
    throw new Error(failed[0].errMsg || '图片清理失败');
  }
}
