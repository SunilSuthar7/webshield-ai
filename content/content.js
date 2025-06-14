// Enhanced Dark Pattern Detection - Using comprehensive pattern library
class SimpleFraudDetector {
  constructor() {
    // Comprehensive dark pattern detection (from your snippet)
    this.darkPatterns = [
      // Fake Urgency & Scarcity (high priority)
      { pattern: /\bhurry up\b/i, message: "Creates false urgency", important: true },
      { pattern: /\bact now\b/i, message: "Encourages immediate action", important: true },
      { pattern: /\blimited time\b/i, message: "Limited-time offer creating scarcity", important: true },
      { pattern: /\boffer expires\b/i, message: "Fake expiration tactic", important: true },
      { pattern: /\blast chance\b/i, message: "Plays on fear of missing out", important: true },
      { pattern: /\blimited offer\b/i, message: "Creates sense of exclusivity", important: true },
      { pattern: /\bonly \d+ left\b/i, message: "Low stock warning to pressure purchase", important: true },
      { pattern: /\brunning out\b/i, message: "Fake scarcity", important: true },
      { pattern: /\bwhile supplies last\b/i, message: "Creates artificial scarcity", important: true },
      { pattern: /\btime running out\b/i, message: "Pressure tactic", important: true },

      // Sneak into Basket
      { pattern: /\bpre-selected\b/i, message: "Pre-checked option sneaked into basket", important: true },
      { pattern: /\badded automatically\b/i, message: "Automatic add-on", important: true },
      { pattern: /\bincluded by default\b/i, message: "Included without explicit consent", important: true },

      // Confirm Shaming
      { pattern: /\bno thanks\b/i, message: "Guilt-based negative option", important: true },
      { pattern: /\bno, i don't want\b/i, message: "Guilt-based opt-out", important: true },
      { pattern: /\bmiss out\b/i, message: "Fear of missing out", important: true },
      { pattern: /\bgive up\b/i, message: "Confirm shaming tactic", important: true },
      { pattern: /\blose my chance\b/i, message: "FOMO & shame copy", important: true },

      // Forced Continuity
      { pattern: /\bfree trial\b/i, message: "May auto-renew by default", important: true },
      { pattern: /\btrial ends\b/i, message: "Forced subscription after trial", important: true },
      { pattern: /\bauto.?renew\b/i, message: "Automatic renewal can be hidden", important: true },
      { pattern: /\bcancel anytime\b/i, message: "Often harder than promised", important: true },

      // Critical fraud patterns (highest priority)
      {
        pattern: /\benter your bank password\b/i,
        message: "Requesting bank credentials - CRITICAL FRAUD",
        important: true,
      },
      { pattern: /\bprovide your bank login\b/i, message: "Requesting bank login - CRITICAL FRAUD", important: true },
      { pattern: /\bconfirm your pin number\b/i, message: "Requesting PIN - CRITICAL FRAUD", important: true },
      { pattern: /\byour computer has been infected\b/i, message: "Fake tech support scam", important: true },
      { pattern: /\bcall microsoft support immediately\b/i, message: "Fake Microsoft support scam", important: true },
      { pattern: /\bguaranteed returns of\b/i, message: "Investment scam promise", important: true },
      { pattern: /\bdouble your bitcoin\b/i, message: "Cryptocurrency scam", important: true },
      { pattern: /\birs final notice\b/i, message: "Government impersonation scam", important: true },

      // Misdirection (medium priority)
      { pattern: /\bbest value\b/i, message: "Highlights costly plan", important: false },
      { pattern: /\brecommended\b/i, message: "Bias to upsell", important: false },
      { pattern: /\bmost popular\b/i, message: "Biased choice presentation", important: false },
      { pattern: /\bexclusive deal\b/i, message: "Fake exclusivity", important: false },

      // Obstruction tactics
      { pattern: /\bdelete account\b/i, message: "May be intentionally hidden", important: true },
      { pattern: /\bcancel membership\b/i, message: "Cancel flow may be obstructed", important: true },
      { pattern: /\bunsubscribe\b/i, message: "May be hidden in emails or settings", important: true },
    ]

    // Suspicious input fields
    this.suspiciousInputs = [
      "bank_password",
      "bank_login",
      "ssn",
      "social_security",
      "pin",
      "banking",
      "account_password",
    ]

    // Trusted domains - never flag these
    this.trustedDomains = [
      "google.com",
      "amazon.com",
      "paypal.com",
      "microsoft.com",
      "apple.com",
      "facebook.com",
      "youtube.com",
      "netflix.com",
      "walmart.com",
      "target.com",
      "ebay.com",
      "stripe.com",
    ]
  }

  analyzeElement(element) {
    const text = element.textContent?.toLowerCase() || ""
    const currentUrl = window.location.hostname.toLowerCase()

    // Skip trusted domains completely
    if (this.isTrustedDomain(currentUrl)) {
      return null
    }

    // Check for suspicious input fields first (highest priority)
    if (element.tagName === "INPUT") {
      const name = element.name?.toLowerCase() || ""
      const placeholder = element.placeholder?.toLowerCase() || ""

      for (const suspicious of this.suspiciousInputs) {
        if (name.includes(suspicious) || placeholder.includes(suspicious)) {
          return {
            type: "suspiciousInput",
            confidence: 95,
            description: `Input field requesting sensitive information: ${suspicious}`,
            severity: "critical",
            element: element,
            category: "Critical Fraud",
          }
        }
      }
    }

    // Check for dark patterns in text
    for (const pattern of this.darkPatterns) {
      if (pattern.pattern.test(text)) {
        // Prioritize important patterns
        const confidence = pattern.important ? 85 : 65
        const severity = pattern.message.includes("CRITICAL") ? "critical" : pattern.important ? "high" : "medium"

        return {
          type: "darkPattern",
          confidence: confidence,
          description: pattern.message,
          severity: severity,
          element: element,
          category: this.getCategoryFromMessage(pattern.message),
          pattern: pattern.pattern.source,
        }
      }
    }

    return null
  }

  getCategoryFromMessage(message) {
    if (message.includes("CRITICAL FRAUD")) return "Critical Fraud"
    if (message.includes("urgency") || message.includes("scarcity")) return "Fake Urgency"
    if (message.includes("guilt") || message.includes("shame")) return "Confirm Shaming"
    if (message.includes("auto-renew") || message.includes("trial")) return "Forced Continuity"
    if (message.includes("upsell") || message.includes("bias")) return "Misdirection"
    if (message.includes("hidden") || message.includes("obstruct")) return "Obstruction"
    return "Dark Pattern"
  }

  isTrustedDomain(hostname) {
    return this.trustedDomains.some((domain) => hostname === domain || hostname.endsWith("." + domain))
  }
}

class WebShieldContent {
  constructor() {
    this.isEnabled = true
    this.detectedThreats = []
    this.maxThreats = 10 // Limit to 10 threats max for demo
    this.scanningOverlay = null
    this.init()
  }

