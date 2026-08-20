// script.js

const CART_STORAGE_KEY = 'glossyBookingCart';
const INSPO_STORAGE_KEY = 'glossyInspoPrompt';

document.addEventListener('DOMContentLoaded', () => {
    setupEmailForm();
    setupPortfolioSlideshow();
    setupInspoGallery();
    setupDesignGenerator();
    setupBookingCart();
});

function setupEmailForm() {
    const emailForm = document.getElementById('email-form');
    if (!emailForm) {
        return;
    }

    emailForm.addEventListener('submit', function(event) {
        event.preventDefault();
        const emailInput = document.getElementById('email');
        if (!emailInput) {
            return;
        }
        const email = emailInput.value.trim();
        if (email) {
            alert(`Thank you! Your email ${email} has been saved.`);
            emailInput.value = '';
        }
    });
}

function setupPortfolioSlideshow() {
    const modal = document.getElementById('slideshow-modal');
    if (!modal) {
        return;
    }

    const modalImg = document.getElementById('slideshow-img');
    const modalTitle = document.getElementById('modal-title');
    const modalDuration = document.getElementById('modal-duration');
    const closeBtn = document.querySelector('.close');
    const prevBtn = document.getElementById('prev');
    const nextBtn = document.getElementById('next');

    let currentImages = [];
    let currentIndex = 0;

    const portfolioItems = document.querySelectorAll('.portfolio .grid-item');
    portfolioItems.forEach(item => {
        item.addEventListener('click', function() {
            currentImages = this.getAttribute('data-images').split(',');
            currentIndex = 0;
            modalTitle.textContent = this.getAttribute('data-description') || '';
            const durationText = this.getAttribute('data-duration');
            modalDuration.textContent = durationText ? `Duration: ${durationText}` : '';
            showImage();
            modal.style.display = 'block';
        });
    });

    if (closeBtn) {
        closeBtn.addEventListener('click', function() {
            modal.style.display = 'none';
        });
    }

    if (prevBtn) {
        prevBtn.addEventListener('click', function() {
            currentIndex = currentImages.length
                ? (currentIndex > 0 ? currentIndex - 1 : currentImages.length - 1)
                : 0;
            showImage();
        });
    }

    if (nextBtn) {
        nextBtn.addEventListener('click', function() {
            currentIndex = currentImages.length
                ? (currentIndex < currentImages.length - 1 ? currentIndex + 1 : 0)
                : 0;
            showImage();
        });
    }

    window.addEventListener('click', function(event) {
        if (event.target === modal) {
            modal.style.display = 'none';
        }
    });

    function showImage() {
        if (modalImg && currentImages[currentIndex]) {
            modalImg.src = currentImages[currentIndex];
        }
    }
}

function setupInspoGallery() {
    const gallerySection = document.querySelector('.inspo-gallery');
    if (!gallerySection) {
        return;
    }

    const filterButtons = Array.from(document.querySelectorAll('.filter-btn'));
    const searchInput = document.getElementById('gallery-search');
    const cards = Array.from(document.querySelectorAll('.gallery-card'));
    if (!cards.length) {
        return;
    }

    let activeFilter = 'all';

    filterButtons.forEach(button => {
        button.addEventListener('click', function() {
            activeFilter = this.dataset.filter;
            filterButtons.forEach(btn => btn.classList.remove('active'));
            this.classList.add('active');
            filterCards();
        });
    });

    if (searchInput) {
        searchInput.addEventListener('input', filterCards);
    }

    document.querySelectorAll('.send-inspo').forEach(button => {
        button.addEventListener('click', function() {
            const description = this.dataset.description || this.closest('.gallery-card')?.dataset.description;
            if (description) {
                localStorage.setItem(INSPO_STORAGE_KEY, description);
                window.location.href = 'design-generator.html';
            }
        });
    });

    document.querySelectorAll('.add-booking').forEach(button => {
        button.addEventListener('click', function() {
            const card = this.closest('.gallery-card');
            if (!card) {
                return;
            }
            const item = {
                id: card.dataset.id || this.dataset.id || Date.now().toString(),
                title: card.dataset.description || this.dataset.description || 'Saved design',
                price: card.dataset.price || this.dataset.price || '$0-$0',
                time: card.dataset.time || this.dataset.time || '0 hrs',
                imgSrc: card.querySelector('img') ? card.querySelector('img').src : '',
            };
            addCartItem(item);
        });
    });

    filterCards();

    function filterCards() {
        const query = searchInput?.value.trim().toLowerCase() || '';

        cards.forEach(card => {
            const category = (card.dataset.category || '').toLowerCase();
            const description = (card.dataset.description || '').toLowerCase();
            const keywords = (card.dataset.keywords || '').toLowerCase();

            const matchesFilter = activeFilter === 'all' || category === activeFilter;
            const matchesSearch =
                !query ||
                description.includes(query) ||
                keywords.includes(query) ||
                category.includes(query);

            card.style.display = matchesFilter && matchesSearch ? 'flex' : 'none';
        });
    }
}

