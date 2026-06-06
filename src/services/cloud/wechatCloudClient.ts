type CloudFunctionName =
  | 'user.updateProfile'
  | 'family.listMyFamilies'
  | 'family.createFamily'
  | 'home.getFamilyHome'
  | 'item.getFormOptions'
  | 'item.listItems'
  | 'item.createItem'
  | 'item.updateItem'
  | 'item.consumeItem'
  | 'item.deleteItem';

export interface CloudFunctionRequest<TPayload> {
  name: CloudFunctionName;
  payload: TPayload;
}

export async function callCloudFunction<TPayload, TResult>(request: CloudFunctionRequest<TPayload>): Promise<TResult> {
  if (typeof uni === 'undefined' || typeof uniCloud === 'undefined' || !uniCloud) {
    throw new Error('WeChat cloud adapter is only available after uniCloud is configured.');
  }

  const response = await uniCloud.callFunction({
    name: request.name,
    data: request.payload
  });

  return response.result as TResult;
}
