"use client";
import Link from "next/link";
import { FormEvent, useEffect, useMemo, useRef, useState } from "react";
import { nadiPrices } from "../lib/nadis";
import { BrandLogo } from "../components/SiteChrome";
import {LocalizedPrice} from "../components/LocalizedPrice";
import {usePricing} from "../components/PricingProvider";
import {formatPrice,leafFindingAmount,localizedNadiAmount} from "../lib/pricing";
import { identifyTikTok, leafFindingInr, metaAttribution, restoreTikTokIdentity, tikTokUsd, track, trackMeta, trackMetaCustom, trackTikTok, visitorId } from "../components/AnalyticsTracker";
const pathToNadi:Record<string,string>={"shiva-nadi":"shiva","brahma-nadi":"brahma","nandi-nadi":"nandi","kakabhushundi-nadi":"kaka","vasishta-nadi":"vasishta","thirumoolar-nadi":"thirumoolar","bhogar-nadi":"bhogar","dhanvantari-nadi":"dhanvantari","shukra-nadi":"shukra","bhrigu-nadi":"bhrigu","atri-nadi":"atri","agastya-nadi":"agastya"};
const indianStates = [
  "Andaman and Nicobar Islands",
  "Andhra Pradesh",
  "Arunachal Pradesh",
  "Assam",
  "Bihar",
  "Chandigarh",
  "Chhattisgarh",
  "Dadra and Nagar Haveli and Daman and Diu",
  "Delhi",
  "Goa",
  "Gujarat",
  "Haryana",
  "Himachal Pradesh",
  "Jammu and Kashmir",
  "Jharkhand",
  "Karnataka",
  "Kerala",
  "Ladakh",
  "Lakshadweep",
  "Madhya Pradesh",
  "Maharashtra",
  "Manipur",
  "Meghalaya",
  "Mizoram",
  "Nagaland",
  "Odisha",
  "Puducherry",
  "Punjab",
  "Rajasthan",
  "Sikkim",
  "Tamil Nadu",
  "Telangana",
  "Tripura",
  "Uttar Pradesh",
  "Uttarakhand",
  "West Bengal",
];

const questions = [
  {
    key: "focus",
    eyebrow: "What you need",
    title: "What help do you want most?",
    sub: "Pick the one that matters most to you now.",
    options: [
      [
        "direction",
        "My whole life",
        "Life path, important choices and what may come next",
        "✦",
      ],
      [
        "relationship",
        "Marriage and family",
        "Love, spouse, children and family life",
        "♡",
      ],
      ["career", "Work and money", "Job, business, timing and growth", "↗"],
      [
        "health",
        "Health and healing",
        "Health concerns, wellbeing and traditional remedies",
        "✧",
      ],
      [
        "spiritual",
        "Spiritual path",
        "Karma, protection and spiritual growth",
        "ॐ",
      ],
    ],
  },
  {
    key: "depth",
    eyebrow: "Who it is for",
    title: "Who do you want the reading for?",
    sub: "This helps us show the right reading type.",
    options: [
      ["self", "Only me", "A detailed reading for your own life", "◉"],
      [
        "family",
        "Me and my family",
        "A deeper reading that may include spouse, children and family patterns",
        "◎",
      ],
      [
        "focused",
        "One main question",
        "A focused reading about one important part of life",
        "○",
      ],
    ],
  },
  {
    key: "voice",
    eyebrow: "Type of guidance",
    title: "What kind of guidance do you like?",
    sub: "Do not worry if you are unsure. We will still show good choices.",
    options: [
      [
        "divine",
        "Clear and complete",
        "Direct guidance across many parts of life",
        "♢",
      ],
      [
        "sage",
        "Simple and practical",
        "Help with choices, duties and daily life",
        "⌁",
      ],
      [
        "siddhar",
        "Healing and change",
        "Health, remedies and inner growth",
        "✺",
      ],
      [
        "rare",
        "Deep and rare",
        "Family karma, time cycles and spiritual purpose",
        "✹",
      ],
    ],
  },
  {
    key: "budget",
    eyebrow: "Your comfort",
    title: "What budget feels comfortable later?",
    sub: "This is only for our suggestion. There is no payment on this step.",
    options: [
      [
        "essential",
        "₹11,800 to ₹22,000",
        "Show me focused and lower-priced options",
        "₹",
      ],
      [
        "complete",
        "₹22,000 to ₹52,000",
        "Show me more complete Standard and Ultra options",
        "₹₹",
      ],
      [
        "open",
        "Budget is not a constraint",
        "Show me the deepest and rarest options too",
        "✦",
      ],
    ],
  },
] as const;

function recommendationId(a: Record<string, string>) {
  const { focus, depth, voice, budget } = a;
  if (
    budget === "open" &&
    (depth === "family" || voice === "rare" || focus === "spiritual")
  )
    return "brahma";
  if (focus === "health") return voice === "sage" ? "dhanvantari" : "bhogar";
  if (focus === "career") return voice === "divine" ? "nandi" : "kaka";
  if (focus === "spiritual")
    return budget === "essential" ? "thirumoolar" : "brahma";
  if (focus === "relationship" && depth === "family")
    return budget === "open" ? "brahma" : "shiva";
  if (budget === "essential") return voice === "sage" ? "vasishta" : "agastya";
  return "shiva";
}

