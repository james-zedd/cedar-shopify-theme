import sanitizeHtml from "sanitize-html";

const PRODUCT_DESCRIPTION_OPTIONS: sanitizeHtml.IOptions = {
  allowedTags: ["p", "br", "strong", "em", "b", "i", "u", "ul", "ol", "li", "h2", "h3", "h4", "blockquote", "a"],
  allowedAttributes: { a: ["href", "target", "rel"] },
  allowedSchemes: ["http", "https"],
  transformTags: {
    a: sanitizeHtml.simpleTransform("a", { rel: "noopener noreferrer" }),
  },
};

export function sanitizeProductHtml(html: string): string {
  return sanitizeHtml(html, PRODUCT_DESCRIPTION_OPTIONS);
}