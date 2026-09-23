export type PayPalRuntime={PAYPAL_CLIENT_ID?:string;PAYPAL_CLIENT_SECRET?:string;PAYPAL_MODE?:string};

export const paypalBase=(runtime:PayPalRuntime)=>runtime.PAYPAL_MODE==="sandbox"?"https://api-m.sandbox.paypal.com":"https://api-m.paypal.com";

export async function paypalAccessToken(runtime:PayPalRuntime){
  if(!runtime.PAYPAL_CLIENT_ID||!runtime.PAYPAL_CLIENT_SECRET)throw new Error("PayPal is not configured");
  const response=await fetch(`${paypalBase(runtime)}/v1/oauth2/token`,{method:"POST",headers:{Authorization:`Basic ${btoa(`${runtime.PAYPAL_CLIENT_ID}:${runtime.PAYPAL_CLIENT_SECRET}`)}`,"Content-Type":"application/x-www-form-urlencoded"},body:"grant_type=client_credentials"});
  if(!response.ok)throw new Error(`PayPal authentication failed (${response.status})`);
  const data=await response.json() as {access_token?:string};
  if(!data.access_token)throw new Error("PayPal did not return an access token");
  return data.access_token;
}
