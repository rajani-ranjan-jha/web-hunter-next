// import { Cheerio } from "cheerio";
import * as Cheerio from 'cheerio';
import { OpenRouter } from "./openrouter";



export const GetDataUsingURL = async (url) => {
  // 1. Enhanced URL Validation and Normalization
  if (!url || typeof url !== "string") {
    console.error("Error: Invalid or missing URL provided to GetDataUsingURL.");
    return { title: "", description: "", error: "Invalid or missing URL" };
  }

  // Normalize URL - add protocol if missing
  let normalizedUrl = url.trim();
  if (!/^https?:\/\//i.test(normalizedUrl)) {
    normalizedUrl = `https://${normalizedUrl}`;
  }

  // Validate normalized URL
  try {
    new URL(normalizedUrl);
  } catch (urlError) {
    console.error(`Error: Invalid URL format: ${normalizedUrl}`);
    return { title: "", description: "", error: "Invalid URL format" };
  }

  let controller;
  let timeoutId;

  try {
    // 2. Timeout for Fetch Request
    controller = new AbortController();
    const signal = controller.signal;

    timeoutId = setTimeout(() => {
      controller.abort();
      console.error(`Error: Fetch timed out for URL: ${normalizedUrl}`);
    }, 15000); // Increased to 15 seconds for better reliability

    // 3. Enhanced Fetch with Better Headers
    const res = await fetch(normalizedUrl, {
      signal,
      headers: {
        'User-Agent': 'Mozilla/5.0 (Windows NT 10.0; Win64; x64) AppleWebKit/537.36 (KHTML, like Gecko) Chrome/91.0.4472.124 Safari/537.36',
        'Accept': 'text/html,application/xhtml+xml,application/xml;q=0.9,image/webp,*/*;q=0.8',
        'Accept-Language': 'en-US,en;q=0.5',
        'Accept-Encoding': 'gzip, deflate',
        'Cache-Control': 'no-cache',
        'Pragma': 'no-cache'
      },
      redirect: 'follow',
      timeout: 15000
    });

    clearTimeout(timeoutId);

    // 4. Handle Non-OK HTTP Responses
    if (!res.ok) {
      const errorText = `HTTP Error: ${res.status} ${res.statusText} for URL: ${normalizedUrl}`;
      console.error(errorText);
      return { title: "", description: "", error: errorText };
    }

    // 5. Enhanced Content-Type Check
    const contentType = res.headers.get("content-type") || '';
    if (!contentType.includes("text/html") && !contentType.includes("application/xhtml")) {
      const errorText = `URL does not serve HTML content. Content-Type: ${contentType} for URL: ${normalizedUrl}`;
      console.error(errorText);
      return { title: "", description: "", error: errorText };
    }

    const html = await res.text();

    // 6. Parse HTML with Cheerio
    const $ = Cheerio.load(html);

    // 7. Comprehensive Title Extraction
    const title = extractTitle($);
    
    // 8. Comprehensive Description Extraction
    const description = await extractDescription($);

    // console.log("Extracted Title:", title);
    // console.log("Extracted Description:", description);

    return { 
      title: title || "No Title Found", 
      description: description || "No Description Found",
      url: normalizedUrl
    };

  } catch (error) {
    if (timeoutId) {
      clearTimeout(timeoutId);
    }

    // 9. Enhanced Error Handling
    if (error.name === "AbortError") {
      console.error(`Error: Request aborted for URL: ${normalizedUrl}`);
      return {
        title: "",
        description: "",
        error: "Request timed out or was aborted"
      };
    } else if (error.code === 'ENOTFOUND' || error.code === 'ECONNREFUSED') {
      console.error(`DNS/Connection Error for URL: ${normalizedUrl}`, error.message);
      return {
        title: "",
        description: "",
        error: `Connection error: ${error.message}`
      };
    } else if (error instanceof TypeError) {
      console.error(`Network Error for URL: ${normalizedUrl}`, error.message);
      return {
        title: "",
        description: "",
        error: `Network error: ${error.message}`
      };
    } else {
      console.error(`Unexpected error for URL: ${normalizedUrl}`, error);
      return {
        title: "",
        description: "",
        error: `Unexpected error: ${error.message}`
      };
    }
  } finally {
    if (timeoutId) {
      clearTimeout(timeoutId);
    }
  }
};

