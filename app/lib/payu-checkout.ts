// Hand off to PayU's hosted checkout with a normal top-level form submit.
// This works reliably in Instagram's WebView and when an external UPI app
// returns, while the signed callback/server recovery remains authoritative.
export function payuCheckoutHtml(fields:Record<string,string>,test:boolean) {
  const json=JSON.stringify(fields).replace(/</g,"\\u003c");
  const endpoint=test?"https://test.payu.in/_payment":"https://secure.payu.in/_payment";
  return `<!doctype html><html><head><meta name="viewport" content="width=device-width,initial-scale=1"><meta name="robots" content="noindex"><title>Secure NadiVedas payment</title></head>
<body style="font:17px system-ui;background:#112a22;color:white;margin:0;padding:32px"><main style="max-width:480px;margin:40px auto;text-align:center"><h1>Opening secure payment…</h1><p id="status" role="status">Please stay on this page for a moment.</p><form id="payu" method="post" action="${endpoint}"></form><noscript><p>JavaScript is required to open PayU. Please enable it and try again.</p></noscript></main>
<script>
const data=${json};const form=document.getElementById('payu');
const resume=new URL('/journey',location.origin);resume.searchParams.set('lead',data.udf1);resume.searchParams.set('payment','pending');
history.replaceState(null,'',resume.href);
for(const [name,value] of Object.entries(data)){const input=document.createElement('input');input.type='hidden';input.name=name;input.value=value;form.appendChild(input);}
form.submit();
</script></body></html>`;
}
