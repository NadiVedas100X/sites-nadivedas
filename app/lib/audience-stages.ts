/** Current-state predicates. Unknown CRM outcomes are not treated as confirmed negatives. */
export type AudienceFacts = {
  phone?: string;
  detailsSubmitted: boolean;
  payment: 'success'|'failed'|'pending'|'not_started'|'unknown';
  thumbprintUploaded: boolean|null;
  nadiDecided: boolean|null;
  lfDone: boolean|null;
  leafConfirmed: boolean|null;
  frDecided: boolean|null;
  frPaid: boolean|null;
  pujaPaid: boolean|null;
  scheduledAt: number|null;
};
export const audienceLabels = {
  payment_success: 'Payment successful', payment_failed: 'Payment failed',
  payment_incomplete: 'Payment incomplete', thumbprint_missing: 'Thumbprint missing',
  nadi_undecided: 'Nadi not chosen', lf_not_done: 'LF session not done',
  lf_overdue: 'Scheduled date passed; LF not done', leaf_confirmed: 'Leaf confirmed',
  leaf_not_confirmed: 'Leaf not confirmed', fr_undecided: 'FR not decided',
  fr_unpaid: 'FR unpaid', fr_paid: 'FR paid', puja_unpaid: 'Puja unpaid',
} as const;
export type AudienceStage = keyof typeof audienceLabels;
export function audienceStages(f:AudienceFacts, now=Date.now()):AudienceStage[]{
  if(['917799639692','7799639692'].includes((f.phone||'').replace(/\D/g,'')))return [];
  const stages:AudienceStage[]=[];
  if(f.payment==='success')stages.push('payment_success');
  if(f.payment==='failed')stages.push('payment_failed');
  if(f.detailsSubmitted&&['not_started','pending'].includes(f.payment))stages.push('payment_incomplete');
  if(f.payment==='success'){
    if(f.thumbprintUploaded===false)stages.push('thumbprint_missing');
    if(f.nadiDecided===false)stages.push('nadi_undecided');
    if(f.lfDone===false){stages.push('lf_not_done');if(f.scheduledAt!==null&&f.scheduledAt<now)stages.push('lf_overdue');}
  }
  if(f.leafConfirmed===true)stages.push('leaf_confirmed');
  if(f.leafConfirmed===false)stages.push('leaf_not_confirmed');
  if(f.frDecided===false)stages.push('fr_undecided');
  if(f.frPaid===false)stages.push('fr_unpaid');
  if(f.frPaid===true)stages.push('fr_paid');
  if(f.pujaPaid===false)stages.push('puja_unpaid');
  return stages;
}
export function matchesAudience(f:AudienceFacts,selected:AudienceStage[],now=Date.now()){
  const stages=new Set(audienceStages(f,now));
  return stages.size>0&&selected.every(stage=>stages.has(stage));
}
