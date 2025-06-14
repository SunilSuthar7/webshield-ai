class WebShieldBackground {
  constructor() {
    this.init()
  }

  init() {
    chrome.runtime.onMessage.addListener((request, sender, sendResponse) => {
      if (request.action === "updateBadge") {
        this.updateBadge(sender.tab.id, request.count)
      }
    })

    chrome.runtime.onInstalled.addListener(() => {
      chrome.storage.sync.set({ enabled: true })
    })
  }

  updateBadge(tabId, count) {
    if (count > 0) {
      chrome.action.setBadgeText({
        text: count.toString(),
        tabId: tabId,
      })
      chrome.action.setBadgeBackgroundColor({
        color: "#ff6b6b",
        tabId: tabId,
      })
    } else {
      chrome.action.setBadgeText({
        text: "",
        tabId: tabId,
      })
    }
  }
}

new WebShieldBackground()
