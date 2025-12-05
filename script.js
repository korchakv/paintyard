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
    document.getElementById('header').style.backgroundColor = data.colors.headerBg;
    document.getElementById('footer').style.backgroundColor = data.colors.headerBg;
    document.getElementById('main-content').style.backgroundColor = data.colors.mainBg;

    // Render logo
    if (data.logo) {
        document.getElementById('header-logo').src = data.logo;
        document.getElementById('header-logo').style.display = 'block';
        document.getElementById('header-logo-text').style.display = 'none';
        document.getElementById('footer-logo').src = data.logo;
        document.getElementById('footer-logo').style.display = 'block';
        document.getElementById('footer-logo-text').style.display = 'none';
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
document.querySelectorAll('.menu a').forEach(link => {
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

// Initialize page
renderPage();
