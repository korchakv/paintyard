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
    const safeHeaderBg = sanitizeCSSColor(data.colors.headerBg);
    const safeMainBg = sanitizeCSSColor(data.colors.mainBg);
    if (safeHeaderBg) {
        document.getElementById('footer').style.backgroundColor = safeHeaderBg;
    }
    if (safeMainBg) {
        document.getElementById('main-content').style.backgroundColor = safeMainBg;
    }

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
    
    // Apply header padding
    if (data.headerPadding) {
        applyHeaderPadding(data.headerPadding);
    }
    
    // Apply main background color to mobile menu
    if (data.colors && data.colors.mainBg) {
        applyMobileMenuBackground(data.colors.mainBg);
    }
    
    // Apply menu font size
    if (data.menuFontSize) {
        applyMenuFontSize(data.menuFontSize);
    }
    
    // Apply button font size
    if (data.buttonFontSize) {
        applyButtonFontSize(data.buttonFontSize);
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
            const safeBg = sanitizeCSSColor(data.buttonColors.call.background);
            const safeText = sanitizeCSSColor(data.buttonColors.call.text);
            if (safeBg) callButton.style.backgroundColor = safeBg;
            if (safeText) callButton.style.color = safeText;
        }
        
        const routeButton = document.getElementById('route-button');
        if (routeButton && data.buttonColors.route) {
            const safeBg = sanitizeCSSColor(data.buttonColors.route.background);
            const safeText = sanitizeCSSColor(data.buttonColors.route.text);
            if (safeBg) routeButton.style.backgroundColor = safeBg;
            if (safeText) routeButton.style.color = safeText;
        }
    }
    
    // Apply map settings
    if (data.mapSettings) {
        const mapImage = document.getElementById('map-image');
        const mapContainer = document.querySelector('.map-container-new');
        
        if (mapImage && data.mapSettings.image) {
            mapImage.src = data.mapSettings.image;
        }
        
        // Apply dimensions to container to constrain maximum size
        if (mapContainer && data.mapSettings.width) {
            mapContainer.style.maxWidth = data.mapSettings.width;
        }
        
        // Apply explicit dimensions to image
        // The clickable map link will automatically wrap to match these dimensions
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
        
        // Apply font sizes to contact info in map section
        if (data.mapSettings.addressFontSize) {
            const addressLinks = document.querySelectorAll('.address-link-contact, .address-link-bottom');
            addressLinks.forEach(link => {
                link.style.fontSize = data.mapSettings.addressFontSize;
            });
        }
        
        if (data.mapSettings.phonesFontSize) {
            const phoneLinks = document.querySelectorAll('.contact-details a[href^="tel:"]');
            phoneLinks.forEach(link => {
                link.style.fontSize = data.mapSettings.phonesFontSize;
            });
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
    
    // Apply scroll button margins
    if (data.scrollButtonMargins) {
        applyScrollButtonMargins(data.scrollButtonMargins);
    }

    // Render about
    document.getElementById('about-content').innerHTML = `<p>${data.aboutText}</p>`;

    // Render brands (without price) - all brands in grid
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
    // Show only first 8 articles initially
    const reversedArticles = [...data.articles].reverse();
    const initialArticleCount = 8;
    const visibleArticles = reversedArticles.slice(0, initialArticleCount);
    
    const articlesHTML = visibleArticles.map(article => `
        <div class="article-card" onclick="openArticleModal(${article.id})">
            <img src="${article.image}" alt="${article.name}">
            <h3>${article.name}</h3>
            <p class="excerpt">${article.excerpt}</p>
            <div class="read-more">Читати більше</div>
        </div>
    `).join('');
    document.getElementById('articles-container').innerHTML = articlesHTML;
    
    // Show "More" button if there are more articles
    const moreButton = document.getElementById('more-articles-btn');
    if (reversedArticles.length > initialArticleCount && moreButton) {
        moreButton.style.display = 'inline-block';
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
        const safeColor = sanitizeCSSColor(textColors.header);
        if (safeColor) {
            const headerTop = document.querySelector('.header-top');
            if (headerTop) {
                headerTop.style.color = safeColor;
            }
        }
    }
    
    // Menu text color
    if (textColors.menu) {
        const safeColor = sanitizeCSSColor(textColors.menu);
        if (safeColor) {
            const menuLinks = document.querySelectorAll('#header nav a');
            menuLinks.forEach(link => {
                // Override Tailwind classes with important flag
                link.style.setProperty('color', safeColor, 'important');
            });
        }
    }
    
    // About section text color
    if (textColors.about) {
        const safeColor = sanitizeCSSColor(textColors.about);
        if (safeColor) {
            const aboutSection = document.getElementById('about');
            if (aboutSection) {
                aboutSection.style.color = safeColor;
            }
            // Also apply to about content
            const aboutContent = document.getElementById('about-content');
            if (aboutContent) {
                aboutContent.style.color = safeColor;
            }
        }
    }
    
    // Brands section text color
    const brandsColor = textColors.brands || textColors.products;
    if (brandsColor) {
        const safeColor = sanitizeCSSColor(brandsColor);
        if (safeColor) {
            const brandsSection = document.getElementById('brands');
            if (brandsSection) {
                brandsSection.style.color = safeColor;
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
                    color: ${safeColor} !important;
                }
            `;
        }
    }
    
    // Articles section text color
    if (textColors.articles) {
        const safeColor = sanitizeCSSColor(textColors.articles);
        if (safeColor) {
            const articlesSection = document.getElementById('articles');
            if (articlesSection) {
                articlesSection.style.color = safeColor;
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
                    color: ${safeColor} !important;
                }
            `;
        }
    }
    
    // Footer text color
    if (textColors.footer) {
        const safeColor = sanitizeCSSColor(textColors.footer);
        if (safeColor) {
            const footer = document.getElementById('footer');
            if (footer) {
                footer.style.color = safeColor;
            }
        }
    }
}

// Apply menu underline color
function applyMenuUnderlineColor(color) {
    const safeColor = sanitizeCSSColor(color);
    if (!safeColor) return;
    
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
            background: ${safeColor} !important;
        }
    `;
}

// Apply contact colors
function applyContactColors(contactColors) {
    if (contactColors.phones) {
        const safeColor = sanitizeCSSColor(contactColors.phones);
        if (safeColor) {
            const phoneLinks = document.querySelectorAll('#header-phones a, #footer-phones a');
            phoneLinks.forEach(link => {
                link.style.color = safeColor;
            });
        }
    }
    
    if (contactColors.address) {
        const safeColor = sanitizeCSSColor(contactColors.address);
        if (safeColor) {
            const addressElements = document.querySelectorAll('#header-address, #footer-address');
            addressElements.forEach(element => {
                element.style.color = safeColor;
            });
            // Also color the address link
            const addressLink = document.getElementById('header-address-link');
            if (addressLink) {
                addressLink.style.color = safeColor;
            }
        }
    }
}

// Shared CSS sanitization utility
function sanitizeCSSValue(value) {
    if (!value) return null;
    const trimmedValue = value.trim();
    
    // Check for dangerous patterns
    if (trimmedValue.includes('<') || trimmedValue.includes('>') || 
        trimmedValue.includes('script') || trimmedValue.includes('expression') ||
        trimmedValue.includes('url(') || trimmedValue.includes('calc(') ||
        trimmedValue.includes('var(') || trimmedValue.includes('attr(')) {
        return null;
    }
    
    // Only allow px, em, rem, %, auto values
    const safePattern = /^(auto|(\d+(\.\d+)?(px|em|rem|%)))$/;
    return safePattern.test(trimmedValue) ? trimmedValue : null;
}

// Sanitize CSS padding value (allows multiple space-separated values)
function sanitizeCSSPadding(value) {
    if (!value) return null;
    const trimmedValue = value.trim();
    
    // Check for dangerous patterns
    if (trimmedValue.includes('<') || trimmedValue.includes('>') || 
        trimmedValue.includes('script') || trimmedValue.includes('expression') ||
        trimmedValue.includes('url(') || trimmedValue.includes('calc(') ||
        trimmedValue.includes('var(') || trimmedValue.includes('attr(')) {
        return null;
    }
    
    // Allow safe padding values with px, em, rem, % units (supports up to 4 space-separated values)
    const safePattern = /^(\d+(\.\d+)?(px|em|rem|%)(\s+\d+(\.\d+)?(px|em|rem|%)){0,3})$/;
    return safePattern.test(trimmedValue) ? trimmedValue : null;
}

// Sanitize CSS color value
function sanitizeCSSColor(color) {
    if (!color) return null;
    const trimmedColor = color.trim();
    
    // Check for dangerous patterns
    if (trimmedColor.includes('<') || trimmedColor.includes('>') || 
        trimmedColor.includes('script') || trimmedColor.includes('expression') ||
        trimmedColor.includes('url(') || trimmedColor.includes('calc(') ||
        trimmedColor.includes('var(') || trimmedColor.includes('attr(')) {
        return null;
    }
    
    // Allow hex colors, rgb/rgba, hsl/hsla, and named colors
    const colorPattern = /^(#[0-9A-Fa-f]{3,8}|rgba?\([^)]+\)|hsla?\([^)]+\)|[a-z]+)$/;
    return colorPattern.test(trimmedColor) ? trimmedColor : null;
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

// Apply header padding
function applyHeaderPadding(headerPadding) {
    const header = document.getElementById('header');
    if (!header) return;
    
    const headerDiv = header.querySelector('div.mx-auto');
    if (!headerDiv) return;
    
    const paddingTop = sanitizeCSSValue(headerPadding.top);
    const paddingBottom = sanitizeCSSValue(headerPadding.bottom);
    const paddingLeft = sanitizeCSSValue(headerPadding.left);
    const paddingRight = sanitizeCSSValue(headerPadding.right);
    
    if (paddingTop) headerDiv.style.paddingTop = paddingTop;
    if (paddingBottom) headerDiv.style.paddingBottom = paddingBottom;
    if (paddingLeft) headerDiv.style.paddingLeft = paddingLeft;
    if (paddingRight) headerDiv.style.paddingRight = paddingRight;
}

// Apply mobile menu background color
function applyMobileMenuBackground(bgColor) {
    if (!bgColor) return;
    
    // Sanitize color value
    const safeColor = sanitizeCSSColor(bgColor);
    if (!safeColor) return;
    
    // Create or update style element
    let styleEl = document.getElementById('mobile-menu-bg-style');
    if (!styleEl) {
        styleEl = document.createElement('style');
        styleEl.id = 'mobile-menu-bg-style';
        document.head.appendChild(styleEl);
    }
    
    // Convert color to rgba with 0.95 opacity for semi-transparent effect
    let transparentBg = safeColor;
    
    // If it's a hex color, convert to rgba
    if (safeColor.startsWith('#')) {
        const hex = safeColor.replace('#', '');
        const r = parseInt(hex.substring(0, 2), 16);
        const g = parseInt(hex.substring(2, 4), 16);
        const b = parseInt(hex.substring(4, 6), 16);
        transparentBg = `rgba(${r}, ${g}, ${b}, 0.95)`;
    } 
    // If it's rgb, convert to rgba
    else if (safeColor.startsWith('rgb(')) {
        transparentBg = safeColor.replace('rgb(', 'rgba(').replace(')', ', 0.95)');
    }
    // If already rgba, use it as is
    
    // Apply semi-transparent background color to mobile menu
    styleEl.textContent = `
        @media (max-width: 768px) {
            #header nav {
                background: ${transparentBg} !important;
                backdrop-filter: blur(10px) !important;
                -webkit-backdrop-filter: blur(10px) !important;
            }
        }
    `;
}

// Apply menu font size
function applyMenuFontSize(fontSize) {
    if (!fontSize) return;
    
    // Sanitize CSS value
    const safeFontSize = sanitizeCSSValue(fontSize);
    if (!safeFontSize) return;
    
    // Create or update style element
    let styleEl = document.getElementById('menu-font-size-style');
    if (!styleEl) {
        styleEl = document.createElement('style');
        styleEl.id = 'menu-font-size-style';
        document.head.appendChild(styleEl);
    }
    
    styleEl.textContent = `
        #header nav a {
            font-size: ${safeFontSize} !important;
        }
    `;
}

// Apply button font size
function applyButtonFontSize(fontSize) {
    if (!fontSize) return;
    
    // Sanitize CSS value
    const safeFontSize = sanitizeCSSValue(fontSize);
    if (!safeFontSize) return;
    
    const callButton = document.getElementById('call-button');
    const routeButton = document.getElementById('route-button');
    
    if (callButton) callButton.style.fontSize = safeFontSize;
    if (routeButton) routeButton.style.fontSize = safeFontSize;
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

// Open modal with all articles
function openAllArticlesModal() {
    const reversedArticles = [...siteData.articles].reverse();
    const initialArticleCount = 8;
    const remainingArticles = reversedArticles.slice(initialArticleCount);
    
    const articlesHTML = remainingArticles.map(article => `
        <div class="article-card" data-article-id="${article.id}">
            <img src="${article.image}" alt="${article.name}">
            <h3>${article.name}</h3>
            <p class="excerpt">${article.excerpt}</p>
            <div class="read-more">Читати більше</div>
        </div>
    `).join('');
    
    const modal = document.createElement('div');
    modal.className = 'modal-overlay';
    modal.innerHTML = `
        <div class="modal-content modal-article" style="max-width: 90%; max-height: 90vh;">
            <button class="modal-close" onclick="closeModal(this)">&times;</button>
            <div class="modal-body">
                <h2 style="text-align: center; color: #1a1a1a; margin-bottom: 30px;">Більше статей</h2>
                <div class="articles-grid more-articles-grid" style="max-height: calc(90vh - 150px); overflow-y: auto;">
                    ${articlesHTML}
                </div>
            </div>
        </div>
    `;
    modal.onclick = (e) => { if (e.target === modal) closeModal(modal.querySelector('.modal-close')); };
    
    // Add event delegation for article cards in the modal
    const articlesGrid = modal.querySelector('.more-articles-grid');
    articlesGrid.addEventListener('click', (e) => {
        const card = e.target.closest('.article-card');
        if (card) {
            const articleId = parseInt(card.dataset.articleId);
            openArticleModal(articleId);
            closeModal(modal.querySelector('.modal-close'));
        }
    });
    
    document.body.appendChild(modal);
    setTimeout(() => modal.classList.add('show'), 10);
}

// Apply footer size
function applyFooterSize(footerHeight) {
    if (!footerHeight) return;
    
    // Sanitize CSS value
    const safeValue = sanitizeCSSValue(footerHeight);
    if (!safeValue) return;
    
    const footer = document.getElementById('footer');
    if (footer) {
        footer.style.padding = `${safeValue} 0`;
    }
}

// Apply footer settings (colors and font sizes)
function applyFooterSettings(footerSettings) {
    const footer = document.getElementById('footer');
    
    // Apply footer background color
    if (footer && footerSettings.bgColor) {
        const safeColor = sanitizeCSSColor(footerSettings.bgColor);
        if (safeColor) {
            footer.style.backgroundColor = safeColor;
        }
    }
    
    // Apply address styles
    const addressElements = document.querySelectorAll('#footer-address');
    addressElements.forEach(element => {
        if (footerSettings.addressColor) {
            const safeColor = sanitizeCSSColor(footerSettings.addressColor);
            if (safeColor) {
                element.style.color = safeColor;
            }
        }
        if (footerSettings.addressFontSize) {
            const safeFontSize = sanitizeCSSValue(footerSettings.addressFontSize);
            if (safeFontSize) {
                element.style.fontSize = safeFontSize;
            }
        }
    });
    
    // Apply phone styles
    const phoneLinks = document.querySelectorAll('#footer-phones a');
    phoneLinks.forEach(link => {
        if (footerSettings.phonesColor) {
            const safeColor = sanitizeCSSColor(footerSettings.phonesColor);
            if (safeColor) {
                link.style.color = safeColor;
            }
        }
        if (footerSettings.phonesFontSize) {
            const safeFontSize = sanitizeCSSValue(footerSettings.phonesFontSize);
            if (safeFontSize) {
                link.style.fontSize = safeFontSize;
            }
        }
    });
}

// Apply section heights
function applySectionHeights(sectionHeights) {
    // Apply to each section
    const sections = ['about', 'brands', 'articles'];
    sections.forEach(sectionName => {
        if (sectionHeights[sectionName]) {
            const padding = sanitizeCSSPadding(sectionHeights[sectionName]);
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

// Apply scroll button margins
function applyScrollButtonMargins(scrollButtonMargins) {
    // Apply margins to brands section scroll buttons
    if (scrollButtonMargins.brands) {
        const brandsSection = document.getElementById('brands');
        if (brandsSection) {
            const leftBtn = brandsSection.querySelector('.scroll-btn.scroll-left');
            const rightBtn = brandsSection.querySelector('.scroll-btn.scroll-right');
            
            if (leftBtn && scrollButtonMargins.brands.left) {
                leftBtn.style.marginLeft = scrollButtonMargins.brands.left;
            }
            if (rightBtn && scrollButtonMargins.brands.right) {
                rightBtn.style.marginRight = scrollButtonMargins.brands.right;
            }
        }
    }
    
    // Apply margins to articles section scroll buttons
    if (scrollButtonMargins.articles) {
        const articlesSection = document.getElementById('articles');
        if (articlesSection) {
            const leftBtn = articlesSection.querySelector('.scroll-btn.scroll-left');
            const rightBtn = articlesSection.querySelector('.scroll-btn.scroll-right');
            
            if (leftBtn && scrollButtonMargins.articles.left) {
                leftBtn.style.marginLeft = scrollButtonMargins.articles.left;
            }
            if (rightBtn && scrollButtonMargins.articles.right) {
                rightBtn.style.marginRight = scrollButtonMargins.articles.right;
            }
        }
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

