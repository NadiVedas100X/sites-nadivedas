'use client';

import {useEffect, useRef, useState} from 'react';

type Country = {code:string; name:string; dialCode:string};
type Place = {label:string; district:string; state:string; country:string; latitude:number; longitude:number};

const countries:Country[] = [
  {code:'IN', name:'India', dialCode:'+91'},
  {code:'US', name:'United States', dialCode:'+1'},
  {code:'GB', name:'United Kingdom', dialCode:'+44'},
  {code:'AU', name:'Australia', dialCode:'+61'},
  {code:'CA', name:'Canada', dialCode:'+1'},
  {code:'SG', name:'Singapore', dialCode:'+65'},
  {code:'MY', name:'Malaysia', dialCode:'+60'},
  {code:'AE', name:'United Arab Emirates', dialCode:'+971'},
  {code:'SA', name:'Saudi Arabia', dialCode:'+966'},
  {code:'ZA', name:'South Africa', dialCode:'+27'},
];

export default function ReportOrder(){
  const requestKey=useRef(crypto.randomUUID());
  const searchTimer=useRef<ReturnType<typeof setTimeout>|null>(null);
  const [salesEnabled,setSalesEnabled]=useState(false);
  const [country,setCountry]=useState<Country>(countries[0]);
  const [placeQuery,setPlaceQuery]=useState('');
  const [selectedPlace,setSelectedPlace]=useState<Place|null>(null);
  const [suggestions,setSuggestions]=useState<Place[]>([]);
  const [placeBusy,setPlaceBusy]=useState(false);
  const [busy,setBusy]=useState(false);
  const [error,setError]=useState('');

  useEffect(()=>{
    fetch('/api/pdf-orders').then(r=>r.json()).then(v=>setSalesEnabled(v.salesEnabled===true)).catch(()=>{});
    fetch('/api/visitor-country').then(r=>r.json()).then(v=>{
      const match=countries.find(item=>item.code===v.countryCode);
      if(match)setCountry(match);
    }).catch(()=>{});
  },[]);

  function searchPlace(value:string){
    setPlaceQuery(value);
    setSelectedPlace(null);
    if(searchTimer.current)clearTimeout(searchTimer.current);
    if(value.trim().length<3){setSuggestions([]);return}
    searchTimer.current=setTimeout(async()=>{
      setPlaceBusy(true);
      try{
        const response=await fetch(`/api/location-search?q=${encodeURIComponent(value.trim())}`);
        const result=await response.json();
        setSuggestions(response.ok?(result.places||[]):[]);
      }catch{setSuggestions([])}finally{setPlaceBusy(false)}
    },300);
  }

  function choosePlace(place:Place){
    setSelectedPlace(place);
    setPlaceQuery(place.label);
    setSuggestions([]);
  }

  async function submit(event:React.FormEvent<HTMLFormElement>){
    event.preventDefault();
    if(!salesEnabled)return;
    if(!selectedPlace){setError('Please select your exact place of birth from the suggestions.');return}
    setError('');setBusy(true);
    try{
      const data=Object.fromEntries(new FormData(event.currentTarget));
      const phone=String(data.phone||'').trim();
      data.phone=phone.startsWith('+')?phone:`${country.dialCode}${phone.replace(/^0+/,'')}`;
      data.birthPlace=selectedPlace.label;
      data.birthDistrict=selectedPlace.district;
      data.birthState=selectedPlace.state;
      data.birthCountry=selectedPlace.country;
      data.birthLatitude=String(selectedPlace.latitude);
      data.birthLongitude=String(selectedPlace.longitude);
      const response=await fetch('/api/pdf-orders',{method:'POST',headers:{'content-type':'application/json','idempotency-key':requestKey.current},body:JSON.stringify(data)});
      const result=await response.json();
      if(!response.ok)throw Error(result.error||'Unable to create your order. Please retry.');
      const checkout=document.createElement('form');
      checkout.method='POST';checkout.action='/api/pdf-checkout';
      for(const [name,value] of Object.entries({orderId:result.orderId,token:result.token})){
        const input=document.createElement('input');input.type='hidden';input.name=name;input.value=String(value);checkout.appendChild(input);
      }
      document.body.appendChild(checkout);checkout.submit();
    }catch(e){setError(e instanceof Error?e.message:'Please try again.');setBusy(false)}
  }

  return <form className="pdf-form" onSubmit={submit}>
    <span className="pdf-eyebrow">YOUR PERSONAL DETAILS</span><h3>Let’s begin with you.</h3>
    {!salesEnabled&&<p className="pdf-launch-notice" role="status">Checkout is being prepared. Please try again shortly.</p>}
    <label>Full name<input required name="name" autoComplete="name" maxLength={100}/></label>
    <div className="pdf-fields">
      <label>Email address<input required name="email" type="email" autoComplete="email" maxLength={200}/></label>
      <label>WhatsApp number<span className="pdf-phone-field"><select aria-label="Country code" value={country.code} onChange={e=>setCountry(countries.find(item=>item.code===e.target.value)||countries[0])}>{countries.map(item=><option value={item.code} key={item.code}>{item.name} ({item.dialCode})</option>)}</select><input required name="phone" type="tel" placeholder="98765 43210" autoComplete="tel-national" inputMode="tel" maxLength={20}/></span></label>
    </div>
    <div className="pdf-fields"><label>Date of birth<input required name="birthDate" type="date" min="1900-01-01" max={new Date().toISOString().slice(0,10)}/></label><label>Exact time of birth<input required name="birthTime" type="time"/></label></div>
    <label className="pdf-place-field">Place of birth<input required value={placeQuery} onChange={e=>searchPlace(e.target.value)} placeholder="Search city, village, hospital or landmark" autoComplete="off" maxLength={200}/>{placeBusy&&<small>Finding places…</small>}{suggestions.length>0&&<span className="pdf-place-suggestions" role="listbox">{suggestions.map(place=><button type="button" role="option" key={`${place.latitude}-${place.longitude}`} onClick={()=>choosePlace(place)}>{place.label}</button>)}</span>}<small>Select the exact birthplace so its district, state and coordinates are recorded accurately.</small></label>
    <div className="pdf-fields"><label>Gender<select required name="gender" defaultValue=""><option value="" disabled>Select</option><option value="male">Male</option><option value="female">Female</option><option value="other">Other</option></select></label><label>Report language<select name="language" defaultValue="English">{['English','Hindi','Telugu','Tamil','Kannada','Marathi'].map(language=><option key={language}>{language}</option>)}</select></label></div>
    <label className="pdf-consent"><input required type="checkbox" name="consent" value="yes"/><span>I confirm these birth details and agree to the <a href="/pages/terms-conditions">terms</a> and <a href="/privacy">privacy policy</a>. I consent to order updates and report delivery by email and WhatsApp.</span></label>
    {error&&<p className="pdf-error" role="alert">{error}</p>}
    <button className="pdf-button" disabled={busy||!salesEnabled}>{busy?'Preparing secure checkout…':salesEnabled?'Continue to secure payment · ₹1,539':'Checkout opens soon'} <span>↗</span></button>
    <p className="pdf-micro">Secure payment via PayU. Your booking is confirmed only after payment verification.</p>
  </form>
}
