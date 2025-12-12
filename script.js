// Global data variable
let siteData = null;

// Load data from localStorage first, then data.json
async function loadData() {
    // Try to load from localStorage first (for admin changes)
    if (!siteData) {
        const localData = localStorage.getItem('paintyardData');
        if (localData) {
            try {
                siteData = JSON.parse(localData);
                return siteData;
            } catch (e) {
                console.error('Error parsing localStorage data:', e);
            }
        }
        
        // If no localStorage data, load from data.json
        try {
            const response = await fetch('data.json');
            siteData = await response.json();
        } catch (error) {
            console.error('Error loading data.json:', error);
            // Fallback to empty data if file doesn't exist
            siteData = {
                logo: '',
                address: '',
                phones: [],
                aboutText: '',
                products: [],
                articles: [],
                colors: { headerBg: '#667eea', mainBg: 'transparent' }
            };
        }
    }
    return siteData;
}

// Render page content
async function renderPage() {
    const data = await loadData();

    // Apply colors to footer and main content only
    document.getElementById('footer').style.backgroundColor = data.colors.headerBg;
    document.getElementById('main-content').style.backgroundColor = data.colors.mainBg;

    // Apply text colors
    if (data.textColors) {
        applyTextColors(data.textColors);
    }
    
    // Apply menu underline color
    if (data.menuUnderlineColor) {
        applyMenuUnderlineColor(data.menuUnderlineColor);
    }
    
    // Apply footer size
    if (data.headerSizes && data.headerSizes.footerHeight) {
        applyFooterSize(data.headerSizes.footerHeight);
    }

    // Apply logo size
    if (data.logoSize) {
        const footerLogo = document.getElementById('footer-logo');
        if (footerLogo) {
            footerLogo.style.width = data.logoSize.width;
            footerLogo.style.height = data.logoSize.height;
        }
        
        // Apply to header logo as well
        const headerLogo = document.getElementById('header-logo');
        if (headerLogo) {
            headerLogo.style.width = data.logoSize.width;
            headerLogo.style.height = data.logoSize.height;
        }
    }

    // Render logo in header and footer
    if (data.logo) {
        const headerLogo = document.getElementById('header-logo');
        if (headerLogo) {
            headerLogo.src = data.logo;
            headerLogo.style.display = 'block';
            const headerLogoText = document.getElementById('header-logo-text');
            if (headerLogoText) {
                headerLogoText.style.display = 'none';
            }
        }
        
        const footerLogo = document.getElementById('footer-logo');
        if (footerLogo) {
            footerLogo.src = data.logo;
            footerLogo.style.display = 'block';
            document.getElementById('footer-logo-text').style.display = 'none';
        }
    } else {
        // Show text logo when no logo image is set
        const headerLogo = document.getElementById('header-logo');
        if (headerLogo) {
            headerLogo.style.display = 'none';
        }
        const headerLogoText = document.getElementById('header-logo-text');
        if (headerLogoText) {
            headerLogoText.style.display = 'inline';
        }
    }
    
    // Apply section backgrounds
    if (data.sectionBackgrounds) {
        applySectionBackgrounds(data.sectionBackgrounds);
    }
    
    // Apply section heights
    if (data.sectionHeights) {
        applySectionHeights(data.sectionHeights);
    }
    
    // Apply section headings
    if (data.sectionHeadings) {
        const aboutHeading = document.getElementById('about-heading');
        if (aboutHeading && data.sectionHeadings.about) {
            aboutHeading.textContent = data.sectionHeadings.about;
        }
        
        const brandsHeading = document.getElementById('brands-heading');
        if (brandsHeading && data.sectionHeadings.brands) {
            brandsHeading.textContent = data.sectionHeadings.brands;
        }
        
        const articlesHeading = document.getElementById('articles-heading');
        if (articlesHeading && data.sectionHeadings.articles) {
            articlesHeading.textContent = data.sectionHeadings.articles;
        }
    }
    
    // Apply button colors
    if (data.buttonColors) {
        const callButton = document.getElementById('call-button');
        if (callButton && data.buttonColors.call) {
            callButton.style.backgroundColor = data.buttonColors.call.background;
            callButton.style.color = data.buttonColors.call.text;
        }
        
        const routeButton = document.getElementById('route-button');
        if (routeButton && data.buttonColors.route) {
            routeButton.style.backgroundColor = data.buttonColors.route.background;
            routeButton.style.color = data.buttonColors.route.text;
        }
    }
    
    // Apply map settings
    if (data.mapSettings) {
        const mapImage = document.getElementById('map-image');
        const mapContainer = document.querySelector('.map-container-new');
        
        if (mapImage && data.mapSettings.image) {
            mapImage.src = data.mapSettings.image;
        }
        
        // Apply dimensions to both container and image
        if (mapContainer) {
            if (data.mapSettings.width) {
                mapContainer.style.maxWidth = data.mapSettings.width;
            }
            // Container height will be determined by image aspect ratio
        }
        
        if (mapImage) {
            if (data.mapSettings.width) {
                mapImage.style.width = data.mapSettings.width;
            }
            if (data.mapSettings.height) {
                mapImage.style.height = data.mapSettings.height;
            }
        }
        
        const mapLink = document.getElementById('map-link');
        if (mapLink && data.mapSettings.link) {
            mapLink.href = data.mapSettings.link;
        }
    }

    // Render phones in footer only
    const phonesHTML = data.phones.map(phone => 
        `<a href="tel:${phone.replace(/\D/g, '')}">${phone}</a>`
    ).join('');
    const footerPhones = document.getElementById('footer-phones');
    if (footerPhones) {
        footerPhones.innerHTML = phonesHTML;
    }

    // Render address in footer only
    const footerAddress = document.getElementById('footer-address');
    if (footerAddress) {
        footerAddress.textContent = data.address;
    }
    
    // Apply footer settings (colors and font sizes)
    if (data.footerSettings) {
        applyFooterSettings(data.footerSettings);
    }
    
    // Apply contact colors AFTER rendering (fix for phone colors) - legacy support
    if (data.contactColors) {
        applyContactColors(data.contactColors);
    }
    
    // Apply content opacity settings
    if (data.contentOpacity) {
        applyContentOpacity(data.contentOpacity);
    }
    
    // Apply content blur settings
    if (data.contentBlur) {
        applyContentBlur(data.contentBlur);
    }

    // Render about
    document.getElementById('about-content').innerHTML = `<p>${data.aboutText}</p>`;

    // Render brands (without price)
    const brands = data.brands || data.products || []; // Support both old and new format
    const brandsHTML = brands.map(brand => `
        <div class="brand-card" onclick="openBrandModal(${brand.id})">
            <img src="${brand.image}" alt="${brand.name}">
            <h3>${brand.name}</h3>
            <p>${brand.description}</p>
            <div class="read-more">Читати більше</div>
        </div>
    `).join('');
    document.getElementById('brands-container').innerHTML = brandsHTML;

    // Render articles in reverse order (newest first)
    const reversedArticles = [...data.articles].reverse();
    const articlesHTML = reversedArticles.map(article => `
        <div class="article-card" onclick="openArticleModal(${article.id})">
            <img src="${article.image}" alt="${article.name}">
            <h3>${article.name}</h3>
            <p class="excerpt">${article.excerpt}</p>
            <div class="read-more">Читати більше</div>
        </div>
    `).join('');
    document.getElementById('articles-container').innerHTML = articlesHTML;
    
    // Setup auto-scroll for brands and articles
    setTimeout(() => {
        setupAutoScroll('brands-container', 0.3);
        setupAutoScroll('articles-container', 0.3);
        setupEdgeHoverRotation('brands-container');
        setupEdgeHoverRotation('articles-container');
        setupScrollButtonHover();
    }, 100);
}

