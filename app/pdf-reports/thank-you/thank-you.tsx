'use client';
import {useEffect,useState} from 'react';
import {SiteHeader,SiteFooter} from '../../components/SiteChrome';
import '../reports.css';

type Order={amountPaise:number;recoveryOffer:boolean;name:string;paymentStatus:string;reportStatus:string;deliverAfter:number|null;downloadReady:boolean};

export default function ThankYou(){
 const [access,setAccess]=useState({id:'',token:''});
 const [order,setOrder]=useState<Order|null>(null);
 const [busy,setBusy]=useState(false);
 const [error,setError]=useState('');
 const [stopped,setStopped]=useState(false);

 async function load(a=access){
  if(!a.id||!a.token)return;
  try{
   const r=await fetch('/api/pdf-orders/status',{method:'POST',headers:{'content-type':'application/json',authorization:`Bearer ${a.token}`},body:JSON.stringify({id:a.id}),cache:'no-store'});
   const v=await r.json();
   if(!r.ok)throw Error(v.error||'Unable to open this order.');
   setOrder(v);setError('');
  }catch(e){setError(e instanceof Error?e.message:'Please retry.')}
 }

 useEffect(()=>{
  const hash=new URLSearchParams(location.hash.slice(1));
  const a={id:hash.get('order')||'',token:hash.get('token')||''};
  setAccess(a);
  if(!a.id||!a.token){setError('Open the private order link supplied with your payment confirmation.');return}
  void load(a);
 },[]);

 useEffect(()=>{
  if(!access.id||!access.token||order?.paymentStatus==='success'||order?.paymentStatus==='failed')return;
  const timer=setInterval(()=>void load(access),2000);
  return()=>clearInterval(timer);
 },[access,order?.paymentStatus]);

 useEffect(()=>{
  if(!access.id||order?.paymentStatus!=='success'||new URLSearchParams(location.search).get('tracking')==='off')return;
  const amount=Number(order.amountPaise);
  if(!Number.isFinite(amount)||amount<=0||!window.fbq)return;
  const key=`nadivedas-meta-pdf-purchase:${access.id}`;
  try{if(localStorage.getItem(key))return}catch{}
  window.fbq('track','Purchase',{
   value:amount/100,
   currency:'INR',
   content_name:'Nadi Vedas PDF Report',
   content_type:'product',
   content_ids:['nadi-vedas-pdf-report'],
  },{eventID:`pdf-purchase-${access.id}`});
  try{localStorage.setItem(key,'1')}catch{}
 },[access.id,order?.paymentStatus,order?.amountPaise]);

 async function download(){setBusy(true);setError('');try{const r=await fetch('/api/pdf-orders/download',{method:'POST',headers:{'content-type':'application/json',authorization:`Bearer ${access.token}`},body:JSON.stringify({id:access.id})});if(!r.ok)throw Error('Your report is still being prepared. Please check again shortly.');const url=URL.createObjectURL(await r.blob()),a=document.createElement('a');a.href=url;a.download='Nadi-Vedas-Personal-Report.pdf';a.click();setTimeout(()=>URL.revokeObjectURL(url),60000)}catch(e){setError(e instanceof Error?e.message:'Please retry.')}finally{setBusy(false)}}
 async function stop(){setBusy(true);try{const r=await fetch('/api/pdf-orders/unsubscribe',{method:'POST',headers:{'content-type':'application/json',authorization:`Bearer ${access.token}`},body:JSON.stringify({id:access.id})});if(!r.ok)throw Error('Unable to stop reminders. Please contact support.');setStopped(true)}catch(e){setError(e instanceof Error?e.message:'Please retry.')}finally{setBusy(false)}}
 function retry(){const f=document.createElement('form');f.method='POST';f.action='/api/pdf-checkout';for(const [name,value] of Object.entries({orderId:access.id,token:access.token,offer:order?.recoveryOffer?'yes':'no'})){const i=document.createElement('input');i.type='hidden';i.name=name;i.value=value;f.appendChild(i)}document.body.appendChild(f);f.submit()}

 const paid=order?.paymentStatus==='success';
 const failed=order?.paymentStatus==='failed';
 const firstName=order?.name?.split(' ')[0]||'';
 return <div className="pdf-page"><SiteHeader showBooking={false}/><main className="pdf-thanks">
  {paid?<section className="pdf-thanks-card pdf-thanks-success"><div className="pdf-thanks-mark">✓</div><span className="pdf-kicker">PAYMENT CONFIRMED</span><h1>Thank you{firstName?`, ${firstName}`:''}.</h1><p className="pdf-thanks-lead">Your personal Nadi report is now being prepared.</p><div className="pdf-thanks-receipt"><span>Amount paid</span><strong>₹{((order.amountPaise||153900)/100).toLocaleString('en-IN')}</strong><span>Delivery</span><strong>Within 48 hours</strong><span>Sent to</span><strong>Email and WhatsApp</strong></div>{order.downloadReady?<button className="pdf-cta" disabled={busy} onClick={download}>Download your report ↓</button>:<div className="pdf-thanks-progress"><i/><div><strong>Preparation has started</strong><p>We will notify you as soon as your private report is ready. You do not need to keep this page open.</p></div></div>}</section>
  :failed?<section className="pdf-thanks-card"><span className="pdf-kicker">PAYMENT NOT CONFIRMED</span><h1>Your payment was not completed.</h1><p className="pdf-thanks-lead">If your bank shows a debit, please do not pay again. Contact our team so we can verify it first.</p>{order.recoveryOffer&&<p className="pdf-thanks-offer"><strong>Your final offer: ₹999 instead of ₹1,539.</strong></p>}<button className="pdf-cta" onClick={retry}>Retry secure payment · ₹{order.recoveryOffer?'999':((order.amountPaise||153900)/100).toLocaleString('en-IN')}</button></section>
  :<section className="pdf-thanks-card"><div className="pdf-thanks-loader" aria-hidden="true"/><span className="pdf-kicker">VERIFYING PAYMENT</span><h1>We’re confirming your payment.</h1><p className="pdf-thanks-lead">This normally takes a few seconds. If your bank shows a debit, please do not pay again or close this page yet.</p><button className="pdf-secondary" onClick={()=>load()} disabled={busy}>Check again</button></section>}
  {error&&<p className="pdf-thanks-error" role="alert">{error}</p>}
  {order&&!paid&&<p className="pdf-thanks-stop">{stopped?'Payment reminders stopped.':<button type="button" disabled={busy} onClick={stop}>Stop payment reminders and offers</button>}</p>}
  <p className="pdf-small pdf-thanks-private">Keep this private order link safe. It belongs only to you.</p>
 </main><SiteFooter/></div>
}
