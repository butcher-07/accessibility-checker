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
    const parsed = new URL(url, baseUrl);
    
    // Remove query parameters and fragments for consistent processing
    // This ensures URLs like:
    // - https://example.com/page?param=1
    // - https://example.com/page#section
    // - https://example.com/page?param=1#section
    // All become: https://example.com/page
    parsed.search = '';
    parsed.hash = '';
    
    // Remove trailing slash for consistency unless it's the root path
    let normalizedUrl = parsed.href;
    if (normalizedUrl.endsWith('/') && parsed.pathname !== '/') {
      normalizedUrl = normalizedUrl.slice(0, -1);
    }
    
    return normalizedUrl;
  } catch (e) {
    return '';
  }
}

// Additional helper function to strip parameters/fragments from already absolute URLs
export function stripUrlParams(url: string): string {
  try {
    const parsed = new URL(url);
    parsed.search = '';
    parsed.hash = '';
    
    // Remove trailing slash for consistency unless it's the root path
    let normalizedUrl = parsed.href;
    if (normalizedUrl.endsWith('/') && parsed.pathname !== '/') {
      normalizedUrl = normalizedUrl.slice(0, -1);
    }
    
    return normalizedUrl;
  } catch (e) {
    return url; // Return original if parsing fails
  }
}

export function isCommunicationLink(url: string): boolean {
  if (!url) return true; // Exclude empty URLs
  
  const lowerUrl = url.toLowerCase();
  
  // Communication protocols to exclude
  const communicationProtocols = [
    'mailto:',
    'tel:',
    'sms:',
    'fax:',
    'skype:',
    'whatsapp:',
    'telegram:',
    'viber:',
    'signal:',
    'facetime:',
    'facetime-audio:',
    'callto:',
    'sip:',
    'xmpp:'
  ];
  
  // Check if URL starts with any communication protocol
  return communicationProtocols.some(protocol => lowerUrl.startsWith(protocol));
}
