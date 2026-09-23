import {proxyPdf} from '../../../lib/pdf-proxy';
export async function POST(request:Request,{params}:{params:Promise<{action:string}>}){return proxyPdf(request,(await params).action)}