// Auto-scroll functionality for containers with overflow
function setupAutoScroll(containerId, speed = 0.5) {
    const container = document.getElementById(containerId);
    if (!container) return;
    
    let scrollInterval = null;
    let isPaused = false;
    
    // Check if container has overflow
    function hasOverflow() {
        return container.scrollWidth > container.clientWidth;
    }
    
    // Auto-scroll function
    function autoScroll() {
        if (!hasOverflow() || isPaused) return;
        
        // Scroll right slowly
        container.scrollLeft += speed;
        
        // Reset to start when reaching the end (with 1px threshold to handle rounding)
        const scrollThreshold = 1;
        if (container.scrollLeft >= container.scrollWidth - container.clientWidth - scrollThreshold) {
            setTimeout(() => {
                container.scrollLeft = 0;
            }, 2000); // Pause at end for 2 seconds
        }
    }
    
    // Pause on hover
    container.addEventListener('mouseenter', () => {
        isPaused = true;
    });
    
    container.addEventListener('mouseleave', () => {
        isPaused = false;
    });
    
    // Start auto-scroll only if there's overflow
    if (hasOverflow()) {
        scrollInterval = setInterval(autoScroll, 30);
    }
    
    // Re-check on window resize
    window.addEventListener('resize', () => {
        if (scrollInterval) {
            clearInterval(scrollInterval);
        }
        if (hasOverflow()) {
            scrollInterval = setInterval(autoScroll, 30);
        }
    });
}

