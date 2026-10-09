// Analytics remains disabled until IDs have been approved and provided.
const GA_MEASUREMENT_ID = "";
const CLARITY_ID = "";

if (/^G-[A-Z0-9]+$/.test(GA_MEASUREMENT_ID)) {
  window.dataLayer = window.dataLayer || [];
  function gtag() { window.dataLayer.push(arguments); }
  gtag('js', new Date());
  gtag('config', GA_MEASUREMENT_ID);
  const script = document.createElement('script');
  script.async = true;
  script.src = `https://www.googletagmanager.com/gtag/js?id=${encodeURIComponent(GA_MEASUREMENT_ID)}`;
  document.head.append(script);
}
if (/^[a-zA-Z0-9]+$/.test(CLARITY_ID)) {
  window.clarity = window.clarity || function () {
    (window.clarity.q = window.clarity.q || []).push(arguments);
  };
  const script = document.createElement('script');
  script.async = true;
  script.src = `https://www.clarity.ms/tag/${encodeURIComponent(CLARITY_ID)}`;
  document.head.append(script);
}
