import {getCmsCatalog} from '../lib/blog-cms';
import type {Metadata} from 'next';
import {SiteHeader,SiteFooter} from '../components/SiteChrome';
import BlogLibrary from './BlogLibrary';
import {libraryPosts} from './library-posts';
import './reviews.css';
export const metadata:Metadata={title:'Nadi Astrology Blog & Real Seeker Stories',description:'Explore Nadi astrology, reading chapters and real NadiVedas video review stories. Search by topic or name and discover the experiences behind the reviews.',alternates:{canonical:'/blogs'}};
export default async function Page(){const cms=await getCmsCatalog();const posts=libraryPosts([],cms);return <main className="new-site blogs-index"><SiteHeader/><header className="journal-hero"><div><span className="kicker">THE NADI VEDAS JOURNAL</span><h1>Real stories.<br/>Deeper <em>understanding.</em></h1><p>Meet the people behind the reviews. Explore the traditions, chapters and questions that bring seekers to Nadi astrology.</p></div><div className="journal-seal"><b>{posts.length}</b><span>Stories &<br/>guides</span></div></header><BlogLibrary posts={posts}/><SiteFooter/></main>}