// Edge hover rotation for articles and brands
function setupEdgeHoverRotation(containerId) {
    const container = document.getElementById(containerId);
    if (!container) return;
    
    let rafId = null;
    
    container.addEventListener('mousemove', (e) => {
        // Cancel previous animation frame to throttle updates
        if (rafId) {
            cancelAnimationFrame(rafId);
        }
        
        rafId = requestAnimationFrame(() => {
            const containerRect = container.getBoundingClientRect();
            const mouseX = e.clientX - containerRect.left;
            const containerWidth = containerRect.width;
            const edgeThreshold = 100; // pixels from edge to trigger rotation
            
            // Get all cards in the container
            const cards = container.querySelectorAll('.brand-card, .product-card, .article-card');
            
            cards.forEach((card) => {
                const cardRect = card.getBoundingClientRect();
                const cardCenter = cardRect.left + cardRect.width / 2 - containerRect.left;
                
                // Check if mouse is near left edge and card is on the left side
                if (mouseX < edgeThreshold && cardCenter < containerWidth / 2) {
                    const distanceFromEdge = Math.abs(mouseX - cardCenter);
                    if (distanceFromEdge < edgeThreshold) {
                        card.style.transform = 'translateY(-10px) rotate(5deg)';
                    }
                }
                // Check if mouse is near right edge and card is on the right side
                else if (mouseX > containerWidth - edgeThreshold && cardCenter > containerWidth / 2) {
                    const distanceFromEdge = Math.abs(mouseX - cardCenter);
                    if (distanceFromEdge < edgeThreshold) {
                        card.style.transform = 'translateY(-10px) rotate(-5deg)';
                    }
                }
                else {
                    // Reset to default hover state
                    if (card.matches(':hover')) {
                        card.style.transform = 'translateY(-10px)';
                    } else {
                        card.style.transform = '';
                    }
                }
            });
            
            rafId = null;
        });
    });
    
    container.addEventListener('mouseleave', () => {
        if (rafId) {
            cancelAnimationFrame(rafId);
            rafId = null;
        }
        const cards = container.querySelectorAll('.brand-card, .product-card, .article-card');
        cards.forEach((card) => {
            card.style.transform = '';
        });
    });
}

// Scroll functions (legacy - kept for backwards compatibility, but now using hover)
function scrollBrands(direction) {
    const container = document.getElementById('brands-container');
    const scrollAmount = 290;
    if (direction === 'left') {
        container.scrollLeft -= scrollAmount;
    } else {
        container.scrollLeft += scrollAmount;
    }
}

