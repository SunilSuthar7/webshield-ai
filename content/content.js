// content/content.js

// Import the classifier function
import { detectDarkPatterns } from '../ml/classifier.js';

(function(){
    console.log("WebShield content script loaded.");

    // Gather all elements from the webpage
    const elements = document.querySelectorAll('*');    

    elements.forEach(el => {
        if (detectDarkPatterns(el)) {
            // Highlight suspected dark patterns
            el.classList.add('dark-pattern-warning'); 
        }
    });

    console.log("Dark pattern detection completed.");
})();