  async init() {
    const settings = await chrome.storage.sync.get(["enabled"])
    this.isEnabled = settings.enabled !== false

    if (this.isEnabled) {
      this.showScanningOverlay()
      setTimeout(() => {
        this.scanPage()
      }, 1000)
      this.setupMessageListener()
    }
  }

  showScanningOverlay() {
    // Remove existing overlay if any
    if (this.scanningOverlay) {
      this.scanningOverlay.remove()
    }

    // Create full-width scanning overlay
    this.scanningOverlay = document.createElement("div")
    this.scanningOverlay.id = "webshield-scanning-overlay"
    this.scanningOverlay.innerHTML = `
      <div style="
        position: fixed;
        top: 0;
        left: 0;
        right: 0;
        background: linear-gradient(135deg, #667eea 0%, #764ba2 100%);
        color: white;
        padding: 16px 20px;
        font-family: Arial, sans-serif;
        font-size: 16px;
        font-weight: 600;
        z-index: 999999;
        box-shadow: 0 4px 20px rgba(0,0,0,0.3);
        border-bottom: 3px solid rgba(255,255,255,0.3);
        backdrop-filter: blur(10px);
        animation: webshield-scan-pulse 2s infinite;
        text-align: center;
      ">
        <div style="display: flex; align-items: center; justify-content: center; gap: 12px;">
          <div style="font-size: 24px;">🛡️</div>
          <div>
            <div><strong>WebSHIELD.AI</strong> started debugging...</div>
            <div style="font-size: 14px; opacity: 0.9; margin-top: 4px;">
              🔍 Scanning for dark patterns and fraud indicators...
            </div>
          </div>
          <div class="scanning-dots" style="display: flex; gap: 4px;">
            <div style="width: 8px; height: 8px; background: white; border-radius: 50%; animation: webshield-dot-bounce 1.4s infinite ease-in-out both; animation-delay: -0.32s;"></div>
            <div style="width: 8px; height: 8px; background: white; border-radius: 50%; animation: webshield-dot-bounce 1.4s infinite ease-in-out both; animation-delay: -0.16s;"></div>
            <div style="width: 8px; height: 8px; background: white; border-radius: 50%; animation: webshield-dot-bounce 1.4s infinite ease-in-out both;"></div>
          </div>
        </div>
      </div>
    `

    // Add CSS animations
    if (!document.getElementById("webshield-styles")) {
      const style = document.createElement("style")
      style.id = "webshield-styles"
      style.textContent = `
        @keyframes webshield-scan-pulse {
          0%, 100% { opacity: 1; }
          50% { opacity: 0.8; }
        }
        @keyframes webshield-dot-bounce {
          0%, 80%, 100% { transform: scale(0); }
          40% { transform: scale(1); }
        }
        @keyframes webshield-slide-in {
          from { transform: translateX(100%); opacity: 0; }
          to { transform: translateX(0); opacity: 1; }
        }
        @keyframes webshield-fade-out {
          from { opacity: 1; transform: translateY(0); }
          to { opacity: 0; transform: translateY(-100%); }
        }
      `
      document.head.appendChild(style)
    }

    document.body.appendChild(this.scanningOverlay)
  }