function scrollArticles(direction) {
    const container = document.getElementById('articles-container');
    const scrollAmount = 290;
    if (direction === 'left') {
        container.scrollLeft -= scrollAmount;
    } else {
        container.scrollLeft += scrollAmount;
    }
}

// Setup hover-based scroll acceleration for navigation buttons
function setupScrollButtonHover() {
    // Get all scroll buttons
    const scrollButtons = document.querySelectorAll('.scroll-btn');
    
    scrollButtons.forEach(button => {
        let hoverScrollInterval = null;
        let rafId = null;
        const fastScrollSpeed = 5; // Faster speed on hover
        
        button.addEventListener('mouseenter', () => {
            // Clear any existing interval/animation to prevent memory leaks
            if (hoverScrollInterval) {
                clearInterval(hoverScrollInterval);
                hoverScrollInterval = null;
            }
            if (rafId) {
                cancelAnimationFrame(rafId);
                rafId = null;
            }
            
            // Determine which container and direction
            const section = button.closest('section');
            let container = null;
            let direction = 1; // 1 for right, -1 for left
            
            if (section && section.id === 'brands') {
                container = document.getElementById('brands-container');
            } else if (section && section.id === 'articles') {
                container = document.getElementById('articles-container');
            }
            
            if (button.classList.contains('scroll-left')) {
                direction = -1;
            }
            
            if (container) {
                // Use requestAnimationFrame for smoother performance
                function animateScroll() {
                    // Check scroll boundaries
                    const atStart = container.scrollLeft <= 0 && direction === -1;
                    const atEnd = container.scrollLeft >= container.scrollWidth - container.clientWidth - 1 && direction === 1;
                    
                    if (!atStart && !atEnd) {
                        container.scrollLeft += direction * fastScrollSpeed;
                        rafId = requestAnimationFrame(animateScroll);
                    } else {
                        rafId = null;
                    }
                }
                rafId = requestAnimationFrame(animateScroll);
            }
        });
        
        button.addEventListener('mouseleave', () => {
            // Stop fast scrolling
            if (hoverScrollInterval) {
                clearInterval(hoverScrollInterval);
                hoverScrollInterval = null;
            }
            if (rafId) {
                cancelAnimationFrame(rafId);
                rafId = null;
            }
        });
    });
}

// Smooth scroll for menu links
document.querySelectorAll('#header nav a').forEach(link => {
    link.addEventListener('click', (e) => {
        e.preventDefault();
        const targetId = link.getAttribute('href').substring(1);
        const targetElement = document.getElementById(targetId);
        if (targetElement) {
            window.scrollTo({
                top: targetElement.offsetTop - 100,
                behavior: 'smooth'
            });
        }
    });
});

// Mobile menu toggle
document.addEventListener('DOMContentLoaded', () => {
    const mobileMenuButton = document.getElementById('mobile-menu-button');
    const nav = document.querySelector('#header nav');
    
    if (mobileMenuButton && nav) {
        mobileMenuButton.addEventListener('click', () => {
            const isOpen = nav.classList.toggle('mobile-open');
            mobileMenuButton.setAttribute('aria-expanded', isOpen.toString());
            mobileMenuButton.setAttribute('aria-label', isOpen ? 'Close menu' : 'Open menu');
        });
        
        // Close menu when clicking on a link
        document.querySelectorAll('#header nav a').forEach(link => {
            link.addEventListener('click', () => {
                nav.classList.remove('mobile-open');
                mobileMenuButton.setAttribute('aria-expanded', 'false');
                mobileMenuButton.setAttribute('aria-label', 'Open menu');
            });
        });
    }
});

