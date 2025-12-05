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

    // Apply colors
    const headerTop = document.querySelector('.header-top');
    if (headerTop) {
        headerTop.style.backgroundColor = data.colors.headerBg;
    }
    
    const menuBar = document.getElementById('menu-bar');
    if (menuBar && data.colors.menuBg) {
        menuBar.style.backgroundColor = data.colors.menuBg;
    }
    
    document.getElementById('footer').style.backgroundColor = data.colors.headerBg;
    document.getElementById('main-content').style.backgroundColor = data.colors.mainBg;

    // Apply text colors
    if (data.textColors) {
        applyTextColors(data.textColors);
    }
    
    // Apply contact colors
    if (data.contactColors) {
        applyContactColors(data.contactColors);
    }
    
    // Apply header sizes
    if (data.headerSizes) {
        applyHeaderSizes(data.headerSizes);
    }

    // Apply logo size
    if (data.logoSize) {
        const headerLogo = document.getElementById('header-logo');
        const footerLogo = document.getElementById('footer-logo');
        if (headerLogo) {
            headerLogo.style.width = data.logoSize.width;
            headerLogo.style.height = data.logoSize.height;
        }
        if (footerLogo) {
            footerLogo.style.width = data.logoSize.width;
            footerLogo.style.height = data.logoSize.height;
        }
    }

    // Render logo
    if (data.logo) {
        document.getElementById('header-logo').src = data.logo;
        document.getElementById('header-logo').style.display = 'block';
        document.getElementById('header-logo-text').style.display = 'none';
        document.getElementById('footer-logo').src = data.logo;
        document.getElementById('footer-logo').style.display = 'block';
        document.getElementById('footer-logo-text').style.display = 'none';
    }
    
    // Apply section backgrounds
    if (data.sectionBackgrounds) {
        applySectionBackgrounds(data.sectionBackgrounds);
    }

    // Render phones
    const phonesHTML = data.phones.map(phone => 
        `<a href="tel:${phone.replace(/\D/g, '')}">${phone}</a>`
    ).join('');
    document.getElementById('header-phones').innerHTML = phonesHTML;
    document.getElementById('footer-phones').innerHTML = phonesHTML;

    // Render address
    document.getElementById('header-address').textContent = data.address;
    document.getElementById('footer-address').textContent = data.address;

    // Render about
    document.getElementById('about-content').innerHTML = `<p>${data.aboutText}</p>`;

    // Render products
    const productsHTML = data.products.map(product => `
        <div class="product-card">
            <img src="${product.image}" alt="${product.name}">
            <h3>${product.name}</h3>
            <p>${product.description}</p>
            <div class="price">${product.price}</div>
        </div>
    `).join('');
    document.getElementById('products-container').innerHTML = productsHTML;

    // Render articles
    const articlesHTML = data.articles.map(article => `
        <a href="article.html?id=${article.id}" target="_blank" class="article-card">
            <img src="${article.image}" alt="${article.name}">
            <h3>${article.name}</h3>
            <p class="excerpt">${article.excerpt}</p>
        </a>
    `).join('');
    document.getElementById('articles-container').innerHTML = articlesHTML;
}

// Scroll functions
function scrollProducts(direction) {
    const container = document.getElementById('products-container');
    const scrollAmount = 300;
    if (direction === 'left') {
        container.scrollLeft -= scrollAmount;
    } else {
        container.scrollLeft += scrollAmount;
    }
}

function scrollArticles(direction) {
    const container = document.getElementById('articles-container');
    const scrollAmount = 340;
    if (direction === 'left') {
        container.scrollLeft -= scrollAmount;
    } else {
        container.scrollLeft += scrollAmount;
    }
}

// Sticky header shrink on scroll
window.addEventListener('scroll', () => {
    const header = document.getElementById('header');
    if (window.scrollY > 50) {
        header.classList.add('shrink');
    } else {
        header.classList.remove('shrink');
    }
});

// Smooth scroll for menu links
document.querySelectorAll('.menu-container a').forEach(link => {
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

// Apply section backgrounds
function applySectionBackgrounds(backgrounds) {
    const sectionMap = {
        'header': document.getElementById('header'),
        'about': document.getElementById('about'),
        'products': document.getElementById('products'),
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
        const menuLinks = document.querySelectorAll('.menu-container a');
        menuLinks.forEach(link => {
            link.style.color = textColors.menu;
        });
    }
    
    // About section text color
    if (textColors.about) {
        const aboutSection = document.getElementById('about');
        if (aboutSection) {
            aboutSection.style.color = textColors.about;
        }
    }
    
    // Products section text color
    if (textColors.products) {
        const productsSection = document.getElementById('products');
        if (productsSection) {
            productsSection.style.color = textColors.products;
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
    
    // Build CSS rules
    let css = '';
    
    // Header top padding
    if (headerSizes.headerTopHeight) {
        css += `.header-top { padding: ${headerSizes.headerTopHeight} 0; }\n`;
        css += `#header.shrink .header-top { padding: calc(${headerSizes.headerTopHeight} * 0.5) 0; }\n`;
    }
    
    // Menu padding
    if (headerSizes.menuHeight) {
        css += `.menu-container a { padding: ${headerSizes.menuHeight} 25px; }\n`;
        css += `#header.shrink .menu-container a { padding: calc(${headerSizes.menuHeight} * 0.7) 25px; }\n`;
    }
    
    // Logo heights - these override the shrink animation
    if (headerSizes.logoHeightNormal) {
        css += `#header-logo { height: ${headerSizes.logoHeightNormal} !important; }\n`;
    }
    if (headerSizes.logoHeightShrink) {
        css += `#header.shrink #header-logo { height: ${headerSizes.logoHeightShrink} !important; }\n`;
    }
    
    styleEl.textContent = css;
}

// Initialize page
renderPage();
