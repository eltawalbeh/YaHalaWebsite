/**
 * Module-level cache: stores the full service objects keyed by slug.
 * Populated the first time getServices() resolves anywhere in the app.
 * ServiceDetailPage checks this synchronously before making any API call,
 * so services with an external_url are redirected with zero page flash.
 */
export const servicesCache = new Map<string, any>();