// Apply section backgrounds
function applySectionBackgrounds(backgrounds) {
    const sectionMap = {
        'header': document.getElementById('header'),
        'about': document.getElementById('about'),
        'brands': document.getElementById('brands'),
        'products': document.getElementById('brands'), // Legacy support
        'articles': document.getElementById('articles'),
        'footer': document.getElementById('footer')
    };
    
    Object.keys(backgrounds).forEach(sectionKey => {
        const section = sectionMap[sectionKey];
        const bgData = backgrounds[sectionKey];
        
        if (section && bgData && bgData.image) {
            // Sanitize image URL - only allow data: URLs and relative paths
            const imageUrl = bgData.image;
            if (!imageUrl.startsWith('data:') && !imageUrl.startsWith('images/') && !imageUrl.startsWith('/images/')) {
                console.warn(`Skipping potentially unsafe URL for ${sectionKey}: ${imageUrl}`);
                return;
            }
            
            const opacity = Math.max(0, Math.min(100, bgData.opacity || 100)) / 100;
            const scale = bgData.scale || 100;
            const posX = bgData.posX !== undefined ? bgData.posX : 50;
            const posY = bgData.posY !== undefined ? bgData.posY : 50;
            
            // Create overlay div if not exists
            let overlay = section.querySelector('.section-bg-overlay');
            if (!overlay) {
                overlay = document.createElement('div');
                overlay.className = 'section-bg-overlay';
                // Only set position if not already set
                const currentPosition = window.getComputedStyle(section).position;
                if (currentPosition === 'static') {
                    section.style.position = 'relative';
                }
                section.insertBefore(overlay, section.firstChild);
            }
            
            overlay.style.backgroundImage = `url('${imageUrl.replace(/\\/g, "\\\\").replace(/'/g, "\\'")}')`;
            // On mobile (screen width < 768px), always use 'cover' to avoid empty strips
            // On desktop, use the custom scale
            const isMobile = window.innerWidth < 768;
            if (isMobile) {
                overlay.style.backgroundSize = 'cover';
            } else {
                overlay.style.backgroundSize = `${scale}%`;
            }
            overlay.style.backgroundPosition = `${posX}% ${posY}%`;
            overlay.style.backgroundRepeat = 'no-repeat';
            overlay.style.opacity = opacity;
        }
    });
}

// Apply text colors to sections
function applyTextColors(textColors) {
    // Header text color
    if (textColors.header) {
        const headerTop = document.querySelector('.header-top');
        if (headerTop) {
            headerTop.style.color = textColors.header;
        }
    }
    
    // Menu text color
    if (textColors.menu) {
        const menuLinks = document.querySelectorAll('#header nav a');
        menuLinks.forEach(link => {
            // Override Tailwind classes with important flag
            link.style.setProperty('color', textColors.menu, 'important');
        });
    }
    
    // About section text color
    if (textColors.about) {
        const aboutSection = document.getElementById('about');
        if (aboutSection) {
            aboutSection.style.color = textColors.about;
        }
        // Also apply to about content
        const aboutContent = document.getElementById('about-content');
        if (aboutContent) {
            aboutContent.style.color = textColors.about;
        }
    }
    
    // Brands section text color
    const brandsColor = textColors.brands || textColors.products;
    if (brandsColor) {
        const brandsSection = document.getElementById('brands');
        if (brandsSection) {
            brandsSection.style.color = brandsColor;
        }
        // Create or update style element for brand cards
        let styleEl = document.getElementById('brands-text-color-style');
        if (!styleEl) {
            styleEl = document.createElement('style');
            styleEl.id = 'brands-text-color-style';
            document.head.appendChild(styleEl);
        }
        styleEl.textContent = `
            .brand-card h3, .product-card h3,
            .brand-card p, .product-card p {
                color: ${brandsColor} !important;
            }
        `;
    }
    
    // Articles section text color
    if (textColors.articles) {
        const articlesSection = document.getElementById('articles');
        if (articlesSection) {
            articlesSection.style.color = textColors.articles;
        }
        // Create or update style element for article cards
        let styleEl = document.getElementById('articles-text-color-style');
        if (!styleEl) {
            styleEl = document.createElement('style');
            styleEl.id = 'articles-text-color-style';
            document.head.appendChild(styleEl);
        }
        styleEl.textContent = `
            .article-card h3,
            .article-card .excerpt {
                color: ${textColors.articles} !important;
            }
        `;
    }
    
    // Footer text color
    if (textColors.footer) {
        const footer = document.getElementById('footer');
        if (footer) {
            footer.style.color = textColors.footer;
        }
    }
}