  hideScanningOverlay() {
    if (this.scanningOverlay) {
      this.scanningOverlay.style.animation = "webshield-fade-out 0.5s ease-in"
      setTimeout(() => {
        if (this.scanningOverlay) {
          this.scanningOverlay.remove()
          this.scanningOverlay = null
        }
      }, 500)
    }
  }

  showScanComplete(threatsFound) {
    const completeNotification = document.createElement("div")
    completeNotification.innerHTML = `
      <div style="
        position: fixed;
        top: 20px;
        right: 20px;
        background: ${threatsFound > 0 ? "linear-gradient(135deg, #ff6b6b 0%, #ee5a24 100%)" : "linear-gradient(135deg, #00b894 0%, #00a085 100%)"};
        color: white;
        padding: 16px 24px;
        border-radius: 12px;
        font-family: Arial, sans-serif;
        font-size: 16px;
        font-weight: 600;
        z-index: 999999;
        box-shadow: 0 8px 32px rgba(0,0,0,0.3);
        border: 2px solid rgba(255,255,255,0.2);
        backdrop-filter: blur(10px);
        animation: webshield-slide-in 0.5s ease-out;
        min-width: 300px;
      ">
        <div style="display: flex; align-items: center; gap: 12px;">
          <div style="font-size: 28px;">${threatsFound > 0 ? "🚨" : "✅"}</div>
          <div>
            <div><strong>WebSHIELD.AI</strong> scan complete</div>
            <div style="font-size: 14px; opacity: 0.9; margin-top: 4px;">
              ${threatsFound > 0 ? `${threatsFound} dark pattern(s) detected - Check console (F12)` : "No dark patterns found - Website appears clean"}
            </div>
          </div>
        </div>
      </div>
    `

    document.body.appendChild(completeNotification)

    setTimeout(() => {
      completeNotification.style.animation = "webshield-fade-out 0.5s ease-in"
      setTimeout(() => {
        completeNotification.remove()
      }, 500)
    }, 6000)
  }

