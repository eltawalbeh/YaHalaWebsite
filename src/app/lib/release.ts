export const RELEASE = {
  app: "Ya Hala Travel & Tourism",
  version: "6.0.0-local",
  environment: "production-candidate",
  releasedAt: "2026-09-05T00:00:00.000Z",
};

export function releaseMarker() {
  return `${RELEASE.app} | ${RELEASE.version}`;
}
