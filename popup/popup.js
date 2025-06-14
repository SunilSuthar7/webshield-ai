class WebShieldPopup {
  constructor() {
    this.init()
  }

  async init() {
    await this.loadSettings()
    await this.loadCurrentPageData()
    this.setupEventListeners()
  }

  async loadSettings() {
    const settings = await chrome.storage.sync.get(["enabled"])
    const isEnabled = settings.enabled !== false

    const toggle = document.getElementById("toggleSwitch")
    const statusDot = document.getElementById("statusDot")
    const statusText = document.getElementById("statusText")

    if (isEnabled) {
      toggle.classList.add("active")
      statusDot.classList.remove("disabled")
      statusText.textContent = "Protection Active"
    } else {
      toggle.classList.remove("active")
      statusDot.classList.add("disabled")
      statusText.textContent = "Protection Disabled"
    }
  }

  async loadCurrentPageData() {
    try {
      const [tab] = await chrome.tabs.query({ active: true, currentWindow: true })

      if (!tab.url || tab.url.startsWith("chrome://")) {
        this.updateStats(0)
        return
      }

      const response = await Promise.race([
        chrome.tabs.sendMessage(tab.id, { action: "getDetectedPatterns" }),
        new Promise((_, reject) => setTimeout(() => reject(new Error("Timeout")), 2000)),
      ])

      if (response && response.success) {
        this.updateStats(response.count)
      } else {
        this.updateStats(0)
      }
    } catch (error) {
      this.updateStats(0)
    }
  }

  updateStats(count) {
    document.getElementById("threatCount").textContent = count
  }

  setupEventListeners() {
    // Toggle switch
    document.getElementById("toggleSwitch").addEventListener("click", async () => {
      try {
        const settings = await chrome.storage.sync.get(["enabled"])
        const newEnabled = !settings.enabled

        await chrome.storage.sync.set({ enabled: newEnabled })

        const [tab] = await chrome.tabs.query({ active: true, currentWindow: true })
        if (tab.url && !tab.url.startsWith("chrome://")) {
          try {
            await chrome.tabs.sendMessage(tab.id, {
              action: "toggleEnabled",
              enabled: newEnabled,
            })
          } catch (error) {
            console.log("Content script not available")
          }
        }

        await this.loadSettings()
        setTimeout(() => this.loadCurrentPageData(), 500)
      } catch (error) {
        console.error("Toggle error:", error)
      }
    })

    // Open console button
    document.getElementById("openConsole").addEventListener("click", () => {
      alert("Press F12 to open Developer Tools and see the Console tab for threat details.")
    })

    // Rescan button
    document.getElementById("rescanBtn").addEventListener("click", async () => {
      const [tab] = await chrome.tabs.query({ active: true, currentWindow: true })
      chrome.tabs.sendMessage(tab.id, { action: "rescanPage" })
      setTimeout(() => this.loadCurrentPageData(), 1000)
    })
  }
}

document.addEventListener("DOMContentLoaded", () => {
  new WebShieldPopup()
})
