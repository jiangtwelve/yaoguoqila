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
