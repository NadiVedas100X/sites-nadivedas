import {getCmsCatalog} from '../../lib/blog-cms';
import type {Metadata} from 'next';
import {SiteHeader,SiteFooter} from '../../components/SiteChrome';
import BlogLibrary from '../BlogLibrary';
import {libraryPosts} from '../library-posts';
import '../reviews.css';
export const metadata:Metadata={title:'NadiVedas Reviews Blog | Stories Behind the Videos',description:'Read the stories behind NadiVedas video reviews, with the original videos, names and experiences of seekers, doctors and professionals.',alternates:{canonical:'/blogs/reviews'}};
export default async function Page(){return <main className="new-site blogs-index"><SiteHeader/><header className="journal-hero"><div><span className="kicker">REVIEWS BLOG</span><h1>Watch their story.<br/><em>Understand their journey.</em></h1><p>Connected stories from published NadiVedas testimonials, with the original videos beside each person's experience.</p></div></header><BlogLibrary posts={libraryPosts([],await getCmsCatalog())} initialCategory="reviews"/><SiteFooter/></main>}
