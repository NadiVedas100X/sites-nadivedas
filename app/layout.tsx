import type {Metadata} from "next";
import "./globals.css";
import "./editorial.css";
import "./performance.css";
import {AnalyticsTracker} from "./components/AnalyticsTracker";
import {MetaPixel} from "./components/MetaPixel";
import {NadiInterestTracker} from "./components/NadiInterestTracker";
import {PricingProvider} from "./components/PricingProvider";
import {InAppBrowserGuard} from "./components/InAppBrowserGuard";
import {WebsiteChatbot} from "./components/WebsiteChatbot";

const siteUrl="https://www.nadivedas.com";
const faviconVersion="20260816";
const officialProfiles=[
  "https://www.instagram.com/nadivedas/",
  "https://x.com/NadiVedas",
  "https://www.youtube.com/@NadiVedas"
];
const title="NadiVedas — Authentic Nadi Astrology & Palm Leaf Reading";
const description="Discover authentic Nadi astrology through a traditional thumb-impression palm-leaf search, live leaf matching and guided online readings from India.";

export const metadata:Metadata={
  metadataBase:new URL(siteUrl),
  title:{default:title,template:"%s | NadiVedas"},
  description,
  applicationName:"NadiVedas",
  keywords:["Nadi astrology","palm leaf astrology","Nadi reading online","palm leaf reading","Nadi Jyotish","Agastya Nadi","Shiva Nadi","Vaitheeswaran Koil Nadi astrology"],
  authors:[{name:"NadiVedas",url:siteUrl}],
  creator:"NadiVedas",
  publisher:"NadiVedas",
  category:"Spiritual guidance",
  icons:{
    icon:[
      {url:`/favicon.ico?v=${faviconVersion}`,type:"image/x-icon",sizes:"16x16 32x32 48x48 64x64"},
      {url:`/favicon.png?v=${faviconVersion}`,type:"image/png",sizes:"64x64"},
      {url:`/favicon-192.png?v=${faviconVersion}`,type:"image/png",sizes:"192x192"}
    ],
    shortcut:`/favicon.ico?v=${faviconVersion}`,
    apple:[{url:`/apple-touch-icon.png?v=${faviconVersion}`,type:"image/png",sizes:"180x180"}]
  },
  manifest:"/site.webmanifest",
  formatDetection:{telephone:false,email:false,address:false},
  openGraph:{type:"website",locale:"en_IN",url:siteUrl,siteName:"NadiVedas",title,description,images:[{url:"/og.png",width:1768,height:928,alt:"NadiVedas — authentic Nadi palm-leaf astrology"}]},
  twitter:{card:"summary_large_image",title,description,images:["/og.png"]},
  robots:{index:true,follow:true,googleBot:{index:true,follow:true,"max-image-preview":"large","max-snippet":-1,"max-video-preview":-1}}
};

const structuredData={"@context":"https://schema.org","@graph":[
  {"@type":"Organization","@id":`${siteUrl}/#organization`,name:"NadiVedas",url:siteUrl,logo:{"@type":"ImageObject",url:`${siteUrl}/favicon-512.png`,width:512,height:512},image:`${siteUrl}/og.png`,sameAs:officialProfiles,email:"support@nadivedas.com",telephone:"+91-9992229463"},
  {"@type":"WebSite","@id":`${siteUrl}/#website`,url:siteUrl,name:"NadiVedas",description,publisher:{"@id":`${siteUrl}/#organization`},inLanguage:"en-IN"},
  {"@type":"Service","@id":`${siteUrl}/#leaf-finding`,name:"Nadi Palm Leaf Finding",serviceType:"Traditional Nadi astrology palm-leaf search and live matching",provider:{"@id":`${siteUrl}/#organization`},areaServed:"Worldwide",availableChannel:{"@type":"ServiceChannel",serviceUrl:`${siteUrl}/journey`,availableLanguage:["English","Hindi","Tamil","Telugu"]},offers:{"@type":"Offer",price:"999",priceCurrency:"INR",url:`${siteUrl}/journey`,description:"Leaf-finding fee, fully refunded when no matching leaf is found."}}
]};

const tikTokPixel=`!function (w, d, t) {
  if(w.location.pathname.startsWith("/pdf-reports/thank-you"))return;
  w.TiktokAnalyticsObject=t;var ttq=w[t]=w[t]||[];ttq.methods=["page","track","identify","instances","debug","on","off","once","ready","alias","group","enableCookie","disableCookie","holdConsent","revokeConsent","grantConsent"],ttq.setAndDefer=function(t,e){t[e]=function(){t.push([e].concat(Array.prototype.slice.call(arguments,0)))}};for(var i=0;i<ttq.methods.length;i++)ttq.setAndDefer(ttq,ttq.methods[i]);ttq.instance=function(t){for(var e=ttq._i[t]||[],n=0;n<ttq.methods.length;n++)ttq.setAndDefer(e,ttq.methods[n]);return e},ttq.load=function(e,n){var r="https://analytics.tiktok.com/i18n/pixel/events.js",o=n&&n.partner;ttq._i=ttq._i||{},ttq._i[e]=[],ttq._i[e]._u=r,ttq._t=ttq._t||{},ttq._t[e]=+new Date,ttq._o=ttq._o||{},ttq._o[e]=n||{};n=document.createElement("script");n.type="text/javascript",n.async=!0,n.src=r+"?sdkid="+e+"&lib="+t;e=document.getElementsByTagName("script")[0];e.parentNode.insertBefore(n,e)};
  ttq.load("DA3FQ3JC77U14HQM5JR0");
  ttq.page();
}(window, document, "ttq");`;

export default function RootLayout({children}:Readonly<{children:React.ReactNode}>){return <html lang="en-IN"><head><link rel="dns-prefetch" href="https://secure.payu.in"/><link rel="preconnect" href="https://secure.payu.in" crossOrigin="anonymous"/><link rel="dns-prefetch" href="https://www.paypal.com"/><link rel="preconnect" href="https://www.paypal.com" crossOrigin="anonymous"/><link rel="preconnect" href="https://analytics.tiktok.com" crossOrigin="anonymous"/><script dangerouslySetInnerHTML={{__html:tikTokPixel}}/></head><body><InAppBrowserGuard/><PricingProvider><MetaPixel/><NadiInterestTracker/><AnalyticsTracker/>{children}<WebsiteChatbot/></PricingProvider><script type="application/ld+json" dangerouslySetInnerHTML={{__html:JSON.stringify(structuredData)}}/><noscript><img height="1" width="1" style={{display:"none"}} src="https://www.facebook.com/tr?id=424480907320631&ev=PageView&noscript=1" alt=""/></noscript></body></html>}
