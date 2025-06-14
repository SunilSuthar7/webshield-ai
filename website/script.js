// DOM Content Loaded
document.addEventListener("DOMContentLoaded", () => {
  initializeWebsite()
  setupEventListeners()
  startAnimations()
})

// Initialize website functionality
function initializeWebsite() {
  console.log("WebSHIELD.AI Website initialized")

  // Add fade-in animation to elements
  const observerOptions = {
    threshold: 0.1,
    rootMargin: "0px 0px -50px 0px",
  }

  const observer = new IntersectionObserver((entries) => {
    entries.forEach((entry) => {
      if (entry.isIntersecting) {
        entry.target.classList.add("fade-in-up")
      }
    })
  }, observerOptions)

  // Observe elements for animation
  const animatedElements = document.querySelectorAll(".feature-card, .step, .install-step")
  animatedElements.forEach((el) => observer.observe(el))
}

// Setup event listeners
function setupEventListeners() {
  // Mobile menu toggle
  const mobileMenuBtn = document.getElementById("mobileMenuBtn")
  if (mobileMenuBtn) {
    mobileMenuBtn.addEventListener("click", toggleMobileMenu)
  }

  // Install buttons
  const installBtns = document.querySelectorAll("#installBtn, #ctaInstallBtn, #downloadBtn")
  installBtns.forEach((btn) => {
    btn.addEventListener("click", handleInstallClick)
  })

  // Demo button
  const demoBtn = document.getElementById("demoBtn")
  if (demoBtn) {
    demoBtn.addEventListener("click", handleDemoClick)
  }

  // Smooth scrolling for navigation links
  const navLinks = document.querySelectorAll('.nav-link[href^="#"]')
  navLinks.forEach((link) => {
    link.addEventListener("click", handleSmoothScroll)
  })

  // Navbar scroll effect
  window.addEventListener("scroll", handleNavbarScroll)

  // GitHub link tracking
  const githubLinks = document.querySelectorAll('.github-link, a[href*="github"]')
  githubLinks.forEach((link) => {
    link.addEventListener("click", handleGitHubClick)
  })
}

// Start animations
function startAnimations() {
  // Animate hero stats
  animateCounters()

  // Start hero pattern animation
  startHeroPatternAnimation()

  // Animate browser mockup
  animateBrowserMockup()
}

// Mobile menu toggle
function toggleMobileMenu() {
  const navLinks = document.querySelector(".nav-links")
  const mobileMenuBtn = document.getElementById("mobileMenuBtn")

  navLinks.classList.toggle("mobile-open")
  mobileMenuBtn.classList.toggle("active")

  // Add mobile menu styles if not already added
  if (!document.getElementById("mobile-menu-styles")) {
    const style = document.createElement("style")
    style.id = "mobile-menu-styles"
    style.textContent = `
            .nav-links.mobile-open {
                display: flex;
                position: absolute;
                top: 100%;
                left: 0;
                right: 0;
                background: white;
                flex-direction: column;
                padding: 1rem 2rem;
                box-shadow: var(--shadow-lg);
                border-top: 1px solid var(--border-color);
            }
            
            .mobile-menu-btn.active span:nth-child(1) {
                transform: rotate(45deg) translate(5px, 5px);
            }
            
            .mobile-menu-btn.active span:nth-child(2) {
                opacity: 0;
            }
            
            .mobile-menu-btn.active span:nth-child(3) {
                transform: rotate(-45deg) translate(7px, -6px);
            }
        `
    document.head.appendChild(style)
  }
}

// Handle install button clicks
function handleInstallClick(event) {
  event.preventDefault()

  // Show installation modal or redirect to installation instructions
  showInstallationModal()

  // Track installation attempt
  trackEvent("install_attempt", {
    source: event.target.id || "unknown",
    timestamp: new Date().toISOString(),
  })
}

// Show installation modal
function showInstallationModal() {
  // Create modal if it doesn't exist
  let modal = document.getElementById("installModal")
  if (!modal) {
    modal = createInstallationModal()
    document.body.appendChild(modal)
  }

  modal.style.display = "flex"
  document.body.style.overflow = "hidden"

  // Close modal on outside click
  modal.addEventListener("click", (e) => {
    if (e.target === modal) {
      closeInstallationModal()
    }
  })
}

