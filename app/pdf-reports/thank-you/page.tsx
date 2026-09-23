import type {Metadata} from 'next';
import ThankYou from './thank-you';
export const metadata:Metadata={title:'Your Nadi report order | Nadi Vedas',robots:{index:false,follow:false},referrer:'no-referrer'};
export default function Page(){return <ThankYou/>}
