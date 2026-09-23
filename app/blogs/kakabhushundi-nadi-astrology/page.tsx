import {getCmsBlog,cmsMetadata} from '../../lib/blog-cms';
import CmsBlogArticle from '../../components/CmsBlogArticle';
import {notFound} from 'next/navigation';
import { LineageBlogArticle, lineageMetadata } from "../../components/LineageBlogArticle";
import { kakabhushundiNadiArticle as article } from "../../lib/lineage-blog-articles";
const fallbackMetadata = lineageMetadata(article);
function StaticPage(){ return <LineageBlogArticle article={article} />; }

export async function generateMetadata(){const {post}=await getCmsBlog('kakabhushundi-nadi-astrology');return post?cmsMetadata(post):fallbackMetadata}
export default async function Page(){const {managed,post}=await getCmsBlog('kakabhushundi-nadi-astrology');if(post)return <CmsBlogArticle post={post}/>;if(managed)notFound();return <StaticPage/>}
