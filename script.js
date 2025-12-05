// Initialize default data
const DEFAULT_DATA = {
    logo: '',
    address: 'м. Київ, вул. Прикладна, 1',
    phones: ['+380 (44) 123-45-67', '+380 (50) 123-45-67'],
    aboutText: 'Наш магазин "Paintyard" пропонує широкий асортимент якісних фарб, лаків та будівельних матеріалів. Ми працюємо на ринку понад 10 років та допомагаємо нашим клієнтам втілити в життя найсміливіші дизайнерські рішення. У нас ви знайдете продукцію провідних виробників за найкращими цінами.',
    products: [
        {
            id: 1,
            name: 'Фарба інтер\'єрна біла',
            description: 'Високоякісна фарба для внутрішніх робіт',
            price: '450 грн',
            image: 'data:image/svg+xml,%3Csvg xmlns="http://www.w3.org/2000/svg" width="200" height="200"%3E%3Crect fill="%23ddd" width="200" height="200"/%3E%3Ctext x="50%25" y="50%25" text-anchor="middle" dy=".3em" fill="%23999" font-size="16"%3EФарба%3C/text%3E%3C/svg%3E'
        },
        {
            id: 2,
            name: 'Емаль для дерева',
            description: 'Захисна емаль для дерев\'яних поверхонь',
            price: '380 грн',
            image: 'data:image/svg+xml,%3Csvg xmlns="http://www.w3.org/2000/svg" width="200" height="200"%3E%3Crect fill="%23ddd" width="200" height="200"/%3E%3Ctext x="50%25" y="50%25" text-anchor="middle" dy=".3em" fill="%23999" font-size="16"%3EЕмаль%3C/text%3E%3C/svg%3E'
        },
        {
            id: 3,
            name: 'Лак для паркету',
            description: 'Глянцевий лак для паркетних підлог',
            price: '620 грн',
            image: 'data:image/svg+xml,%3Csvg xmlns="http://www.w3.org/2000/svg" width="200" height="200"%3E%3Crect fill="%23ddd" width="200" height="200"/%3E%3Ctext x="50%25" y="50%25" text-anchor="middle" dy=".3em" fill="%23999" font-size="16"%3EЛак%3C/text%3E%3C/svg%3E'
        }
    ],
    articles: [
        {
            id: 1,
            name: 'Як вибрати фарбу для стін',
            excerpt: 'Поради професіоналів щодо вибору інтер\'єрної фарби',
            content: '<h1>Як вибрати фарбу для стін</h1><p>При виборі фарби для стін потрібно враховувати декілька важливих факторів...</p><p>1. Тип приміщення - для вологих приміщень обирайте вологостійкі фарби</p><p>2. Тип поверхні - для різних матеріалів підходять різні типи фарб</p><p>3. Бажаний ефект - матовий, глянцевий або напівматовий</p>',
            image: 'data:image/svg+xml,%3Csvg xmlns="http://www.w3.org/2000/svg" width="200" height="200"%3E%3Crect fill="%23ddd" width="200" height="200"/%3E%3Ctext x="50%25" y="50%25" text-anchor="middle" dy=".3em" fill="%23999" font-size="14"%3EСтаття 1%3C/text%3E%3C/svg%3E'
        },
        {
            id: 2,
            name: 'Підготовка поверхні перед фарбуванням',
            excerpt: 'Важливі етапи підготовки для ідеального результату',
            content: '<h1>Підготовка поверхні перед фарбуванням</h1><p>Якісна підготовка поверхні - запорука успіху...</p><p>Етапи підготовки:</p><ul><li>Очищення поверхні від старого покриття</li><li>Шпаклювання тріщин та нерівностей</li><li>Шліфування</li><li>Ґрунтування</li></ul>',
            image: 'data:image/svg+xml,%3Csvg xmlns="http://www.w3.org/2000/svg" width="200" height="200"%3E%3Crect fill="%23ddd" width="200" height="200"/%3E%3Ctext x="50%25" y="50%25" text-anchor="middle" dy=".3em" fill="%23999" font-size="14"%3EСтаття 2%3C/text%3E%3C/svg%3E'
        }
    ],
    colors: {
        headerBg: '#2c3e50',
        mainBg: '#f4f4f4'
    }
};

// Load data from localStorage or use defaults
function loadData() {
    const storedData = localStorage.getItem('paintyardData');
    return storedData ? JSON.parse(storedData) : DEFAULT_DATA;
}

// Render page content
function renderPage() {
    const data = loadData();

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
