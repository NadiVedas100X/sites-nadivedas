import {getCmsBlog,cmsMetadata} from '../../lib/blog-cms';
import CmsBlogArticle from '../../components/CmsBlogArticle';
import {notFound} from 'next/navigation';
import { CityBlogArticle, cityMetadata } from "../../components/CityBlogArticle";
import { getCityBlogArticle } from "../../lib/city-blog-articles";
const article = getCityBlogArticle("nadi-astrology-ahmedabad")!;
const fallbackMetadata = cityMetadata(article);
function StaticPage(){ return <CityBlogArticle article={article}/>; }

export async function generateMetadata(){const {post}=await getCmsBlog('nadi-astrology-ahmedabad');return post?cmsMetadata(post):fallbackMetadata}
export default async function Page(){const {managed,post}=await getCmsBlog('nadi-astrology-ahmedabad');if(post)return <CmsBlogArticle post={post}/>;if(managed)notFound();return <StaticPage/>}
