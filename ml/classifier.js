// ml/classifier.js

/**
 * Detect dark patterns in a webpage element based on suspicious phrases.
 * This is a heuristic classifier — you can later replace or augment it with ML.
 */

/**
 * Check if the element contains dark patterns
 * @param {Element} el - The webpage element to analyze
 * @returns {boolean} true if dark pattern is suspected
 */
export function detectDarkPatterns(el) {
    // Suspicious phrases or patterns to watch for
    const suspiciousPatterns = [
        "hurry up!", "trap", "dark pattern", "urgent!", "click now!", "this won’t last!", "exclusive deal",
        "can't miss", "your account will expire", "deceptive", "misleading"
    ];

    // Combine element text and attributes
    const text = el.textContent.toLowerCase();
    let combined = text;

    // Include attributes (like aria-label, title) in search
    for (let attr of ['aria-label', 'alt', 'title']) {
        if (el.hasAttribute(attr)) {
            combined += " " + el.getAttribute(attr).toLowerCase();
        }
    }

    return suspiciousPatterns.some((pattern) =>
        combined.includes(pattern)
    );
}

