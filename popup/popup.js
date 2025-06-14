document.addEventListener("DOMContentLoaded", () => {
  // Initialize popup
  initializePopup()

  // Event listeners
  setupEventListeners()

  // Load data
  loadPopupData()
})

function initializePopup() {
  console.log("WebSHIELD.AI Popup initialized")

  // Animate stats on load
  animateStats()

  // Update time stamps
  updateTimeStamps()
}

function setupEventListeners() {
  // Main toggle
  const mainToggle = document.getElementById("mainToggle")
  mainToggle.addEventListener("change", handleMainToggle)

  // Settings button
  const settingsBtn = document.getElementById("settingsBtn")
  settingsBtn.addEventListener("click", openSettings)

  // Report button
  const reportBtn = document.getElementById("reportBtn")
  reportBtn.addEventListener("click", openReportDialog)

  // Footer links
  const helpLink = document.getElementById("helpLink")
  const aboutLink = document.getElementById("aboutLink")

  helpLink.addEventListener("click", (e) => {
    e.preventDefault()
    openHelpPage()
  })

  aboutLink.addEventListener("click", (e) => {
    e.preventDefault()
    openAboutPage()
  })
}

function handleMainToggle(event) {
  const isEnabled = event.target.checked
  const statusIndicator = document.getElementById("statusIndicator")
  const statusText = document.getElementById("statusText")
  const statusDot = statusIndicator.querySelector(".status-dot")
  const toggleDescription = document.getElementById("toggleDescription")

  if (isEnabled) {
    statusText.textContent = "Active"
    statusDot.classList.remove("inactive")
    statusDot.classList.add("active")
    toggleDescription.textContent = "Real-time dark pattern detection enabled"

    // Send message to background script
    window.chrome.runtime.sendMessage({
      action: "enableProtection",
    })

    showNotification("WebSHIELD.AI protection enabled", "success")
  } else {
    statusText.textContent = "Inactive"
    statusDot.classList.remove("active")
    statusDot.classList.add("inactive")
    toggleDescription.textContent = "Dark pattern detection disabled"

    // Send message to background script
    window.chrome.runtime.sendMessage({
      action: "disableProtection",
    })

    showNotification("WebSHIELD.AI protection disabled", "warning")
  }

  // Save state
  window.chrome.storage.local.set({ webshield_enabled: isEnabled })
}

function loadPopupData() {
  // Load saved state
  window.chrome.storage.local.get(["webshield_enabled", "daily_stats", "recent_activity"], (result) => {
    // Set toggle state
    const mainToggle = document.getElementById("mainToggle")
    mainToggle.checked = result.webshield_enabled !== false // Default to true

    // Update status
    handleMainToggle({ target: { checked: mainToggle.checked } })

    // Load stats
    if (result.daily_stats) {
      updateStats(result.daily_stats)
    }

    // Load recent activity
    if (result.recent_activity) {
      updateRecentActivity(result.recent_activity)
    }
  })

  // Request current tab data
  window.chrome.tabs.query({ active: true, currentWindow: true }, (tabs) => {
    if (tabs[0]) {
      window.chrome.tabs.sendMessage(tabs[0].id, { action: "getPageStats" }, (response) => {
        if (response && response.stats) {
          updateCurrentPageStats(response.stats)
        }
      })
    }
  })
}

function updateStats(stats) {
  const blockedCount = document.getElementById("blockedCount")
  const sitesScanned = document.getElementById("sitesScanned")

  animateNumber(blockedCount, stats.blocked || 12)
  animateNumber(sitesScanned, stats.scanned || 47)
}

function updateRecentActivity(activities) {
  const activityList = document.getElementById("activityList")

  if (activities && activities.length > 0) {
    activityList.innerHTML = ""

    activities.slice(0, 3).forEach((activity) => {
      const activityItem = createActivityItem(activity)
      activityList.appendChild(activityItem)
    })
  }
}

function createActivityItem(activity) {
  const item = document.createElement("div")
  item.className = "activity-item"

  const iconMap = {
    blocked: "🚫",
    warning: "⚠️",
    detected: "🔍",
  }

  item.innerHTML = `
        <div class="activity-icon ${activity.type}">${iconMap[activity.type] || "⚠️"}</div>
        <div class="activity-details">
            <div class="activity-site">${activity.site}</div>
            <div class="activity-type">${activity.description}</div>
        </div>
        <div class="activity-time">${formatTimeAgo(activity.timestamp)}</div>
    `

  return item
}

