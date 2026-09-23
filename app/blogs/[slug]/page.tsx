import {notFound} from 'next/navigation';
import {getCmsBlog,cmsMetadata} from '../../lib/blog-cms';
import CmsBlogArticle from '../../components/CmsBlogArticle';
export async function generateMetadata({params}:{params:Promise<{slug:string}>}){const {post}=await getCmsBlog((await params).slug);return post?cmsMetadata(post):{title:'Article not found',robots:{index:false}}}
export default async function Page({params}:{params:Promise<{slug:string}>}){const {post}=await getCmsBlog((await params).slug);if(!post)notFound();return <CmsBlogArticle post={post}/>}