// Apply menu underline color
function applyMenuUnderlineColor(color) {
    // Create or update style element for menu underline
    let styleEl = document.getElementById('menu-underline-style');
    if (!styleEl) {
        styleEl = document.createElement('style');
        styleEl.id = 'menu-underline-style';
        document.head.appendChild(styleEl);
    }
    
    // Set the menu underline color
    styleEl.textContent = `
        #header nav a::after {
            background: ${color} !important;
        }
    `;
}

// Apply contact colors
function applyContactColors(contactColors) {
    if (contactColors.phones) {
        const phoneLinks = document.querySelectorAll('#header-phones a, #footer-phones a');
        phoneLinks.forEach(link => {
            link.style.color = contactColors.phones;
        });
    }
    
    if (contactColors.address) {
        const addressElements = document.querySelectorAll('#header-address, #footer-address');
        addressElements.forEach(element => {
            element.style.color = contactColors.address;
        });
        // Also color the address link
        const addressLink = document.getElementById('header-address-link');
        if (addressLink) {
            addressLink.style.color = contactColors.address;
        }
    }
}

// Apply header sizes
function applyHeaderSizes(headerSizes) {
    // Create style element if not exists
    let styleEl = document.getElementById('dynamic-header-styles');
    if (!styleEl) {
        styleEl = document.createElement('style');
        styleEl.id = 'dynamic-header-styles';
        document.head.appendChild(styleEl);
    }
    
    // Sanitize CSS values - only allow safe units
    function sanitizeCSSValue(value) {
        if (!value) return null;
        // Only allow px, em, rem, %, auto values
        const safePattern = /^(auto|(\d+(\.\d+)?(px|em|rem|%)))$/;
        return safePattern.test(value.trim()) ? value.trim() : null;
    }
    
    // Build CSS rules
    let css = '';
    
    // Header top padding with improved shrinking
    const headerTopHeight = sanitizeCSSValue(headerSizes.headerTopHeight);
    if (headerTopHeight) {
        css += `.header-top { padding: ${headerTopHeight} 0; }\n`;
        css += `#header.shrink .header-top { padding: calc(${headerTopHeight} * 0.4) 0; }\n`;
    }
    
    // Menu padding
    const menuHeight = sanitizeCSSValue(headerSizes.menuHeight);
    if (menuHeight) {
        css += `.menu-container a { padding: ${menuHeight} 25px; }\n`;
        css += `#header.shrink .menu-container a { padding: calc(${menuHeight} * 0.7) 25px; }\n`;
    }
    
    // Logo heights - these override the shrink animation
    const logoHeightNormal = sanitizeCSSValue(headerSizes.logoHeightNormal);
    if (logoHeightNormal) {
        css += `#header-logo { height: ${logoHeightNormal} !important; }\n`;
    }
    const logoHeightShrink = sanitizeCSSValue(headerSizes.logoHeightShrink);
    if (logoHeightShrink) {
        css += `#header.shrink #header-logo { height: ${logoHeightShrink} !important; }\n`;
    }
    
    styleEl.textContent = css;
}

// Modal functions for brands
function openBrandModal(brandId) {
    const brands = siteData.brands || siteData.products || [];
    const brand = brands.find(b => b.id === brandId);
    if (!brand) return;
    
    const modal = document.createElement('div');
    modal.className = 'modal-overlay';
    modal.innerHTML = `
        <div class="modal-content">
            <button class="modal-close" onclick="closeModal(this)">&times;</button>
            <div class="modal-body">
                <img src="${brand.image}" alt="${brand.name}" class="modal-image">
                <h2>${brand.name}</h2>
                <p class="modal-description">${brand.description}</p>
            </div>
        </div>
    `;
    modal.onclick = (e) => { if (e.target === modal) closeModal(modal.querySelector('.modal-close')); };
    document.body.appendChild(modal);
    setTimeout(() => modal.classList.add('show'), 10);
}

