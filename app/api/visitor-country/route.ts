const countryDialCodes:Record<string,string>={IN:'+91',US:'+1',GB:'+44',AU:'+61',CA:'+1',SG:'+65',MY:'+60',AE:'+971',SA:'+966',ZA:'+27'};
export async function GET(request:Request){
  const code=(request.headers.get('cf-ipcountry')||'IN').toUpperCase();
  const countryCode=countryDialCodes[code]?code:'IN';
  return Response.json({countryCode,dialCode:countryDialCodes[countryCode]},{headers:{'cache-control':'private, max-age=86400'}});
}
