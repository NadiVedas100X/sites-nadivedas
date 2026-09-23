export const publishedTestimonials = [
  ["1118b123-e9e6-426c-becb-cfb52b6cb9ea","Tanushri Patnaik","","Initially skeptical, but very satisfied with the session","I thought it might be a fraud at first, but your team came and I really liked the session — I gave 4.5 stars.",10,"d6b6897a35d45aa19b94140ea3388702"],
  ["2eae687b-a6c2-4ea6-b511-7b66af5e49df","Gautam Singhania","Chairman of Raymonds","","",10,"dc86e175b40f6f79077080be7b73fc92"],
  ["ae134e3a-8cb6-4b6d-a2db-13a19c2c4e6d","Sambit","","I experienced mind-blowing accuracy — I recommend the NadiVedas team","Without knowing me, Guruji got about 95–98% of things right. It was a mind-blowing experience, and I recommend everyone try the NadiVedas team.",11,"560a9b2b35f84177e0c1fe94c09a464e"],
  ["5fd47d21-b5aa-4341-b3af-3486161dcd26","Suraj","","I experienced excellent coordination — the Guruji was on time","The NadiVedas team coordinated well, kept me updated on timing, the Guruji was on time, and I gave them a five.",30,"fb31cbba1f44a2e595f95e6ec45fac36"],
  ["1e2e0984-eabf-41c9-887a-dfec281db1eb","Shubhi","","Exact thumb-reading, clear remedies, seamless coordination","I felt a big relief — the thumb-impression reading matched my past and future exactly, the remedies were clearly explained, and your team coordinated everything perfectly and kept me informed.",70,"b3ede59396c5bafe29ad319360c2ac5a"],
  ["a19fa4f7-7d0a-4e0d-95a3-fe1f6fabd547","Gaurav kumar","","","",130,"c743643e0be257d391b1f203961e6b6c"],
  ["86b4eb24-1a48-426a-80b3-583e13bdc85a","Aditya","","Accurate, Detailed Readings and Quick Coordination","Their readings were very accurate and very detailed, and the coordination team was quick and responsive.",170,"5073b9db9570652f4c8d185d81f811c3"],
  ["22609439-80c2-4d28-9171-c267dd8e7fb3","Dr. Aanchal","MBBS Doctor","Insightful and Flawless Experience","It was very good and very insightful — your team's coordination was flawless and everyone updated me properly.",180,"a397782d20bf16e7645548ffa7db6ac7"],
  ["9178e5d9-2db1-4985-935d-d3c622c91270","Dr. Aanchal","MBBS Doctor","","",190,"31edc076e8fdc4fd938404c412beb14f"],
].map(([id,name,role,title,quote,priority,streamId])=>({
  id:String(id),type:"video" as const,name:String(name),role:String(role),title:String(title),quote:String(quote),nadi:"",language:"English",aspectRatio:"9:16",priority:Number(priority),rating:5,imageUrl:"",
  posterUrl:`https://videodelivery.net/${streamId}/thumbnails/thumbnail.jpg?time=1s&height=720&fit=crop`,
  playbackUrl:`https://iframe.videodelivery.net/${streamId}?preload=none&letterboxColor=%23080d0a`,
}));