// Create installation modal
function createInstallationModal() {
  const modal = document.createElement("div")
  modal.id = "installModal"
  modal.innerHTML = `
        <div class="modal-overlay">
            <div class="modal-content">
                <div class="modal-header">
                    <h3>Install WebSHIELD.AI Extension</h3>
                    <button class="modal-close" onclick="closeInstallationModal()">&times;</button>
                </div>
                <div class="modal-body">
                    <div class="install-options">
                        <div class="install-option">
                            <div class="install-icon">📦</div>
                            <h4>Download Extension Files</h4>
                            <p>Download the extension package and install manually</p>
                            <button class="btn btn-primary" onclick="downloadExtension()">
                                <span class="btn-icon">⬇️</span>
                                Download ZIP
                            </button>
                        </div>
                        <div class="install-option">
                            <div class="install-icon">🔗</div>
                            <h4>GitHub Repository</h4>
                            <p>Access the source code and latest releases</p>
                            <button class="btn btn-secondary" onclick="openGitHub()">
                                <span class="btn-icon">🐙</span>
                                Open GitHub
                            </button>
                        </div>
                    </div>
                    <div class="install-steps">
                        <h4>Quick Installation Steps:</h4>
                        <ol>
                            <li>Download the extension files</li>
                            <li>Open Chrome and go to <code>chrome://extensions/</code></li>
                            <li>Enable "Developer mode" in the top right</li>
                            <li>Click "Load unpacked" and select the WebSHIELD.AI folder</li>
                            <li>The extension is now installed and active!</li>
                        </ol>
                    </div>
                </div>
            </div>
        </div>
    `

  // Add modal styles
  const style = document.createElement("style")
  style.textContent = `
        #installModal {
            position: fixed;
            top: 0;
            left: 0;
            right: 0;
            bottom: 0;
            background: rgba(0, 0, 0, 0.8);
            display: none;
            align-items: center;
            justify-content: center;
            z-index: 10000;
            padding: 2rem;
        }
        
        .modal-overlay {
            background: white;
            border-radius: 12px;
            max-width: 600px;
            width: 100%;
            max-height: 80vh;
            overflow-y: auto;
            box-shadow: var(--shadow-xl);
        }
        
        .modal-header {
            display: flex;
            justify-content: space-between;
            align-items: center;
            padding: 1.5rem;
            border-bottom: 1px solid var(--border-color);
        }
        
        .modal-header h3 {
            margin: 0;
            color: var(--text-primary);
        }
        
        .modal-close {
            background: none;
            border: none;
            font-size: 1.5rem;
            cursor: pointer;
            color: var(--text-muted);
            padding: 0.5rem;
            border-radius: 4px;
        }
        
        .modal-close:hover {
            background: var(--bg-secondary);
        }
        
        .modal-body {
            padding: 1.5rem;
        }
        
        .install-options {
            display: grid;
            grid-template-columns: repeat(auto-fit, minmax(150px, 1fr));
            gap: 1rem;
            margin-bottom: 2rem;
        }
        
        .install-option {
            text-align: center;
            padding: 1.5rem;
            border: 1px solid var(--border-color);
            border-radius: 8px;
            transition: all 0.2s ease;
        }
        
        .install-option:hover {
            border-color: var(--primary-color);
            transform: translateY(-2px);
        }
        
        .install-icon {
            font-size: 2rem;
            margin-bottom: 0.5rem;
        }
        
        .install-option h4 {
            margin: 0.5rem 0;
            color: var(--text-primary);
        }
        
        .install-option p {
            color: var(--text-secondary);
            font-size: 0.875rem;
            margin-bottom: 1rem;
        }
        
        .install-steps {
            background: var(--bg-secondary);
            padding: 1.5rem;
            border-radius: 8px;
        }
        
        .install-steps h4 {
            margin-bottom: 1rem;
            color: var(--text-primary);
        }
        
        .install-steps ol {
            margin-left: 1rem;
        }
        
        .install-steps li {
            margin-bottom: 0.5rem;
            color: var(--text-secondary);
        }
        
        .install-steps code {
            background: white;
            padding: 0.25rem 0.5rem;
            border-radius: 4px;
            font-family: monospace;
            color: var(--primary-color);
        }
    `
  document.head.appendChild(style)

  return modal
}

