export function createCloudApi({getToken,getUserId=()=>null,fetcher=fetch}) {
  return async (path,method='GET',data) => {
    const owner=getUserId();
    const token = await getToken();
    if(owner!==getUserId())throw new Error('Your account changed. Please try again.');
    if(!token)throw new Error('Please sign in to continue.');
    const response=await fetcher(`/api${path}`,{method,credentials:'same-origin',cache:'no-store',headers:{Authorization:`Bearer ${token}`,...(data!==undefined?{'Content-Type':'application/json'}:{})},...(data!==undefined?{body:JSON.stringify(data)}:{})});
    let result;try{result=await response.json();}catch{throw new Error('Cloud accounts are not available on this site yet.');}
    if(!response.ok){const messages={subscription_required:'An active subscription is needed to save a new cloud report.',checkout_not_enabled:'Subscriptions are not available yet.',checkout_pending_reconciliation:'Your checkout is being checked. Please do not start another subscription. Contact support if this continues.',subscription_already_exists:'You already have a subscription or checkout in progress. Manage it below.',too_many_requests:'Please wait a minute and try again.',invalid_session:'Your session expired. Please sign in again.',cloud_storage_consent_required:'Please agree to cloud storage before saving.',report_id_reused:'A different report is already saved with this identifier.'};throw new Error(messages[result.error]||'We could not complete that request. Please try again.');}
    return result;
  };
}
