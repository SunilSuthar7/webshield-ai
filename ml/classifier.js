function detectDarkPatterns(el) {
  // Suspicious patterns with regex, message, feature, severity (1-5), and friendly name
  const suspiciousPatterns = [
    { pattern: /hurry up!?/i, message: "This may create a false urgency.", feature: "Real-time Detection", severity: 3, name: "False Urgency" },
    { pattern: /trap/i, message: "This may confuse or manipulate.", feature: "Smart Blocking", severity: 4, name: "Manipulation Trap" },
    { pattern: /dark pattern/i, message: "General deceptive tactic.", feature: "Smart Blocking", severity: 5, name: "Dark Pattern" },
    { pattern: /urgent!?/i, message: "This may create urgency.", feature: "Real-time Detection", severity: 3, name: "Urgency" },
    { pattern: /click now!?/i, message: "This is a pressure tactic.", feature: "Real-time Detection", severity: 3, name: "Pressure Tactic" },
    { pattern: /this won[’']t last!?/i, message: "A false scarcity tactic.", feature: "Smart Blocking", severity: 4, name: "False Scarcity" },
    { pattern: /exclusive deal/i, message: "Manipulating your perception.", feature: "Smart Blocking", severity: 4, name: "Manipulative Deal" },
    { pattern: /can'?t miss/i, message: "Plays on FOMO.", feature: "Smart Blocking", severity: 3, name: "FOMO" },
    { pattern: /your account will expire/i, message: "Pressuring you.", feature: "Smart Blocking", severity: 4, name: "Account Expiry Pressure" },
    { pattern: /deceptive/i, message: "General deceptive tactic.", feature: "Smart Blocking", severity: 5, name: "Deceptive Tactic" },
    { pattern: /misleading/i, message: "Intentional framing.", feature: "Smart Blocking", severity: 5, name: "Misleading Content" },
    // Cookie consent related
    { pattern: /we use cookies/i, message: "Possible confusing consent.", feature: "Customizable Settings", severity: 2, name: "Cookie Consent" },
    { pattern: /cookie consent/i, message: "Confusing consent.", feature: "Customizable Settings", severity: 2, name: "Cookie Consent" },
    { pattern: /this website uses cookies/i, message: "Possible confusing consent.", feature: "Customizable Settings", severity: 2, name: "Cookie Consent" },
    { pattern: /accept cookies/i, message: "Manipulative consent.", feature: "Customizable Settings", severity: 3, name: "Cookie Consent" },
    { pattern: /allow cookies/i, message: "Manipulative consent.", feature: "Customizable Settings", severity: 3, name: "Cookie Consent" },
    { pattern: /cookie policy/i, message: "Intentional confusion.", feature: "Customizable Settings", severity: 3, name: "Cookie Policy" },
    { pattern: /reject cookies/i, message: "Hard to find or confusing.", feature: "Customizable Settings", severity: 4, name: "Cookie Consent" }
  ];

  // Normalize text content and attributes to lowercase and replace fancy apostrophes with straight
  let combined = el.textContent ? el.textContent.trim().toLowerCase() : "";
  combined = combined.replace(/[’‘]/g, "'");

  ['aria-label', 'alt', 'title'].forEach(attr => {
    if (el.hasAttribute(attr)) {
      let val = el.getAttribute(attr).trim().toLowerCase();
      val = val.replace(/[’‘]/g, "'");
      combined += " " + val;
    }
  });

  const matches = [];

  for (const item of suspiciousPatterns) {
    if (item.pattern.test(combined)) {
      matches.push({
        type: item.name,
        message: item.message,
        feature: item.feature,
        severity: item.severity
      });
    }
  }

  return matches.length > 0 ? matches : false;
}

window.detectDarkPatterns = detectDarkPatterns;