// Legacy function name for backwards compatibility
function openProductModal(productId) {
    openBrandModal(productId);
}

// Modal functions for articles
function openArticleModal(articleId) {
    const article = siteData.articles.find(a => a.id === articleId);
    if (!article) return;
    
    const modal = document.createElement('div');
    modal.className = 'modal-overlay';
    modal.innerHTML = `
        <div class="modal-content modal-article">
            <button class="modal-close" onclick="closeModal(this)">&times;</button>
            <div class="modal-body">
                <img src="${article.image}" alt="${article.name}" class="modal-image">
                <h2>${article.name}</h2>
                <div class="modal-article-content">${article.content}</div>
            </div>
        </div>
    `;
    modal.onclick = (e) => { if (e.target === modal) closeModal(modal.querySelector('.modal-close')); };
    document.body.appendChild(modal);
    setTimeout(() => modal.classList.add('show'), 10);
}

// Close modal
function closeModal(closeBtn) {
    const modal = closeBtn.closest('.modal-overlay');
    modal.classList.remove('show');
    setTimeout(() => modal.remove(), 300);
}

// Apply footer size
function applyFooterSize(footerHeight) {
    if (!footerHeight) return;
    
    // Sanitize CSS value
    const safePattern = /^(auto|(\d+(\.\d+)?(px|em|rem|%)))$/;
    if (!safePattern.test(footerHeight.trim())) return;
    
    const footer = document.getElementById('footer');
    if (footer) {
        footer.style.padding = `${footerHeight} 0`;
    }
}

// Apply footer settings (colors and font sizes)
function applyFooterSettings(footerSettings) {
    const footer = document.getElementById('footer');
    
    // Apply footer background color
    if (footer && footerSettings.bgColor) {
        footer.style.backgroundColor = footerSettings.bgColor;
    }
    
    // Apply address styles
    const addressElements = document.querySelectorAll('#footer-address');
    addressElements.forEach(element => {
        if (footerSettings.addressColor) {
            element.style.color = footerSettings.addressColor;
        }
        if (footerSettings.addressFontSize) {
            element.style.fontSize = footerSettings.addressFontSize;
        }
    });
    
    // Apply phone styles
    const phoneLinks = document.querySelectorAll('#footer-phones a');
    phoneLinks.forEach(link => {
        if (footerSettings.phonesColor) {
            link.style.color = footerSettings.phonesColor;
        }
        if (footerSettings.phonesFontSize) {
            link.style.fontSize = footerSettings.phonesFontSize;
        }
    });
}

// Apply section heights
function applySectionHeights(sectionHeights) {
    // Sanitize CSS value - only allow safe units and prevent XSS
    function sanitizeCSSValue(value) {
        if (!value) return null;
        // Only allow safe padding values with px, em, rem, % units
        // No CSS functions, comments, or special characters allowed
        const safePattern = /^(\d+(\.\d+)?(px|em|rem|%)(\s+\d+(\.\d+)?(px|em|rem|%))?)$/;
        const trimmedValue = value.trim();
        
        // Check for dangerous patterns
        if (trimmedValue.includes('<') || trimmedValue.includes('>') || 
            trimmedValue.includes('script') || trimmedValue.includes('expression') ||
            trimmedValue.includes('url(') || trimmedValue.includes('calc(') ||
            trimmedValue.includes('var(') || trimmedValue.includes('attr(')) {
            return null;
        }
        
        return safePattern.test(trimmedValue) ? trimmedValue : null;
    }
    
    // Apply to each section
    const sections = ['about', 'brands', 'articles'];
    sections.forEach(sectionName => {
        if (sectionHeights[sectionName]) {
            const padding = sanitizeCSSValue(sectionHeights[sectionName]);
            if (padding) {
                const section = document.getElementById(sectionName);
                if (section) {
                    section.style.padding = padding;
                }
            }
        }
    });
}

