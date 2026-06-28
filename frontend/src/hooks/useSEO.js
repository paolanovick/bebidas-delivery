import { useEffect } from 'react';

const BASE_URL = 'https://www.eldanes.online';
const SITE_NAME = 'El Danés';

function setMeta(selector, content) {
  const el = document.querySelector(selector);
  if (el) el.content = content;
}

function setLink(rel, href) {
  let el = document.querySelector(`link[rel="${rel}"]`);
  if (!el) {
    el = document.createElement('link');
    el.rel = rel;
    document.head.appendChild(el);
  }
  el.href = href;
}

export function useSEO({ title, description, url }) {
  useEffect(() => {
    const fullTitle = `${title} — ${SITE_NAME}`;
    const resolvedUrl = url ? `${BASE_URL}${url}` : BASE_URL;
    const resolvedDesc =
      description ||
      'Bebidas & delivery en Tandil. Pedí online tus bebidas favoritas, chequeá promos y novedades.';

    document.title = fullTitle;
    setMeta('meta[name="description"]', resolvedDesc);
    setLink('canonical', resolvedUrl);

    setMeta('meta[property="og:title"]', fullTitle);
    setMeta('meta[property="og:description"]', resolvedDesc);
    setMeta('meta[property="og:image:alt"]', fullTitle);
    setMeta('meta[property="og:url"]', resolvedUrl);

    setMeta('meta[name="twitter:title"]', fullTitle);
    setMeta('meta[name="twitter:description"]', resolvedDesc);
    setMeta('meta[name="twitter:image:alt"]', fullTitle);

    return () => {
      document.title = `${SITE_NAME} — Bebidas & Delivery en Tandil`;
      setMeta('meta[name="description"]', 'El Danés: bebidas & delivery en Tandil. Pedí online tus bebidas favoritas.');
      setLink('canonical', BASE_URL + '/');
      setMeta('meta[property="og:title"]', `${SITE_NAME} — Bebidas & Delivery en Tandil`);
      setMeta('meta[property="og:description"]', 'Bebidas & delivery en Tandil. Pedí online tus bebidas favoritas, chequeá promos y novedades.');
      setMeta('meta[property="og:image:alt"]', `${SITE_NAME} — Bebidas & Delivery en Tandil`);
      setMeta('meta[property="og:url"]', BASE_URL + '/');
      setMeta('meta[name="twitter:title"]', `${SITE_NAME} — Bebidas & Delivery en Tandil`);
      setMeta('meta[name="twitter:description"]', 'Bebidas & delivery en Tandil. Pedí online tus bebidas favoritas.');
      setMeta('meta[name="twitter:image:alt"]', `${SITE_NAME} — Bebidas & Delivery en Tandil`);
    };
  }, [title, description, url]);
}
