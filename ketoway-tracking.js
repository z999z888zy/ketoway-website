// First-party, client-side attribution only. No analytics request is sent here.
(() => {
  'use strict';
  const key = 'ketoway-attribution-v1';
  const params = new URLSearchParams(location.search);
  const clean = value => String(value || '').slice(0, 300);
  const read = () => {
    try { return JSON.parse(sessionStorage.getItem(key) || '{}'); }
    catch { return {}; }
  };
  const initial = read();
  const fields = ['utm_source', 'utm_medium', 'utm_campaign', 'utm_term', 'utm_content'];
  const incoming = Object.fromEntries(fields.map(field => [field, clean(params.get(field))]));
  const hasCampaign = fields.some(field => incoming[field]);
  const first = initial.first_landing_page || location.href;
  const state = {
    first_landing_page: clean(first),
    first_referrer: clean(initial.first_referrer || document.referrer),
    ...Object.fromEntries(fields.map(field => [field, hasCampaign ? incoming[field] : clean(initial[field])]))
  };
  try { sessionStorage.setItem(key, JSON.stringify(state)); } catch {}
  window.KT = Object.freeze({
    flat() {
      return {
        ...state,
        inquiry_page: clean(location.href),
        inquiry_referrer: clean(document.referrer)
      };
    }
  });
})();
