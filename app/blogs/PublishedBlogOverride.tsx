"use client";

import {useEffect,useRef,useState} from "react";

type PublishedArticle={published:boolean;title?:string;content?:string;revision?:number};

export function PublishedBlogOverride(){
  const[token,setToken]=useState("");
  const[status,setStatus]=useState("");
  const imagePicker=useRef<HTMLInputElement>(null);
  useEffect(()=>{
    const match=window.location.pathname.match(/^\/blogs\/([a-z0-9-]+)\/?$/i);if(!match)return;
    const editToken=new URLSearchParams(window.location.search).get("cmsEdit")||"";
    const controller=new AbortController();
    fetch(`https://poojacrm.nadivedas.com/api/blogs/public?slug=${encodeURIComponent(match[1])}`,{signal:controller.signal})
      .then(response=>response.ok?response.json():null)
      .then((article:PublishedArticle|null)=>{if(article?.published&&article.content){const body=document.querySelector<HTMLElement>(".long-blog-copy");if(body)body.innerHTML=article.content;const heading=document.querySelector<HTMLElement>(".long-blog-hero h1");if(heading&&article.title)heading.textContent=article.title;document.documentElement.dataset.cmsRevision=String(article.revision||"")}})
      .catch(error=>{if(error?.name!=="AbortError")console.warn("Published blog revision unavailable",error)})
      .finally(()=>setToken(editToken));
    return()=>controller.abort();
  },[]);
  useEffect(()=>{
    if(!token)return;const heading=document.querySelector<HTMLElement>(".long-blog-hero h1"),body=document.querySelector<HTMLElement>(".long-blog-copy");
    heading?.setAttribute("contenteditable","true");body?.setAttribute("contenteditable","true");document.body.classList.add("nadi-cms-editing");setStatus("Editing the live page");
    return()=>{heading?.removeAttribute("contenteditable");body?.removeAttribute("contenteditable");document.body.classList.remove("nadi-cms-editing")};
  },[token]);
  const command=(name:string,value?:string)=>{document.execCommand(name,false,value)};
  const link=()=>{const url=window.prompt("Paste the link URL");if(url&&(/^https?:\/\//i.test(url)||url.startsWith("/")))command("createLink",url)};
  const upload=async(file?:File)=>{if(!file)return;setStatus("Uploading image…");const form=new FormData();form.set("token",token);form.set("image",file);const response=await fetch("https://poojacrm.nadivedas.com/api/blogs/editor-session",{method:"POST",body:form});const result=await response.json();if(!response.ok){setStatus(result.error||"Image upload failed");return}command("insertImage",result.url);setStatus("Image added")};
  const publish=async()=>{const title=document.querySelector<HTMLElement>(".long-blog-hero h1")?.innerText.trim()||"",body=document.querySelector<HTMLElement>(".long-blog-copy"),excerpt=body?.querySelector<HTMLElement>(".blog-dek")?.innerText.trim()||body?.querySelector("p")?.textContent?.trim()||"";if(!body)return;setStatus("Publishing changes…");const response=await fetch("https://poojacrm.nadivedas.com/api/blogs/editor-session",{method:"POST",headers:{"content-type":"application/json"},body:JSON.stringify({token,title,excerpt,content:body.innerHTML})});const result=await response.json();if(!response.ok){setStatus(result.error||"Publishing failed");return}setStatus(`Published · revision ${result.revision}`);window.history.replaceState({},"",window.location.pathname)};
  if(!token)return null;
  return <><div className="nadi-cms-bar"><b>NadiVedas page editor</b><span>{status}</span><button onClick={()=>command("formatBlock","h2")}>H2</button><button onClick={()=>command("formatBlock","h3")}>H3</button><button onClick={()=>command("bold")}><b>B</b></button><button onClick={()=>command("italic")}><i>I</i></button><button onClick={()=>command("insertUnorderedList")}>• List</button><button onClick={link}>🔗 Link</button><button onClick={()=>imagePicker.current?.click()}>▧ Image</button><input ref={imagePicker} hidden type="file" accept="image/jpeg,image/png,image/webp" onChange={event=>void upload(event.target.files?.[0])}/><button className="publish" onClick={publish}>Publish changes</button><a href={window.location.pathname}>Exit</a></div><style>{`
    body.nadi-cms-editing{padding-top:68px}.nadi-cms-editing [contenteditable=true]{outline:2px dashed #d79b35;outline-offset:6px;cursor:text}.nadi-cms-editing [contenteditable=true]:focus{outline:3px solid #15845b;background:#fffdf7}.nadi-cms-bar{position:fixed;z-index:999999;inset:0 0 auto;background:#15130f;color:white;min-height:68px;padding:10px 18px;display:flex;align-items:center;gap:8px;box-shadow:0 8px 30px #0004;font:600 14px/1.2 system-ui}.nadi-cms-bar>b{margin-right:6px}.nadi-cms-bar>span{color:#e8d8b3;margin-right:auto;font-weight:500}.nadi-cms-bar button,.nadi-cms-bar a{border:1px solid #ffffff3b;background:#2b2924;color:#fff;border-radius:8px;padding:9px 11px;text-decoration:none;cursor:pointer}.nadi-cms-bar .publish{background:#168657;border-color:#168657;padding-inline:18px}@media(max-width:800px){body.nadi-cms-editing{padding-top:120px}.nadi-cms-bar{flex-wrap:wrap}.nadi-cms-bar>span{width:45%;order:0}.nadi-cms-bar button,.nadi-cms-bar a{padding:8px}.nadi-cms-bar .publish{margin-left:auto}}
  `}</style></>;
}
