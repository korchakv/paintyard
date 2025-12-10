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
        if (mapImage && data.mapSettings.image) {
            mapImage.src = data.mapSettings.image;
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
    
    // Apply contact colors AFTER rendering (fix for phone colors)
    if (data.contactColors) {
        applyContactColors(data.contactColors);
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

    // Render articles
    const articlesHTML = data.articles.map(article => `
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

// Scroll functions
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
            overlay.style.backgroundSize = `${scale}%`;
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
    }
    
    // Brands section text color
    const brandsColor = textColors.brands || textColors.products;
    if (brandsColor) {
        const brandsSection = document.getElementById('brands');
        if (brandsSection) {
            brandsSection.style.color = brandsColor;
        }
    }
    
    // Articles section text color
    if (textColors.articles) {
        const articlesSection = document.getElementById('articles');
        if (articlesSection) {
            articlesSection.style.color = textColors.articles;
        }
    }
    
    // Footer text color
    if (textColors.footer) {
        const footer = document.getElementById('footer');
        if (footer) {
            footer.style.color = textColors.footer;
        }
    }
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

// Initialize page
renderPage();

