import DOMPurify from 'dompurify';

/**
 * Sanitizes an HTML string to prevent XSS (Cross-Site Scripting) attacks.
 * It removes malicious scripts, invalid tags, and dangerous attributes.
 * 
 * @param dirtyHtml The untrusted HTML string (usually from a backend/API).
 * @returns A safe HTML string ready to be injected via dangerouslySetInnerHTML.
 */
export const sanitizeHtml = (dirtyHtml: string | undefined | null): string => {
  if (!dirtyHtml) return '';
  return DOMPurify.sanitize(dirtyHtml, {
    ALLOWED_TAGS: ['b', 'i', 'em', 'strong', 'a', 'p', 'br', 'ul', 'ol', 'li', 'h1', 'h2', 'h3', 'h4', 'h5', 'h6', 'span', 'div', 'img', 'table', 'tbody', 'tr', 'td', 'th', 'thead', 'blockquote', 'hr'],
    ALLOWED_ATTR: ['href', 'src', 'alt', 'class', 'style', 'target', 'rel'],
  });
};
