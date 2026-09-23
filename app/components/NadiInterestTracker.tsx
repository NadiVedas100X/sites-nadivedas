"use client";
import {useEffect} from 'react';
import {usePathname} from 'next/navigation';
import {trackMetaCustom} from './AnalyticsTracker';
const slugs:Record<string,string>={'shiva-nadi':'shiva','brahma-nadi':'brahma','nandi-nadi':'nandi','kakabhushundi-nadi':'kaka','vasishta-nadi':'vasishta','thirumoolar-nadi':'thirumoolar','bhogar-nadi':'bhogar','dhanvantari-nadi':'dhanvantari','shukra-nadi':'shukra','bhrigu-nadi':'bhrigu','atri-nadi':'atri','agastya-nadi':'agastya'};
function interest(url:URL){return slugs[url.pathname.split('/').filter(Boolean).at(-1)||'']||Object.values(slugs).find(id=>id===url.searchParams.get('interest'))||'';}
export function NadiInterestTracker(){
 const path=usePathname();
 useEffect(()=>{
   const nadi=interest(new URL(location.href));
   if(nadi){trackMetaCustom('NadiPageView',{nadi,page_path:location.pathname});}
   const click=(e:MouseEvent)=>{
     const anchor=(e.target as Element)?.closest?.('a[href]');if(!anchor)return;
     const target=new URL(anchor.getAttribute('href')||'',location.href);if(target.origin!==location.origin)return;
     const next=interest(target);if(next)trackMetaCustom(target.pathname.startsWith('/journey')?'NadiBookingClick':'NadiExploreClick',{nadi:next,page_path:location.pathname});
   };
   document.addEventListener('click',click);return()=>document.removeEventListener('click',click);
 },[path]);
 return null;
}
