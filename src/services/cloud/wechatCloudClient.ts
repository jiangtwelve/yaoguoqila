type CloudFunctionName =
  | 'user.updateProfile'
  | 'family.listMyFamilies'
  | 'family.createFamily'
  | 'home.getFamilyHome'
  | 'item.getFormOptions'
  | 'item.listItems'
  | 'item.getItemDetail'
  | 'item.createItem'
  | 'item.updateItem'
  | 'item.consumeItem'
  | 'item.deleteItem';

const CLOUD_API_FUNCTION_NAME = 'yaoguoqiApi';

export interface CloudFunctionRequest<TPayload> {
  name: CloudFunctionName;
  payload: TPayload;
}

export async function callCloudFunction<TPayload, TResult>(request: CloudFunctionRequest<TPayload>): Promise<TResult> {
  if (typeof uni === 'undefined' || typeof uniCloud === 'undefined' || !uniCloud) {
    throw new Error('WeChat cloud adapter is only available after uniCloud is configured.');
  }

  const response = await uniCloud.callFunction({
    name: CLOUD_API_FUNCTION_NAME,
    data: {
      action: request.name,
      payload: request.payload
    }
  });

  if (response.result && typeof response.result === 'object' && 'error' in response.result) {
    throw new Error(String((response.result as { error: unknown }).error));
  }

  return response.result as TResult;
}