// Helper function to extract title with multiple fallbacks
const extractTitle = ($) => {
  // Priority order for title extraction
  const titleSelectors = [
    'meta[property="og:title"]',           // Open Graph
    'meta[name="twitter:title"]',          // Twitter Card
    'meta[property="twitter:title"]',      // Twitter Card (alternative)
    'title',                               // HTML title tag
    'h1',                                  // Main heading
    'meta[name="title"]',                  // Generic title meta
    '.title',                              // Common title class
    '#title'                               // Common title ID
  ];

  // Common separators used to separate page title from site name
  const separators = ['|', '-', ':', '•', '—', '–', '►', '»', '>', '~'];

  for (const selector of titleSelectors) {
    let title = '';
    if (selector === 'title' || selector === 'h1') {
      title = $(selector).first().text();
    } else {
      title = $(selector).attr('content');
    }
    
    if (title && title.trim()) {
      title = title.trim();
      
      // Clean title by removing site name/branding after separators
      for (const separator of separators) {
        if (title.includes(separator)) {
          const parts = title.split(separator);
          // Take the first part (actual title) and clean it
          const cleanTitle = parts[0].trim();
          if (cleanTitle.length > 0) {
            title = cleanTitle;
            break; // Use the first separator found
          }
        }
      }
      
      // Additional cleaning
      title = title
        .replace(/\s+/g, ' ')           // Remove extra whitespace
        .replace(/^[|\-:•—–►»>~]\s*/, '') // Remove leading separators
        .replace(/\s*[|\-:•—–►»>~]$/, '') // Remove trailing separators
        .trim();
      
      if (title.length > 0) {
        return title;
      }
    }
  }
  
  return '';
};

// Helper function to extract description with multiple fallbacks
const extractDescription = async ($) => {
  // Priority order for description extraction
  const descriptionSelectors = [
    'meta[name="description"]',            // Standard meta description
    'meta[property="og:description"]',     // Open Graph
    'meta[name="twitter:description"]',    // Twitter Card
    'meta[property="twitter:description"]', // Twitter Card (alternative)
    'meta[name="summary"]',                // Alternative summary
    '.description',                        // Common description class
    '.summary',                           // Common summary class
    'p'                                   // First paragraph as fallback
  ];

  // Common separators and patterns to clean descriptions
  const separators = ['|', '-', ':', '•', '—', '–', '►', '»', '>', '~'];
  const cleanupPatterns = [
    /^(read more|learn more|click here|visit|see more)/i,
    /^(home|homepage|main page)/i,
    /(copyright|©|\(c\))/i,
    /^(welcome to|about|this is)/i
  ];

  for (const selector of descriptionSelectors) {
    let description = '';
    
    if (selector === 'p') {
      // For paragraphs, get the first substantial one
      $('p').each((i, el) => {
        const text = $(el).text().trim();
        // Skip navigation, menu, and other non-content paragraphs
        const parentClass = $(el).parent().attr('class') || '';
        const isNavigation = /nav|menu|header|footer|sidebar|ad/i.test(parentClass);
        
        if (text.length > 50 && text.length < 500 && !isNavigation) {
          description = text;
          return false; // Break the loop
        }
      });
    } else {
      description = $(selector).attr('content');
    }
    
    if (description && description.trim()) {
      description = description.trim();
      
      // Clean description by removing site name/branding after separators
      for (const separator of separators) {
        if (description.includes(separator)) {
          const parts = description.split(separator);
          // Take the first part (actual description) and clean it
          const cleanDesc = parts[0].trim();
          if (cleanDesc.length > 20) { // Ensure it's substantial
            description = cleanDesc;
            break; // Use the first separator found
          }
        }
      }
      
      // Remove common unwanted patterns
      for (const pattern of cleanupPatterns) {
        description = description.replace(pattern, '').trim();
      }
      
      // Additional cleaning
      description = description
        .replace(/\s+/g, ' ')              // Remove extra whitespace
        .replace(/^[|\-:•—–►»>~]\s*/, '')  // Remove leading separators
        .replace(/\s*[|\-:•—–►»>~]$/, '')  // Remove trailing separators
        .replace(/^[.,:;!?]+/, '')         // Remove leading punctuation
        .replace(/[.,:;!?]+$/, '')         // Remove trailing punctuation
        .trim();
      
      // Ensure description is substantial and not too long
      if (description.length >= 110) {
        description = await OpenRouter(description)
        return description;
      } 
      return description
    }
  }
  
  return '';
};



// Example usage:
// const GetDataUsingURL = require('./metadata-extractor');
// 
// (async () => {
//   const result = await GetDataUsingURL('https://deadshot.io');
//   console.log(result);
// })();