// Apply content opacity to frames
function applyContentOpacity(contentOpacity) {
    // About content frame
    if (contentOpacity.about !== undefined) {
        const aboutContent = document.getElementById('about-content');
        if (aboutContent) {
            const opacity = Math.max(0, Math.min(100, contentOpacity.about)) / 100;
            // Replace the rgba value in the background
            aboutContent.style.background = `rgba(255, 255, 255, ${opacity})`;
        }
    }
    
    // Brands cards
    if (contentOpacity.brands !== undefined) {
        const opacity = Math.max(0, Math.min(100, contentOpacity.brands)) / 100;
        // Create or update style element for brands
        let styleEl = document.getElementById('brands-opacity-style');
        if (!styleEl) {
            styleEl = document.createElement('style');
            styleEl.id = 'brands-opacity-style';
            document.head.appendChild(styleEl);
        }
        styleEl.textContent = `
            .brand-card, .product-card {
                background: rgba(255, 255, 255, ${opacity}) !important;
            }
        `;
    }
    
    // Articles cards
    if (contentOpacity.articles !== undefined) {
        const opacity = Math.max(0, Math.min(100, contentOpacity.articles)) / 100;
        // Create or update style element for articles
        let styleEl = document.getElementById('articles-opacity-style');
        if (!styleEl) {
            styleEl = document.createElement('style');
            styleEl.id = 'articles-opacity-style';
            document.head.appendChild(styleEl);
        }
        styleEl.textContent = `
            .article-card {
                background: rgba(255, 255, 255, ${opacity}) !important;
            }
        `;
    }
}

// Apply content blur (liquid glass effect) to frames
function applyContentBlur(contentBlur) {
    // About content frame
    if (contentBlur.about !== undefined) {
        const aboutContent = document.getElementById('about-content');
        if (aboutContent) {
            const blur = Math.max(0, Math.min(100, contentBlur.about));
            aboutContent.style.backdropFilter = `blur(${blur}px)`;
            aboutContent.style.webkitBackdropFilter = `blur(${blur}px)`;
        }
    }
    
    // Brands cards
    if (contentBlur.brands !== undefined) {
        const blur = Math.max(0, Math.min(100, contentBlur.brands));
        // Create or update style element for brands
        let styleEl = document.getElementById('brands-blur-style');
        if (!styleEl) {
            styleEl = document.createElement('style');
            styleEl.id = 'brands-blur-style';
            document.head.appendChild(styleEl);
        }
        styleEl.textContent = `
            .brand-card, .product-card {
                backdrop-filter: blur(${blur}px) !important;
                -webkit-backdrop-filter: blur(${blur}px) !important;
            }
        `;
    }
    
    // Articles cards
    if (contentBlur.articles !== undefined) {
        const blur = Math.max(0, Math.min(100, contentBlur.articles));
        // Create or update style element for articles
        let styleEl = document.getElementById('articles-blur-style');
        if (!styleEl) {
            styleEl = document.createElement('style');
            styleEl.id = 'articles-blur-style';
            document.head.appendChild(styleEl);
        }
        styleEl.textContent = `
            .article-card {
                backdrop-filter: blur(${blur}px) !important;
                -webkit-backdrop-filter: blur(${blur}px) !important;
            }
        `;
    }
}

// Header shrink on scroll with throttling
let scrollTimeout;
window.addEventListener('scroll', () => {
    if (scrollTimeout) {
        return;
    }
    
    scrollTimeout = setTimeout(() => {
        scrollTimeout = null;
        
        const header = document.getElementById('header');
        const scrollTop = window.pageYOffset || document.documentElement.scrollTop;
        
        // Add shrink class when scrolling down past 50px
        if (scrollTop > 50) {
            header.classList.add('shrink');
        } else {
            header.classList.remove('shrink');
        }
    }, 100); // Throttle to once per 100ms
});

// Initialize page
renderPage();

