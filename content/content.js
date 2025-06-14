(function() {
  console.log("WebShield content script loaded.");

  // 1) Dark pattern detection function attached globally
  function detectDarkPatterns(el) {
    const suspiciousPatterns = [
      { pattern: "hurry up!", message: "This may create a false urgency.", feature: "Real-time Detection", important: true },
      { pattern: "trap", message: "This may confuse or manipulate.", feature: "Smart Blocking", important: true },
      { pattern: "dark pattern", message: "General deceptive tactic.", feature: "Smart Blocking", important: true },
      { pattern: "urgent!", message: "This may create urgency.", feature: "Real-time Detection", important: true },
      { pattern: "click now!", message: "This is a pressure tactic.", feature: "Real-time Detection", important: true },
      { pattern: "this won’t last!", message: "A false scarcity tactic.", feature: "Smart Blocking", important: false },
      { pattern: "exclusive deal", message: "Manipulating your perception.", feature: "Smart Blocking", important: false },
      { pattern: "can't miss", message: "Plays on FOMO.", feature: "Smart Blocking", important: false },
      { pattern: "your account will expire", message: "Pressuring you.", feature: "Smart Blocking", important: true },
      { pattern: "deceptive", message: "General deceptive tactic.", feature: "Smart Blocking", important: true },
      { pattern: "misleading", message: "Intentional framing.", feature: "Smart Blocking", important: true },
      // Cookie consent related - less important
      { pattern: "we use cookies", message: "Possible confusing consent.", feature: "Customizable Settings", important: false },
      { pattern: "cookie consent", message: "Confusing consent.", feature: "Customizable Settings", important: false },
      { pattern: "this website uses cookies", message: "Possible confusing consent.", feature: "Customizable Settings", important: false },
      { pattern: "accept cookies", message: "Manipulative consent.", feature: "Customizable Settings", important: false },
      { pattern: "allow cookies", message: "Manipulative consent.", feature: "Customizable Settings", important: false },
      { pattern: "cookie policy", message: "Intentional confusion.", feature: "Customizable Settings", important: false },
      { pattern: "reject cookies", message: "Hard to find or confusing.", feature: "Customizable Settings", important: false }
    ];

    if (!el || !el.textContent) return false;

    const text = el.textContent.toLowerCase();
    let combined = text;

    for (let attr of ['aria-label', 'alt', 'title']) {
      if (el.hasAttribute(attr)) {
        combined += " " + el.getAttribute(attr).toLowerCase();
      }
    }

    for (let item of suspiciousPatterns) {
      if (combined.includes(item.pattern.toLowerCase())) {
        return {
          type: item.pattern,
          message: item.message,
          feature: item.feature,
          important: item.important
        };
      }
    }

    return false;
  }

  window.detectDarkPatterns = detectDarkPatterns;

  // 2) Settings
  const containerSelector = 'body'; // Change this to limit scope, e.g. '#main-content' or '.product-area'
  const onlyShowImportant = true;   // Show popup only for important dark patterns
  let popupShown = false;            // To show popup once

  // 3) Detect dark patterns inside container
  const container = document.querySelector(containerSelector);
  if (!container) {
    console.warn("Container for dark pattern detection not found:", containerSelector);
    return;
  }

  const detectedElements = [];

  container.querySelectorAll('*').forEach(el => {
    const detection = detectDarkPatterns(el);
    if (detection) {
      if (onlyShowImportant && !detection.important) return; // Skip less important
      detectedElements.push({ element: el, info: detection });
    }
  });

  if (detectedElements.length === 0) {
    console.log("No important dark patterns detected in container.");
    return;
  }

  // 4) Add tooltip on hover for each detected element
  detectedElements.forEach(({ element, info }) => {
    let tooltip;
    element.addEventListener('mouseenter', (e) => {
      tooltip = document.createElement('div');
      tooltip.textContent = `${info.type}: ${info.message}`;
      Object.assign(tooltip.style, {
        position: 'absolute',
        backgroundColor: '#8B4513',
        color: '#fff',
        padding: '6px 10px',
        borderRadius: '6px',
        fontSize: '13px',
        fontWeight: '600',
        maxWidth: '250px',
        zIndex: 9999999,
        pointerEvents: 'none',
        boxShadow: '0 2px 8px rgba(0,0,0,0.3)',
        fontFamily: 'Segoe UI, Tahoma, Geneva, Verdana, sans-serif',
      });
      document.body.appendChild(tooltip);

      function positionTooltip(event) {
        const padding = 12;
        let top = event.pageY + padding;
        let left = event.pageX + padding;

        if (left + tooltip.offsetWidth > window.pageXOffset + window.innerWidth) {
          left = event.pageX - tooltip.offsetWidth - padding;
        }
        if (top + tooltip.offsetHeight > window.pageYOffset + window.innerHeight) {
          top = event.pageY - tooltip.offsetHeight - padding;
        }

        tooltip.style.top = `${top}px`;
        tooltip.style.left = `${left}px`;
      }

      positionTooltip(e);
      element.addEventListener('mousemove', positionTooltip);

      element.addEventListener('mouseleave', () => {
        if (tooltip) {
          tooltip.remove();
          tooltip = null;
        }
      }, { once: true });
    });
  });

  // 5) Show popup once per page load
  if (popupShown) return;
  popupShown = true;

  // 6) Create the warning popup (fixed bottom right)
  const popup = document.createElement('div');
  Object.assign(popup.style, {
    position: 'fixed',
    bottom: '20px',
    right: '20px',
    backgroundColor: '#8B4513',
    color: 'white',
    padding: '14px 20px',
    borderRadius: '12px',
    boxShadow: '0 0 15px rgb(139, 69, 19)',
    fontWeight: 'bold',
    fontFamily: 'Segoe UI, Tahoma, Geneva, Verdana, sans-serif',
    cursor: 'pointer',
    zIndex: 99999999,
    maxWidth: '320px',
  });

  const first = detectedElements[0];
  popup.textContent = `⚠️ Warning: Detected dark pattern "${first.info.type}". Click for details.`;

  // On popup click - show details modal
  popup.addEventListener('click', () => {
    // Create overlay
    const overlay = document.createElement('div');
    Object.assign(overlay.style, {
      position: 'fixed',
      top: 0, left: 0, right: 0, bottom: 0,
      backgroundColor: 'rgba(0,0,0,0.6)',
      display: 'flex',
      justifyContent: 'center',
      alignItems: 'center',
      zIndex: 999999999,
    });

    // Modal content box
    const modal = document.createElement('div');
    Object.assign(modal.style, {
      backgroundColor: 'white',
      borderRadius: '12px',
      padding: '20px 30px',
      width: '400px',
      maxHeight: '70vh',
      overflowY: 'auto',
      boxShadow: '0 5px 15px rgba(0,0,0,0.3)',
      fontFamily: 'Segoe UI, Tahoma, Geneva, Verdana, sans-serif',
      position: 'relative',
    });

    // Title
    const title = document.createElement('h2');
    title.textContent = 'Detected Dark Patterns';
    Object.assign(title.style, {
      color: '#8B4513',
      marginTop: '0',
      marginBottom: '16px',
    });
    modal.appendChild(title);

    // List all detections
    const list = document.createElement('ul');
    list.style.paddingLeft = '20px';
    detectedElements.forEach(({ info }, idx) => {
      const li = document.createElement('li');
      li.style.marginBottom = '12px';
      li.innerHTML = `<strong>${idx + 1}. ${info.type}</strong>: ${info.message}`;
      list.appendChild(li);
    });
    modal.appendChild(list);

    // Block / Allow buttons container
    const btnContainer = document.createElement('div');
    Object.assign(btnContainer.style, {
      marginTop: '20px',
      display: 'flex',
      justifyContent: 'flex-end',
      gap: '12px',
    });

    // Close button
    const closeBtn = document.createElement('button');
    closeBtn.textContent = 'Close';
    Object.assign(closeBtn.style, {
      backgroundColor: '#8B4513',
      color: 'white',
      border: 'none',
      padding: '8px 16px',
      borderRadius: '6px',
      cursor: 'pointer',
    });
    closeBtn.onclick = () => {
      document.body.removeChild(overlay);
    };
    btnContainer.appendChild(closeBtn);

    // Block first detected element button
    const blockBtn = document.createElement('button');
    blockBtn.textContent = 'Block This Element';
    Object.assign(blockBtn.style, {
      backgroundColor: '#B22222',
      color: 'white',
      border: 'none',
      padding: '8px 16px',
      borderRadius: '6px',
      cursor: 'pointer',
    });
    blockBtn.onclick = () => {
      try {
        first.element.style.pointerEvents = 'none';
        first.element.style.opacity = '0.4';
        alert('The element has been blocked.');
      } catch (e) {
        alert('Failed to block element.');
      }
      document.body.removeChild(overlay);
    };
    btnContainer.appendChild(blockBtn);

    modal.appendChild(btnContainer);

    overlay.appendChild(modal);
    document.body.appendChild(overlay);
  });

  document.body.appendChild(popup);

  console.log(`WebShield detected ${detectedElements.length} important dark pattern(s). Popup shown once.`);
})();