function animateStats() {
  const statNumbers = document.querySelectorAll(".stat-number")

  statNumbers.forEach((stat) => {
    const finalValue = Number.parseInt(stat.textContent)
    animateNumber(stat, finalValue)
  })
}

function animateNumber(element, targetValue) {
  const duration = 1000
  const startValue = 0
  const startTime = Date.now()

  function updateNumber() {
    const elapsed = Date.now() - startTime
    const progress = Math.min(elapsed / duration, 1)

    const currentValue = Math.floor(startValue + (targetValue - startValue) * easeOutQuart(progress))
    element.textContent = currentValue

    if (progress < 1) {
      window.requestAnimationFrame(updateNumber)
    }
  }

  updateNumber()
}

function easeOutQuart(t) {
  return 1 - Math.pow(1 - t, 4)
}

function updateTimeStamps() {
  const timeElements = document.querySelectorAll(".activity-time")

  timeElements.forEach((element) => {
    // This would normally use real timestamps
    // For demo purposes, keeping static values
  })
}

function formatTimeAgo(timestamp) {
  const now = Date.now()
  const diff = now - timestamp

  const minutes = Math.floor(diff / 60000)
  const hours = Math.floor(diff / 3600000)
  const days = Math.floor(diff / 86400000)

  if (minutes < 1) return "Just now"
  if (minutes < 60) return `${minutes}m ago`
  if (hours < 24) return `${hours}h ago`
  return `${days}d ago`
}

function openSettings() {
  window.chrome.tabs.create({ url: window.chrome.runtime.getURL("options/options.html") })
}

function openReportDialog() {
  // Get current tab URL
  window.chrome.tabs.query({ active: true, currentWindow: true }, (tabs) => {
    const currentUrl = tabs[0].url
    const reportUrl = `https://webshield-ai.com/report?url=${encodeURIComponent(currentUrl)}`
    window.chrome.tabs.create({ url: reportUrl })
  })
}

function openHelpPage() {
  window.chrome.tabs.create({ url: "https://webshield-ai.com/help" })
}

function openAboutPage() {
  window.chrome.tabs.create({ url: "https://webshield-ai.com/about" })
}

function showNotification(message, type = "info") {
  // Create notification element
  const notification = document.createElement("div")
  notification.className = `notification ${type}`
  notification.textContent = message

  // Style the notification
  Object.assign(notification.style, {
    position: "fixed",
    top: "10px",
    right: "10px",
    padding: "10px 15px",
    borderRadius: "6px",
    fontSize: "12px",
    fontWeight: "500",
    zIndex: "1000",
    opacity: "0",
    transform: "translateY(-10px)",
    transition: "all 0.3s ease",
  })

  // Set colors based on type
  if (type === "success") {
    notification.style.background = "#48bb78"
    notification.style.color = "white"
  } else if (type === "warning") {
    notification.style.background = "#ed8936"
    notification.style.color = "white"
  } else {
    notification.style.background = "#667eea"
    notification.style.color = "white"
  }

  document.body.appendChild(notification)

  // Animate in
  setTimeout(() => {
    notification.style.opacity = "1"
    notification.style.transform = "translateY(0)"
  }, 10)

  // Remove after 3 seconds
  setTimeout(() => {
    notification.style.opacity = "0"
    notification.style.transform = "translateY(-10px)"
    setTimeout(() => {
      document.body.removeChild(notification)
    }, 300)
  }, 3000)
}

// Update current page stats
function updateCurrentPageStats(stats) {
  if (stats.darkPatternsFound > 0) {
    // Update activity list with current page detections
    const activityList = document.getElementById("activityList")
    const currentPageActivity = document.createElement("div")
    currentPageActivity.className = "activity-item current-page"
    currentPageActivity.innerHTML = `
            <div class="activity-icon warning">🔍</div>
            <div class="activity-details">
                <div class="activity-site">Current Page</div>
                <div class="activity-type">${stats.darkPatternsFound} dark patterns detected</div>
            </div>
            <div class="activity-time">Now</div>
        `

    activityList.insertBefore(currentPageActivity, activityList.firstChild)
  }
}
