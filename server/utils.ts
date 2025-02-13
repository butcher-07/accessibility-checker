import { URL } from 'url';

export function getDomain(url: string): string {
  try {
    const parsed = new URL(url);
    return parsed.hostname;
  } catch (e) {
    return '';
  }
}

export function isInternalLink(url: string, domain: string): boolean {
  try {
    const parsed = new URL(url);
    return parsed.hostname === domain || parsed.hostname === '';
  } catch (e) {
    return false;
  }
}

export function normalizeUrl(url: string, baseUrl: string): string {
  try {
    // Handle relative URLs
    return new URL(url, baseUrl).href;
  } catch (e) {
    return '';
  }
}
