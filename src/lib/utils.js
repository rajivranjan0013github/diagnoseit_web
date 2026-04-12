import { clsx } from 'clsx'
import { twMerge } from 'tailwind-merge'

export function cn(...inputs) {
  return twMerge(clsx(inputs))
}

// Clean text by removing stray ** markers that aren't properly paired
export const cleanText = (text) => {
  if (!text) return '';
  let cleaned = text.trim();

  // Pre-processing: handle common bad patterns before main logic
  // 1. Remove leading "** " that starts text without closing
  cleaned = cleaned.replace(/^\*\*\s+/g, '');

  // 2. Handle "**Word" at end without proper opening (e.g., "text **Salivation.")
  cleaned = cleaned.replace(/\s\*\*([A-Za-z][^*\s]*)([.,]?)$/g, ' $1$2');

  // 3. Handle "** **Text" pattern (double stray **)
  cleaned = cleaned.replace(/^\*\*\s*\*\*/g, '');
  cleaned = cleaned.replace(/\*\*\s*\*\*/g, '');

  // Remove all standalone ** markers (not part of valid **bold** pairs)
  // Temporarily replace valid **text** pairs
  const validPairs = [];
  cleaned = cleaned.replace(/\*\*([^*]+)\*\*/g, (_, content) => {
    validPairs.push(content);
    return `__BOLD_${validPairs.length - 1}__`;
  });

  // Now remove any remaining stray ** markers
  cleaned = cleaned.replace(/\*\*/g, '');

  // Restore valid bold pairs
  cleaned = cleaned.replace(/__BOLD_(\d+)__/g, (_, idx) => `**${validPairs[parseInt(idx)]}**`);

  return cleaned;
};
