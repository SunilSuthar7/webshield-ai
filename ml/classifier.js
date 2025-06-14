// Simple Fraud Detection - Maximum 10 threats for demo
class SimpleFraudDetector {
  constructor() {
    // Only the most obvious fraud indicators
    this.fraudKeywords = [
      // Critical payment fraud (only the most obvious)
      "enter your bank password",
      "provide your bank login",
      "confirm your pin number",

      // Fake tech support (only clear scams)
      "your computer has been infected",
      "call microsoft support immediately",
      "virus detected on your computer",

      // Investment scams (only guaranteed money promises)
      "guaranteed returns of",
      "double your bitcoin in",
      "100% guaranteed profit",

      // Government impersonation (only official threats)
      "irs final notice",
      "your social security number has been suspended",
    ]

    // Suspicious input fields that ask for sensitive info
    this.suspiciousInputs = ["bank_password", "bank_login", "ssn", "social_security"]

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

    // Check for suspicious input fields first
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
          }
        }
      }
    }

    // Check for fraud keywords in text
    for (const keyword of this.fraudKeywords) {
      if (text.includes(keyword)) {
        return {
          type: "fraudKeyword",
          confidence: 90,
          description: `Suspicious text detected: "${keyword}"`,
          severity: "high",
          element: element,
        }
      }
    }

    return null
  }

  isTrustedDomain(hostname) {
    return this.trustedDomains.some((domain) => hostname === domain || hostname.endsWith("." + domain))
  }
}

class WebShieldContent {
  constructor() {
    this.isEnabled = true
    this.detectedThreats = []
    this.maxThreats = 10 // Limit to 10 threats max
    this.init()
  }

  async init() {
    const settings = await chrome.storage.sync.get(["enabled"])
    this.isEnabled = settings.enabled !== false

    if (this.isEnabled) {
      this.scanPage()
      this.setupMessageListener()
    }
  }

  scanPage() {
    const elements = document.querySelectorAll("*")
    let threatsFound = 0

    console.group("🛡️ WebSHIELD.AI - Simple Fraud Detection Demo")
    console.log(`🔍 Scanning website: ${window.location.href}`)

    for (const element of elements) {
      // Stop if we've found enough threats
      if (threatsFound >= this.maxThreats) break

      try {
        const threat = new SimpleFraudDetector().analyzeElement(element)
        if (threat) {
          this.detectedThreats.push(threat)
          threatsFound++

          // Log each threat clearly
          console.group(`⚠️ THREAT ${threatsFound}: ${threat.type.toUpperCase()}`)
          console.log(`🎯 Confidence: ${threat.confidence}%`)
          console.log(`📝 Description: ${threat.description}`)
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

    // Simple summary
    console.log(`\n📊 DETECTION SUMMARY:`)
    console.log(`🔍 Website scanned: ${window.location.hostname}`)
    console.log(`⚠️ Threats detected: ${threatsFound}`)

    if (threatsFound === 0) {
      console.log("✅ No threats detected - website appears safe")
    } else {
      console.warn(`🚨 ${threatsFound} potential threat(s) found!`)
      console.log("📋 Check the detailed logs above for more information")
    }

    console.groupEnd()

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
              this.detectedThreats = []
              this.scanPage()
            } else {
              console.log("🛡️ WebSHIELD.AI - Detection disabled")
            }
            sendResponse({ success: true })
            break
          case "rescanPage":
            console.clear()
            this.detectedThreats = []
            this.scanPage()
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
if (document.readyState === "loading") {
  document.addEventListener("DOMContentLoaded", () => {
    new WebShieldContent()
  })
} else {
  new WebShieldContent()
}
