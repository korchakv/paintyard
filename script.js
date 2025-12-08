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
    
    // Apply header sizes
    if (data.headerSizes) {
        applyHeaderSizes(data.headerSizes);
    }
    
    // Apply footer size
    if (data.headerSizes && data.headerSizes.footerHeight) {
        applyFooterSize(data.headerSizes.footerHeight);
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

    // Render address with map link
    const addressLink = document.getElementById('header-address-link');
    const headerAddress = document.getElementById('header-address');
    if (addressLink && headerAddress) {
        headerAddress.textContent = data.address;
        // Use GPS coordinates for more accurate location (WPMJ+PG)
        addressLink.href = `https://www.google.com/maps/search/?api=1&query=48.9366,24.7311`;
        addressLink.target = '_blank';
        addressLink.rel = 'noopener noreferrer';
    }
    document.getElementById('footer-address').textContent = data.address;
    
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

// ==================== Google Neighborhood Discovery Widget ====================

// Utility functions for the widget
function hideElement(el, focusEl) {
    el.style.display = 'none';
    if (focusEl) focusEl.focus();
}

function showElement(el, focusEl) {
    el.style.display = 'block';
    if (focusEl) focusEl.focus();
}

function hasHiddenContent(el) {
    const noscroll = window.getComputedStyle(el).overflowY.includes('hidden');
    return noscroll && el.scrollHeight > el.clientHeight;
}

function formatPlaceType(str) {
    const capitalized = str.charAt(0).toUpperCase() + str.slice(1);
    return capitalized.replace(/_/g, ' ');
}

function parseDaysHours(openingHours) {
    const daysHours = openingHours.weekday_text.map((e) => e.split(/\:\s+/))
                .map((e) => ({'days': e[0].substr(0, 3), 'hours': e[1]}));

    for (let i = 1; i < daysHours.length; i++) {
        if (daysHours[i - 1].hours === daysHours[i].hours) {
            if (daysHours[i - 1].days.indexOf('-') !== -1) {
                daysHours[i - 1].days =
                    daysHours[i - 1].days.replace(/\w+$/, daysHours[i].days);
            } else {
                daysHours[i - 1].days += ' - ' + daysHours[i].days;
            }
            daysHours.splice(i--, 1);
        }
    }
    return daysHours;
}

const ND_NUM_PLACES_INITIAL = 5;
const ND_NUM_PLACES_SHOW_MORE = 5;
const ND_NUM_PLACE_PHOTOS_MAX = 6;
const ND_DEFAULT_POI_MIN_ZOOM = 18;
const ND_MARKER_ICONS_BY_TYPE = {
    '_default': 'circle',
};

// Neighborhood Discovery Widget
function NeighborhoodDiscovery(configuration) {
    const widget = this;
    const widgetEl = document.querySelector('.neighborhood-discovery');
    
    if (!widgetEl) return;

    widget.center = configuration.mapOptions.center;
    widget.places = configuration.pois || [];

    // Initialize map
    function initializeMap() {
        const mapOptions = configuration.mapOptions;
        widget.mapBounds = new google.maps.Circle(
            {center: widget.center, radius: configuration.mapRadius}).getBounds();
        mapOptions.restriction = {latLngBounds: widget.mapBounds};
        mapOptions.mapTypeControlOptions = {position: google.maps.ControlPosition.TOP_RIGHT};
        widget.map = new google.maps.Map(widgetEl.querySelector('.map'), mapOptions);
        widget.map.fitBounds(widget.mapBounds, 0);
        widget.map.addListener('click', (e) => {
            if (e.placeId) {
                e.stop();
                widget.selectPlaceById(e.placeId);
            }
        });
        widget.map.addListener('zoom_changed', () => {
            const hideDefaultPoiPins = widget.map.getZoom() < ND_DEFAULT_POI_MIN_ZOOM;
            widget.map.setOptions({
                styles: [{
                    featureType: 'poi',
                    elementType: hideDefaultPoiPins ? 'labels' : 'labels.text',
                    stylers: [{visibility: 'off'}],
                }],
            });
        });

        const markerPath = widgetEl.querySelector('.marker-pin path').getAttribute('d');
        const drawMarker = function(title, position, fillColor, strokeColor, labelText) {
            return new google.maps.Marker({
                title: title,
                position: position,
                map: widget.map,
                icon: {
                    path: markerPath,
                    fillColor: fillColor,
                    fillOpacity: 1,
                    strokeColor: strokeColor,
                    anchor: new google.maps.Point(13, 35),
                    labelOrigin: new google.maps.Point(13, 13),
                },
                label: {
                    text: labelText,
                    color: 'white',
                    fontSize: '16px',
                    fontFamily: 'Material Icons',
                },
            });
        };

        if (configuration.centerMarker && configuration.centerMarker.icon) {
            drawMarker('Paintyard', widget.center, '#1A73E8', '#185ABC', configuration.centerMarker.icon);
        }

        widget.addPlaceMarker = function(place) {
            place.marker = drawMarker(place.name, place.coords, '#EA4335', '#C5221F', place.icon);
            place.marker.addListener('click', () => void widget.selectPlaceById(place.placeId));
        };

        widget.updateBounds = function(places) {
            const bounds = new google.maps.LatLngBounds();
            bounds.extend(widget.center);
            for (let place of places) {
                bounds.extend(place.marker.getPosition());
            }
            widget.map.fitBounds(bounds, 100);
        };

        widget.selectedPlaceMarker = new google.maps.Marker({title: 'Point of Interest'});
    }

    // Initialize Place Details
    function initializePlaceDetails() {
        const detailsService = new google.maps.places.PlacesService(widget.map);
        const placeIdsToDetails = new Map();

        for (let place of widget.places) {
            placeIdsToDetails.set(place.placeId, place);
            place.fetchedFields = new Set(['place_id']);
        }

        widget.fetchPlaceDetails = function(placeId, fields, callback) {
            if (!placeId || !fields) return;

            let place = placeIdsToDetails.get(placeId);
            if (!place) {
                place = {placeId: placeId, fetchedFields: new Set(['place_id'])};
                placeIdsToDetails.set(placeId, place);
            }
            const missingFields = fields.filter((field) => !place.fetchedFields.has(field));
            if (missingFields.length === 0) {
                callback(place);
                return;
            }

            const request = {placeId: placeId, fields: missingFields};
            let retryCount = 0;
            const processResult = function(result, status) {
                if (status !== google.maps.places.PlacesServiceStatus.OK) {
                    if (status === google.maps.places.PlacesServiceStatus.OVER_QUERY_LIMIT && retryCount < 5) {
                        const delay = (Math.pow(2, retryCount) + Math.random()) * 500;
                        setTimeout(() => void detailsService.getDetails(request, processResult), delay);
                        retryCount++;
                    }
                    return;
                }

                if (result.name) place.name = result.name;
                if (result.geometry) place.coords = result.geometry.location;
                if (result.formatted_address) place.address = result.formatted_address;
                if (result.photos) {
                    place.photos = result.photos.map((photo) => ({
                        urlSmall: photo.getUrl({maxWidth: 200, maxHeight: 200}),
                        urlLarge: photo.getUrl({maxWidth: 1200, maxHeight: 1200}),
                        attrs: photo.html_attributions,
                    })).slice(0, ND_NUM_PLACE_PHOTOS_MAX);
                }
                if (result.types) {
                    place.type = formatPlaceType(result.types[0]);
                    place.icon = ND_MARKER_ICONS_BY_TYPE['_default'];
                    for (let type of result.types) {
                        if (type in ND_MARKER_ICONS_BY_TYPE) {
                            place.type = formatPlaceType(type);
                            place.icon = ND_MARKER_ICONS_BY_TYPE[type];
                            break;
                        }
                    }
                }
                if (result.url) place.url = result.url;
                if (result.website) {
                    place.website = result.website;
                    const url = new URL(place.website);
                    place.websiteDomain = url.hostname;
                }
                if (result.formatted_phone_number) place.phoneNumber = result.formatted_phone_number;
                if (result.opening_hours) place.openingHours = parseDaysHours(result.opening_hours);

                for (let field of missingFields) {
                    place.fetchedFields.add(field);
                }
                callback(place);
            };

            if (widget.placeIdsToAutocompleteResults) {
                const autoCompleteResult = widget.placeIdsToAutocompleteResults.get(placeId);
                if (autoCompleteResult) {
                    processResult(autoCompleteResult, google.maps.places.PlacesServiceStatus.OK);
                    return;
                }
            }
            detailsService.getDetails(request, processResult);
        };
    }

    // Initialize side panel
    function initializeSidePanel() {
        const placesPanelEl = widgetEl.querySelector('.places-panel');
        const detailsPanelEl = widgetEl.querySelector('.details-panel');
        const placeResultsEl = widgetEl.querySelector('.place-results-list');
        const showMoreButtonEl = widgetEl.querySelector('.show-more-button');
        const photoModalEl = widgetEl.querySelector('.photo-modal');
        const detailsTemplate = Handlebars.compile(
            document.getElementById('nd-place-details-tmpl').innerHTML);
        const resultsTemplate = Handlebars.compile(
            document.getElementById('nd-place-results-tmpl').innerHTML);

        const showPhotoModal = function(photo, placeName) {
            const prevFocusEl = document.activeElement;
            const imgEl = photoModalEl.querySelector('img');
            imgEl.src = photo.urlLarge;
            const backButtonEl = photoModalEl.querySelector('.back-button');
            backButtonEl.addEventListener('click', () => {
                hideElement(photoModalEl, prevFocusEl);
                imgEl.src = '';
            });
            photoModalEl.querySelector('.photo-place').innerHTML = placeName;
            photoModalEl.querySelector('.photo-attrs span').innerHTML = photo.attrs;
            const attributionEl = photoModalEl.querySelector('.photo-attrs a');
            if (attributionEl) attributionEl.setAttribute('target', '_blank');
            photoModalEl.addEventListener('click', (e) => {
                if (e.target === photoModalEl) {
                    hideElement(photoModalEl, prevFocusEl);
                    imgEl.src = '';
                }
            });
            showElement(photoModalEl, backButtonEl);
        };

        let selectedPlaceId;
        widget.selectPlaceById = function(placeId, panToMarker) {
            if (selectedPlaceId === placeId) return;
            selectedPlaceId = placeId;
            const prevFocusEl = document.activeElement;

            const showDetailsPanel = function(place) {
                detailsPanelEl.innerHTML = detailsTemplate(place);
                const backButtonEl = detailsPanelEl.querySelector('.back-button');
                backButtonEl.addEventListener('click', () => {
                    hideElement(detailsPanelEl, prevFocusEl);
                    selectedPlaceId = undefined;
                    widget.updateDirections();
                    widget.selectedPlaceMarker.setMap(null);
                });
                detailsPanelEl.querySelectorAll('.photo').forEach((photoEl, i) => {
                    photoEl.addEventListener('click', () => {
                        showPhotoModal(place.photos[i], place.name);
                    });
                });
                showElement(detailsPanelEl, backButtonEl);
                detailsPanelEl.scrollTop = 0;
            };

            const processResult = function(place) {
                if (place.marker) {
                    widget.selectedPlaceMarker.setMap(null);
                } else {
                    widget.selectedPlaceMarker.setPosition(place.coords);
                    widget.selectedPlaceMarker.setMap(widget.map);
                }
                if (panToMarker) {
                    widget.map.panTo(place.coords);
                }
                showDetailsPanel(place);
                widget.fetchDuration(place, showDetailsPanel);
                widget.updateDirections(place);
            };

            widget.fetchPlaceDetails(placeId, [
                'name', 'types', 'geometry.location', 'formatted_address', 'photo', 'url',
                'website', 'formatted_phone_number', 'opening_hours',
            ], processResult);
        };

        const renderPlaceResults = function(places, startIndex) {
            placeResultsEl.insertAdjacentHTML('beforeend', resultsTemplate({places: places}));
            placeResultsEl.querySelectorAll('.place-result').forEach((resultEl, i) => {
                const place = places[i - startIndex];
                if (!place) return;
                resultEl.addEventListener('click', () => {
                    widget.selectPlaceById(place.placeId, true);
                });
                resultEl.querySelector('.name').addEventListener('click', (e) => {
                    widget.selectPlaceById(place.placeId, true);
                    e.stopPropagation();
                });
                resultEl.querySelector('.photo').addEventListener('click', (e) => {
                    showPhotoModal(place.photos[0], place.name);
                    e.stopPropagation();
                });
                widget.addPlaceMarker(place);
            });
        };

        let nextPlaceIndex = 0;
        const showNextPlaces = function(n) {
            const nextPlaces = widget.places.slice(nextPlaceIndex, nextPlaceIndex + n);
            if (nextPlaces.length < 1) {
                hideElement(showMoreButtonEl);
                return;
            }
            showMoreButtonEl.disabled = true;
            let count = nextPlaces.length;
            for (let place of nextPlaces) {
                const processResult = function(place) {
                    count--;
                    if (count > 0) return;
                    renderPlaceResults(nextPlaces, nextPlaceIndex);
                    nextPlaceIndex += n;
                    widget.updateBounds(widget.places.slice(0, nextPlaceIndex));
                    const hasMorePlacesToShow = nextPlaceIndex < widget.places.length;
                    if (hasMorePlacesToShow || hasHiddenContent(placesPanelEl)) {
                        showElement(showMoreButtonEl);
                        showMoreButtonEl.disabled = false;
                    } else {
                        hideElement(showMoreButtonEl);
                    }
                };
                widget.fetchPlaceDetails(place.placeId, [
                    'name', 'types', 'geometry.location', 'photo',
                ], processResult);
            }
        };
        showNextPlaces(ND_NUM_PLACES_INITIAL);

        showMoreButtonEl.addEventListener('click', () => {
            placesPanelEl.classList.remove('no-scroll');
            showMoreButtonEl.classList.remove('sticky');
            showNextPlaces(ND_NUM_PLACES_SHOW_MORE);
        });
    }

    // Initialize search
    function initializeSearchInput() {
        const searchInputEl = widgetEl.querySelector('.place-search-input');
        widget.placeIdsToAutocompleteResults = new Map();

        const autocomplete = new google.maps.places.Autocomplete(searchInputEl, {
            types: ['establishment'],
            fields: [
                'place_id', 'name', 'types', 'geometry.location', 'formatted_address', 'photo', 'url',
                'website', 'formatted_phone_number', 'opening_hours',
            ],
            bounds: widget.mapBounds,
            strictBounds: true,
        });
        autocomplete.addListener('place_changed', () => {
            const place = autocomplete.getPlace();
            widget.placeIdsToAutocompleteResults.set(place.place_id, place);
            widget.selectPlaceById(place.place_id, true);
            searchInputEl.value = '';
        });
    }

    // Initialize distance matrix
    function initializeDistanceMatrix() {
        const distanceMatrixService = new google.maps.DistanceMatrixService();

        widget.fetchDuration = function(place, callback) {
            if (!widget.center || !place || !place.coords || place.duration) return;
            const request = {
                origins: [widget.center],
                destinations: [place.coords],
                travelMode: google.maps.TravelMode.DRIVING,
            };
            distanceMatrixService.getDistanceMatrix(request, function(result, status) {
                if (status === google.maps.DistanceMatrixStatus.OK) {
                    const trip = result.rows[0].elements[0];
                    if (trip.status === google.maps.DistanceMatrixElementStatus.OK) {
                        place.duration = trip.duration;
                        callback(place);
                    }
                }
            });
        };
    }

    // Initialize directions
    function initializeDirections() {
        const directionsService = new google.maps.DirectionsService();
        const directionsRenderer = new google.maps.DirectionsRenderer({
            suppressMarkers: true,
            preserveViewport: true,
        });

        widget.updateDirections = function(place) {
            if (!widget.center || !place || !place.coords) {
                directionsRenderer.setMap(null);
                return;
            }
            if (place.directions) {
                directionsRenderer.setMap(widget.map);
                directionsRenderer.setDirections(place.directions);
                return;
            }
            const request = {
                origin: widget.center,
                destination: place.coords,
                travelMode: google.maps.TravelMode.DRIVING,
            };
            directionsService.route(request, function(result, status) {
                if (status === google.maps.DirectionsStatus.OK) {
                    place.directions = result;
                    directionsRenderer.setMap(widget.map);
                    directionsRenderer.setDirections(result);
                }
            });
        };
    }

    initializeMap();
    initializePlaceDetails();
    initializeSidePanel();
    initializeSearchInput();
    initializeDistanceMatrix();
    initializeDirections();
}

// Configuration for Neighborhood Discovery
const NEIGHBORHOOD_CONFIG = {
    "capabilities": {
        "search": true,
        "distances": true,
        "directions": true,
        "contacts": true,
        "atmospheres": false,
        "thumbnails": true
    },
    "centerMarker": {"icon": "circle"},
    "mapRadius": 500,
    "mapOptions": {
        "center": {"lat": 48.9366, "lng": 24.7311},
        "fullscreenControl": true,
        "mapTypeControl": true,
        "streetViewControl": false,
        "zoom": 16,
        "zoomControl": true,
        "maxZoom": 20,
        "mapId": ""
    },
    "mapsApiKey": "AIzaSyAqyiWG8P5OeY8yEjJGoW2yQ65S__oE2Ww"
};

// Initialize map when Google Maps API is loaded
function initMap() {
    new NeighborhoodDiscovery(NEIGHBORHOOD_CONFIG);
}

// Make initMap globally accessible
window.initMap = initMap;

