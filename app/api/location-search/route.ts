type PhotonFeature={geometry?:{coordinates?:[number,number]};properties?:Record<string,unknown>};
const clean=(value:unknown)=>typeof value==='string'?value.trim():'';
export async function GET(request:Request){
  const query=new URL(request.url).searchParams.get('q')?.trim()||'';
  if(query.length<3||query.length>120)return Response.json({places:[]});
  try{
    const response=await fetch(`https://photon.komoot.io/api/?q=${encodeURIComponent(query)}&limit=6&lang=en`,{headers:{'user-agent':'NadiVedas/1.0 (https://www.nadivedas.com)'},signal:AbortSignal.timeout(5000)});
    if(!response.ok)throw Error('Location lookup failed');
    const payload=await response.json() as {features?:PhotonFeature[]};
    const places=(payload.features||[]).flatMap(feature=>{
      const properties=feature.properties||{},coordinates=feature.geometry?.coordinates;
      if(!coordinates||!Number.isFinite(coordinates[0])||!Number.isFinite(coordinates[1]))return [];
      const name=clean(properties.name),city=clean(properties.city)||clean(properties.town)||clean(properties.village),district=clean(properties.district)||clean(properties.county),state=clean(properties.state),country=clean(properties.country);
      const label=[name,city!==name?city:'',district,state,country].filter(Boolean).filter((item,index,list)=>list.indexOf(item)===index).join(', ');
      return label?[{label,district,state,country,latitude:coordinates[1],longitude:coordinates[0]}]:[];
    });
    return Response.json({places},{headers:{'cache-control':'public, max-age=300'}});
  }catch{return Response.json({places:[]},{status:502})}
}
