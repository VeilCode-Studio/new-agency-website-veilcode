export function getMetaPixelId(enabled: string | undefined, id: string | undefined) {
  return enabled === "true" && id && /^\d+$/.test(id) ? id : null;
}
