import {cache} from 'react';
export type CmsPost={id:string;title:string;slug:string;excerpt:string;content:string;cover_image:string;author:string;tags:string[];published_at:string;updated_at:string;publish_domain:string};
const origin='https://nadi-ai.pages.dev/api/blog-catalog?domain=www.nadivedas.com';
export const getCmsBlog=cache(async(slug:string):Promise<{managed:boolean;post:CmsPost|null}>=>{try{const r=await fetch(origin+'&slug='+encodeURIComponent(slug),{next:{revalidate:30},signal:AbortSignal.timeout(10000)});if(!r.ok)return {managed:false,post:null};return await r.json()}catch{return {managed:false,post:null}}});
export async function getCmsCatalog():Promise<{posts:CmsPost[];managedSlugs:string[]}>{try{const r=await fetch(origin,{next:{revalidate:30},signal:AbortSignal.timeout(10000)});if(r.ok)return await r.json()}catch{}return {posts:[],managedSlugs:[]}}
export function cmsMetadata(p:CmsPost){const url='https://www.nadivedas.com/blogs/'+p.slug;return {title:p.title,description:p.excerpt,alternates:{canonical:url},openGraph:{type:'article' as const,title:p.title,description:p.excerpt,url,...p.cover_image?{images:[p.cover_image]}:{}}}}