function setupDesignGenerator() {
    const promptEl = document.getElementById('design-prompt');
    if (!promptEl) {
        return;
    }

    const savedInspo = localStorage.getItem(INSPO_STORAGE_KEY);
    if (savedInspo) {
        promptEl.value = savedInspo;
    }
}

function setupBookingCart() {
    const existing = document.getElementById('booking-cart-button');
    if (existing) {
        existing.parentElement.remove();
    }

    const cartWrapper = document.createElement('div');
    cartWrapper.innerHTML = `
        <button id="booking-cart-button" class="booking-cart-button" aria-label="Open booking cart">
            🛒
            <span id="cart-counter" class="cart-counter">0</span>
        </button>
        <div id="booking-cart-panel" class="cart-panel">
            <div class="cart-panel-header">
                <h3>Saved Designs</h3>
                <button id="cart-close" class="cart-close" aria-label="Close cart">&times;</button>
            </div>
            <div id="cart-items" class="cart-items"></div>
            <div class="cart-panel-footer">
                <p>Open your booking and schedule when you're ready.</p>
                <a href="book-now.html" class="button primary">Book Now</a>
            </div>
        </div>
    `;
    document.body.appendChild(cartWrapper);

    const cartButton = document.getElementById('booking-cart-button');
    const cartPanel = document.getElementById('booking-cart-panel');
    const cartClose = document.getElementById('cart-close');

    cartButton.addEventListener('click', () => {
        cartPanel.classList.add('open');
    });

    cartClose.addEventListener('click', () => {
        cartPanel.classList.remove('open');
    });

    renderCartPanel();
    updateCartCount();
}

function getCartItems() {
    try {
        return JSON.parse(localStorage.getItem(CART_STORAGE_KEY) || '[]');
    } catch (error) {
        return [];
    }
}

function saveCartItems(items) {
    localStorage.setItem(CART_STORAGE_KEY, JSON.stringify(items));
}

function updateCartCount() {
    const countElement = document.getElementById('cart-counter');
    if (!countElement) {
        return;
    }
    const items = getCartItems();
    countElement.textContent = String(items.length);
}

function addCartItem(item) {
    const cartItems = getCartItems();
    if (cartItems.some(entry => entry.id === item.id)) {
        alert('This design is already saved in your booking cart.');
        return;
    }
    cartItems.push(item);
    saveCartItems(cartItems);
    renderCartPanel();
    updateCartCount();
}

function removeCartItem(itemId) {
    const cartItems = getCartItems().filter(entry => entry.id !== itemId);
    saveCartItems(cartItems);
    renderCartPanel();
    updateCartCount();
}

function renderCartPanel() {
    const cartItemsContainer = document.getElementById('cart-items');
    if (!cartItemsContainer) {
        return;
    }
    const items = getCartItems();
    cartItemsContainer.innerHTML = '';

    if (!items.length) {
        cartItemsContainer.innerHTML = '<p class="cart-empty">Your booking cart is empty.</p>';
        return;
    }

    items.forEach(item => {
        const itemEl = document.createElement('div');
        itemEl.className = 'cart-item';
        itemEl.innerHTML = `
            <div class="cart-item-top">
                ${item.imgSrc ? `<img src="${item.imgSrc}" class="cart-item-thumb" alt="saved design" onclick="openCartImage('${item.imgSrc}')">` : ''}
            </div>
            <div class="cart-item-body">
                <div class="cart-item-info">
                    <strong>${item.title}</strong>
                    <p class="cart-item-meta">${item.price} • ${item.time}</p>
                </div>
                <div class="cart-item-actions">
                    <a href="book-now.html">Book Now</a>
                    <button class="remove-cart" aria-label="Remove saved design">&times;</button>
                </div>
            </div>
        `;

        itemEl.querySelector('.remove-cart')?.addEventListener('click', () => {
            removeCartItem(item.id);
        });

        cartItemsContainer.appendChild(itemEl);
    });
    function openCartImage(src) {
        let overlay = document.getElementById('cart-image-overlay');
        if (!overlay) {
            overlay = document.createElement('div');
            overlay.id = 'cart-image-overlay';
            overlay.style.cssText = `
                position: fixed;
                inset: 0;
                background: rgba(0,0,0,0.75);
                z-index: 9999;
                display: flex;
                align-items: center;
                justify-content: center;
                cursor: pointer;
            `;
            overlay.innerHTML = `
                <div style="position:relative;max-width:90vw;max-height:90vh;">
                    <img id="cart-overlay-img" src="" style="max-width:90vw;max-height:85vh;border-radius:18px;display:block;">
                    <button onclick="document.getElementById('cart-image-overlay').style.display='none'" style="position:absolute;top:-14px;right:-14px;background:#c47a9a;color:white;border:none;border-radius:999px;width:32px;height:32px;font-size:1.1rem;cursor:pointer;">✕</button>
                </div>
            `;
            overlay.addEventListener('click', function(e) {
                if (e.target === overlay) overlay.style.display = 'none';
            });
            document.body.appendChild(overlay);
        }
        document.getElementById('cart-overlay-img').src = src;
        overlay.style.display = 'flex';
    }
}
