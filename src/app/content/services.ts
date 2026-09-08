export type ServiceRecord = {
  id: string;
  slug: string;
  name_ar: string;
  name_en: string;
  short_description_ar: string;
  short_description_en: string;
  long_description_ar?: string;
  long_description_en?: string;
  cover_image_url: string;
  hero_image_url: string;
  is_featured: boolean;
  is_active: boolean;
  external_url?: string;
  features_json?: Array<{ ar: string; en: string }>;
  process_steps_json?: unknown[];
};

export const defaultServices: ServiceRecord[] = [
  { id: "svc-flights", slug: "flights", name_ar: "تذاكر الطيران", name_en: "Flight Tickets", short_description_ar: "حجز تذاكر طيران بأفضل الأسعار لجميع الوجهات العالمية", short_description_en: "Book flight tickets at the best prices to all global destinations", cover_image_url: "https://images.unsplash.com/photo-1769945967065-ec805ecc7e6b?w=800&q=80", hero_image_url: "https://images.unsplash.com/photo-1769945967065-ec805ecc7e6b?w=1200&q=80", is_featured: true, is_active: true },
  { id: "svc-hotels", slug: "hotels", name_ar: "حجوزات الفنادق", name_en: "Hotel Reservations", short_description_ar: "فنادق فاخرة ومميزة في جميع أنحاء العالم", short_description_en: "Luxury and distinguished hotels worldwide", cover_image_url: "https://images.unsplash.com/photo-1743510605761-a53505d68c09?w=800&q=80", hero_image_url: "https://images.unsplash.com/photo-1743510605761-a53505d68c09?w=1200&q=80", is_featured: true, is_active: true },
  { id: "svc-ground", slug: "ground-transport", name_ar: "السيارات والقطارات", name_en: "Car & Train", short_description_ar: "خدمات النقل البري المتكاملة للشركات", short_description_en: "Comprehensive ground transport services for businesses", cover_image_url: "https://images.unsplash.com/photo-1771775751121-3091d79073d4?w=800&q=80", hero_image_url: "https://images.unsplash.com/photo-1771775751121-3091d79073d4?w=1200&q=80", is_featured: false, is_active: true },
  { id: "svc-mice", slug: "mice", name_ar: "المؤتمرات والفعاليات (MICE)", name_en: "MICE", short_description_ar: "تنظيم الاجتماعات والمؤتمرات والمعارض والفعاليات المؤسسية", short_description_en: "Organizing meetings, conferences, exhibitions and corporate events", cover_image_url: "https://images.unsplash.com/photo-1771147372627-7fffe86cf00b?w=800&q=80", hero_image_url: "https://images.unsplash.com/photo-1771147372627-7fffe86cf00b?w=1200&q=80", is_featured: true, is_active: true },
  { id: "svc-honeymoon", slug: "honeymoon", name_ar: "باقات شهر العسل", name_en: "Honeymoon Packages", short_description_ar: "رحلات شهر عسل استثنائية لبداية حياة مثالية", short_description_en: "Exceptional honeymoon trips for a perfect start", cover_image_url: "https://images.unsplash.com/photo-1766735325665-9e7dea46f9cc?w=800&q=80", hero_image_url: "https://images.unsplash.com/photo-1766735325665-9e7dea46f9cc?w=1200&q=80", is_featured: false, is_active: true },
  { id: "svc-cruises", slug: "cruises", name_ar: "رحلات الكروز", name_en: "Cruise Packages", short_description_ar: "إبحار فاخر في أجمل البحار والمحيطات حول العالم", short_description_en: "Luxury sailing on the most beautiful seas worldwide", cover_image_url: "https://images.unsplash.com/photo-1741962839137-01e0c297a281?w=800&q=80", hero_image_url: "https://images.unsplash.com/photo-1741962839137-01e0c297a281?w=1200&q=80", is_featured: false, is_active: true },
  { id: "svc-therapeutic", slug: "therapeutic-educational", name_ar: "السياحة العلاجية والتعليمية", name_en: "Therapeutic & Educational", short_description_ar: "رحلات متخصصة للعلاج والتعليم في أفضل المراكز العالمية", short_description_en: "Specialized trips for treatment and education at top global centers", cover_image_url: "https://images.unsplash.com/photo-1654762930571-dcf2ebc11542?w=800&q=80", hero_image_url: "https://images.unsplash.com/photo-1654762930571-dcf2ebc11542?w=1200&q=80", is_featured: false, is_active: true },
  { id: "svc-vip", slug: "vip", name_ar: "الطيران الخاص وخدمات VIP", name_en: "VIP & Private Flights", short_description_ar: "تجربة سفر استثنائية مع خدمات الطيران الخاص وكبار الشخصيات", short_description_en: "Exceptional travel experience with private jets and VIP services", cover_image_url: "https://images.unsplash.com/photo-1759614581731-4c7090648de0?w=800&q=80", hero_image_url: "https://images.unsplash.com/photo-1759614581731-4c7090648de0?w=1200&q=80", is_featured: true, is_active: true },
  { id: "svc-visa", slug: "visa-insurance", name_ar: "التأشيرات والتأمين", name_en: "Visa & Insurance", short_description_ar: "خدمات استخراج التأشيرات وتأمين السفر لجميع الوجهات", short_description_en: "Visa processing and travel insurance services for all destinations", cover_image_url: "https://images.unsplash.com/photo-1655722725332-9925c96dd627?w=800&q=80", hero_image_url: "https://images.unsplash.com/photo-1655722725332-9925c96dd627?w=1200&q=80", is_featured: false, is_active: true },
  { id: "svc-corporate", slug: "corporate", name_ar: "حلول الأعمال المؤسسية", name_en: "Business Solutions", short_description_ar: "حلول سفر متكاملة مصممة خصيصاً للشركات والمؤسسات", short_description_en: "Comprehensive travel solutions designed specifically for businesses", cover_image_url: "https://images.unsplash.com/photo-1771147372627-7fffe86cf00b?w=800&q=80", hero_image_url: "https://images.unsplash.com/photo-1771147372627-7fffe86cf00b?w=1200&q=80", is_featured: true, is_active: true },
];

export const serviceBySlug = (slug: string) => defaultServices.find((service) => service.slug === slug);
export const activeServices = (services: ServiceRecord[]) => services.filter((service) => service.is_active !== false);
