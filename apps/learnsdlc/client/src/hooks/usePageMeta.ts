import { useEffect } from "react";

interface PageMeta {
  title: string;
  description: string;
  keywords?: string;
}

/**
 * Sets page-level meta tags for SEO and content categorization.
 * Helps corporate web filters correctly classify pages as educational content.
 */
export function usePageMeta({ title, description, keywords }: PageMeta) {
  useEffect(() => {
    // Set document title
    const fullTitle = `${title} | GRACE Academy - Educational Platform`;
    document.title = fullTitle;

    // Set or create meta description
    let descMeta = document.querySelector('meta[name="description"]');
    if (descMeta) {
      descMeta.setAttribute("content", description);
    } else {
      descMeta = document.createElement("meta");
      descMeta.setAttribute("name", "description");
      descMeta.setAttribute("content", description);
      document.head.appendChild(descMeta);
    }

    // Set or create meta keywords
    if (keywords) {
      let keyMeta = document.querySelector('meta[name="keywords"]');
      if (keyMeta) {
        keyMeta.setAttribute("content", keywords);
      } else {
        keyMeta = document.createElement("meta");
        keyMeta.setAttribute("name", "keywords");
        keyMeta.setAttribute("content", keywords);
        document.head.appendChild(keyMeta);
      }
    }

    // Cleanup: restore defaults on unmount
    return () => {
      document.title = "Ask Marilyn About Software Testing | GRACE Academy - Educational Platform";
      const descMeta = document.querySelector('meta[name="description"]');
      if (descMeta) {
        descMeta.setAttribute(
          "content",
          "GRACE Academy is an accredited educational platform for software development lifecycle (SDLC) training."
        );
      }
    };
  }, [title, description, keywords]);
}