export default function Journey() {
  const pricing=usePricing();
  const budgetTitle=(value:string,title:string)=>value==="essential"?`${formatPrice(localizedNadiAmount(9800,pricing),pricing.currency)} to ${formatPrice(localizedNadiAmount(20000,pricing),pricing.currency)}`:value==="complete"?`${formatPrice(localizedNadiAmount(20000,pricing),pricing.currency)} to ${formatPrice(localizedNadiAmount(50000,pricing),pricing.currency)}`:title;
  const [step, setStep] = useState(1),
    [busy, setBusy] = useState(false),
    [leadId, setLeadId] = useState(""),
    [choice, setChoice] = useState("shiva"),
    [q, setQ] = useState(-1),
    [answers, setAnswers] = useState<Record<string, string>>({}),
    [deckIndex, setDeckIndex] = useState(0),
    [shortlist, setShortlist] = useState<string[]>([]),
    [selectedPlan, setSelectedPlan] = useState<"standard" | "ultra">(
      "standard",
    ),
    [otherLanguage, setOtherLanguage] = useState(false),
    [formError, setFormError] = useState(""),
    [thumbName, setThumbName] = useState(""),
    [thumbFile,setThumbFile]=useState<File|null>(null),
    [thumbPreview,setThumbPreview]=useState(""),
    [thumbAttempts,setThumbAttempts]=useState(0),
    [thumbHelp,setThumbHelp]=useState(false),
    [leadGender,setLeadGender]=useState<"male"|"female"|"">(""),
    [thumbSideConfirmed,setThumbSideConfirmed]=useState(false),
    [contactOpened,setContactOpened]=useState(false),
    [whatsappChecking,setWhatsappChecking]=useState(false),
    [selectedSlot, setSelectedSlot] = useState(0),
    [sessionSelectedAt,setSessionSelectedAt]=useState(0),
    [clock,setClock]=useState(Date.now()),
    [rescheduling,setRescheduling]=useState(false),
    [paymentVerified,setPaymentVerified]=useState(false),
    [initialInterest,setInitialInterest]=useState(""),
    [pricingAccepted, setPricingAccepted] = useState(false),
    [shivaLanding, setShivaLanding] = useState(false),
    [brahmaLanding, setBrahmaLanding] = useState(false),
    [lockedLineageId,setLockedLineageId]=useState(""),
    [countryCode, setCountryCode] = useState("+91"),
    [slots, setSlots] = useState<Array<{startsAt:number;date:string;minute:number;availableCount:number}>>([]),
    [slotsLoading, setSlotsLoading] = useState(true),
    [selectedDate, setSelectedDate] = useState(""),
    [calendarMonth, setCalendarMonth] = useState(()=>new Date(new Date().getFullYear(),new Date().getMonth(),1));
  const cameraInputRef=useRef<HTMLInputElement|null>(null);
  useEffect(() => {
    if (!paymentVerified || !leadId) return;
    let cancelled=false;
    fetch(`/api/booking-next?lead=${encodeURIComponent(leadId)}`,{cache:'no-store'})
      .then(async response=>{const result=await response.json();if(!response.ok)throw new Error(result.error);return result;})
      .then(result=>{if(!cancelled)window.location.replace(result.url);})
      .catch(()=>{if(!cancelled)setFormError('Your payment is received. We are preparing your next steps. Please refresh in a moment; do not pay again.');});
    return()=>{cancelled=true;};
  },[paymentVerified,leadId]);
  const currentYear = new Date().getFullYear(),
    oldestYear = currentYear - 80,
    youngestYear = currentYear - 10;
  useEffect(() => {
    const params=new URLSearchParams(location.search),paidLead=params.get('payment')==='success'?params.get('lead'):'';
    if(paidLead){window.location.replace(`https://lp.nadivedas.com/checkout/success?txn=${encodeURIComponent(`website-${paidLead}`)}`);return;}
    const p = new URLSearchParams(location.search),
      id = p.get("lead") || "",
      payment = p.get("payment"),
      path=location.pathname.toLowerCase();
    const pathSlug=path.split("/").filter(Boolean).at(-1)||"";
    const preset=pathToNadi[pathSlug]||p.get("interest")||"";
    const fromShiva=preset === "shiva";
    const fromBrahma=preset === "brahma";
    setShivaLanding(fromShiva);
    setBrahmaLanding(fromBrahma);
    setLockedLineageId(pathToNadi[pathSlug]||"");
    setChoice(preset||"shiva");setInitialInterest(preset);
    if (id) {
      setLeadId(id);
      const requested=p.get("step");
      setStep(payment === "success" ? (requested==="thumbprint"?5:requested==="nadi"?6:3) : 2);

      if (payment !== "success")
        setFormError(
          "Your payment is being checked. If money was debited, do not pay again.",
        );
      void (payment !== "success" ? fetch("/api/payu/recover",{method:"POST",headers:{"content-type":"application/json"},body:JSON.stringify({leadId:id})}).catch(()=>null) : Promise.resolve()).then(()=>fetch(`/api/leads?id=${encodeURIComponent(id)}`,{cache:"no-store"}))
        .then((response) => response.json())
        .then((data) => {relayToCrm(data.crm);const saved=data.lead as {nadiDecided?:boolean;sessionAt?:number;sessionSelectedAt?:number;thumbprintUploaded?:boolean;selectedNadi?:string;paymentStatus?:string;gender?:"male"|"female"}|undefined;if(!saved)return;if(saved.gender)setLeadGender(saved.gender);if(saved.sessionAt){setSelectedSlot(saved.sessionAt);setSessionSelectedAt(saved.sessionSelectedAt||Date.now());}if(saved.selectedNadi)setChoice(saved.selectedNadi);if(saved.paymentStatus!=="success"){if(["failed","failure"].includes(saved.paymentStatus||""))trackMetaCustom("LeafFindingPaymentFailed",{nadi:preset||"general"});setStep(2);return}setFormError("");track("payment_success",id);setPaymentVerified(true);if(!sessionStorage.getItem(`nv-meta-paid:${id}`)){trackMetaCustom("LeafFindingPaid",{nadi:preset||"general"});sessionStorage.setItem(`nv-meta-paid:${id}`,"1")}setStep(5);restoreTikTokIdentity();const purchaseKey=`nadivedas-tiktok-purchase:${id}`;if(!localStorage.getItem(purchaseKey)){const nadi=pathToNadi[pathSlug]||saved.selectedNadi||"",inr=leafFindingInr(nadi);trackTikTok("Purchase",{contents:[{content_id:nadi?`${nadi}-nadi-leaf-finding`:"nadi-leaf-finding",content_type:"product",content_name:nadi?`${nadi} Nadi Leaf Finding`:"NadiVedas Leaf Finding",price:tikTokUsd(inr)}],value:tikTokUsd(inr),currency:"USD"},`purchase-${id}`);localStorage.setItem(purchaseKey,"1")}if(requested==="thumbprint"){setStep(5);return}if(requested==="nadi"){setStep(6);return}if(saved.thumbprintUploaded)setStep(saved.nadiDecided?7:6);else setStep(5);})
        .catch(() => {setFormError('We could not check your booking. Please refresh. If money was debited, do not pay again.');});
    }
  }, []);
  useEffect(()=>{if(step!==5)return;const timer=setInterval(()=>setClock(Date.now()),1000);return()=>clearInterval(timer)},[step]);
  useEffect(()=>{
    const names:Record<number,string>={1:"details",2:"payment",3:"schedule",4:"whatsapp_confirmation",5:"thumbprint",6:"nadi_selection",7:"confirmation"};
    const name=names[step]||`step_${step}`;
    const key=`nadivedas-meta-step:${leadId||"anonymous"}:${step}`;
    if(sessionStorage.getItem(key))return;
    sessionStorage.setItem(key,"1");
    trackMetaCustom("JourneyStepView",{step_number:({1:1,3:2,2:3,5:4,6:5,7:6} as Record<number,number>)[step]||step,step_name:name,nadi:initialInterest||"general"});
    if(step===1){trackMeta("ViewContent",{content_name:"NadiVedas Journey",content_category:"Palm Leaf Finding"});const inr=leafFindingInr(lockedLineageId);trackTikTok("ViewContent",{contents:[{content_id:lockedLineageId?`${lockedLineageId}-nadi-leaf-finding`:"nadi-leaf-finding",content_type:"product",content_name:lockedLineageId?`${lockedLineageId} Nadi Leaf Finding`:"NadiVedas Leaf Finding"}],value:tikTokUsd(inr),currency:"USD",description:"Nadi palm-leaf finding journey"},`view-${leadId||visitorId()}`)}
  },[step,leadId]);
  const lockedNadi=nadiPrices.find(n=>n.id===lockedLineageId);
  const lockedLineage=lockedNadi?{id:lockedNadi.id,name:lockedNadi.name,fee:lockedNadi.id==="brahma"?"1,500":"1,001",standard:lockedNadi.price.replace("₹",""),ultra:lockedNadi.ultra.replace("₹","")}:null;
  useEffect(()=>{
    if(step!==1&&step!==3)return;
    let active=true;
    let timer:ReturnType<typeof setTimeout>;
    const controller=new AbortController();
    const run=async()=>{
      let delay=30000;
      try{
        const response=await fetch('/api/availability',{cache:'no-store',signal:AbortSignal.any([controller.signal,AbortSignal.timeout(12000)])});
        const payload=await response.json();
        if(!response.ok||!Array.isArray(payload.slots))throw new Error('Availability unavailable');
        const next=payload.slots.filter((slot:{startsAt:number})=>slot.startsAt>=Date.now()+86400000);
        if(active){
          setSlots(next);setSlotsLoading(false);
          setSelectedSlot(current=>next.some((slot:{startsAt:number})=>slot.startsAt===current)?current:0);
          setSelectedDate(current=>next.some((slot:{date:string})=>slot.date===current)?current:next[0]?.date||'');
        }
      }catch{
        delay=5000;
      }finally{
        if(active)timer=setTimeout(run,delay);
      }
    };
    void run();
    return()=>{active=false;controller.abort();clearTimeout(timer)};
  },[step]);
  const recommended = useMemo(
    () =>
      nadiPrices.find((n) => n.id === recommendationId(answers)) ||
      nadiPrices[0],
    [answers],
  );
  const deck = useMemo(() => {
    const preferred = [
      recommended.id,
      "brahma",
      "shiva",
      "nandi",
      ...nadiPrices.map((n) => n.id),
    ];
    return [...new Set(preferred)]
      .map((id) => nadiPrices.find((n) => n.id === id)!)
      .filter(Boolean);
  }, [recommended.id]);
  const deckNadi = deck[Math.min(deckIndex, deck.length - 1)] || recommended;
  async function relayToCrm(crm?: { payload: string; signature: string }) {
    if (!crm) return;
    await fetch("https://poojacrm.nadivedas.com/api/website-leads", {
      method: "POST",
      headers: { "content-type": "application/json" },
      body: JSON.stringify(crm),
    }).catch(() => {});
  }
  async function submit(e: FormEvent<HTMLFormElement>) {
    e.preventDefault();
    setBusy(true);
    setFormError("");
    const form = new FormData(e.currentTarget),
      data = {
        ...Object.fromEntries(form),
        languages: form.getAll("languages"),
        visitorId: visitorId(),
        ...metaAttribution(),
        interest: lockedLineage?.id || initialInterest || "",
        offerStartedAt: pricing.offerStartedAt || undefined,
      };
    try {
      const res = await fetch("/api/leads", {
        method: "POST",
        headers: { "content-type": "application/json" },
        body: JSON.stringify(data),
        signal: AbortSignal.timeout(12000),
      });
      const json = res.headers.get("content-type")?.includes("application/json")
        ? await res.json()
        : {error: res.ok ? "The booking response was incomplete. Please retry." : "We could not save your details right now. Please retry in a moment."};
      if (!res.ok) {
        setFormError(json.error || "Please check your details and try again.");
        return;
      }
      setLeadId(json.id || "");
      setLeadGender(data.gender==="female"?"female":"male");
      await identifyTikTok({email:String(data.email||""),phone:`${String(data.countryCode||"")}${String(data.whatsapp||"")}`,externalId:json.id||""});
      track("details_submitted", json.id || "");
      trackMetaCustom("NadiDetailsSubmitted",{nadi:lockedLineage?.id||initialInterest||"general"});
      trackMeta("Lead",{content_name:"NadiVedas Journey Details"});
      trackMeta("CompleteRegistration",{content_name:"Palm Leaf Finding Registration",status:true});
      {const inr=leafFindingInr(lockedLineage?.id||"");trackTikTok("CompleteRegistration",{contents:[{content_id:lockedLineage?.id?`${lockedLineage.id}-nadi-leaf-finding`:"nadi-leaf-finding",content_type:"product",content_name:lockedLineage?.name?`${lockedLineage.name} Leaf Finding`:"NadiVedas Leaf Finding"}],value:tikTokUsd(inr),currency:"USD"},`registration-${json.id}`)}
      setStep(3);
      setBusy(false);
      void relayToCrm(json.crm);
    } catch(error) {
      setFormError(error instanceof DOMException&&error.name==="TimeoutError"?"Saving took longer than expected. Please tap Continue once more—your details are safe.":"We could not save your details. Please check your connection and retry.");
    } finally {
      setBusy(false);
    }
  }
  function answer(key: string, value: string) {
    const next = { ...answers, [key]: value };
    setAnswers(next);
    if (q < questions.length - 1) setTimeout(() => setQ(q + 1), 180);
    else {
      const id = recommendationId(next);
      setChoice(id);
      setSelectedPlan(
        next.depth === "family" || next.budget === "open"
          ? "ultra"
          : "standard",
      );
      setDeckIndex(0);
      setTimeout(() => setQ(questions.length), 260);
    }
  }
  function moveDeck(kind: "previous" | "next" | "shortlist") {
    if(kind==="previous"){setDeckIndex(index=>Math.max(0,index-1));return}
    if (kind === "shortlist")
      setShortlist((list) =>
        list.includes(deckNadi.id) ? list : [...list, deckNadi.id],
      );
    setDeckIndex((index) => Math.min(index + 1, deck.length - 1));
  }
  async function saveChoice() {
    setBusy(true);
    setFormError("");
    try{
      if (leadId) {
        const response = await fetch("/api/leads", {
          method: "PATCH",
          headers: { "content-type": "application/json" },
          body: JSON.stringify({ id: leadId, nadi: choice }),
          signal:AbortSignal.timeout(8000),
        });
        const json = await response.json().catch(() => ({}));
        if(!response.ok)throw new Error(json.error||"Unable to save your Nadi choice.");
        setStep(7);
        void relayToCrm(json.crm);
        track("nadi_selected", leadId);
        trackMetaCustom("NadiSelected",{nadi:choice});
      } else setStep(7);
    }catch(error){setFormError(error instanceof DOMException&&error.name==="TimeoutError"?"Saving took longer than expected. Please tap Confirm once more.":error instanceof Error?error.message:"Unable to save your Nadi choice.");}
    finally{setBusy(false)}
  }
  async function inspectThumbImage(file:File){
    if(!["image/jpeg","image/png","image/webp"].includes(file.type))throw new Error("Choose a JPG, PNG or WebP image.");
    if(file.size>5*1024*1024)throw new Error("The original image must be 5 MB or smaller.");
    const bitmap=await createImageBitmap(file);if(bitmap.width<320||bitmap.height<320){bitmap.close();throw new Error("Move closer—the thumb image is too small to inspect.");}
    const canvas=document.createElement("canvas");canvas.width=128;canvas.height=128;const ctx=canvas.getContext("2d",{willReadFrequently:true});if(!ctx){bitmap.close();return}ctx.drawImage(bitmap,0,0,128,128);bitmap.close();const pixels=ctx.getImageData(0,0,128,128).data;let mean=0;const gray=new Float32Array(128*128);for(let i=0;i<gray.length;i++){const value=.299*pixels[i*4]+.587*pixels[i*4+1]+.114*pixels[i*4+2];gray[i]=value;mean+=value}mean/=gray.length;let variance=0,edges=0;for(let y=24;y<104;y++)for(let x=24;x<104;x++){const i=y*128+x;variance+=(gray[i]-mean)**2;if(Math.abs(gray[i]-gray[i-1])+Math.abs(gray[i]-gray[i-128])>22)edges++}variance/=6400;if(mean<28||mean>242)throw new Error("The image is too dark or too bright. Use soft, even light.");if(variance<120||edges<120)throw new Error("The thumb ridges are not clear enough. Focus on the centre of the thumb pad and retry.");
  }
  async function prepareThumbUpload(file:File){
    const bitmap=await createImageBitmap(file),limit=1100,largest=Math.max(bitmap.width,bitmap.height);
    if(file.size<=650*1024&&largest<=limit){bitmap.close();return file}
    const scale=Math.min(1,limit/largest),canvas=document.createElement("canvas");canvas.width=Math.max(1,Math.round(bitmap.width*scale));canvas.height=Math.max(1,Math.round(bitmap.height*scale));const ctx=canvas.getContext("2d");if(!ctx){bitmap.close();return file}ctx.imageSmoothingEnabled=true;ctx.imageSmoothingQuality="high";ctx.drawImage(bitmap,0,0,canvas.width,canvas.height);bitmap.close();let quality=.86,blob:Blob|null=null;while(quality>=.58){blob=await new Promise(resolve=>canvas.toBlob(resolve,"image/webp",quality));if(blob&&blob.size<=650*1024)break;quality-=.07}if(!blob)throw new Error("This phone could not prepare the image. Please choose a smaller photo.");return new File([blob],`thumbprint-${Date.now()}.webp`,{type:"image/webp",lastModified:Date.now()});
  }
  async function selectThumbFile(file?:File){
    if(!file)return;setFormError("");setThumbSideConfirmed(false);try{await inspectThumbImage(file);const prepared=await prepareThumbUpload(file);if(thumbPreview)URL.revokeObjectURL(thumbPreview);setThumbFile(prepared);setThumbName(file.name);setThumbPreview(URL.createObjectURL(prepared));}catch(error){setThumbFile(null);setThumbName("");setThumbPreview("");const attempts=thumbAttempts+1;setThumbAttempts(attempts);setFormError(error instanceof Error?error.message:"Choose another clear thumb image.");if(attempts>=3)await requestThumbHelp();}
  }
  function chooseAnotherThumb(openCamera=false){
    if(thumbPreview)URL.revokeObjectURL(thumbPreview);setThumbFile(null);setThumbPreview("");setThumbName("");setThumbSideConfirmed(false);setFormError("");if(openCamera)setTimeout(()=>cameraInputRef.current?.click(),0);
  }
  async function requestThumbHelp(){
    setThumbHelp(true);const response=await fetch("/api/leads",{method:"PATCH",headers:{"content-type":"application/json"},body:JSON.stringify({id:leadId,thumbprintHelp:true})}).catch(()=>null);if(response){const json=await response.json().catch(()=>({}));void relayToCrm(json.crm)}setTimeout(()=>setStep(6),1800);
  }
  async function uploadThumbprint(e: FormEvent<HTMLFormElement>) {
    e.preventDefault();
    if(!thumbFile){setFormError("Take or choose a clear thumb image first.");return}
    if(!thumbSideConfirmed){setFormError(`Please confirm that this is your ${leadGender==="female"?"left":"right"} thumb.`);return}
    setBusy(true);
    setFormError("");
    const data = new FormData();data.set("thumbprint",thumbFile);
    try {
      const response = await fetch(
        `/api/leads/${encodeURIComponent(leadId)}/thumbprint`,
        { method: "POST", body: data,signal:AbortSignal.timeout(45000) },
      );
      const json = await response.json().catch(()=>({error:response.status===413?"This photo is too large for the secure upload. Choose it again so we can prepare a smaller copy.":"The upload service did not accept the image."}));
      if (!response.ok) {
        setFormError(json.error || "Unable to upload this image.");
        return;
      }
      setThumbName(json.fileName || "Thumbprint received");
      setStep(6);
      void relayToCrm(json.crm);
      track("thumbprint_uploaded",leadId);
      trackMetaCustom("ThumbprintUploaded",{nadi:initialInterest||"general"});
      trackMeta("SubmitApplication",{content_name:"Thumbprint submitted"});
    } catch(error){setFormError(error instanceof DOMException&&error.name==="TimeoutError"?"The upload took too long. Please retry—your booking is still safe.":"The upload could not be saved. Please retry.");} finally {
      setBusy(false);
    }
  }
  async function saveSlot() {
    if (!selectedSlot) return;
    if(!paymentVerified){
      setBusy(true);setFormError("");
      try{const r=await fetch("/api/booking-preference",{method:"POST",headers:{"content-type":"application/json"},body:JSON.stringify({leadId,startsAt:selectedSlot})});const data=await r.json();if(!r.ok)throw new Error(data.error||"Unable to save preferred time");trackMetaCustom("PreferredTimeSelected",{nadi:initialInterest});setStep(2);}catch(error){setFormError(error instanceof Error?error.message:"Please retry");}finally{setBusy(false)}
      return;
    }
    setBusy(true);
    const response = await fetch("/api/leads", {
      method: "PATCH",
      headers: { "content-type": "application/json" },
      body: JSON.stringify({ id: leadId, sessionAt: selectedSlot,reschedule:rescheduling }),
    });
    const json = await response.json().catch(() => ({}));
    if (response.ok) {
      track("timeslot_selected",leadId);
      trackMeta("Schedule",{content_name:"Guruji consultation"});
      setSessionSelectedAt(json.sessionSelectedAt||Date.now());setRescheduling(false);
      setStep(5);
      void relayToCrm(json.crm);
    } else setFormError(json.error || "Unable to reserve this time.");
    setBusy(false);
  }
  const orderId=leadId?`NV-${leadId.slice(0,8).toUpperCase()}`:"";
  const whatsappText=orderId?`Hi, I have just booked my Nadi leaf-finding session. Order ID: ${orderId}. Please guide me with the next steps.`:"Hi, I have just booked my Nadi leaf-finding session. Please guide me with the next steps.";
  const whatsappUrl=`https://wa.me/919992229463?text=${encodeURIComponent(whatsappText)}`;
  async function checkWhatsAppConfirmation(silent=false){
    if(!leadId||whatsappChecking)return false;
    setWhatsappChecking(true);
    try{
      const response=await fetch(`https://poojacrm.nadivedas.com/api/communications/whatsapp-status?lead=${encodeURIComponent(leadId)}&order=${encodeURIComponent(orderId)}`,{cache:"no-store"});
      const result=await response.json() as {confirmed?:boolean};
      if(result.confirmed){
        localStorage.setItem(`nadivedas-whatsapp-confirmed:${leadId}`,"1");
        track("whatsapp_confirmed",leadId);
        trackMetaCustom("WhatsAppConfirmed",{lead_id:leadId});
        setFormError("");
        setStep(5);
        return true;
      }
      if(!silent)setFormError("We have not received your WhatsApp message yet. Please tap the green button, send the prepared message, then return here.");
    }catch{if(!silent)setFormError("We are checking your WhatsApp confirmation. Please wait a moment and try again.");}
    finally{setWhatsappChecking(false)}
    return false;
  }
  useEffect(()=>{
    if(step!==4||!leadId||!contactOpened)return;
    const check=()=>void checkWhatsAppConfirmation(true);
    check();
    const timer=window.setInterval(check,2500);
    return()=>window.clearInterval(timer);
  },[step,leadId,contactOpened,orderId]);
  const selectedSlotLabel=selectedSlot?new Intl.DateTimeFormat("en-IN",{timeZone:"Asia/Kolkata",weekday:"long",day:"numeric",month:"long",year:"numeric",hour:"numeric",minute:"2-digit"}).format(new Date(selectedSlot)):"";
  const thumbSeconds=Math.max(0,Math.ceil((sessionSelectedAt+15*60*1000-clock)/1000)),thumbTimer=`${String(Math.floor(thumbSeconds/60)).padStart(2,"0")}:${String(thumbSeconds%60).padStart(2,"0")}`;
  const expectedThumb=leadGender==="female"?"left":"right";
  const slotDates=useMemo(()=>new Set(slots.map(slot=>slot.date)),[slots]);
  const selectedDateSlots=useMemo(()=>slots.filter(slot=>slot.date===selectedDate),[slots,selectedDate]);
  const question = questions[q >= 0 && q < questions.length ? q : 0];
  if(paymentVerified) return <main style={{maxWidth:640,margin:'80px auto',padding:24,textAlign:'center'}}><h1>Payment received</h1><p>{formError || 'Preparing your Nadi choices and thumbprint upload links…'}</p>{formError && <button onClick={()=>window.location.reload()}>Try again</button>}</main>;
  return (
    <main className="journey">
      <header className="journey-nav">
        <Link href="/" className="journey-logo">
          <BrandLogo light />
        </Link>
        <Link href="/">← Back to NadiVedas</Link>
      </header>
      <div className="journey-shell">
        <aside>
          <p className="eyebrow light">
            <span /> Your leaf journey
          </p>
          <h1>
            {step === 1 ? (
              <>
                Let destiny
                <br />
                <em>introduce itself.</em>
              </>
            ) : step === 2 ? (
              <>
                Reserve the
                <br />
                <em>sacred search.</em>
              </>
            ) : step === 3 ? (
              <>
                Choose a time
                <br />
                <em>for your search.</em>
              </>
            ) : step === 4 ? (
              <>
                Confirm on WhatsApp
                <br />
                <em>before we call.</em>
              </>
            ) : step === 5 ? (
              <>
                Share the key
                <br />
                <em>to the library.</em>
              </>
            ) : step === 6 ? (
              <>
                Choose your
                <br />
                <em>Nadi library.</em>
              </>
            ) : (
              <>
                Your journey
                <br />
                <em>has begun.</em>
              </>
            )}
          </h1>
          <p>
            {step === 5
              ? "A clear thumb impression helps the library classify and narrow the search."
                : step === 4
                  ? "Send one prepared WhatsApp message and receive the thumbprint and Nadi steps automatically."
                : step === 6
                  ? "A Nadi is a traditional palm-leaf library. Your choice tells Guruji which library to search. No payment is taken on this step."
                : step === 3
                  ? "Choose a preferred time. Your booking is confirmed after payment."
                  : step === 2
                    ? "One transparent fee begins the physical search through the palm-leaf library."
                    : step === 1
                      ? "Share the simplest details. No payment is taken on this step."
                      : "Your details are safely recorded for the NadiVedas team."}
          </p>
          <div className="side-promise">
            <span>✦</span>
            <p>
              <b>Our promise</b><LocalizedPrice inr={lockedLineage?.fee||999} kind="leaf" nadiId={lockedLineage?.id||""}/> is fully refunded when no matching leaf is
              found.
            </p>
          </div>
        </aside>
        <section className="journey-panel">
          <div className="progress booking-three">
            {[{id:1,label:"Details"},{id:3,label:"Book time"},{id:2,label:"Payment"}].map((item,index)=><span key={item.id} className={step===item.id?"on":""}><em>{index+1}</em><b>{item.label}</b></span>)}
          </div>
          {step === 2 && (
            <details className="process-explainer">
              <summary>
                See exactly how leaf finding works <span>＋</span>
              </summary>
              <ol>
                <li>
                  <b>Pay the leaf-finding fee</b>
                  <p>
                    <LocalizedPrice inr={lockedLineage?.fee||999} kind="leaf" nadiId={lockedLineage?.id||""}/> covers locating and verifying your index leaf only.
                  </p>
                </li>
                <li>
                  <b>{lockedLineage?`${lockedLineage.name} is already selected`:"Select your Nadi library"}</b>
                  <p>
                    {lockedLineage?`This journey stays inside the ${lockedLineage.name} library. Standard and Ultra continuation readings differ in depth and duration.`:"Your choice tells Guruji which tradition and bundles to search. Standard and Ultra continuation readings differ in depth and duration."}
                  </p>
                </li>
                <li>
                  <b>Share the search details</b>
                  <p>
                    We collect birth year, gender, preferred language and a
                    clear thumb impression. Your language helps us arrange a
                    suitable Guruji or translator.
                  </p>
                </li>
                <li>
                  <b>Guruji searches likely bundles</b>
                  <p>
                    The thumb classification helps Guruji narrow the selected
                    library to likely palm-leaf bundles.
                  </p>
                </li>
                <li>
                  <b>Verify the index leaf live</b>
                  <p>
                    Guruji translates clues written in ancient Tamil. You answer
                    yes or no. Non-matching leaves are eliminated until a
                    sequence of personal details matches.
                  </p>
                </li>
                <li>
                  <b>Choose what happens after a match</b>
                  <p>
                    The matched index leaf points to a continuation bundle
                    containing detailed predictions and guidance. We explain its
                    scope, duration and exact price first. Continuing is
                    separate and optional.
                  </p>
                </li>
              </ol>
            </details>
          )}
          {step === 1 && (
            <div className="step-body">
              <span className="step-label">Step 1 · Begin</span>
              <h2>Could one of the leaves be yours?</h2>
              <p>
                Tell us where to send your next step. These details also help
                the library team prepare your leaf search.
              </p>
              <form onSubmit={submit}>
                <div className="form-pair">
                  <label>
                    Full name
                    <input
                      name="name"
                      required
                      placeholder="Your full name"
                      autoComplete="name"
                    />
                  </label>
                  <label>
                    Birth year
                    <input
                      name="birthYear"
                      type="number"
                      required
                      min={oldestYear}
                      max={youngestYear}
                      placeholder={`${oldestYear}–${youngestYear}`}
                      title={`Enter a year between ${oldestYear} and ${youngestYear}`}
                    />
                    <small>
                      Age 10–80 · {oldestYear} to {youngestYear}
                    </small>
                  </label>
                </div>
                <div className="form-pair">
                  <label>
                    Email address
                    <input
                      name="email"
                      type="email"
                      required
                      placeholder="you@example.com"
                      autoComplete="email"
                      inputMode="email"
                    />
                  </label>
                  <label>
                    Gender
                    <select name="gender" required defaultValue="">
                      <option value="" disabled>
                        Select gender
                      </option>
                      <option value="male">Male</option>
                      <option value="female">Female</option>
                    </select>
                  </label>
                </div>
                <label>
                  WhatsApp number
                  <div className="phone-field">
                    <select
                      name="countryCode"
                      value={countryCode}
                      onChange={(event) => setCountryCode(event.target.value)}
                      aria-label="Country code"
                    >
                      <option value="+91">🇮🇳 +91</option>
                      <option value="+971">🇦🇪 +971</option>
                      <option value="+1">🇺🇸 +1</option>
                      <option value="+44">🇬🇧 +44</option>
                      <option value="+61">🇦🇺 +61</option>
                      <option value="+65">🇸🇬 +65</option>
                    </select>
                    <input
                      name="whatsapp"
                      type="tel"
                      required
                      placeholder={countryCode === "+91" ? "10-digit WhatsApp number" : "WhatsApp number"}
                      autoComplete="tel-national"
                      inputMode="numeric"
                      pattern={countryCode === "+91" ? "[0-9]{10}" : "[0-9]{6,15}"}
                      minLength={countryCode === "+91" ? 10 : 6}
                      maxLength={countryCode === "+91" ? 10 : 15}
                    />
                  </div>
                  <small>
                    {countryCode === "+91" ? "India is selected by default; enter exactly 10 digits." : "Enter the number without its country code."}
                  </small>
                </label>
                {countryCode === "+91" ? (
                  <label>State for GST<select name="state" required defaultValue=""><option value="" disabled>Select state or union territory</option>{indianStates.map((state) => <option key={state}>{state}</option>)}</select><small>Required for the correct GST place of supply.</small></label>
                ) : (
                  <label>Country<input name="country" required placeholder="Your country" autoComplete="country-name"/><small>Used for international billing records.</small></label>
                )}
                <fieldset className="language-field">
                  <legend>
                    Languages known <small>Select all that apply</small>
                  </legend>
                  <div>
                    {[
                      ["English","English"],
                      ["Hindi","हिन्दी"],
                      ["Telugu","తెలుగు"],
                      ["Tamil","தமிழ்"],
                      ["Kannada","ಕನ್ನಡ"],
                      ["Malayalam","മലയാളം"],
                    ].map(([value,label]) => (
                      <label key={value}>
                        <input
                          type="checkbox"
                          name="languages"
                          value={value}
                        />
                        <span>{label}</span>
                      </label>
                    ))}
                    <label>
                      <input
                        type="checkbox"
                        onChange={(event) =>
                          setOtherLanguage(event.target.checked)
                        }
                      />
                      <span>Other</span>
                    </label>
                  </div>
                  {otherLanguage && (
                    <input
                      name="otherLanguage"
                      required
                      placeholder="Type another language"
                      maxLength={60}
                    />
                  )}
                </fieldset>
                {formError && (
                  <p className="form-error" role="alert">
                    {formError}
                  </p>
                )}
                <label className="consent">
                  <input type="checkbox" name="followupConsent" required />
                  <span>
                    I agree that Nadi Vedas may contact me by WhatsApp, phone
                    call and email with booking updates and help completing my
                    leaf-finding journey. I can ask the team to stop at any
                    time.
                  </span>
                </label>
                <button disabled={busy} className="primary" type="submit">
                  {busy ? "Saving…" : "Continue to leaf finding"}
                  <span>→</span>
                </button>
                <small>No payment on this step · Takes about 2 minutes</small>
              </form>
            </div>
          )}
          {step === 2 && (
            <div className="step-body pay-step">
              <span className="step-label">Step 3 · Secure payment</span>
              <h2>Start your index-leaf search.</h2>
              {formError && (
                <p className="form-error" role="alert">{formError}</p>
              )}
              <div className="price-card">
                <div>
                  <span>Index-leaf finding</span>
                  <strong>
                    <LocalizedPrice inr={lockedLineage?.fee||999} kind="leaf" nadiId={lockedLineage?.id||""}/>
                  </strong>
                  <small>
                    One-time · Fully refundable if no index leaf is found
                  </small>
                </div>
                <span className="secure">
                  ◈
                  <small>
                    {pricing.region==="india"?"PayU":"PayPal"}
                    <br />
                    secured
                  </small>
                </span>
              </div>
              <ul>
                <li>
                  <span>✓</span><b>Classify your thumbprint</b>
                </li>
                <li>
                  <span>✓</span><b>Search the likely leaf bundles</b>
                </li>
                <li>
                  <span>✓</span><b>Verify the matching leaf live with Guruji</b>
                </li>
              </ul>
              <div className="pricing-disclosure">
                <b>This payment is only for finding and verifying your leaf.</b>
                <p>
                  No match means a full refund. {lockedLineage?<>If your {lockedLineage.name} leaf matches, Standard <LocalizedPrice inr={lockedLineage.standard}/> and Ultra <LocalizedPrice inr={lockedLineage.ultra}/> readings remain separate and optional.</>:<>If a leaf matches, the detailed reading is priced separately and remains optional.</>}
                </p>
              </div>
              <form
                method="post"
                action={pricing.region==="india"?"/api/payu/initiate":"/api/paypal/initiate"}
                onSubmit={() => {const amount=leafFindingAmount(pricing,lockedLineage?.id||""),inr=pricing.region==="india"?amount:leafFindingInr(lockedLineage?.id||"");track("payment_started",leadId);trackMeta("InitiateCheckout",{content_name:`${lockedLineage?.name||"Palm Leaf"} Finding`,content_category:"Palm Leaf Finding",currency:pricing.currency,value:amount,num_items:1});trackTikTok("InitiateCheckout",{contents:[{content_id:lockedLineage?.id?`${lockedLineage.id}-nadi-leaf-finding`:"nadi-leaf-finding",content_type:"product",content_name:`${lockedLineage?.name||"NadiVedas"} Leaf Finding`,price:tikTokUsd(inr)}],value:tikTokUsd(inr),currency:"USD"},`checkout-${leadId}`);setBusy(true)}}
              >
                <input type="hidden" name="leadId" value={leadId} />
                <label className="pricing-consent">
                  <input
                    type="checkbox"
                    required
                    checked={pricingAccepted}
                    onChange={(event) =>
                      setPricingAccepted(event.target.checked)
                    }
                  />
                  <span>
                    I understand: <LocalizedPrice inr={lockedLineage?.fee||999} kind="leaf" nadiId={lockedLineage?.id||""}/> is for leaf finding only; a detailed reading is separate and optional.
                  </span>
                </label>
                <button
                  className="primary"
                  type="submit"
                  disabled={busy || !pricingAccepted}
                >
                  {busy
                    ? "Opening secure payment…"
                    : "Proceed to secure payment"}{" "}
                  <span>→</span>
                </button>
              </form>
              <p className="payment-note">
                Secure payment · Next, upload your thumbprint.
              </p>
            </div>
          )}
          {step === 6 && q === -1 && (
            <div className="step-body nadi-intro">
              <span className="step-label">Step 5 · Select a Nadi</span>
              <button type="button" className="replace-thumbprint" onClick={()=>{setFormError("");setStep(5)}}>Need to change your thumbprint? Tap here</button>
              <h2>Choose where Guruji should search.</h2>
              <p>
                Each Nadi is a different palm-leaf library. Your choice tells
                Guruji which library to search.
              </p>
              <div className="library-example">
                <span>1</span>
                <div>
                  <b>Choose a library</b>
                  <p>For example, choose Shiva Nadi to search the Shiva library.</p>
                </div>
                <span>2</span>
                <div>
                  <b>Guruji searches the leaves</b>
                  <p>Your saved thumbprint helps Guruji check the right bundles.</p>
                </div>
                <span>3</span>
                <div>
                  <b>Confirm the match live</b>
                  <p>During the live session, you answer yes or no to Guruji's clues.</p>
                </div>
              </div>
              <div className="no-charge">
                <b>No payment now.</b>
                <span>You decide about a full reading only after your leaf is found.</span>
              </div>
              <button className="primary confirm-nadi" onClick={() => setQ(0)}>
                Help me choose <span>→</span>
              </button>
            </div>
          )}
          {step === 6 && q >= 0 && q < questions.length && (
            <div key={q} className="step-body discovery-question">
              <div className="discovery-count">
                <span>
                  Question {q + 1} of {questions.length}
                </span>
                <i>
                  <b
                    style={{ width: `${((q + 1) / questions.length) * 100}%` }}
                  />
                </i>
              </div>
              <span className="step-label">{question.eyebrow}</span>
              <h2>{question.title}</h2>
              <p>{question.sub}</p>
              <div className="answer-grid">
                {question.options.map(([value, title, desc, icon]) => (
                  <button
                    key={value}
                    onClick={() => answer(question.key, value)}
                  >
                    <i>{icon}</i>
                    <span>
                      <b>{budgetTitle(value,title)}</b>
                      <small>{desc}</small>
                    </span>
                    <em>→</em>
                  </button>
                ))}
              </div>
              <button className="quiet-back" onClick={() => setQ(q - 1)}>
                ← Back
              </button>
            </div>
          )}
          {step === 6 && q === questions.length && (
            <div className="step-body recommendation">
              <span className="step-label">
                Compare one Nadi at a time · {deckIndex + 1} of {deck.length}
              </span>
              <h2>
                {deckIndex === 0
                  ? "Your best starting choice."
                  : "See if this Nadi feels right."}
              </h2>
              <p>
                Choose it, save it, or see the next option. No payment now.
              </p>
              <div className="recommend-card">
                <img src={deckNadi.image} alt={`${deckNadi.name} tradition`} />
                <div className="recommend-shade" />
                <div className="recommend-copy">
                  <span>
                    {deckIndex === 0
                      ? "Recommended for your answers"
                      : deckNadi.tag}{" "}
                    · {deckNadi.sage}
                  </span>
                  <h3>{deckNadi.name}</h3>
                  <p>{deckNadi.focus}</p>
                </div>
              </div>
              <div className="why-fit">
                <span>✦</span>
                <div>
                  <b>
                    {deckNadi.id === "brahma"
                      ? "NadiVedas’ rarest and deepest option"
                      : deckNadi.id === "shiva"
                        ? "A complete-life favourite"
                        : "Why you may choose this Nadi"}
                  </b>
                  <p>
                    {deckNadi.id === "brahma"
                      ? "For deep guidance about family, karma and spiritual purpose."
                      : deckNadi.id === "shiva"
                        ? "For broad guidance about life, family, work and spiritual questions."
                        : "This Nadi matches the main help you selected."}
                  </p>
                </div>
              </div>
              <div
                className="plan-pick"
                role="group"
                aria-label="Choose reading preference"
              >
                <button
                  className={selectedPlan === "standard" ? "selected" : ""}
                  onClick={() => setSelectedPlan("standard")}
                >
                  <small>Standard</small>
                  <strong><LocalizedPrice inr={deckNadi.price}/></strong>
                  <span>About 1 hour*</span>
                </button>
                <button
                  className={
                    selectedPlan === "ultra" ? "selected ultra" : "ultra"
                  }
                  onClick={() => setSelectedPlan("ultra")}
                >
                  <i>Best depth</i>
                  <small>Ultra</small>
                  <strong><LocalizedPrice inr={deckNadi.ultra}/></strong>
                  <span>Up to 2 hours* · Up to 6 family members</span>
                </button>
              </div>
              <p className="plan-terms">*Reading time is approximate. It depends on the seeker&apos;s age and how much life-period content is available on the leaf.</p>
              <p className="later-price">
                <b>No payment now.</b> You decide about the full reading only
                after your leaf is found and confirmed.
              </p>
              <div className="deck-actions">
                <button
                  onClick={() => moveDeck("previous")}
                  disabled={deckIndex === 0}
                >
                  ← Previous
                </button>
                <button
                  onClick={() => moveDeck("shortlist")}
                >
                  ♡ Save for later
                </button>
                <button onClick={() => moveDeck("next")} disabled={deckIndex === deck.length - 1}>
                  Next Nadi →
                </button>
                <button className={choice===deckNadi.id?"selected":""} onClick={() => setChoice(deckNadi.id)}>
                  {choice===deckNadi.id?"✓ Nadi selected":"Select this Nadi"}
                </button>
              </div>
              {shortlist.length > 0 && (
                <div className="shortlist">
                  <b>Your shortlist</b>
                  <div>
                    {shortlist.map((id) => {
                      const n = nadiPrices.find((item) => item.id === id);
                      return n ? (
                        <button
                          key={id}
                          onClick={() => {
                            setChoice(id);
                            setDeckIndex(
                              deck.findIndex((item) => item.id === id),
                            );
                          }}
                        >
                          {n.name}
                        </button>
                      ) : null;
                    })}
                  </div>
                </div>
              )}
              <div className="chosen-line">
                <span>Current choice</span>
                <b>
                  {nadiPrices.find((n) => n.id === choice)?.name ||
                    deckNadi.name}{" "}
                  · {selectedPlan === "ultra" ? "Ultra" : "Standard"}
                </b>
              </div>
              <button
                className="primary confirm-nadi"
                disabled={busy}
                onClick={saveChoice}
              >
                {busy
                  ? "Saving…"
                  : `Confirm ${nadiPrices.find((n) => n.id === choice)?.name || deckNadi.name}`}
                <span>→</span>
              </button>
              <small className="confirm-help">
                Your thumbprint is already saved. No new payment on this step.
              </small>
              <button
                className="restart-quiz"
                onClick={() => {
                  setQ(-1);
                  setAnswers({});
                  setDeckIndex(0);
                  setShortlist([]);
                }}
              >
                Start again
              </button>
            </div>
          )}
          {step === 4 && (
            <div className="step-body contact-save-step">
              <span className="step-label">Step 4 · Confirm on WhatsApp</span>
              {selectedSlotLabel&&<div className="slot-confirmation"><span>✓ Your session time is reserved</span><b>{selectedSlotLabel} IST</b></div>}
              <h2>Your session is not confirmed yet.</h2>
              <p>Tap the green button and <b>send the prepared message</b> to NadiVedas. We will reply automatically with your thumbprint and Nadi steps. Complete them within eight hours to avoid rescheduling.</p>
              <div className="contact-number-card">
                <div><span>NV</span><b>NadiVedas WhatsApp</b><small>Official booking support</small></div>
                <p><b>Order ID</b><span>{orderId}</span></p>
                <p><b>Message</b><span>Thumbprint, Nadi selection & support</span></p>
              </div>
              {formError&&<p className="form-error" role="alert">{formError}</p>}
              <a className="primary contact-download" href={whatsappUrl} target="_blank" rel="noreferrer" onClick={()=>{setContactOpened(true);setFormError("");track("whatsapp_confirmation_opened",leadId)}}>Send WhatsApp to confirm <span>→</span></a>
              {contactOpened&&<button type="button" className="contact-continue" disabled={whatsappChecking} onClick={()=>void checkWhatsAppConfirmation(false)}>{whatsappChecking?"Checking WhatsApp…":"I sent it — check confirmation"} <span>→</span></button>}
              <small className="contact-help">WhatsApp opens with your booking message ready. Please tap Send there, then return to this page. Confirmation is automatic after we receive it.</small>
            </div>
          )}
          {step === 5 && (
            <div className="step-body upload-step">
              <span className="step-label">Step 4 · Thumb impression</span>
              {selectedSlotLabel&&<div className="slot-confirmation"><span>✓ Your session time is reserved</span><b>{selectedSlotLabel} IST</b><div className="booking-actions"><small>{thumbSeconds>0?<>Upload your thumbprint within <strong>{thumbTimer}</strong> to complete the booking.</>:"Upload now to avoid a delay in confirmation."}</small><button type="button" onClick={()=>{setRescheduling(true);setSelectedSlot(0);setStep(3)}}>Reschedule</button></div></div>}
              <h2>Upload your {expectedThumb} thumbprint.</h2>
              <p>Take a clear photo of your <b>{expectedThumb} thumb pad</b>, or upload its dark ink impression on plain paper. Keep the centre ridge lines sharp and visible.</p>
              <div className="thumb-examples"><figure><img src="/images/thumb-photo-example.webp" alt="Clear close-up photo showing the centre and ridges of a thumb pad"/><figcaption><b>Option 1 · Thumb photo</b><span>Centre and ridge lines in sharp focus</span></figcaption></figure><figure><img src="/images/blog-nadi-thumb-impression-real.webp" alt="Clear inked fingerprint impression showing the central ridge pattern"/><figcaption><b>Option 2 · Ink impression</b><span>Full print on clean paper</span></figcaption></figure></div>
              <form onSubmit={uploadThumbprint}>
                {thumbPreview?<><div className="thumb-preview"><img src={thumbPreview} alt={`Selected ${expectedThumb} thumbprint preview`}/><div><b>Image ready</b><span>{thumbName}</span><button type="button" onClick={()=>chooseAnotherThumb(false)}>Choose another</button></div></div><div className="thumb-side-confirm"><b>Is this your {expectedThumb} thumb?</b><p>{leadGender==="female"?"For women, please submit the left thumb.":"For men, please submit the right thumb."}</p><div><button type="button" className={thumbSideConfirmed?"selected":""} onClick={()=>{setThumbSideConfirmed(true);setFormError("")}}>Yes, {expectedThumb} thumb</button><button type="button" onClick={()=>chooseAnotherThumb(true)}>No, retake photo</button></div></div></>:<div className="thumb-actions"><label><input ref={cameraInputRef} type="file" accept="image/jpeg,image/png,image/webp" capture="environment" onChange={e=>void selectThumbFile(e.target.files?.[0])}/><span>Camera</span><b>Take {expectedThumb} thumb photo</b></label><label><input type="file" accept="image/jpeg,image/png,image/webp" onChange={e=>void selectThumbFile(e.target.files?.[0])}/><span>Upload</span><b>Choose from phone</b></label></div>}
                {formError && (
                  <p className="form-error" role="alert">
                    {formError}
                  </p>
                )}
                <button className="primary" disabled={busy||!thumbFile||!thumbSideConfirmed}>
                  {busy ? "Saving to your booking…" : "Confirm thumbprint"}
                  <span>→</span>
                </button>
              </form>
              {thumbHelp&&<p className="thumb-help">We could not verify a clear image after three attempts. Your booking is safe; our care team will help collect it, and you can continue.</p>}
              <p className="privacy-note">
                Your thumbprint is stored privately for the leaf-finding process
                and is not displayed publicly.
              </p>
            </div>
          )}
          {step === 3 && (
            <div className="step-body slot-step">
              <span className="step-label">Step 2 · Preferred time</span>
              <h2>{rescheduling?"Choose a new session time.":"When would you like to meet?"}</h2>
              <p>
                Choose your preferred time. It is confirmed only after successful payment, subject to availability.
              </p>
              <div className="journey-booking-calendar">
                <section className="journey-date-picker">
                  <header><button type="button" onClick={()=>setCalendarMonth(new Date(calendarMonth.getFullYear(),calendarMonth.getMonth()-1,1))}>‹</button><strong>{calendarMonth.toLocaleDateString("en-IN",{month:"long",year:"numeric"})}</strong><button type="button" onClick={()=>setCalendarMonth(new Date(calendarMonth.getFullYear(),calendarMonth.getMonth()+1,1))}>›</button></header>
                  <div className="journey-weekdays">{["Su","Mo","Tu","We","Th","Fr","Sa"].map(day=><b key={day}>{day}</b>)}</div>
                  <div className="journey-month-grid">{Array.from({length:42},(_,index)=>{const date=new Date(calendarMonth.getFullYear(),calendarMonth.getMonth(),index-calendarMonth.getDay()+1);const key=date.toLocaleDateString("en-CA",{timeZone:"Asia/Kolkata"});const enabled=slotDates.has(key);return <button type="button" key={key} disabled={!enabled} className={`${date.getMonth()===calendarMonth.getMonth()?"":"outside"} ${selectedDate===key?"selected":""}`} onClick={()=>{setSelectedDate(key);setSelectedSlot(0)}}>{date.getDate()}</button>})}</div>
                  <small>Asia/Kolkata · 60 minute session · minimum 24 hour lead</small>
                </section>
                <section className="journey-time-picker"><h3>Select time</h3>{slotsLoading?<div className="slot-loading">Finding live Guruji availability…</div>:selectedDateSlots.length?<div>{selectedDateSlots.map(slot=><button type="button" key={slot.startsAt} className={selectedSlot===slot.startsAt?"selected":""} onClick={()=>setSelectedSlot(slot.startsAt)}><b>{new Date(slot.startsAt).toLocaleTimeString("en-IN",{timeZone:"Asia/Kolkata",hour:"numeric",minute:"2-digit"})}</b><small>{slot.availableCount>1?`${slot.availableCount} Gurujis available`:"1 Guruji available"}</small></button>)}</div>:<p>No live slots on this date. Choose another available date.</p>}</section>
              </div>
              {formError && (
                <div className="slot-recovery" role="alert"><p>{formError}</p></div>
              )}
              <button
                className="primary confirm-slot"
                disabled={!selectedSlot || busy}
                onClick={saveSlot}
              >
                {busy ? "Saving…" : !paymentVerified?"Continue to payment":rescheduling?"Confirm new time":"Confirm preferred time"}
                <span>→</span>
              </button>
            </div>
          )}
          {step === 7 && (
            <div className="step-body success">
              {!selectedSlot&&<div role="status"><p>Your payment is confirmed. Please choose an available session time to finish your booking.</p><button type="button" onClick={()=>setStep(3)}>Choose session time</button></div>}
              <div className="success-seal">✓</div>
              <span className="step-label">{lockedLineage?`${lockedLineage.name} selected`:"Journey registered"}</span>
              {selectedSlotLabel&&<div className="slot-confirmation"><span>✓ Journey registered for</span><b>{selectedSlotLabel} IST</b></div>}
              <h2>{selectedSlot?"Your journey is registered.":"One more step: choose your time."}</h2>
              <p>
                Your payment, {selectedSlot?"preferred time, ":""}{"chosen Nadi"} and thumbprint are
                safely recorded. Our care team will confirm your live session
                details on WhatsApp.
              </p>
              {lockedLineage&&<div className="pricing-disclosure"><b>Your selected continuation options</b><p>Standard <LocalizedPrice inr={lockedLineage.standard}/> · Ultra <LocalizedPrice inr={lockedLineage.ultra}/>. These are paid only if your index leaf is found and you choose to continue.</p></div>}
              <div className="next-card">
                <b>What happens next</b>
                <ol>
                  <li>
                    <span>1</span>Our team checks the thumbprint quality
                  </li>
                  <li>
                    <span>2</span>Guruji classifies the print and searches
                    candidate bundles
                  </li>
                  <li>
                    <span>3</span>During the live session, Guruji verifies the index leaf
                    before any continuation-bundle reading
                  </li>
                </ol>
              </div>
              <Link href="/" className="primary">
                Return to NadiVedas <span>→</span>
              </Link>
              <button type="button" className="replace-thumbprint" onClick={()=>{setFormError("");setStep(5)}}>Need to change your thumbprint? Tap here</button>
            </div>
          )}
        </section>
      </div>
    </main>
  );
}