// Close installation modal
function closeInstallationModal() {
  const modal = document.getElementById("installModal")
  if (modal) {
    modal.style.display = "none"
    document.body.style.overflow = "auto"
  }
}

// Download extension
function downloadExtension() {
  // In a real implementation, this would trigger a download
  // For now, we'll show a message and redirect to GitHub
  alert("Download will start shortly. You will be redirected to GitHub for the latest release.")
  window.open("https://github.com/your-username/webshield-ai/releases/latest", "_blank")

  trackEvent("download_extension", {
    timestamp: new Date().toISOString(),
  })
}

// Open installation guide
function openInstallGuide() {
  window.open("https://github.com/your-username/webshield-ai#installation", "_blank")
}

// Open GitHub
function openGitHub() {
  window.open("https://github.com/your-username/webshield-ai", "_blank")
}

// Handle demo button click
function handleDemoClick(event) {
  event.preventDefault()

  // Scroll to how it works section
  const howItWorksSection = document.getElementById("how-it-works")
  if (howItWorksSection) {
    howItWorksSection.scrollIntoView({ behavior: "smooth" })
  }

  // Start demo animation
  setTimeout(() => {
    startDemoAnimation()
  }, 500)

  trackEvent("demo_viewed", {
    timestamp: new Date().toISOString(),
  })
}

// Start demo animation
function startDemoAnimation() {
  const browserMockup = document.querySelector(".browser-mockup")
  if (browserMockup) {
    browserMockup.classList.add("demo-active")

    // Add demo styles if not already added
    if (!document.getElementById("demo-styles")) {
      const style = document.createElement("style")
      style.id = "demo-styles"
      style.textContent = `
                .browser-mockup.demo-active .detection-item {
                    animation: demoDetection 3s ease-in-out;
                }
                
                @keyframes demoDetection {
                    0% { opacity: 0; transform: translateX(-20px); }
                    20% { opacity: 1; transform: translateX(0); }
                    80% { opacity: 1; transform: translateX(0); }
                    100% { opacity: 0.7; transform: translateX(0); }
                }
            `
      document.head.appendChild(style)
    }

    // Remove demo class after animation
    setTimeout(() => {
      browserMockup.classList.remove("demo-active")
    }, 3000)
  }
}

// Handle smooth scrolling
function handleSmoothScroll(event) {
  event.preventDefault()

  const targetId = event.target.getAttribute("href")
  const targetSection = document.querySelector(targetId)

  if (targetSection) {
    const offsetTop = targetSection.offsetTop - 80 // Account for fixed navbar

    window.scrollTo({
      top: offsetTop,
      behavior: "smooth",
    })
  }
}

// Handle navbar scroll effect
function handleNavbarScroll() {
  const navbar = document.querySelector(".navbar")
  const scrollY = window.scrollY

  if (scrollY > 50) {
    navbar.classList.add("scrolled")

    // Add scrolled styles if not already added
    if (!document.getElementById("navbar-scroll-styles")) {
      const style = document.createElement("style")
      style.id = "navbar-scroll-styles"
      style.textContent = `
                .navbar.scrolled {
                    background: rgba(255, 255, 255, 0.98);
                    backdrop-filter: blur(20px);
                    box-shadow: var(--shadow-sm);
                }
            `
      document.head.appendChild(style)
    }
  } else {
    navbar.classList.remove("scrolled")
  }
}

// Handle GitHub link clicks
function handleGitHubClick(event) {
  trackEvent("github_click", {
    source: event.target.textContent || "unknown",
    timestamp: new Date().toISOString(),
  })
}

// Animate counters
function animateCounters() {
  const counters = document.querySelectorAll(".stat-number[data-target]")

  const observerOptions = {
    threshold: 0.5,
  }

  const observer = new IntersectionObserver((entries) => {
    entries.forEach((entry) => {
      if (entry.isIntersecting) {
        animateCounter(entry.target)
        observer.unobserve(entry.target)
      }
    })
  }, observerOptions)

  counters.forEach((counter) => observer.observe(counter))
}

