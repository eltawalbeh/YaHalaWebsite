type ServiceSeoInput = {
  slug: string;
  nameAr: string;
  nameEn: string;
  descriptionAr?: string;
  descriptionEn?: string;
  image?: string;
  locale?: "ar" | "en";
};

function setMeta(selector: string, attribute: "name" | "property", key: string, content: string) {
  let element = document.querySelector<HTMLMetaElement>(selector);
  if (!element) {
    element = document.createElement("meta");
    element.setAttribute(attribute, key);
    document.head.appendChild(element);
  }
  element.content = content;
  return element;
}

export function buildServiceJsonLd(service: ServiceSeoInput) {
  const description = service.locale === "en"
    ? (service.descriptionEn || service.descriptionAr || "Professional travel services by Ya Hala Travel & Tourism")
    : (service.descriptionAr || service.descriptionEn || "Professional travel services by Ya Hala Travel & Tourism");
  const canonical = `https://www.yahala.co/services/${encodeURIComponent(service.slug)}`;
  return { "@context": "https://schema.org", "@type": "Service", name: service.nameEn, alternateName: service.nameAr, description, url: canonical, image: service.image || undefined, provider: { "@type": "TravelAgency", name: "Ya Hala Travel & Tourism", url: "https://www.yahala.co/" } };
}

export function clearServiceSeo() {
  document.title = "Ya Hala Travel & Tourism | Corporate Travel Services in Saudi Arabia";
  const description = document.querySelector<HTMLMetaElement>('meta[name="description"]');
  if (description) description.content = "Ya Hala Travel & Tourism provides corporate travel, flights, hotels, MICE, VIP travel, visa, insurance, and business travel solutions across Saudi Arabia and the Gulf.";
  document.querySelectorAll('meta[property^="og:"]').forEach((node) => node.remove());
  document.querySelectorAll('script[data-yahala-service-seo="true"]').forEach((node) => node.remove());
  const canonical = document.querySelector<HTMLLinkElement>('link[rel="canonical"]');
  if (canonical) canonical.href = "https://www.yahala.co/";
}

export function applyServiceSeo(service: ServiceSeoInput) {
  const useEnglish = service.locale === "en";
  const title = `${useEnglish ? service.nameEn : service.nameAr} | Ya Hala Travel & Tourism`;
  const description = useEnglish
    ? (service.descriptionEn || service.descriptionAr || "Professional travel services by Ya Hala Travel & Tourism")
    : (service.descriptionAr || service.descriptionEn || "Professional travel services by Ya Hala Travel & Tourism");
  const canonical = `https://www.yahala.co/services/${encodeURIComponent(service.slug)}`;
  document.title = title;
  setMeta('meta[name="description"]', "name", "description", description);
  setMeta('meta[property="og:title"]', "property", "og:title", title);
  setMeta('meta[property="og:description"]', "property", "og:description", description);
  setMeta('meta[property="og:url"]', "property", "og:url", canonical);
  if (service.image) setMeta('meta[property="og:image"]', "property", "og:image", service.image);
  let link = document.querySelector<HTMLLinkElement>('link[rel="canonical"]');
  if (!link) { link = document.createElement("link"); link.rel = "canonical"; document.head.appendChild(link); }
  link.href = canonical;
  const script = document.createElement("script");
  script.type = "application/ld+json";
  script.dataset.yahalaServiceSeo = "true";
  script.textContent = JSON.stringify(buildServiceJsonLd(service));
  document.querySelectorAll('script[data-yahala-service-seo="true"]').forEach((node) => node.remove());
  document.head.appendChild(script);
}
