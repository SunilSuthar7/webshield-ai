document.addEventListener('DOMContentLoaded', function() {
    // DOM Elements
    const statusIndicator = document.getElementById('statusIndicator');
    const statusText = document.getElementById('statusText');
    const patternsDetected = document.getElementById('patternsDetected');
    const pagesProtected = document.getElementById('pagesProtected');
    const detectionsList = document.getElementById('detectionsItems');
    const toggleProtection = document.getElementById('toggleProtection');
    const viewDetails = document.getElementById('viewDetails');
    const openSettings = document.getElementById('openSettings');

    // State variables
    let isProtectionEnabled = true;
    let currentPageDetections = 0;
    let totalPagesProtected = 0;

    // Initialize the popup
    initPopup();

    // Event Listeners
    toggleProtection.addEventListener('click', toggleProtectionHandler);
    viewDetails.addEventListener('click', viewDetailsHandler);
    openSettings.addEventListener('click', openSettingsHandler);

    // Functions
    function initPopup() {
        // Get current protection status from storage
        chrome.storage.local.get(['isProtectionEnabled', 'totalPagesProtected'], function(result) {
            isProtectionEnabled = result.isProtectionEnabled !== false; // Default to true
            totalPagesProtected = result.totalPagesProtected || 0;
            
            updateProtectionStatus();
            updateStatsDisplay();
        });

        // Get detections for current tab
        chrome.tabs.query({active: true, currentWindow: true}, function(tabs) {
            if (tabs[0]) {
                const tabId = tabs[0].id;
                
                // Request detections from background script
                chrome.runtime.sendMessage(
                    {action: "getDetections", tabId: tabId},
                    function(response) {
                        if (response && response.detections) {
                            currentPageDetections = response.detections.length;
                            updateDetectionsList(response.detections);
                            updateStatsDisplay();
                        }
                    }
                );
            }
        });
    }

    function updateProtectionStatus() {
        if (isProtectionEnabled) {
            statusIndicator.className = 'status-indicator active';
            statusText.textContent = 'Protection is active';
            toggleProtection.textContent = 'Disable Protection';
        } else {
            statusIndicator.className = 'status-indicator';
            statusText.textContent = 'Protection is disabled';
            toggleProtection.textContent = 'Enable Protection';
        }
    }

    function updateStatsDisplay() {
        patternsDetected.textContent = currentPageDetections;
        pagesProtected.textContent = totalPagesProtected;
    }

    function updateDetectionsList(detections) {
        if (detections.length === 0) {
            detectionsList.innerHTML = '<li class="empty-state">No dark patterns detected yet</li>';
            return;
        }

        detectionsList.innerHTML = '';
        
        // Group detections by type
        const groupedDetections = detections.reduce((acc, detection) => {
            if (!acc[detection.type]) {
                acc[detection.type] = [];
            }
            acc[detection.type].push(detection);
            return acc;
        }, {});

        // Add to list
        for (const [type, items] of Object.entries(groupedDetections)) {
            const li = document.createElement('li');
            
            let iconClass = 'detection-icon';
            let typeDisplay = type;
            
            switch(type) {
                case 'misleading':
                    iconClass += ' misleading';
                    typeDisplay = 'Misleading Action';
                    break;
                case 'urgent':
                    iconClass += ' urgent';
                    typeDisplay = 'Fake Urgency';
                    break;
                case 'trick':
                    iconClass += ' trick';
                    typeDisplay = 'Trick Question';
                    break;
                default:
                    iconClass += ' misleading';
            }
            
            li.innerHTML = `
                <span class="${iconClass}"></span>
                <span>${typeDisplay} (${items.length})</span>
            `;
            
            detectionsList.appendChild(li);
        }
    }

    function toggleProtectionHandler() {
        isProtectionEnabled = !isProtectionEnabled;
        
        // Save to storage
        chrome.storage.local.set({isProtectionEnabled: isProtectionEnabled});
        
        // Send message to content script
        chrome.tabs.query({active: true, currentWindow: true}, function(tabs) {
            if (tabs[0]) {
                chrome.tabs.sendMessage(tabs[0].id, {
                    action: "toggleProtection",
                    isEnabled: isProtectionEnabled
                });
            }
        });
        
        updateProtectionStatus();
    }

    function viewDetailsHandler() {
        // Open a new tab with detailed report
        chrome.tabs.create({url: chrome.runtime.getURL('details.html')});
    }

    function openSettingsHandler() {
        // Open extension options page
        chrome.runtime.openOptionsPage();
    }
});