// Animate individual counter
function animateCounter(element) {
  const target = Number.parseInt(element.getAttribute("data-target"))
  const duration = 2000
  const startTime = Date.now()
  const startValue = 0

  function updateCounter() {
    const elapsed = Date.now() - startTime
    const progress = Math.min(elapsed / duration, 1)

    const currentValue = Math.floor(startValue + (target - startValue) * easeOutQuart(progress))

    if (element.textContent.includes("%")) {
      element.textContent = currentValue + "%"
    } else if (target >= 1000) {
      element.textContent = (currentValue / 1000).toFixed(0) + "K+"
    } else {
      element.textContent = currentValue.toLocaleString()
    }

    if (progress < 1) {
      requestAnimationFrame(updateCounter)
    }
  }

  updateCounter()
}

// Easing function
function easeOutQuart(t) {
  return 1 - Math.pow(1 - t, 4)
}

// Start hero pattern animation
function startHeroPatternAnimation() {
  const heroPattern = document.querySelector(".hero-pattern")
  if (heroPattern) {
    // Pattern is already animated via CSS
    // This function can be extended for more complex animations
  }
}

// Animate browser mockup
function animateBrowserMockup() {
  const detectionItems = document.querySelectorAll(".detection-item")

  detectionItems.forEach((item, index) => {
    setTimeout(() => {
      item.style.animation = `slideIn 0.5s ease-out ${index * 0.2}s both`
    }, 1000)
  })
}

// Track events (placeholder for analytics)
function trackEvent(eventName, properties = {}) {
  console.log("Event tracked:", eventName, properties)

  // In a real implementation, you would send this to your analytics service
  // Example: gtag('event', eventName, properties);
  // Example: analytics.track(eventName, properties);
}

// Utility function to check if element is in viewport
function isInViewport(element) {
  const rect = element.getBoundingClientRect()
  return (
    rect.top >= 0 &&
    rect.left >= 0 &&
    rect.bottom <= (window.innerHeight || document.documentElement.clientHeight) &&
    rect.right <= (window.innerWidth || document.documentElement.clientWidth)
  )
}

// Add keyboard navigation support
document.addEventListener("keydown", (event) => {
  // Close modal on Escape key
  if (event.key === "Escape") {
    closeInstallationModal()
  }

  // Navigate with arrow keys (for accessibility)
  if (event.key === "ArrowDown" || event.key === "ArrowUp") {
    const focusableElements = document.querySelectorAll(
      'button, a, input, select, textarea, [tabindex]:not([tabindex="-1"])',
    )
    const currentIndex = Array.from(focusableElements).indexOf(document.activeElement)

    if (event.key === "ArrowDown" && currentIndex < focusableElements.length - 1) {
      focusableElements[currentIndex + 1].focus()
      event.preventDefault()
    } else if (event.key === "ArrowUp" && currentIndex > 0) {
      focusableElements[currentIndex - 1].focus()
      event.preventDefault()
    }
  }
})

// Performance optimization: Lazy load images
function lazyLoadImages() {
  const images = document.querySelectorAll("img[data-src]")

  const imageObserver = new IntersectionObserver((entries, observer) => {
    entries.forEach((entry) => {
      if (entry.isIntersecting) {
        const img = entry.target
        img.src = img.dataset.src
        img.classList.remove("lazy")
        imageObserver.unobserve(img)
      }
    })
  })

  images.forEach((img) => imageObserver.observe(img))
}

// Initialize lazy loading
lazyLoadImages()

// Add error handling for failed resource loads
window.addEventListener("error", (event) => {
  console.error("Resource failed to load:", event.target.src || event.target.href)

  // Track error for debugging
  trackEvent("resource_error", {
    resource: event.target.src || event.target.href,
    timestamp: new Date().toISOString(),
  })
})

// Service worker registration (for future PWA features)
if ("serviceWorker" in navigator) {
  window.addEventListener("load", () => {
    navigator.serviceWorker
      .register("/sw.js")
      .then((registration) => {
        console.log("ServiceWorker registration successful")
      })
      .catch((error) => {
        console.log("ServiceWorker registration failed")
      })
  })
}

// Make functions globally available
window.closeInstallationModal = closeInstallationModal
window.downloadExtension = downloadExtension
window.openInstallGuide = openInstallGuide
window.openGitHub = openGitHub
