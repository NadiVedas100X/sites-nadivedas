import {proxyPdf} from '../../lib/pdf-proxy';
export async function POST(request:Request){return proxyPdf(request,'checkout')}
