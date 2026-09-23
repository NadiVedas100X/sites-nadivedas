import {getCmsCatalog} from './lib/blog-cms';
import type { MetadataRoute } from "next";
import { journalPosts } from "./lib/journal";
import { blogs } from "./lib/blogs";
import { lineagePages } from "./lib/lineage-pages";

const pages = [
  ["/pdf-reports", .9, "monthly"],
  ["/affiliate", .6, "monthly"],
  ["", 1, "weekly"], ["/about", .95, "monthly"], ["/nadis", .9, "monthly"], ["/shiva-nadi", .92, "monthly"], ["/brahma-nadi", .92, "monthly"], ["/chapters", .85, "monthly"], ["/reviews", .8, "monthly"], ["/blog", .8, "weekly"], ["/blogs", .9, "daily"], ["/journey", .8, "monthly"], ["/refund-policy", .4, "yearly"], ["/privacy", .3, "yearly"],
  ["/pages/about-us", .72, "monthly"], ["/pages/terms-conditions", .35, "yearly"], ["/pages/return-shipping", .35, "yearly"], ["/pages/privacy-policies", .35, "yearly"], ["/pages/contact", .65, "monthly"],
  ["/collections/all", .9, "weekly"], ["/products/shiva-vakya-nadi", .88, "monthly"], ["/products/brahma-nadi", .86, "monthly"], ["/products/nandi-nadi", .84, "monthly"], ["/products/agastya-nadi", .75, "monthly"], ["/products/atri-nadi", .7, "monthly"], ["/products/bhogar-nadi", .7, "monthly"], ["/products/bhrigu-nadi", .7, "monthly"], ["/products/dhanvantari-nadi", .7, "monthly"], ["/products/kaka-bhushundi-nadi", .72, "monthly"], ["/products/shukra-nadi", .7, "monthly"], ["/products/thirumoolar-nadi", .7, "monthly"], ["/products/vasishtha-nadi", .7, "monthly"],
] as const;

export default async function sitemap(): Promise<MetadataRoute.Sitemap> {
  const cms=await getCmsCatalog();
  const base = "https://www.nadivedas.com";
  return [
    {url:base+"/blogs/reviews",changeFrequency:"weekly",priority:.8},
    ...pages.map(([path, priority, changeFrequency]) => ({ url: base + path, lastModified: new Date(path === "" ? "2026-08-16" : "2026-08-07"), changeFrequency, priority })),
    ...journalPosts.map(post => ({ url: `${base}/blog/${post.slug}`, lastModified: new Date("2026-08-07"), changeFrequency: "monthly" as const, priority: .72 })),
    ...cms.posts.map(post=>({url:`${base}/blogs/${post.slug}`,lastModified:new Date(post.updated_at),changeFrequency:"monthly" as const,priority:.86})),
    ...blogs.filter(post=>!cms.managedSlugs.includes(post.slug)&&!cms.posts.some(p=>p.slug===post.slug)).map(post => ({ url: `${base}/blogs/${post.slug}`, lastModified: new Date(post.date), changeFrequency: "monthly" as const, priority: .86 })),
    ...lineagePages.map(page => ({ url: `${base}/${page.slug}`, lastModified: new Date("2026-08-13"), changeFrequency: "monthly" as const, priority: .92 })),
  ];
}
