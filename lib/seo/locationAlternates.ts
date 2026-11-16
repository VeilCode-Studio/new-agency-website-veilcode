import { LOCATION_MARKETS, getMarketCountryCode } from "@/constants/locations";
import { pageUrl } from "./site";

/**
 * hreflang set shared by the five English location pages and the /locations
 * directory. Every member emits the identical set (including itself), so the
 * annotations are reciprocal. The directory is the x-default: it is the page
 * for visitors whose market is not listed.
 *
 * All current location pages are English regional versions; adapt the language
 * mapping if a page is ever written in another language.
 */
export const locationAlternateLanguages: Record<string, string> = {
  ...Object.fromEntries(
    LOCATION_MARKETS.flatMap((market) => {
      const countryCode = getMarketCountryCode(market);
      return countryCode
        ? [[`en-${countryCode}`, pageUrl(`/locations/${market.slug}`)]]
        : [];
    }),
  ),
  "x-default": pageUrl("/locations"),
};