  scanPage() {
    const elements = document.querySelectorAll("*")
    let threatsFound = 0
    const threatsByCategory = {}

    console.group("🛡️ WebSHIELD.AI - Enhanced Dark Pattern Detection")
    console.log(`🔍 Scanning website: ${window.location.href}`)
    console.log(`⚙️ Debug mode: Active`)
    console.log(`🎯 Max threats to detect: ${this.maxThreats}`)
    console.log(`📋 Pattern library: ${new SimpleFraudDetector().darkPatterns.length} patterns loaded`)

    for (const element of elements) {
      if (threatsFound >= this.maxThreats) {
        console.log(`⏹️ Stopped scanning - reached maximum of ${this.maxThreats} threats`)
        break
      }

      try {
        const threat = new SimpleFraudDetector().analyzeElement(element)
        if (threat) {
          this.detectedThreats.push(threat)
          threatsFound++

          // Group by category
          if (!threatsByCategory[threat.category]) {
            threatsByCategory[threat.category] = 0
          }
          threatsByCategory[threat.category]++

          // Enhanced logging with categories
          console.group(`⚠️ THREAT ${threatsFound}: ${threat.category.toUpperCase()}`)
          console.log(`🎯 Confidence: ${threat.confidence}%`)
          console.log(`📝 Description: ${threat.description}`)
          console.log(`🔍 Severity: ${threat.severity}`)
          console.log(`🔍 Element:`, element)

          if (element.textContent) {
            const preview = element.textContent.substring(0, 100)
            console.log(`📄 Text: "${preview}${preview.length >= 100 ? "..." : ""}"`)
          }

          console.groupEnd()
        }
      } catch (error) {
        // Skip problematic elements
      }
    }

    // Enhanced summary with categories
    console.log(`\n📊 DETECTION SUMMARY:`)
    console.log(`🔍 Website scanned: ${window.location.hostname}`)
    console.log(`⚠️ Total threats detected: ${threatsFound}`)

    if (Object.keys(threatsByCategory).length > 0) {
      console.log(`📋 Threats by category:`)
      Object.entries(threatsByCategory).forEach(([category, count]) => {
        console.log(`   • ${category}: ${count}`)
      })
    }

    console.log(`🛡️ WebSHIELD.AI debugging completed`)

    if (threatsFound === 0) {
      console.log("✅ No dark patterns detected - website appears clean")
    } else {
      console.warn(`🚨 ${threatsFound} potential dark pattern(s) found!`)
      console.log("📋 Check the detailed logs above for more information")
    }

    console.groupEnd()

    this.hideScanningOverlay()
    setTimeout(() => {
      this.showScanComplete(threatsFound)
    }, 600)

    // Update badge
    try {
      chrome.runtime
        .sendMessage({
          action: "updateBadge",
          count: threatsFound,
        })
        .catch(() => {})
    } catch (e) {
      console.warn("Chrome runtime message failed", e)
    }
  }

  setupMessageListener() {
    chrome.runtime.onMessage.addListener((request, sender, sendResponse) => {
      try {
        switch (request.action) {
          case "getDetectedPatterns":
            sendResponse({
              success: true,
              count: this.detectedThreats.length,
              patterns: this.detectedThreats,
            })
            break
          case "toggleEnabled":
            this.isEnabled = request.enabled
            if (this.isEnabled) {
              this.showScanningOverlay()
              this.detectedThreats = []
              setTimeout(() => {
                this.scanPage()
              }, 1000)
            } else {
              console.log("🛡️ WebSHIELD.AI - Detection disabled")
              if (this.scanningOverlay) {
                this.scanningOverlay.remove()
                this.scanningOverlay = null
              }
            }
            sendResponse({ success: true })
            break
          case "rescanPage":
            console.clear()
            this.showScanningOverlay()
            this.detectedThreats = []
            setTimeout(() => {
              this.scanPage()
            }, 1000)
            sendResponse({ success: true })
            break
        }
      } catch (error) {
        console.error("WebSHIELD error:", error)
        sendResponse({ success: false, error: error.message })
      }
      return true
    })
  }
}

// Initialize
if (typeof chrome !== "undefined" && chrome.runtime) {
  if (document.readyState === "loading") {
    document.addEventListener("DOMContentLoaded", () => {
      new WebShieldContent()
    })
  } else {
    new WebShieldContent()
  }
} else {
  console.warn("WebSHIELD.AI: Chrome extension APIs not available")
}
