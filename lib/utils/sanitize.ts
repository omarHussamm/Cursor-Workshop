/**
 * Content sanitization utilities
 * Prevents XSS attacks by removing HTML tags and script content
 */

/**
 * Sanitizes user-generated content to prevent XSS attacks
 * Removes HTML tags and script content
 */
export function sanitizeContent(content: string): string {
  if (!content) return "";
  
  return content
    .replace(/<script[^>]*>.*?<\/script>/gi, "") // Remove script tags and content
    .replace(/<[^>]+>/g, "") // Remove all HTML tags
    .trim();
}
