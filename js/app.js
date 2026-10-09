/**
 * NAVAMART E-Commerce Client Application
 * Connects frontend UI to Node.js REST API Backend
 * Includes 8 Innovative Features:
 * 1. Founder & Customer Notifications (+91 7418362054 / navaneethasozhan2007@gmail.com)
 * 2. Mobile Number / Email Login with Founder Alerts
 * 3. AI Chatbot Assistant (NAVA AI)
 * 4. Price Negotiation System (Deal Maker)
 * 5. Proof-Based Customer Reviews
 * 6. Customer Review Helpful Voting
 * 7. Nearby Local Shop Inventory
 * 8. Gadget & Digital Accessories Rentals
 */

// Application State
const state = {
  products: [],
  categories: [],
  deals: [],
  cart: { items: [], summary: {} },
  wishlist: [],
  currentUser: null,
  activeCategory: 'all',
  searchQuery: '',
  minPrice: 0,
  maxPrice: 300000,
  minRating: 0,
  onlyAssured: false,
  onlyDeals: false,
  onlyRentals: false,
  sortBy: 'popular',
  pincode: '560001',
  locationCity: 'Bengaluru',
  currentSlide: 0,
  carouselInterval: null,
  activeQuickViewProduct: null,
  activeQuickViewTab: 'buy', // 'buy' or 'rent'
  selectedRentalTenure: '7 Days',
  checkoutStep: 1,
  checkoutData: {
    address: {
      fullName: 'Karthik Raja',
      phone: '+91 98765 43210',
      addressLine: 'Flat 402, Skyline Residency, Outer Ring Road',
      city: 'Bengaluru',
      state: 'Karnataka',
      pincode: '560103'
    },
    deliverySpeed: 'express',
    paymentMethod: 'UPI'
  }
};

// ==========================================================================
// API CLIENT
// ==========================================================================
const api = {
  async getProducts(params = {}) {
    const query = new URLSearchParams();
    if (params.category && params.category !== 'all') query.set('category', params.category);
    if (params.search) query.set('search', params.search);
    if (params.minPrice) query.set('minPrice', params.minPrice);
    if (params.maxPrice) query.set('maxPrice', params.maxPrice);
    if (params.minRating) query.set('minRating', params.minRating);
    if (params.assured) query.set('assured', 'true');
    if (params.deal) query.set('deal', 'true');
    if (params.sort) query.set('sort', params.sort);

    const res = await fetch(`/api/products?${query.toString()}`);
    return await res.json();
  },

  async getProductById(id) {
    const res = await fetch(`/api/products/${id}`);
    return await res.json();
  },

  async getCategories() {
    const res = await fetch('/api/categories');
    return await res.json();
  },

  async getDeals() {
    const res = await fetch('/api/deals');
    return await res.json();
  },

  async getCart() {
    const res = await fetch('/api/cart');
    return await res.json();
  },

  async addToCart(itemData) {
    const res = await fetch('/api/cart/add', {
      method: 'POST',
      headers: { 'Content-Type': 'application/json' },
      body: JSON.stringify(itemData)
    });
    return await res.json();
  },

  async updateCartItem(productId, quantity) {
    const res = await fetch('/api/cart/update', {
      method: 'POST',
      headers: { 'Content-Type': 'application/json' },
      body: JSON.stringify({ productId, quantity })
    });
    return await res.json();
  },

  async removeCartItem(productId) {
    const res = await fetch('/api/cart/remove', {
      method: 'POST',
      headers: { 'Content-Type': 'application/json' },
      body: JSON.stringify({ productId })
    });
    return await res.json();
  },

  async applyCoupon(code) {
    const res = await fetch('/api/cart/coupon', {
      method: 'POST',
      headers: { 'Content-Type': 'application/json' },
      body: JSON.stringify({ code })
    });
    return await res.json();
  },

  async getWishlist() {
    const res = await fetch('/api/wishlist');
    return await res.json();
  },

  async toggleWishlist(productId) {
    const res = await fetch('/api/wishlist/toggle', {
      method: 'POST',
      headers: { 'Content-Type': 'application/json' },
      body: JSON.stringify({ productId })
    });
    return await res.json();
  },

  async checkPincode(pincode) {
    const res = await fetch('/api/pincode/check', {
      method: 'POST',
      headers: { 'Content-Type': 'application/json' },
      body: JSON.stringify({ pincode })
    });
    return await res.json();
  },

  async placeOrder(orderData) {
    const res = await fetch('/api/checkout', {
      method: 'POST',
      headers: { 'Content-Type': 'application/json' },
      body: JSON.stringify(orderData)
    });
    return await res.json();
  },

  async getOrders() {
    const res = await fetch('/api/orders');
    return await res.json();
  },

  async login(identifier, name) {
    const res = await fetch('/api/auth/login', {
      method: 'POST',
      headers: { 'Content-Type': 'application/json' },
      body: JSON.stringify({ identifier, name })
    });
    return await res.json();
  },

  async getCurrentUser() {
    const res = await fetch('/api/auth/me');
    return await res.json();
  },

  async logout() {
    const res = await fetch('/api/auth/logout', { method: 'POST' });
    return await res.json();
  },

  async sendChatMessage(message) {
    const res = await fetch('/api/ai/chat', {
      method: 'POST',
      headers: { 'Content-Type': 'application/json' },
      body: JSON.stringify({ message })
    });
    return await res.json();
  },

  async negotiatePrice(productId, offeredPrice) {
    const res = await fetch('/api/negotiate', {
      method: 'POST',
      headers: { 'Content-Type': 'application/json' },
      body: JSON.stringify({ productId, offeredPrice })
    });
    return await res.json();
  },

  async getNearbyStores(pincode, productId) {
    const query = new URLSearchParams();
    if (pincode) query.set('pincode', pincode);
    if (productId) query.set('productId', productId);
    const res = await fetch(`/api/stores/nearby?${query.toString()}`);
    return await res.json();
  },

  async getNotifications() {
    const res = await fetch('/api/notifications');
    return await res.json();
  },

  async addReviewWithProof(productId, reviewData) {
    const res = await fetch(`/api/products/${productId}/review`, {
      method: 'POST',
      headers: { 'Content-Type': 'application/json' },
      body: JSON.stringify(reviewData)
    });
    return await res.json();
  },

  async voteReviewHelpful(productId, reviewIndex) {
    const res = await fetch(`/api/products/${productId}/reviews/${reviewIndex}/vote`, {
      method: 'POST'
    });
    return await res.json();
  },

  async setPriceAlert(productId, targetPrice, contact, customerName) {
    const res = await fetch('/api/price-alert', {
      method: 'POST',
      headers: { 'Content-Type': 'application/json' },
      body: JSON.stringify({ productId, targetPrice, contact, customerName })
    });
    return await res.json();
  },

  async getRentalPlan(productId) {
    const res = await fetch(`/api/rentals/${productId}`);
    return await res.json();
  }
};

// ==========================================================================
// TOAST NOTIFICATIONS
// ==========================================================================
function showToast(message, type = 'info', icon = 'bi-info-circle') {
  const container = document.getElementById('toastContainer');
  if (!container) return;

  const toast = document.createElement('div');
  toast.className = `toast-pill ${type}`;
  toast.innerHTML = `
    <i class="bi ${icon}"></i>
    <span>${message}</span>
  `;

  container.appendChild(toast);

  setTimeout(() => {
    toast.style.opacity = '0';
    toast.style.transform = 'translateX(100%)';
    toast.style.transition = 'all 0.3s ease';
    setTimeout(() => toast.remove(), 300);
  }, 3800);
}

// Currency Formatter
function formatPrice(amount) {
  return new Intl.NumberFormat('en-IN', {
    style: 'currency',
    currency: 'INR',
    maximumFractionDigits: 0
  }).format(amount || 0);
}

// ==========================================================================
// INITIALIZATION
// ==========================================================================
document.addEventListener('DOMContentLoaded', async () => {
  initTheme();
  initHeroCarousel();
  initCountdownTimer();
  setupEventListeners();

  try {
    await Promise.all([
      checkAuthStatus(),
      loadCategories(),
      loadDeals(),
      refreshCart(),
      refreshWishlist(),
      fetchAndRenderProducts()
    ]);
  } catch (err) {
    console.error('Initialization error:', err);
  }
});

// Theme Toggle
function initTheme() {
  const savedTheme = localStorage.getItem('navamart-theme') || 'light';
  document.documentElement.setAttribute('data-theme', savedTheme);
  updateThemeIcon(savedTheme);

  const themeBtn = document.getElementById('themeToggleBtn');
  if (themeBtn) {
    themeBtn.addEventListener('click', () => {
      const current = document.documentElement.getAttribute('data-theme');
      const next = current === 'dark' ? 'light' : 'dark';
      document.documentElement.setAttribute('data-theme', next);
      localStorage.setItem('navamart-theme', next);
      updateThemeIcon(next);
      showToast(`Switched to ${next} mode`, 'info', next === 'dark' ? 'bi-moon-stars' : 'bi-sun');
    });
  }
}

function updateThemeIcon(theme) {
  const icon = document.querySelector('#themeToggleBtn i');
  if (icon) {
    icon.className = theme === 'dark' ? 'bi bi-sun-fill' : 'bi bi-moon-stars-fill';
  }
}

// ==========================================================================
// AUTHENTICATION & FOUNDER NOTIFICATION
// ==========================================================================
async function checkAuthStatus() {
  const res = await api.getCurrentUser();
  if (res.success && res.user) {
    state.currentUser = res.user;
    updateUserAccountUI(res.user);
  }
}

function updateUserAccountUI(user) {
  const greeting = document.getElementById('userGreetingSub');
  const nameDisplay = document.getElementById('userAccountName');
  const menuLabel = document.getElementById('loginMenuLabel');
  const logoutItem = document.getElementById('logoutMenuItem');

  if (user && user.loggedIn) {
    if (greeting) greeting.textContent = `Hello, ${user.name.split(' ')[0]}`;
    if (nameDisplay) nameDisplay.innerHTML = `${user.name} <i class="bi bi-chevron-down" style="font-size: 10px;"></i>`;
    if (menuLabel) menuLabel.textContent = `Profile: ${user.identifier}`;
    if (logoutItem) logoutItem.style.display = 'flex';
  } else {
    if (greeting) greeting.textContent = 'Hello, Sign In';
    if (nameDisplay) nameDisplay.innerHTML = `Profile <i class="bi bi-chevron-down" style="font-size: 10px;"></i>`;
    if (menuLabel) menuLabel.textContent = 'Sign In / Register';
    if (logoutItem) logoutItem.style.display = 'none';
  }
}

function openLoginModal() {
  const modal = document.getElementById('loginModal');
  if (modal) modal.classList.add('active');
}

function closeLoginModal() {
  const modal = document.getElementById('loginModal');
  if (modal) modal.classList.remove('active');
}

async function handleLoginSubmit() {
  const input = document.getElementById('loginIdentifierInput');
  const identifier = input ? input.value.trim() : '';
  if (!identifier) {
    showToast('Please enter your Mobile Number or Email', 'error');
    return;
  }

  const res = await api.login(identifier);
  if (res.success) {
    state.currentUser = res.user;
    updateUserAccountUI(res.user);
    closeLoginModal();
    showToast(res.message, 'success', 'bi-person-check-fill');
    showToast(`🔔 Founder (+91 7418362054) notified of user login!`, 'info', 'bi-bell-fill');
  }
}

async function handleLogout() {
  await api.logout();
  state.currentUser = null;
  updateUserAccountUI(null);
  showToast('You have signed out.', 'info');
}

// ==========================================================================
// HERO CAROUSEL
// ==========================================================================
function initHeroCarousel() {
  const slides = document.querySelectorAll('.carousel-slide');
  const dots = document.querySelectorAll('.indicator-dot');
  if (!slides.length) return;

  function showSlide(index) {
    slides.forEach((s, i) => {
      s.classList.toggle('active', i === index);
      if (dots[i]) dots[i].classList.toggle('active', i === index);
    });
    state.currentSlide = index;
  }

  const prevBtn = document.getElementById('carouselPrev');
  const nextBtn = document.getElementById('carouselNext');

  if (prevBtn) {
    prevBtn.addEventListener('click', () => {
      let nextIdx = (state.currentSlide - 1 + slides.length) % slides.length;
      showSlide(nextIdx);
    });
  }

  if (nextBtn) {
    nextBtn.addEventListener('click', () => {
      let nextIdx = (state.currentSlide + 1) % slides.length;
      showSlide(nextIdx);
    });
  }

  dots.forEach((dot, idx) => {
    dot.addEventListener('click', () => showSlide(idx));
  });

  setInterval(() => {
    let nextIdx = (state.currentSlide + 1) % slides.length;
    showSlide(nextIdx);
  }, 5000);
}

function initCountdownTimer() {
  const timerElem = document.getElementById('dealsCountdown');
  if (!timerElem) return;

  function update() {
    const now = new Date();
    const target = new Date();
    target.setHours(23, 59, 59, 999);
    const diff = target - now;
    if (diff <= 0) {
      timerElem.textContent = '00 : 00 : 00';
      return;
    }
    const hours = String(Math.floor(diff / (1000 * 60 * 60))).padStart(2, '0');
    const minutes = String(Math.floor((diff % (1000 * 60 * 60)) / (1000 * 60))).padStart(2, '0');
    const seconds = String(Math.floor((diff % (1000 * 60)) / 1000)).padStart(2, '0');
    timerElem.textContent = `${hours}h : ${minutes}m : ${seconds}s`;
  }
  update();
  setInterval(update, 1000);
}

// ==========================================================================
// CATEGORIES & DEALS
// ==========================================================================
async function loadCategories() {
  const data = await api.getCategories();
  if (data.success) {
    state.categories = data.categories;
    renderCategoryQuickBubbles(data.categories);
    renderSidebarCategoryList(data.categories);
    populateSearchCategoryDropdown(data.categories);
  }
}

function renderCategoryQuickBubbles(categories) {
  const container = document.getElementById('quickCategoriesContainer');
  if (!container) return;

  container.innerHTML = categories.map(cat => `
    <div class="cat-bubble-item ${state.activeCategory === cat.id ? 'active' : ''}" data-cat="${cat.id}">
      <div class="cat-icon-circle" style="background: linear-gradient(135deg, ${cat.color || '#2874f0'} 0%, #1e293b 100%);">
        <i class="bi ${cat.icon || 'bi-bag'}"></i>
      </div>
      <span class="cat-name-label">${cat.name}</span>
      ${cat.badge ? `<span class="cat-offer-tag">${cat.badge}</span>` : ''}
    </div>
  `).join('');

  container.querySelectorAll('.cat-bubble-item').forEach(el => {
    el.addEventListener('click', () => {
      const catId = el.getAttribute('data-cat');
      setCategoryFilter(catId);
    });
  });
}

function renderSidebarCategoryList(categories) {
  const container = document.getElementById('sidebarCategoryList');
  if (!container) return;

  container.innerHTML = categories.map(cat => `
    <label class="filter-checkbox-item">
      <input type="radio" name="catFilter" value="${cat.id}" ${state.activeCategory === cat.id ? 'checked' : ''}>
      <span>${cat.name}</span>
      <span style="margin-left: auto; color: var(--text-muted); font-size: 11px;">(${cat.count || 0})</span>
    </label>
  `).join('');

  container.querySelectorAll('input[name="catFilter"]').forEach(radio => {
    radio.addEventListener('change', (e) => setCategoryFilter(e.target.value));
  });
}

function populateSearchCategoryDropdown(categories) {
  const select = document.getElementById('searchCategorySelect');
  if (!select) return;

  select.innerHTML = `<option value="all">All Departments</option>` +
    categories.filter(c => c.id !== 'all').map(c => `
      <option value="${c.id}">${c.name}</option>
    `).join('');
}

function setCategoryFilter(catId) {
  state.activeCategory = catId;
  document.querySelectorAll('.cat-bubble-item').forEach(el => {
    el.classList.toggle('active', el.getAttribute('data-cat') === catId);
  });
  const radio = document.querySelector(`input[name="catFilter"][value="${catId}"]`);
  if (radio) radio.checked = true;
  const select = document.getElementById('searchCategorySelect');
  if (select) select.value = catId;
  fetchAndRenderProducts();
}

async function loadDeals() {
  const data = await api.getDeals();
  if (data.success) {
    state.deals = data.deals;
    renderDealsScroll(data.deals);
  }
}

function renderDealsScroll(deals) {
  const container = document.getElementById('lightningDealsScroll');
  if (!container) return;

  container.innerHTML = deals.map(deal => `
    <div class="deal-item-mini" data-id="${deal.id}">
      <span class="deal-badge">${deal.badge || 'MEGA DEAL'}</span>
      <img src="${deal.thumbnail}" alt="${deal.title}" class="deal-thumb-img">
      <h4 class="deal-item-title">${deal.title}</h4>
      <div class="deal-price-row">
        <span class="deal-now-price">${formatPrice(deal.price)}</span>
        <span class="deal-old-price">${formatPrice(deal.originalPrice)}</span>
        <span class="deal-discount-pill">${deal.discountPercentage}% off</span>
      </div>
      <div class="claimed-progress-box">
        <div class="claimed-label">
          <span>Claimed</span>
          <span>${deal.dealClaimedPercent || 75}%</span>
        </div>
        <div class="claimed-bar-track">
          <div class="claimed-bar-fill" style="width: ${deal.dealClaimedPercent || 75}%"></div>
        </div>
      </div>
    </div>
  `).join('');

  container.querySelectorAll('.deal-item-mini').forEach(card => {
    card.addEventListener('click', () => {
      const id = card.getAttribute('data-id');
      openQuickViewModal(id);
    });
  });
}

// ==========================================================================
// PRODUCTS CATALOG & FILTERS
// ==========================================================================
async function fetchAndRenderProducts() {
  const grid = document.getElementById('productsGrid');
  const countDisplay = document.getElementById('resultsCountDisplay');

  if (grid) {
    grid.innerHTML = `
      <div style="grid-column: 1 / -1; text-align: center; padding: 40px; color: var(--text-muted);">
        <i class="bi bi-arrow-repeat" style="font-size: 32px; display: inline-block; animation: spin 1s infinite linear;"></i>
        <p style="margin-top: 10px; font-weight: 600;">Loading verified products from Navamart catalog...</p>
      </div>
    `;
  }

  const res = await api.getProducts({
    category: state.activeCategory,
    search: state.searchQuery,
    minPrice: state.minPrice,
    maxPrice: state.maxPrice,
    minRating: state.minRating,
    assured: state.onlyAssured,
    deal: state.onlyDeals,
    sort: state.sortBy
  });

  if (res.success) {
    let prods = res.products;
    if (state.onlyRentals) {
      const rentalIds = ['gam-1', 'gam-2', 'lap-1', 'lap-2', 'aud-1', 'aud-3'];
      prods = prods.filter(p => rentalIds.includes(p.id));
    }

    state.products = prods;
    if (countDisplay) {
      countDisplay.innerHTML = `Showing <strong>${prods.length}</strong> of <strong>${res.total}</strong> products`;
    }
    renderProductsGrid(prods);
  }
}

function renderProductsGrid(products) {
  const grid = document.getElementById('productsGrid');
  if (!grid) return;

  if (products.length === 0) {
    grid.innerHTML = `
      <div style="grid-column: 1 / -1; text-align: center; padding: 60px 20px; background: var(--bg-card); border-radius: var(--radius-lg); border: 1px dashed var(--border-color);">
        <i class="bi bi-search" style="font-size: 48px; color: var(--text-muted); margin-bottom: 14px; display: block;"></i>
        <h3 style="font-size: 18px; font-weight: 700; color: var(--text-dark); margin-bottom: 6px;">No products match your criteria</h3>
        <p style="color: var(--text-muted); font-size: 14px; margin-bottom: 16px;">Try adjusting your filters, clearing your search query, or checking back soon.</p>
        <button id="resetFiltersEmptyBtn" style="background: var(--primary-blue); color: #fff; font-weight: 700; padding: 10px 20px; border-radius: var(--radius-sm);">Reset All Filters</button>
      </div>
    `;
    const btn = document.getElementById('resetFiltersEmptyBtn');
    if (btn) btn.addEventListener('click', resetAllFilters);
    return;
  }

  grid.innerHTML = products.map(p => {
    const isWishlisted = state.wishlist.includes(p.id);
    const hasRent = Boolean(p.rentalAvailable || p.rentalDailyRate);
    const dailyRate = p.rentalDailyRate || 199;
    const ph = p.priceHistory || {
      lowestPrice: Math.round(p.price * 0.93),
      highestPrice: p.originalPrice || Math.round(p.price * 1.15),
      priceDrop: (p.originalPrice || p.price) - p.price,
      isAtLowest: false
    };

    return `
      <div class="product-card" data-id="${p.id}">
        <div class="card-top-tags">
          <span class="card-promo-badge">${p.badge || `${p.discountPercentage}% OFF`}</span>
          <div style="display: flex; gap: 6px; align-items: center;">
            ${hasRent ? `<span style="background: #dcfce7; color: #15803d; font-size: 10.5px; font-weight: 800; padding: 2px 6px; border-radius: 4px;" title="Rental Option Available">🔄 RENT: ₹${dailyRate}/d</span>` : ''}
            <button class="card-wishlist-toggle ${isWishlisted ? 'active' : ''}" data-id="${p.id}" title="${isWishlisted ? 'Remove from Wishlist' : 'Add to Wishlist'}">
              <i class="bi ${isWishlisted ? 'bi-heart-fill' : 'bi-heart'}"></i>
            </button>
          </div>
        </div>

        <div class="product-card-img-wrap" data-id="${p.id}">
          <img src="${p.thumbnail}" alt="${p.title}" class="product-card-img" loading="lazy">
        </div>

        <span class="product-card-category">${p.brand} • ${p.categoryName}</span>
        <h4 class="product-card-title" data-id="${p.id}" title="${p.title}">${p.title}</h4>

        <div class="product-card-rating">
          <span class="rating-badge">
            ${p.rating} <i class="bi bi-star-fill" style="font-size: 10px;"></i>
          </span>
          <span class="reviews-count-label">(${p.reviewsCount.toLocaleString()})</span>
          ${p.assured ? `<span class="navamart-assured-pill"><i class="bi bi-patch-check-fill" style="color: #ff9f00;"></i> Assured</span>` : ''}
        </div>

        <div class="product-card-pricing">
          <span class="current-price">${formatPrice(p.price)}</span>
          <span class="original-price">${formatPrice(p.originalPrice)}</span>
          <span class="discount-tag">${p.discountPercentage}% off</span>
        </div>

        <!-- Price History Volatility Bar (For Every Product) -->
        <div class="product-card-price-history" data-id="${p.id}" title="Click to view full price chart, all-time low & set drop alert">
          <span class="price-trend-badge ${ph.isAtLowest ? 'all-time-low' : 'price-drop'}">
            <i class="bi bi-graph-down-arrow"></i>
            ${ph.isAtLowest ? '⚡ Lowest Price Ever' : `📉 ${formatPrice(ph.priceDrop)} Drop`}
          </span>
          <span class="btn-card-history-link">
            <i class="bi bi-clock-history"></i> Price History <i class="bi bi-chevron-right" style="font-size: 9px;"></i>
          </span>
        </div>

        <div class="delivery-status-note" style="display: flex; justify-content: space-between; align-items: center;">
          <span><strong>Free Delivery</strong> by Tomorrow</span>
          <span style="color: var(--primary-blue); font-size: 11px; font-weight: 700; cursor: pointer;" onclick="openStoreInventoryModal('${p.id}')">
            <i class="bi bi-shop"></i> In Nearby Hubs
          </span>
        </div>

        <!-- Dual Action Buttons: Buy Now & Rent Option Side-by-Side -->
        <div class="card-actions-row">
          <button class="btn-card-buy" data-id="${p.id}" title="Buy Outright">
            <i class="bi bi-lightning-charge-fill"></i> Buy Now
          </button>
          ${hasRent ? `
            <button class="btn-card-rent" data-id="${p.id}" title="Rent this item from ₹${dailyRate}/day with zero lock-in">
              <i class="bi bi-arrow-repeat"></i> Rent (₹${dailyRate}/d)
            </button>
          ` : `
            <button class="btn-card-details" data-id="${p.id}" title="View Full Details">
              <i class="bi bi-eye"></i> Details
            </button>
          `}
          <button class="btn-card-bargain" data-id="${p.id}" title="🤝 Bargain Deal Live with AI">
            <i class="bi bi-tag-fill"></i>
          </button>
        </div>
      </div>
    `;
  }).join('');

  // 1. Buy Now button listener (adds to cart & opens drawer)
  grid.querySelectorAll('.btn-card-buy').forEach(btn => {
    btn.addEventListener('click', async (e) => {
      e.stopPropagation();
      const id = btn.getAttribute('data-id');
      await handleAddToCart(id);
    });
  });

  // 2. Rent option button listener (opens dedicated rental tenure selector modal)
  grid.querySelectorAll('.btn-card-rent').forEach(btn => {
    btn.addEventListener('click', (e) => {
      e.stopPropagation();
      const id = btn.getAttribute('data-id');
      openRentalQuickSelect(id);
    });
  });

  // 3. Details button listener
  grid.querySelectorAll('.btn-card-details').forEach(btn => {
    btn.addEventListener('click', (e) => {
      e.stopPropagation();
      const id = btn.getAttribute('data-id');
      openQuickViewModal(id);
    });
  });

  // 4. Bargain button listener
  grid.querySelectorAll('.btn-card-bargain').forEach(btn => {
    btn.addEventListener('click', (e) => {
      e.stopPropagation();
      const id = btn.getAttribute('data-id');
      const prod = products.find(p => p.id === id);
      if (prod) openBargainModal(prod.id, prod.title.replace(/'/g, "\\'"), prod.price);
    });
  });

  // 5. Price History click on product card
  grid.querySelectorAll('.product-card-price-history').forEach(el => {
    el.addEventListener('click', (e) => {
      e.stopPropagation();
      const id = el.getAttribute('data-id');
      openPriceHistoryModal(id);
    });
  });

  // 6. Wishlist toggle
  grid.querySelectorAll('.card-wishlist-toggle').forEach(btn => {
    btn.addEventListener('click', async (e) => {
      e.stopPropagation();
      const id = btn.getAttribute('data-id');
      await handleToggleWishlist(id, btn);
    });
  });

  // 7. Card image & title click opens Quick View
  grid.querySelectorAll('.product-card-img-wrap, .product-card-title').forEach(el => {
    el.addEventListener('click', () => {
      const id = el.getAttribute('data-id');
      openQuickViewModal(id);
    });
  });
}

function resetAllFilters() {
  state.activeCategory = 'all';
  state.searchQuery = '';
  state.minPrice = 0;
  state.maxPrice = 300000;
  state.minRating = 0;
  state.onlyAssured = false;
  state.onlyDeals = false;
  state.onlyRentals = false;
  state.sortBy = 'popular';

  const searchInput = document.getElementById('navSearchInput');
  if (searchInput) searchInput.value = '';
  const priceSlider = document.getElementById('priceRangeSlider');
  if (priceSlider) priceSlider.value = 300000;
  const maxPriceInput = document.getElementById('maxPriceInput');
  if (maxPriceInput) maxPriceInput.value = 300000;
  const assuredCheckbox = document.getElementById('assuredFilterCheck');
  if (assuredCheckbox) assuredCheckbox.checked = false;
  const dealsCheckbox = document.getElementById('dealsFilterCheck');
  if (dealsCheckbox) dealsCheckbox.checked = false;
  const rentCheckbox = document.getElementById('rentFilterCheck');
  if (rentCheckbox) rentCheckbox.checked = false;

  setCategoryFilter('all');
}

// ==========================================================================
// CART & DRAWER
// ==========================================================================
async function refreshCart() {
  const data = await api.getCart();
  if (data.success) {
    state.cart = data;
    updateCartUI();
  }
}

function updateCartUI() {
  const badge = document.getElementById('cartBadgeCount');
  const totalDisplay = document.getElementById('cartHeaderTotal');
  const drawerBody = document.getElementById('cartDrawerBody');
  const drawerFooter = document.getElementById('cartDrawerFooter');

  const count = state.cart.summary ? state.cart.summary.totalItemsCount || 0 : 0;
  const total = state.cart.summary ? state.cart.summary.total || 0 : 0;

  if (badge) badge.textContent = count;
  if (totalDisplay) totalDisplay.textContent = formatPrice(total);

  if (!drawerBody) return;

  if (!state.cart.items || state.cart.items.length === 0) {
    drawerBody.innerHTML = `
      <div class="cart-empty-state">
        <i class="bi bi-cart-x"></i>
        <h4 style="font-size: 18px; font-weight: 700; color: var(--text-dark); margin-bottom: 6px;">Your Navamart Cart is Empty</h4>
        <p style="font-size: 13px; margin-bottom: 20px;">Explore our top deals, rentals and price bargaining!</p>
        <button id="cartShopNowBtn" style="background: var(--accent-gold); color: #111827; font-weight: 800; padding: 10px 24px; border-radius: var(--radius-sm);">Shop Today's Deals</button>
      </div>
    `;
    const shopBtn = document.getElementById('cartShopNowBtn');
    if (shopBtn) shopBtn.addEventListener('click', closeCartDrawer);
    if (drawerFooter) drawerFooter.style.display = 'none';
    return;
  }

  if (drawerFooter) drawerFooter.style.display = 'block';

  // Render Items
  drawerBody.innerHTML = `
    <div class="cart-items-list">
      ${state.cart.items.map(item => `
        <div class="cart-item-row" data-id="${item.productId}">
          <img src="${item.product ? item.product.thumbnail : 'assets/products/iphone-16-pro.jpg'}" alt="${item.product ? item.product.title : 'Product'}" class="cart-item-thumb">
          <div class="cart-item-info">
            <h5 class="cart-item-title">${item.product ? item.product.title : 'Item'}</h5>
            ${item.isRental ? `
              <div style="background: #dcfce7; color: #15803d; font-size: 11px; font-weight: 800; display: inline-block; padding: 2px 6px; border-radius: 4px; margin-bottom: 4px;">
                🔄 RENTAL: ${item.tenure} (${item.days} Days) • Security Deposit: ${formatPrice(item.securityDeposit)}
              </div>
            ` : (item.color ? `<div class="cart-item-variant">Color: <strong>${item.color}</strong></div>` : '')}
            
            <div class="cart-item-price">${formatPrice(item.isRental ? item.totalRent : (item.product ? item.product.price : item.price))}</div>
            <div class="cart-item-controls">
              <div class="qty-stepper">
                <button class="qty-btn btn-cart-dec" data-id="${item.productId}" data-qty="${item.quantity}">-</button>
                <span class="qty-display">${item.quantity}</span>
                <button class="qty-btn btn-cart-inc" data-id="${item.productId}" data-qty="${item.quantity}">+</button>
              </div>
              <button class="cart-item-remove-btn" data-id="${item.productId}">
                <i class="bi bi-trash"></i> Remove
              </button>
            </div>
          </div>
        </div>
      `).join('')}
    </div>

    <!-- Promo Coupon Box -->
    <div class="coupon-box">
      <div style="font-size: 12px; font-weight: 700; color: var(--text-dark); margin-bottom: 6px;">Have a Promo or Negotiated Voucher?</div>
      <div class="coupon-input-wrap">
        <input type="text" id="couponCodeInput" class="coupon-input" placeholder="e.g. NAVAFIRST or DEAL-XXXX" value="${state.cart.summary.couponCode || ''}">
        <button id="applyCouponBtn" class="coupon-apply-btn">Apply</button>
      </div>
      ${state.cart.summary.couponCode ? `
        <div class="coupon-applied-tag">
          <span><i class="bi bi-tag-fill"></i> Voucher <strong>${state.cart.summary.couponCode}</strong> applied!</span>
          <button id="removeCouponBtn" style="color: #ef4444; font-weight: bold; margin-left: 8px;">✕</button>
        </div>
      ` : `
        <div style="font-size: 11px; color: var(--text-muted); margin-top: 6px;">
          Available: <strong>NAVAFIRST</strong> (20% Off), <strong>SUPER500</strong> (Flat ₹500), <strong>FREESHIP</strong>
        </div>
      `}
    </div>
  `;

  // Render Footer Summary
  if (drawerFooter) {
    const s = state.cart.summary;
    drawerFooter.innerHTML = `
      ${s.totalSavings > 0 ? `
        <div class="cart-savings-banner">
          <i class="bi bi-check-circle-fill"></i> You are saving <strong>${formatPrice(s.totalSavings)}</strong> on this order!
        </div>
      ` : ''}

      <div class="cart-summary-row">
        <span>Price (${s.totalItemsCount} items)</span>
        <span>${formatPrice(s.originalSubtotal || s.subtotal)}</span>
      </div>

      ${s.totalSecurityDeposit > 0 ? `
        <div class="cart-summary-row" style="color: #059669;">
          <span>Refundable Rental Deposit</span>
          <span>+ ${formatPrice(s.totalSecurityDeposit)}</span>
        </div>
      ` : ''}

      ${s.couponDiscount > 0 ? `
        <div class="cart-summary-row" style="color: var(--accent-green);">
          <span>Coupon (${s.couponCode})</span>
          <span>- ${formatPrice(s.couponDiscount)}</span>
        </div>
      ` : ''}

      <div class="cart-summary-row">
        <span>Delivery Charges</span>
        <span>${s.deliveryFee === 0 ? '<strong style="color: var(--accent-green);">FREE</strong>' : formatPrice(s.deliveryFee)}</span>
      </div>

      <div class="cart-summary-row total-row">
        <span>Total Amount</span>
        <span>${formatPrice(s.total)}</span>
      </div>

      <button id="proceedToCheckoutBtn" class="btn-checkout-drawer" style="margin-top: 14px;">
        <i class="bi bi-shield-check"></i> PROCEED TO CHECKOUT
      </button>
    `;

    const checkoutBtn = document.getElementById('proceedToCheckoutBtn');
    if (checkoutBtn) {
      checkoutBtn.addEventListener('click', () => {
        closeCartDrawer();
        openCheckoutModal();
      });
    }
  }

  drawerBody.querySelectorAll('.btn-cart-dec').forEach(btn => {
    btn.addEventListener('click', async () => {
      const id = btn.getAttribute('data-id');
      const cur = parseInt(btn.getAttribute('data-qty'));
      await api.updateCartItem(id, cur - 1);
      await refreshCart();
    });
  });

  drawerBody.querySelectorAll('.btn-cart-inc').forEach(btn => {
    btn.addEventListener('click', async () => {
      const id = btn.getAttribute('data-id');
      const cur = parseInt(btn.getAttribute('data-qty'));
      await api.updateCartItem(id, cur + 1);
      await refreshCart();
    });
  });

  drawerBody.querySelectorAll('.cart-item-remove-btn').forEach(btn => {
    btn.addEventListener('click', async () => {
      const id = btn.getAttribute('data-id');
      await api.removeCartItem(id);
      showToast('Item removed from cart', 'info');
      await refreshCart();
    });
  });

  const applyBtn = document.getElementById('applyCouponBtn');
  if (applyBtn) {
    applyBtn.addEventListener('click', async () => {
      const input = document.getElementById('couponCodeInput');
      const code = input ? input.value.trim() : '';
      if (!code) return;
      const res = await api.applyCoupon(code);
      if (res.success) {
        showToast(res.message, 'success', 'bi-tag-fill');
        await refreshCart();
      } else {
        showToast(res.message, 'error', 'bi-exclamation-triangle');
      }
    });
  }

  const removeCouponBtn = document.getElementById('removeCouponBtn');
  if (removeCouponBtn) {
    removeCouponBtn.addEventListener('click', async () => {
      await api.applyCoupon('');
      showToast('Coupon removed', 'info');
      await refreshCart();
    });
  }
}

async function handleAddToCart(productId, quantity = 1, color = null, size = null) {
  const res = await api.addToCart({ productId, quantity, color, size });
  if (res.success) {
    showToast(res.message, 'success', 'bi-cart-check-fill');
    await refreshCart();
    openCartDrawer();
  }
}

function openCartDrawer() {
  const overlay = document.getElementById('cartDrawerOverlay');
  const drawer = document.getElementById('cartDrawer');
  if (overlay && drawer) {
    overlay.classList.add('active');
    drawer.classList.add('active');
  }
}

function closeCartDrawer() {
  const overlay = document.getElementById('cartDrawerOverlay');
  const drawer = document.getElementById('cartDrawer');
  if (overlay && drawer) {
    overlay.classList.remove('active');
    drawer.classList.remove('active');
  }
}

// ==========================================================================
// WISHLIST
// ==========================================================================
async function refreshWishlist() {
  const res = await api.getWishlist();
  if (res.success) {
    state.wishlist = res.items.map(i => i.id);
    const badge = document.getElementById('wishlistBadgeCount');
    if (badge) badge.textContent = res.count;
  }
}

async function handleToggleWishlist(productId, btnElement) {
  const res = await api.toggleWishlist(productId);
  if (res.success) {
    if (res.added) {
      state.wishlist.push(productId);
      if (btnElement) {
        btnElement.classList.add('active');
        btnElement.innerHTML = `<i class="bi bi-heart-fill"></i>`;
      }
      showToast(res.message, 'success', 'bi-heart-fill');
    } else {
      state.wishlist = state.wishlist.filter(id => id !== productId);
      if (btnElement) {
        btnElement.classList.remove('active');
        btnElement.innerHTML = `<i class="bi bi-heart"></i>`;
      }
      showToast(res.message, 'info', 'bi-heart');
    }
    const badge = document.getElementById('wishlistBadgeCount');
    if (badge) badge.textContent = res.wishlistCount;
  }
}

// ==========================================================================
// QUICK VIEW MODAL & PRODUCT DETAIL (WITH RENT & BARGAIN)
// ==========================================================================
async function openQuickViewModal(productId) {
  const modal = document.getElementById('quickViewModal');
  const content = document.getElementById('quickViewContent');
  if (!modal || !content) return;

  content.innerHTML = `
    <div style="padding: 60px; text-align: center; color: var(--text-muted);">
      <i class="bi bi-arrow-repeat" style="font-size: 36px; animation: spin 1s infinite linear; display: inline-block;"></i>
      <p style="margin-top: 12px; font-weight: 600;">Loading product specifications and real-time inventory...</p>
    </div>
  `;
  modal.classList.add('active');

  const res = await api.getProductById(productId);
  if (!res.success || !res.product) {
    content.innerHTML = `<div style="padding: 40px; text-align: center;">Product details unavailable.</div>`;
    return;
  }

  const p = res.product;
  const rentalInfo = res.rentalInfo;
  state.activeQuickViewProduct = p;
  state.activeQuickViewTab = 'buy';

  content.innerHTML = `
    <div class="quick-view-grid">
      <!-- Gallery Left -->
      <div class="modal-gallery-left">
        <div class="modal-main-img-box">
          <img id="modalMainImage" src="${p.thumbnail}" alt="${p.title}" class="modal-main-img">
        </div>

        <div style="display: flex; gap: 8px; flex-wrap: wrap;">
          <!-- Bargain Button -->
          <button class="bargain-btn-trigger" onclick="openBargainModal('${p.id}', '${p.title.replace(/'/g, "\\'")}', ${p.price})">
            <i class="bi bi-tag-fill"></i> 🤝 Bargain Price Live
          </button>
          
          <!-- Nearby Store Check -->
          <button style="background: var(--bg-main); border: 1px solid var(--border-color); color: var(--text-dark); font-weight: 700; font-size: 13px; padding: 10px 14px; border-radius: var(--radius-md); display: flex; align-items: center; gap: 6px;" onclick="openStoreInventoryModal('${p.id}')">
            <i class="bi bi-shop"></i> In Nearby Stores
          </button>
        </div>

        <div style="background: rgba(40, 116, 240, 0.06); border-radius: var(--radius-md); padding: 12px; font-size: 12px; color: var(--text-dark); border: 1px solid rgba(40,116,240,0.15);">
          <i class="bi bi-shield-check" style="color: var(--primary-blue); font-size: 16px; vertical-align: middle;"></i>
          <strong>NAVAMART Assured™</strong>: 100% Genuine • 7 Days Replacement • Founder Support Hotline (+91 7418362054)
        </div>
      </div>

      <!-- Details Right -->
      <div class="modal-details-right">
        <div class="modal-product-brand">${p.brand} • ${p.categoryName}</div>
        <h2 class="modal-product-title">${p.title}</h2>

        <div class="product-card-rating" style="margin-bottom: 12px;">
          <span class="rating-badge" style="font-size: 13px; padding: 3px 8px;">
            ${p.rating} <i class="bi bi-star-fill" style="font-size: 11px;"></i>
          </span>
          <span class="reviews-count-label"><strong>${p.reviewsCount.toLocaleString()}</strong> Ratings & Verified Reviews</span>
        </div>

        <!-- Dual Pricing: Outright Purchase & Flexible Rental Side-by-Side -->
        <div class="modal-pricing-dual-card">
          <div class="dual-pricing-buy">
            <div style="font-size: 11px; font-weight: 800; color: var(--text-muted); text-transform: uppercase;">1. Outright Purchase</div>
            <div style="display: flex; align-items: baseline; gap: 8px; margin-top: 2px;">
              <span class="current-price" style="font-size: 24px;">${formatPrice(p.price)}</span>
              <span class="original-price" style="font-size: 15px;">${formatPrice(p.originalPrice)}</span>
              <span class="discount-tag" style="font-size: 14px;">${p.discountPercentage}% off</span>
            </div>
          </div>
          ${rentalInfo ? `
            <div class="dual-pricing-divider">OR</div>
            <div class="dual-pricing-rent">
              <div style="font-size: 11px; font-weight: 800; color: #15803d; text-transform: uppercase;">2. Flexible Rental</div>
              <div style="display: flex; align-items: baseline; gap: 4px; justify-content: flex-end; margin-top: 2px;">
                <span style="font-size: 22px; font-weight: 900; color: #15803d;">₹${rentalInfo.dailyRate}</span>
                <span style="font-size: 12px; color: var(--text-muted);">/ day</span>
              </div>
              <div style="font-size: 11px; color: var(--text-muted);">Refundable Deposit: ${formatPrice(rentalInfo.securityDeposit)}</div>
            </div>
          ` : ''}
        </div>

        <!-- Price History Volatility Bar (For Every Product) -->
        <div class="modal-price-history-bar" onclick="openPriceHistoryModal('${p.id}')" title="Click to view multi-month price chart & set drop alert">
          <div style="display: flex; align-items: center; gap: 8px;">
            <span class="price-trend-badge ${p.priceHistory && p.priceHistory.isAtLowest ? 'all-time-low' : 'price-drop'}">
              <i class="bi bi-graph-down-arrow"></i>
              ${p.priceHistory && p.priceHistory.isAtLowest ? 'All-Time Low Price' : `📉 ${formatPrice(p.priceHistory ? p.priceHistory.priceDrop : (p.originalPrice - p.price))} Off Peak`}
            </span>
            <span style="font-size: 12px; color: var(--text-main);">
              Lowest: <strong>${formatPrice(p.priceHistory ? p.priceHistory.lowestPrice : Math.round(p.price * 0.93))}</strong> • Avg: ${formatPrice(p.priceHistory ? p.priceHistory.averagePrice : p.price)}
            </span>
          </div>
          <button type="button" style="background: var(--primary-blue); color: #fff; font-size: 11px; font-weight: 700; padding: 5px 12px; border-radius: 4px; border: none; cursor: pointer; display: flex; align-items: center; gap: 4px;">
            <i class="bi bi-clock-history"></i> View Price History Chart
          </button>
        </div>

        <!-- Action Row: Buy Now, Add to Cart, and Rent Option Side-by-Side -->
        <div class="modal-cta-row-three">
          <button id="modalBuyNowBtn" class="btn-buy-now" title="Buy outright">
            <i class="bi bi-lightning-charge-fill"></i> BUY NOW (${formatPrice(p.price)})
          </button>
          <button id="modalAddToCartBtn" class="btn-modal-cart" title="Add to Cart">
            <i class="bi bi-cart-plus-fill"></i> ADD TO CART
          </button>
          ${rentalInfo ? `
            <button id="modalRentNowDirectBtn" class="btn-modal-rent" onclick="openRentalQuickSelect('${p.id}')" title="Rent from ₹${rentalInfo.dailyRate}/day with zero lock-in">
              <i class="bi bi-arrow-repeat"></i> RENT (₹${rentalInfo.dailyRate}/d)
            </button>
          ` : ''}
        </div>

        ${p.highlights ? `
          <div style="margin-top: 18px;">
            <div style="font-size: 13px; font-weight: 700; margin-bottom: 6px;">Key Highlights:</div>
            <ul style="padding-left: 20px; font-size: 12.5px; color: var(--text-main); line-height: 1.6;">
              ${p.highlights.map(h => `<li>${h}</li>`).join('')}
            </ul>
          </div>
        ` : ''}

        <!-- Proof-Based Reviews Section -->
        <div style="margin-top: 24px; border-top: 1px solid var(--border-light); padding-top: 18px;">
          <div style="display: flex; justify-content: space-between; align-items: center; margin-bottom: 14px;">
            <h4 style="font-size: 15px; font-weight: 800; color: var(--text-dark);">
              Verified Reviews with Purchase Proof
            </h4>
            <span class="proof-verified-badge"><i class="bi bi-shield-check"></i> Proof Verified</span>
          </div>

          <!-- Customer Reviews List -->
          <div class="customer-reviews-box" style="display: flex; flex-direction: column; gap: 12px;">
            ${p.reviews && p.reviews.length ? p.reviews.map((r, rIdx) => `
              <div style="background: var(--bg-main); border-radius: var(--radius-md); padding: 14px; border: 1px solid var(--border-light);">
                <div style="display: flex; justify-content: space-between; align-items: center; margin-bottom: 6px;">
                  <span class="rating-badge">${r.rating} ★</span>
                  <span style="font-size: 11px; color: var(--text-muted);">${r.date}</span>
                </div>
                <div style="font-size: 13.5px; font-weight: 700; color: var(--text-dark);">${r.title}</div>
                <p style="font-size: 12.5px; color: var(--text-main); margin: 4px 0;">${r.comment}</p>

                <!-- Proof image display if uploaded -->
                ${r.proofPhoto ? `
                  <div style="margin: 8px 0;">
                    <span style="font-size: 11px; font-weight: 700; color: var(--text-muted); display: block; margin-bottom: 4px;">📸 Verified Unboxing Proof:</span>
                    <img src="${r.proofPhoto}" alt="Proof" class="review-proof-thumb" onclick="window.open(this.src)">
                  </div>
                ` : ''}

                <div style="display: flex; justify-content: space-between; align-items: center; margin-top: 8px; font-size: 11.5px;">
                  <span style="color: var(--accent-green); font-weight: 700;">
                    <i class="bi bi-patch-check-fill"></i> ${r.user} • ${r.verifiedProof ? 'Verified Proof Buyer' : 'Verified Purchase'}
                  </span>
                  <button style="color: var(--text-muted); font-size: 11.5px; font-weight: 600;" onclick="handleVoteReview('${p.id}', ${rIdx}, this)">
                    <i class="bi bi-hand-thumbs-up"></i> Helpful (${r.helpfulCount || 12})
                  </button>
                </div>
              </div>
            `).join('') : '<p style="font-size: 12px; color: var(--text-muted);">No reviews written yet.</p>'}
          </div>

          <!-- Leave Proof-Based Review Form -->
          <div style="margin-top: 18px; background: var(--bg-card); border: 1px solid var(--border-color); border-radius: var(--radius-md); padding: 16px;">
            <h5 style="font-size: 13px; font-weight: 800; margin-bottom: 10px;">
              <i class="bi bi-camera-fill" style="color: var(--primary-blue);"></i> Add Review with Photo Proof
            </h5>
            <div style="display: flex; gap: 8px; margin-bottom: 8px;">
              <input type="text" id="reviewAuthorInput" class="form-control" placeholder="Your Name" style="font-size: 12px; padding: 6px 10px;" value="${state.currentUser ? state.currentUser.name : ''}">
              <select id="reviewRatingSelect" class="form-control" style="font-size: 12px; padding: 6px 10px; max-width: 110px;">
                <option value="5">5 ★ (Best)</option>
                <option value="4">4 ★ (Good)</option>
                <option value="3">3 ★ (Average)</option>
              </select>
            </div>
            <textarea id="reviewCommentInput" class="form-control" placeholder="Describe your unboxing and real usage experience..." rows="2" style="font-size: 12px; margin-bottom: 8px;"></textarea>
            
            <div style="display: flex; gap: 8px; align-items: center; margin-bottom: 10px; flex-wrap: wrap;">
              <input type="text" id="reviewOrderIdInput" class="form-control" placeholder="Order ID (e.g. NM-2026-94812)" style="font-size: 12px; flex: 1;">
              <label style="font-size: 11.5px; background: var(--bg-main); border: 1px dashed var(--border-color); padding: 6px 12px; border-radius: 4px; cursor: pointer; display: flex; align-items: center; gap: 6px;">
                <i class="bi bi-upload"></i> <span id="proofFileNameLabel">Attach Unboxing Photo</span>
                <input type="file" id="reviewProofPhotoInput" accept="image/*" style="display: none;" onchange="handleProofFileSelected(this)">
              </label>
            </div>

            <button id="submitReviewBtn" style="background: var(--primary-blue); color: #fff; font-size: 12px; font-weight: 700; padding: 8px 16px; border-radius: 4px;">
              Submit Proof-Verified Review
            </button>
          </div>
        </div>
      </div>
    </div>
  `;

  // Buy Now and Add to Cart event listeners
  const buyNow = document.getElementById('modalBuyNowBtn');
  if (buyNow) {
    buyNow.addEventListener('click', async () => {
      modal.classList.remove('active');
      await api.addToCart({ productId: p.id, quantity: 1 });
      await refreshCart();
      openCheckoutModal();
    });
  }

  const addCart = document.getElementById('modalAddToCartBtn');
  if (addCart) {
    addCart.addEventListener('click', async () => {
      modal.classList.remove('active');
      await handleAddToCart(p.id, 1);
    });
  }

  const submitRev = document.getElementById('submitReviewBtn');
  if (submitRev) {
    submitRev.addEventListener('click', async () => {
      const name = document.getElementById('reviewAuthorInput').value.trim();
      const stars = document.getElementById('reviewRatingSelect').value;
      const text = document.getElementById('reviewCommentInput').value.trim();
      const orderId = document.getElementById('reviewOrderIdInput').value.trim();

      if (!name || !text) {
        showToast('Please provide your name and review comment', 'error');
        return;
      }

      const revRes = await api.addReviewWithProof(p.id, {
        user: name,
        rating: stars,
        title: 'Verified Buyer Unboxing',
        comment: text,
        orderId: orderId || ('NM-' + Math.floor(10000 + Math.random() * 90000)),
        hasProof: true,
        proofPhoto: window._selectedProofBase64 || p.thumbnail
      });

      if (revRes.success) {
        showToast('Proof-Verified review posted! Thank you.', 'success', 'bi-shield-check');
        openQuickViewModal(p.id);
        fetchAndRenderProducts();
      }
    });
  }
}

function switchProductTab(tab) {
  state.activeQuickViewTab = tab;
  const buyBox = document.getElementById('buyModePricingBox');
  const rentBox = document.getElementById('rentalModePricingBox');
  const buyOpt = document.getElementById('tabBuyOpt');
  const rentOpt = document.getElementById('tabRentOpt');

  if (tab === 'buy') {
    if (buyBox) buyBox.style.display = 'block';
    if (rentBox) rentBox.style.display = 'none';
    if (buyOpt) buyOpt.classList.add('active');
    if (rentOpt) rentOpt.classList.remove('active');
  } else {
    if (buyBox) buyBox.style.display = 'none';
    if (rentBox) rentBox.style.display = 'block';
    if (buyOpt) buyOpt.classList.remove('active');
    if (rentOpt) rentOpt.classList.add('active');
  }
}

function selectRentalPlan(element, days, rent, tenure) {
  document.querySelectorAll('.rental-pill').forEach(p => p.classList.remove('active'));
  element.classList.add('active');
  state.selectedRentalTenure = tenure;
  element.setAttribute('data-days', days);
  element.setAttribute('data-rent', rent);
  const btn = document.getElementById('modalRentNowBtn');
  if (btn) btn.innerHTML = `<i class="bi bi-arrow-repeat"></i> RENT NOW (${tenure} - ${formatPrice(rent)})`;
}

async function handleRentContractSubmit(productId) {
  const modal = document.getElementById('quickViewModal');
  const res = await api.getProductById(productId);
  const rPlan = res.rentalInfo;
  if (!rPlan) return;

  const activePill = document.querySelector('.rental-pill.active');
  const tenure = activePill ? activePill.getAttribute('data-tenure') : '7 Days';
  const days = activePill ? parseInt(activePill.getAttribute('data-days')) : 7;
  const totalRent = activePill ? parseInt(activePill.getAttribute('data-rent')) : (rPlan.dailyRate * days);

  const cartRes = await api.addToCart({
    productId,
    quantity: 1,
    isRental: true,
    tenure,
    days,
    dailyRate: rPlan.dailyRate,
    securityDeposit: rPlan.securityDeposit,
    totalRent
  });

  if (cartRes.success) {
    if (modal) modal.classList.remove('active');
    showToast(`Added ${res.product.title} (${tenure} Rental) to cart!`, 'success', 'bi-arrow-repeat');
    await refreshCart();
    openCartDrawer();
  }
}

function handleProofFileSelected(input) {
  if (input.files && input.files[0]) {
    const file = input.files[0];
    const label = document.getElementById('proofFileNameLabel');
    if (label) label.textContent = file.name;

    const reader = new FileReader();
    reader.onload = function(e) {
      window._selectedProofBase64 = e.target.result;
    };
    reader.readAsDataURL(file);
  }
}

async function handleVoteReview(productId, reviewIndex, btn) {
  const res = await api.voteReviewHelpful(productId, reviewIndex);
  if (res.success) {
    btn.innerHTML = `<i class="bi bi-hand-thumbs-up-fill" style="color: var(--primary-blue);"></i> Helpful (${res.helpfulCount})`;
    showToast('Marked review as helpful!', 'info', 'bi-hand-thumbs-up-fill');
  }
}

function closeQuickViewModal() {
  const modal = document.getElementById('quickViewModal');
  if (modal) modal.classList.remove('active');
}

// ==========================================================================
// FEATURE: PRICE HISTORY & VOLATILITY TRACKER (For Every Product)
// ==========================================================================
async function openPriceHistoryModal(productId) {
  const modal = document.getElementById('priceHistoryModal');
  const content = document.getElementById('priceHistoryModalContent');
  if (!modal || !content) return;

  modal.classList.add('active');
  content.innerHTML = `
    <div style="padding: 50px; text-align: center; color: var(--text-muted);">
      <i class="bi bi-arrow-repeat" style="font-size: 32px; animation: spin 1s infinite linear; display: inline-block;"></i>
      <p style="margin-top: 10px; font-weight: 600;">Analyzing historical pricing data & market trends...</p>
    </div>
  `;

  let prod = state.products.find(p => p.id === productId);
  let rentalInfo = null;
  if (!prod || !prod.priceHistory) {
    const res = await api.getProductById(productId);
    if (res.success && res.product) {
      prod = res.product;
      rentalInfo = res.rentalInfo;
    }
  }

  if (!prod) {
    content.innerHTML = `<div style="padding: 30px; text-align: center;">Price history not available.</div>`;
    return;
  }

  const orig = prod.originalPrice || Math.round(prod.price * 1.15);
  const cur = prod.price;
  const ph = prod.priceHistory || {
    lowestPrice: Math.round(cur * 0.93),
    highestPrice: orig,
    averagePrice: Math.round((orig + cur) / 2),
    currentPrice: cur,
    priceDrop: orig - cur,
    dropPercent: Math.round(((orig - cur) / orig) * 100),
    isAtLowest: cur <= Math.round(cur * 0.93 * 1.05),
    timeline: [
      { label: "3 Months Ago", date: "Jul 2026", price: orig, note: "Launch MSRP" },
      { label: "2 Months Ago", date: "Aug 2026", price: Math.round(orig * 0.97), note: "Standard Retail" },
      { label: "Last Month", date: "Sep 2026", price: Math.round(cur * 1.06), note: "Pre-Festive" },
      { label: "Festival Steal", date: "Oct 1", price: Math.round(cur * 0.93), note: "All-Time Low" },
      { label: "Today", date: "Current", price: cur, note: "Today's Price" }
    ]
  };

  const timeline = ph.timeline;
  const minPrice = Math.min(...timeline.map(t => t.price));
  const maxPrice = Math.max(...timeline.map(t => t.price));
  const priceRange = Math.max(1, maxPrice - minPrice);

  // SVG Chart Dimensions
  const chartWidth = 560;
  const chartHeight = 120;
  const paddingX = 40;
  const paddingY = 22;
  const points = timeline.map((t, idx) => {
    const x = paddingX + (idx / (timeline.length - 1)) * (chartWidth - 2 * paddingX);
    const normalizedY = (t.price - minPrice) / priceRange;
    const y = paddingY + (1 - normalizedY) * (chartHeight - 2 * paddingY);
    return { x: Math.round(x), y: Math.round(y), ...t };
  });

  const polylinePoints = points.map(p => `${p.x},${p.y}`).join(' ');
  const areaPoints = `${points[0].x},${chartHeight + 10} ` + polylinePoints + ` ${points[points.length - 1].x},${chartHeight + 10}`;

  content.innerHTML = `
    <!-- Modal Header -->
    <div class="ph-header-row">
      <img src="${prod.thumbnail}" alt="${prod.title}" class="ph-thumb-img">
      <div class="ph-header-info">
        <div class="ph-header-brand">${prod.brand} • ${prod.categoryName}</div>
        <h3 class="ph-header-title">${prod.title}</h3>
        <div class="ph-header-pricing">
          <span class="ph-current-price">${formatPrice(cur)}</span>
          <span class="ph-original-price">${formatPrice(orig)}</span>
          <span class="discount-tag">${prod.discountPercentage}% off</span>
        </div>
      </div>
    </div>

    <!-- 4 Key Stat Cards -->
    <div class="ph-stats-grid">
      <div class="ph-stat-card lowest">
        <div class="ph-stat-label"><i class="bi bi-graph-down-arrow"></i> All-Time Low</div>
        <div class="ph-stat-val">${formatPrice(ph.lowestPrice)}</div>
        <div class="ph-stat-sub">Record lowest price</div>
      </div>
      <div class="ph-stat-card highest">
        <div class="ph-stat-label"><i class="bi bi-graph-up-arrow"></i> Highest (MSRP)</div>
        <div class="ph-stat-val">${formatPrice(ph.highestPrice)}</div>
        <div class="ph-stat-sub">Launch peak price</div>
      </div>
      <div class="ph-stat-card">
        <div class="ph-stat-label"><i class="bi bi-bar-chart-line"></i> 30-Day Average</div>
        <div class="ph-stat-val">${formatPrice(ph.averagePrice)}</div>
        <div class="ph-stat-sub">Typical market price</div>
      </div>
      <div class="ph-stat-card savings">
        <div class="ph-stat-label"><i class="bi bi-piggy-bank"></i> Peak Drop</div>
        <div class="ph-stat-val">${formatPrice(ph.priceDrop)}</div>
        <div class="ph-stat-sub">Save ${ph.dropPercent}% vs peak</div>
      </div>
    </div>

    <!-- Verdict Banner -->
    <div class="ph-verdict-banner">
      <i class="bi ${ph.isAtLowest ? 'bi-stars' : 'bi-check-circle-fill'}"></i>
      <div>
        <div class="ph-verdict-title">${ph.isAtLowest ? '⚡ BEST TIME TO BUY — AT ALL-TIME LOW!' : '🟢 STRONG BUY RECOMMENDATION'}</div>
        <div class="ph-verdict-desc">
          Current price of <strong>${formatPrice(cur)}</strong> is <strong>${formatPrice(ph.highestPrice - cur)}</strong> below peak price and significantly better than the 30-day average of ${formatPrice(ph.averagePrice)}.
        </div>
      </div>
    </div>

    <!-- Interactive Price Trend Graph & Timeline -->
    <div class="ph-chart-container">
      <div class="ph-chart-title-row">
        <span class="ph-chart-title"><i class="bi bi-graph-up" style="color: var(--primary-blue);"></i> Historical Price Trajectory (Every Milestone Tracked)</span>
        <span style="font-size: 11.5px; color: var(--text-muted);"><i class="bi bi-shield-check" style="color: var(--accent-green);"></i> Verified by NAVAMART Pricing Engine</span>
      </div>

      <div style="width: 100%; overflow-x: auto;">
        <svg viewBox="0 0 ${chartWidth} ${chartHeight + 20}" style="width: 100%; height: 160px; display: block; overflow: visible;">
          <defs>
            <linearGradient id="priceGradient" x1="0" y1="0" x2="0" y2="1">
              <stop offset="0%" stop-color="#2563eb" stop-opacity="0.35"/>
              <stop offset="100%" stop-color="#2563eb" stop-opacity="0.0"/>
            </linearGradient>
          </defs>

          <!-- Grid Lines -->
          <line x1="20" y1="${paddingY}" x2="${chartWidth - 20}" y2="${paddingY}" stroke="#e2e8f0" stroke-dasharray="3,3" />
          <line x1="20" y1="${chartHeight / 2}" x2="${chartWidth - 20}" y2="${chartHeight / 2}" stroke="#e2e8f0" stroke-dasharray="3,3" />
          <line x1="20" y1="${chartHeight + 5}" x2="${chartWidth - 20}" y2="${chartHeight + 5}" stroke="#cbd5e1" stroke-width="1.5" />

          <!-- Filled Area Under Curve -->
          <polygon points="${areaPoints}" fill="url(#priceGradient)" />

          <!-- Price Polyline Curve -->
          <polyline points="${polylinePoints}" fill="none" stroke="#2563eb" stroke-width="3" stroke-linecap="round" stroke-linejoin="round" />

          <!-- Node Circles & Value Labels -->
          ${points.map((pt, i) => `
            <g class="chart-point-group" style="cursor: pointer;">
              <circle cx="${pt.x}" cy="${pt.y}" r="${i === points.length - 1 ? 6.5 : (pt.price === minPrice ? 6.5 : 4.5)}" fill="${pt.price === minPrice ? '#10b981' : (i === points.length - 1 ? '#ef4444' : '#2563eb')}" stroke="#ffffff" stroke-width="2.5" />
              <text x="${pt.x}" y="${pt.y - 10}" text-anchor="middle" font-size="11" font-weight="800" fill="#1e293b">₹${(pt.price).toLocaleString('en-IN')}</text>
            </g>
          `).join('')}
        </svg>
      </div>

      <!-- 5 Timeline Milestone Nodes -->
      <div class="ph-chart-timeline-nodes">
        ${timeline.map((node, i) => {
          const isLowest = node.price === minPrice;
          const isCur = i === timeline.length - 1;
          return `
            <div class="ph-timeline-node ${isLowest ? 'lowest' : ''} ${isCur ? 'current' : ''}">
              <div class="ph-node-label">${node.label}</div>
              <div class="ph-node-price">${formatPrice(node.price)}</div>
              <div class="ph-node-date">${node.date}</div>
              <span class="ph-node-tag">${node.note}</span>
            </div>
          `;
        }).join('')}
      </div>
    </div>

    <!-- Price Drop Alert Form -->
    <div class="ph-alert-card">
      <div class="ph-alert-title">
        <i class="bi bi-bell-fill" style="color: #ea580c;"></i> Set Price Drop Alert (Instant Carrier SMS/WhatsApp)
      </div>
      <div class="ph-alert-desc">
        We track price drops 24/7. When price hits or drops below your target, you and the Founder (+91 7418362054) will receive instant alerts.
      </div>
      <div class="ph-alert-form-row">
        <div style="flex: 1; min-width: 160px;">
          <label style="font-size: 11px; font-weight: 700; color: var(--text-muted); display: block; margin-bottom: 2px;">Target Alert Price (₹):</label>
          <input type="number" id="phTargetPriceInput" class="form-control" value="${Math.round(cur * 0.95)}" style="font-size: 13px; font-weight: 700;">
        </div>
        <div style="flex: 1.2; min-width: 180px;">
          <label style="font-size: 11px; font-weight: 700; color: var(--text-muted); display: block; margin-bottom: 2px;">Your Mobile / Email:</label>
          <input type="text" id="phContactInput" class="form-control" value="${state.currentUser ? state.currentUser.identifier : '+91 98765 43210'}" style="font-size: 13px;">
        </div>
        <div style="display: flex; align-items: flex-end;">
          <button id="phSetAlertBtn" class="ph-alert-btn" onclick="handleSetPriceAlert('${prod.id}')">
            <i class="bi bi-bell"></i> Set Price Alert
          </button>
        </div>
      </div>
    </div>

    <!-- Dual Actions at bottom: Buy Now and Rent Option Side-by-Side -->
    <div class="ph-cta-row">
      <button style="flex: 1.2; background: linear-gradient(135deg, var(--accent-red) 0%, #ea580c 100%); color: #fff; font-weight: 800; font-size: 14px; padding: 12px 16px; border-radius: var(--radius-sm); border: none; cursor: pointer; display: flex; align-items: center; justify-content: center; gap: 6px;" onclick="closePriceHistoryModal(); handleAddToCart('${prod.id}');">
        <i class="bi bi-lightning-charge-fill"></i> BUY NOW (${formatPrice(cur)})
      </button>
      <button style="flex: 1; background: var(--accent-gold); color: #111827; font-weight: 800; font-size: 13.5px; padding: 12px 16px; border-radius: var(--radius-sm); border: none; cursor: pointer; display: flex; align-items: center; justify-content: center; gap: 6px;" onclick="closePriceHistoryModal(); openQuickViewModal('${prod.id}');">
        <i class="bi bi-eye"></i> Quick Details
      </button>
      ${Boolean(prod.rentalAvailable || prod.rentalDailyRate || rentalInfo) ? `
        <button style="flex: 1.1; background: linear-gradient(135deg, #10b981 0%, #059669 100%); color: #fff; font-weight: 800; font-size: 13.5px; padding: 12px 16px; border-radius: var(--radius-sm); border: none; cursor: pointer; display: flex; align-items: center; justify-content: center; gap: 6px;" onclick="closePriceHistoryModal(); openRentalQuickSelect('${prod.id}');">
          <i class="bi bi-arrow-repeat"></i> RENT (From ₹${prod.rentalDailyRate || 199}/d)
        </button>
      ` : ''}
    </div>
  `;
}

function closePriceHistoryModal() {
  const modal = document.getElementById('priceHistoryModal');
  if (modal) modal.classList.remove('active');
}

async function handleSetPriceAlert(productId) {
  const priceInput = document.getElementById('phTargetPriceInput');
  const contactInput = document.getElementById('phContactInput');
  const targetPrice = priceInput ? parseFloat(priceInput.value) : 0;
  const contact = contactInput ? contactInput.value.trim() : '';

  if (!targetPrice || targetPrice <= 0) {
    showToast('Please enter a valid target alert price', 'error');
    return;
  }

  const res = await api.setPriceAlert(productId, targetPrice, contact, state.currentUser ? state.currentUser.name : 'Valued Shopper');
  if (res.success) {
    showToast(res.message, 'success', 'bi-bell-fill');
    showToast(`🔔 Founder (+91 7418362054) logged price watch for ₹${targetPrice.toLocaleString('en-IN')}!`, 'info', 'bi-send-check');
  } else {
    showToast(res.message || 'Error setting price alert', 'error');
  }
}

// ==========================================================================
// FEATURE: QUICK RENTAL TENURE SELECTOR MODAL (Rent Option along with Buy)
// ==========================================================================
let _activeRentalProduct = null;
let _selectedRentalPlan = null;

async function openRentalQuickSelect(productId) {
  const modal = document.getElementById('rentalModal');
  const content = document.getElementById('rentalModalContent');
  if (!modal || !content) return;

  modal.classList.add('active');
  content.innerHTML = `
    <div style="padding: 40px; text-align: center; color: var(--text-muted);">
      <i class="bi bi-arrow-repeat" style="font-size: 28px; animation: spin 1s infinite linear; display: inline-block;"></i>
      <p style="margin-top: 10px; font-weight: 600;">Loading flexible rental tenures & security deposit calculator...</p>
    </div>
  `;

  const res = await api.getProductById(productId);
  if (!res.success || !res.product) {
    content.innerHTML = `<div style="padding: 30px; text-align: center;">Rental details unavailable.</div>`;
    return;
  }

  const prod = res.product;
  const rentalInfo = res.rentalInfo || {
    dailyRate: prod.rentalDailyRate || 199,
    securityDeposit: prod.rentalDeposit || 2999,
    minDays: 7,
    plans: [
      { tenure: "7 Days", days: 7, discountPercent: 0, totalRent: (prod.rentalDailyRate || 199) * 7 },
      { tenure: "15 Days", days: 15, discountPercent: 10, totalRent: Math.round((prod.rentalDailyRate || 199) * 15 * 0.9) },
      { tenure: "1 Month", days: 30, discountPercent: 20, totalRent: Math.round((prod.rentalDailyRate || 199) * 30 * 0.8) },
      { tenure: "3 Months", days: 90, discountPercent: 35, totalRent: Math.round((prod.rentalDailyRate || 199) * 90 * 0.65) }
    ],
    perks: ["Zero Long-Term Lock-in", "100% Refundable Security Deposit", "Free Doorstep Delivery & Return"]
  };

  _activeRentalProduct = prod;
  _selectedRentalPlan = rentalInfo.plans[0];

  content.innerHTML = `
    <div class="rental-hero-badge">
      <i class="bi bi-shield-check"></i> NAVAMART Rent & Try™ • 100% Refundable Security Deposit
    </div>

    <!-- Product Summary Header -->
    <div style="display: flex; align-items: center; gap: 14px; margin-bottom: 16px;">
      <img src="${prod.thumbnail}" alt="${prod.title}" style="width: 64px; height: 64px; object-fit: contain; background: #fff; border: 1px solid var(--border-color); border-radius: var(--radius-md); padding: 4px;">
      <div style="flex: 1;">
        <div style="font-size: 11px; font-weight: 700; color: var(--primary-blue); text-transform: uppercase;">${prod.brand} • ${prod.categoryName}</div>
        <h3 style="font-size: 16px; font-weight: 800; color: var(--text-dark); margin: 2px 0 4px 0;">${prod.title}</h3>
        <div style="font-size: 13px; color: var(--text-muted);">
          Retail Buy Price: <strong>${formatPrice(prod.price)}</strong> • Daily Rental: <strong style="color: #15803d;">₹${rentalInfo.dailyRate}/day</strong>
        </div>
      </div>
    </div>

    <!-- Tenure Selector Cards -->
    <div style="font-size: 12.5px; font-weight: 800; color: var(--text-dark); margin-bottom: 8px;">
      Select Your Desired Rental Tenure:
    </div>

    <div class="rental-tenures-grid">
      ${rentalInfo.plans.map((pl, idx) => `
        <div class="rental-tenure-card ${idx === 0 ? 'active' : ''}" onclick="selectRentalQuickPlan(this, ${idx})">
          ${pl.discountPercent > 0 ? `<span class="rental-discount-pill">${pl.discountPercent}% OFF</span>` : ''}
          <div class="tenure-title">${pl.tenure}</div>
          <div class="tenure-price">${formatPrice(pl.totalRent)}</div>
          <div class="tenure-daily">₹${Math.round(pl.totalRent / pl.days)}/day</div>
        </div>
      `).join('')}
    </div>

    <!-- Pricing & Deposit Breakdown -->
    <div class="rental-breakdown-box">
      <div style="display: flex; justify-content: space-between; font-size: 13px; margin-bottom: 6px;">
        <span id="rentalSelectedTenureLabel">Rental Duration (${_selectedRentalPlan.tenure}):</span>
        <strong id="rentalSelectedRentDisplay">${formatPrice(_selectedRentalPlan.totalRent)}</strong>
      </div>
      <div style="display: flex; justify-content: space-between; font-size: 13px; color: #15803d; margin-bottom: 6px;">
        <span>Refundable Security Deposit (100% Back on Return):</span>
        <strong>+ ${formatPrice(rentalInfo.securityDeposit)}</strong>
      </div>
      <div style="display: flex; justify-content: space-between; font-size: 13px; color: var(--accent-green); margin-bottom: 8px;">
        <span>Doorstep Express Delivery & Reverse Pickup:</span>
        <strong>FREE</strong>
      </div>
      <div style="display: flex; justify-content: space-between; font-size: 15px; font-weight: 900; color: var(--text-dark); border-top: 1px solid var(--border-light); padding-top: 8px;">
        <span>Total Payable Today:</span>
        <span id="rentalTotalDueDisplay" style="color: #15803d;">${formatPrice(_selectedRentalPlan.totalRent + rentalInfo.securityDeposit)}</span>
      </div>
    </div>

    <!-- Perks -->
    <div class="rental-perks-list">
      <span class="rental-perk-item"><i class="bi bi-shield-check"></i> Zero Lock-in</span>
      <span class="rental-perk-item"><i class="bi bi-arrow-counterclockwise"></i> 100% Deposit Refund</span>
      <span class="rental-perk-item"><i class="bi bi-truck"></i> Free Pickup & Delivery</span>
      <span class="rental-perk-item"><i class="bi bi-person-check"></i> Founder Guarantee</span>
    </div>

    <!-- Dual Actions: Confirm Rental vs Buy Outright Side-by-Side -->
    <div style="display: flex; gap: 10px; margin-top: 14px;">
      <button id="confirmRentalOrderBtn" style="flex: 1.3; background: linear-gradient(135deg, #10b981 0%, #059669 100%); color: #fff; font-weight: 800; font-size: 14px; padding: 13px 18px; border-radius: var(--radius-sm); border: none; cursor: pointer; display: flex; align-items: center; justify-content: center; gap: 6px; box-shadow: 0 4px 12px rgba(16, 185, 129, 0.4);" onclick="submitRentalQuickOrder()">
        <i class="bi bi-arrow-repeat"></i> CONFIRM RENTAL & ADD TO CART
      </button>
      <button style="flex: 1; background: var(--bg-main); border: 1px solid var(--border-color); color: var(--text-dark); font-weight: 700; font-size: 13px; padding: 13px 14px; border-radius: var(--radius-sm); cursor: pointer; display: flex; align-items: center; justify-content: center; gap: 4px;" onclick="closeRentalModal(); handleAddToCart('${prod.id}');">
        <i class="bi bi-bag"></i> Or Buy Outright (${formatPrice(prod.price)})
      </button>
    </div>
  `;

  window._activeRentalPlans = rentalInfo.plans;
  window._activeRentalInfo = rentalInfo;
}

function selectRentalQuickPlan(element, planIndex) {
  document.querySelectorAll('.rental-tenure-card').forEach(c => c.classList.remove('active'));
  element.classList.add('active');

  const plans = window._activeRentalPlans;
  const rInfo = window._activeRentalInfo;
  if (plans && plans[planIndex]) {
    _selectedRentalPlan = plans[planIndex];
    const lbl = document.getElementById('rentalSelectedTenureLabel');
    const rentDisp = document.getElementById('rentalSelectedRentDisplay');
    const totalDisp = document.getElementById('rentalTotalDueDisplay');

    if (lbl) lbl.textContent = `Rental Duration (${_selectedRentalPlan.tenure}):`;
    if (rentDisp) rentDisp.textContent = formatPrice(_selectedRentalPlan.totalRent);
    if (totalDisp) totalDisp.textContent = formatPrice(_selectedRentalPlan.totalRent + rInfo.securityDeposit);
  }
}

async function submitRentalQuickOrder() {
  if (!_activeRentalProduct || !_selectedRentalPlan) return;
  const p = _activeRentalProduct;
  const pl = _selectedRentalPlan;
  const rInfo = window._activeRentalInfo;

  const res = await api.addToCart({
    productId: p.id,
    quantity: 1,
    isRental: true,
    tenure: pl.tenure,
    days: pl.days,
    dailyRate: Math.round(pl.totalRent / pl.days),
    securityDeposit: rInfo.securityDeposit,
    totalRent: pl.totalRent
  });

  if (res.success) {
    closeRentalModal();
    showToast(`Added ${p.title} (${pl.tenure} Rental) to cart!`, 'success', 'bi-arrow-repeat');
    await refreshCart();
    openCartDrawer();
  }
}

function closeRentalModal() {
  const modal = document.getElementById('rentalModal');
  if (modal) modal.classList.remove('active');
}

// ==========================================================================
// PRICE NEGOTIATION MODAL (BARGAIN DEAL MAKER)
// ==========================================================================
function openBargainModal(productId, productTitle, currentPrice) {
  const modal = document.getElementById('bargainModal');
  if (!modal) return;

  window._bargainProductId = productId;
  document.getElementById('bargainProductTitle').textContent = productTitle;
  document.getElementById('bargainOriginalPriceDisplay').textContent = formatPrice(currentPrice);
  document.getElementById('bargainOfferInput').value = Math.round(currentPrice * 0.92);

  const outcome = document.getElementById('bargainOutcomeBox');
  if (outcome) outcome.style.display = 'none';

  modal.classList.add('active');
}

function closeBargainModal() {
  const modal = document.getElementById('bargainModal');
  if (modal) modal.classList.remove('active');
}

async function handleBargainSubmit() {
  const offerInput = document.getElementById('bargainOfferInput');
  const offeredPrice = offerInput ? parseFloat(offerInput.value) : 0;
  const outcomeBox = document.getElementById('bargainOutcomeBox');

  if (!offeredPrice || offeredPrice <= 0) {
    showToast('Please enter a reasonable counter-offer', 'error');
    return;
  }

  const res = await api.negotiatePrice(window._bargainProductId, offeredPrice);
  if (!outcomeBox) return;

  outcomeBox.style.display = 'block';

  if (res.status === 'ACCEPTED') {
    outcomeBox.innerHTML = `
      <div style="background: #dcfce7; border: 1.5px solid #86efac; border-radius: var(--radius-md); padding: 16px; text-align: center;">
        <i class="bi bi-check-circle-fill" style="font-size: 32px; color: #16a34a;"></i>
        <h4 style="font-size: 16px; font-weight: 800; color: #15803d; margin: 6px 0;">OFFER ACCEPTED BY AI!</h4>
        <p style="font-size: 13px; color: #166534;">${res.message}</p>
        <div style="background: #ffffff; padding: 10px; border-radius: 6px; font-family: monospace; font-size: 16px; font-weight: 800; color: #15803d; margin: 12px 0;">
          VOUCHER: ${res.couponCode}
        </div>
        <button onclick="applyBargainDealToCart('${res.couponCode}')" style="background: #16a34a; color: #fff; font-weight: 800; padding: 10px 20px; border-radius: 4px; font-size: 13px;">
          Claim Deal & Apply to Cart
        </button>
      </div>
    `;
    showToast(`Bargain Accepted! Saved to voucher ${res.couponCode}`, 'success', 'bi-patch-check-fill');
  } else {
    outcomeBox.innerHTML = `
      <div style="background: #fffbeb; border: 1.5px solid #fde68a; border-radius: var(--radius-md); padding: 16px; text-align: center;">
        <i class="bi bi-stars" style="font-size: 32px; color: #d97706;"></i>
        <h4 style="font-size: 16px; font-weight: 800; color: #b45309; margin: 6px 0;">AI COUNTER-PROPOSAL</h4>
        <p style="font-size: 13px; color: #92400e;">${res.message}</p>
        <div style="background: #ffffff; padding: 10px; border-radius: 6px; font-family: monospace; font-size: 16px; font-weight: 800; color: #b45309; margin: 12px 0;">
          COMPROMISE CODE: ${res.couponCode}
        </div>
        <button onclick="applyBargainDealToCart('${res.couponCode}')" style="background: #d97706; color: #fff; font-weight: 800; padding: 10px 20px; border-radius: 4px; font-size: 13px;">
          Accept Counter-Offer & Add to Cart
        </button>
      </div>
    `;
  }
}

async function applyBargainDealToCart(couponCode) {
  closeBargainModal();
  closeQuickViewModal();
  await handleAddToCart(window._bargainProductId, 1);
  await api.applyCoupon(couponCode);
  await refreshCart();
  showToast(`Voucher ${couponCode} automatically applied to your cart!`, 'success');
}

// ==========================================================================
// NEARBY STORE INVENTORY MODAL
// ==========================================================================
async function openStoreInventoryModal(productId = null) {
  const modal = document.getElementById('storeInventoryModal');
  const list = document.getElementById('nearbyStoresListContainer');
  if (!modal || !list) return;

  modal.classList.add('active');
  list.innerHTML = `<div style="text-align: center; padding: 30px;"><i class="bi bi-arrow-repeat" style="font-size: 24px; animation: spin 1s infinite linear; display: inline-block;"></i><p>Locating partner store inventories...</p></div>`;

  const pin = state.pincode || '560001';
  const res = await api.getNearbyStores(pin, productId);

  if (res.success && res.stores.length) {
    list.innerHTML = res.stores.map(st => `
      <div class="store-card-item">
        <div style="flex: 1;">
          <div style="display: flex; align-items: center; gap: 8px;">
            <h4 style="font-size: 14.5px; font-weight: 800; color: var(--text-dark);">${st.name}</h4>
            <span class="store-distance-badge">${st.distanceKm} km away</span>
          </div>
          <div style="font-size: 12px; color: var(--text-muted); margin: 3px 0;">
            <i class="bi bi-geo-alt"></i> ${st.address} • Pincode: ${st.pincode}
          </div>
          <div style="font-size: 11.5px; color: var(--text-muted);">
            <i class="bi bi-clock"></i> ${st.timing} • Phone: ${st.phone}
          </div>
          <div style="margin-top: 6px; font-size: 12px; font-weight: 700; color: ${st.targetProductStock > 0 ? '#15803d' : '#2563eb'};">
            ${st.statusBadge}
          </div>
        </div>
        <div>
          <button style="background: var(--primary-blue); color: #fff; font-size: 12px; font-weight: 700; padding: 8px 14px; border-radius: 4px;" onclick="reserveStorePickup('${st.name}')">
            Reserve for Pickup
          </button>
        </div>
      </div>
    `).join('');
  }
}

function reserveStorePickup(storeName) {
  const modal = document.getElementById('storeInventoryModal');
  if (modal) modal.classList.remove('active');
  showToast(`Reserved for 2-Hour pickup at ${storeName}! Check SMS for details.`, 'success', 'bi-shop');
}

function closeStoreInventoryModal() {
  const modal = document.getElementById('storeInventoryModal');
  if (modal) modal.classList.remove('active');
}

// ==========================================================================
// FOUNDER & CUSTOMER NOTIFICATION LOGS MODAL
// ==========================================================================
async function openNotificationModal() {
  const modal = document.getElementById('notificationModal');
  const container = document.getElementById('notificationsLogContainer');
  if (!modal || !container) return;

  modal.classList.add('active');
  container.innerHTML = `<div style="text-align: center; padding: 30px;"><i class="bi bi-arrow-repeat" style="font-size: 24px; animation: spin 1s infinite linear; display: inline-block;"></i><p>Loading notification dispatch history...</p></div>`;

  const res = await api.getNotifications();
  if (res.success && res.notifications.length) {
    container.innerHTML = res.notifications.map(n => {
      const isFounder = n.recipient === 'FOUNDER';
      return `
        <div class="founder-alert-item" style="border-left: 4px solid ${isFounder ? '#ef4444' : '#2563eb'}; background: ${isFounder ? '#fff1f2' : '#f0fdf4'};">
          <div style="display: flex; justify-content: space-between; align-items: center; margin-bottom: 4px;">
            <span style="font-weight: 800; font-size: 12.5px; color: ${isFounder ? '#b91c1c' : '#15803d'};">
              ${isFounder ? '🚨 FOUNDER DISPATCH (+91 7418362054)' : '📦 CUSTOMER DISPATCH'}
            </span>
            <span style="font-size: 11px; color: var(--text-muted);">${new Date(n.timestamp).toLocaleTimeString()}</span>
          </div>
          <div style="font-weight: 700; font-size: 13.5px; color: var(--text-dark);">${n.title}</div>
          <p style="font-size: 12px; color: var(--text-main); margin: 4px 0;">${n.message}</p>
          <div style="display: flex; justify-content: space-between; align-items: center; margin-top: 8px;">
            <span style="font-size: 11px; color: var(--text-muted);">
              Channels: <strong>SMS • Email (${n.targetInfo.email || 'navaneethasozhan2007@gmail.com'}) • WhatsApp</strong>
            </span>
            <a href="${n.whatsappUrl}" target="_blank" style="background: #25d366; color: #fff; font-size: 11px; font-weight: 700; padding: 4px 10px; border-radius: 12px; display: inline-flex; align-items: center; gap: 4px;">
              <i class="bi bi-whatsapp"></i> Send WhatsApp
            </a>
          </div>
        </div>
      `;
    }).join('');
  } else {
    container.innerHTML = `
      <div style="text-align: center; padding: 40px; color: var(--text-muted);">
        <i class="bi bi-bell-slash" style="font-size: 36px; display: block; margin-bottom: 8px;"></i>
        <p>No dispatches recorded yet. Place an order or login to trigger instant SMS & Email notifications to Founder (+91 7418362054)!</p>
      </div>
    `;
  }
}

function closeNotificationModal() {
  const modal = document.getElementById('notificationModal');
  if (modal) modal.classList.remove('active');
}

// ==========================================================================
// AI CHATBOT (NAVA AI)
// ==========================================================================
function toggleAiChatbot() {
  const windowElem = document.getElementById('aiChatWindow');
  if (windowElem) windowElem.classList.toggle('active');
}

async function sendChatPrompt(promptText) {
  const input = document.getElementById('aiChatInput');
  if (input) input.value = promptText;
  await handleSendChatMessage();
}

async function handleSendChatMessage() {
  const input = document.getElementById('aiChatInput');
  const body = document.getElementById('aiChatBody');
  const userText = input ? input.value.trim() : '';

  if (!userText || !body) return;

  // Append User message
  const userMsgDiv = document.createElement('div');
  userMsgDiv.className = 'chat-msg user';
  userMsgDiv.innerHTML = `<div class="chat-bubble">${userText}</div>`;
  body.appendChild(userMsgDiv);
  input.value = '';
  body.scrollTop = body.scrollHeight;

  // Typing state
  const typingDiv = document.createElement('div');
  typingDiv.className = 'chat-msg bot';
  typingDiv.id = 'botTyping';
  typingDiv.innerHTML = `<div class="chat-bubble"><i class="bi bi-three-dots" style="animation: pulse 1s infinite;"></i> NAVA AI is thinking...</div>`;
  body.appendChild(typingDiv);
  body.scrollTop = body.scrollHeight;

  const res = await api.sendChatMessage(userText);
  typingDiv.remove();

  if (res.success) {
    const botMsgDiv = document.createElement('div');
    botMsgDiv.className = 'chat-msg bot';
    botMsgDiv.innerHTML = `
      <div class="chat-bubble">
        <div>${res.reply.replace(/\n/g, '<br>')}</div>
        ${res.suggestedActions && res.suggestedActions.length ? `
          <div class="chat-chips-row">
            ${res.suggestedActions.map(act => `
              <span class="chat-chip-btn" onclick="sendChatPrompt('${act}')">${act}</span>
            `).join('')}
          </div>
        ` : ''}
      </div>
    `;
    body.appendChild(botMsgDiv);
    body.scrollTop = body.scrollHeight;
  }
}

// ==========================================================================
// CHECKOUT & NOTIFICATIONS TO FOUNDER & CUSTOMER
// ==========================================================================
function openCheckoutModal() {
  const modal = document.getElementById('checkoutModal');
  if (!modal) return;
  state.checkoutStep = 1;
  updateCheckoutStepView();
  modal.classList.add('active');
}

function closeCheckoutModal() {
  const modal = document.getElementById('checkoutModal');
  if (modal) modal.classList.remove('active');
}

function updateCheckoutStepView() {
  const steps = [1, 2, 3, 4];
  steps.forEach(s => {
    const el = document.getElementById(`checkoutStep${s}`);
    const indicator = document.getElementById(`stepIndicator${s}`);
    if (el) el.classList.toggle('active', s === state.checkoutStep);
    if (indicator) {
      indicator.classList.toggle('active', s === state.checkoutStep);
      indicator.classList.toggle('done', s < state.checkoutStep);
    }
  });

  if (state.checkoutStep === 3) {
    const summaryBox = document.getElementById('checkoutStep3Summary');
    if (summaryBox && state.cart.summary) {
      const s = state.cart.summary;
      summaryBox.innerHTML = `
        <div style="background: var(--bg-main); padding: 14px; border-radius: var(--radius-md); margin-top: 16px;">
          <div style="display: flex; justify-content: space-between; font-weight: 700; font-size: 15px; color: var(--text-dark);">
            <span>Total Payable Amount</span>
            <span>${formatPrice(s.total)}</span>
          </div>
          ${s.totalSecurityDeposit > 0 ? `
            <div style="font-size: 11.5px; color: #059669; font-weight: 600;">
              Includes ${formatPrice(s.totalSecurityDeposit)} refundable rental deposit
            </div>
          ` : ''}
          <div style="font-size: 11.5px; color: var(--text-muted); margin-top: 4px;">
            Founder (+91 7418362054) & Customer will receive immediate order dispatch alerts.
          </div>
        </div>
      `;
    }
  }
}

// ==========================================================================
// MY ORDERS & PINCODE MODAL
// ==========================================================================
async function openOrdersModal() {
  const modal = document.getElementById('ordersModal');
  const container = document.getElementById('ordersListContainer');
  if (!modal || !container) return;

  container.innerHTML = `<div style="text-align: center; padding: 40px; color: var(--text-muted);"><i class="bi bi-arrow-repeat" style="font-size: 28px; animation: spin 1s infinite linear; display: inline-block;"></i><p>Loading your past orders...</p></div>`;
  modal.classList.add('active');

  const res = await api.getOrders();
  if (res.success && res.orders.length) {
    container.innerHTML = res.orders.map(o => `
      <div style="background: var(--bg-card); border: 1px solid var(--border-color); border-radius: var(--radius-lg); padding: 18px; margin-bottom: 16px;">
        <div style="display: flex; justify-content: space-between; align-items: center; border-bottom: 1px solid var(--border-light); padding-bottom: 12px; margin-bottom: 14px; flex-wrap: wrap; gap: 8px;">
          <div>
            <span style="font-weight: 800; color: var(--primary-blue); font-family: monospace; font-size: 14px;">Order #${o.id}</span>
            <div style="font-size: 11.5px; color: var(--text-muted);">Placed on ${new Date(o.date).toLocaleDateString('en-US', { month: 'short', day: 'numeric', year: 'numeric' })}</div>
          </div>
          <div style="text-align: right;">
            <span style="background: #dcfce7; color: #15803d; font-size: 11px; font-weight: 800; padding: 3px 10px; border-radius: 12px;">${o.status}</span>
            <div style="font-size: 13.5px; font-weight: 800; color: var(--text-dark); margin-top: 2px;">${formatPrice(o.total)}</div>
          </div>
        </div>

        <div style="display: flex; flex-direction: column; gap: 10px; margin-bottom: 16px;">
          ${o.items.map(it => `
            <div style="display: flex; align-items: center; gap: 12px;">
              <img src="${it.thumbnail || 'assets/products/iphone-16-pro.jpg'}" alt="${it.title}" style="width: 44px; height: 44px; object-fit: contain; background: var(--bg-main); border-radius: 4px; padding: 2px;">
              <div style="flex: 1;">
                <div style="font-size: 13px; font-weight: 600; color: var(--text-dark);">${it.title}</div>
                <div style="font-size: 11px; color: var(--text-muted);">
                  Qty: ${it.quantity} • ${formatPrice(it.price)} ${it.isRental ? `(🔄 Rental: ${it.tenure})` : ''}
                </div>
              </div>
            </div>
          `).join('')}
        </div>

        <div class="tracking-timeline">
          ${o.timeline.map((node) => `
            <div class="timeline-node ${node.completed ? 'completed' : ''}">
              <div class="timeline-dot"><i class="bi ${node.completed ? 'bi-check' : 'bi-circle'}"></i></div>
              <span class="timeline-label">${node.title}</span>
            </div>
          `).join('')}
        </div>
      </div>
    `).join('');
  } else {
    container.innerHTML = `<div style="text-align: center; padding: 50px 20px;"><i class="bi bi-box-seam" style="font-size: 48px; color: var(--text-muted); display: block; margin-bottom: 12px;"></i><h4>No orders found</h4><p style="font-size: 13px; color: var(--text-muted);">You haven't placed any orders yet.</p></div>`;
  }
}

function openPincodeModal() {
  const modal = document.getElementById('pincodeModal');
  if (modal) modal.classList.add('active');
}

function closePincodeModal() {
  const modal = document.getElementById('pincodeModal');
  if (modal) modal.classList.remove('active');
}

// ==========================================================================
// SEARCH AUTO-SUGGESTION
// ==========================================================================
let searchDebounceTimeout = null;

function setupSearchSuggestions() {
  const input = document.getElementById('navSearchInput');
  const suggestionsBox = document.getElementById('searchSuggestionsBox');
  const clearBtn = document.getElementById('searchClearBtn');

  if (!input || !suggestionsBox) return;

  input.addEventListener('input', (e) => {
    const val = e.target.value.trim();
    if (clearBtn) clearBtn.style.display = val ? 'block' : 'none';

    clearTimeout(searchDebounceTimeout);
    if (!val) {
      suggestionsBox.style.display = 'none';
      state.searchQuery = '';
      fetchAndRenderProducts();
      return;
    }

    searchDebounceTimeout = setTimeout(async () => {
      const res = await api.getProducts({ search: val });
      if (res.success && res.products.length > 0) {
        suggestionsBox.innerHTML = res.products.slice(0, 5).map(p => `
          <div class="suggestion-item" data-id="${p.id}">
            <img src="${p.thumbnail}" alt="" class="suggestion-thumb">
            <div class="suggestion-text">
              <div style="font-weight: 600;">${p.title}</div>
              <div style="font-size: 11px; color: var(--text-muted);">${p.categoryName}</div>
            </div>
            <div class="suggestion-price">${formatPrice(p.price)}</div>
          </div>
        `).join('');

        suggestionsBox.style.display = 'block';

        suggestionsBox.querySelectorAll('.suggestion-item').forEach(item => {
          item.addEventListener('click', () => {
            const id = item.getAttribute('data-id');
            suggestionsBox.style.display = 'none';
            openQuickViewModal(id);
          });
        });
      } else {
        suggestionsBox.innerHTML = `<div style="padding: 12px; font-size: 12px; color: var(--text-muted); text-align: center;">No matching products found</div>`;
        suggestionsBox.style.display = 'block';
      }
    }, 250);
  });

  if (clearBtn) {
    clearBtn.addEventListener('click', () => {
      input.value = '';
      clearBtn.style.display = 'none';
      suggestionsBox.style.display = 'none';
      state.searchQuery = '';
      fetchAndRenderProducts();
    });
  }

  const searchBtn = document.getElementById('navSearchBtn');
  if (searchBtn) {
    searchBtn.addEventListener('click', () => {
      state.searchQuery = input.value.trim();
      suggestionsBox.style.display = 'none';
      fetchAndRenderProducts();
    });
  }

  input.addEventListener('keydown', (e) => {
    if (e.key === 'Enter') {
      state.searchQuery = input.value.trim();
      suggestionsBox.style.display = 'none';
      fetchAndRenderProducts();
    }
  });

  document.addEventListener('click', (e) => {
    if (!e.target.closest('.search-container')) {
      suggestionsBox.style.display = 'none';
    }
  });
}

// ==========================================================================
// EVENT LISTENERS SETUP
// ==========================================================================
function setupEventListeners() {
  setupSearchSuggestions();

  // AI Chatbot Widget Trigger
  const aiChatBtn = document.getElementById('aiChatBubbleBtn');
  const aiCloseBtn = document.getElementById('aiChatCloseBtn');
  const aiSendBtn = document.getElementById('aiChatSendBtn');
  const aiInput = document.getElementById('aiChatInput');

  if (aiChatBtn) aiChatBtn.addEventListener('click', toggleAiChatbot);
  if (aiCloseBtn) aiCloseBtn.addEventListener('click', toggleAiChatbot);
  if (aiSendBtn) aiSendBtn.addEventListener('click', handleSendChatMessage);
  if (aiInput) {
    aiInput.addEventListener('keydown', (e) => {
      if (e.key === 'Enter') handleSendChatMessage();
    });
  }

  // Cart Drawer open/close
  const cartTrigger = document.getElementById('cartTriggerBtn');
  const cartClose = document.getElementById('cartDrawerCloseBtn');
  const cartOverlay = document.getElementById('cartDrawerOverlay');

  if (cartTrigger) cartTrigger.addEventListener('click', openCartDrawer);
  if (cartClose) cartClose.addEventListener('click', closeCartDrawer);
  if (cartOverlay) cartOverlay.addEventListener('click', closeCartDrawer);

  // Quick View Close
  const qvClose = document.getElementById('quickViewCloseBtn');
  const qvOverlay = document.getElementById('quickViewModal');
  if (qvClose) qvClose.addEventListener('click', closeQuickViewModal);
  if (qvOverlay) {
    qvOverlay.addEventListener('click', (e) => {
      if (e.target === qvOverlay) closeQuickViewModal();
    });
  }

  // Login Modal
  const loginClose = document.getElementById('loginModalCloseBtn');
  const loginSubmit = document.getElementById('loginSubmitBtn');
  if (loginClose) loginClose.addEventListener('click', closeLoginModal);
  if (loginSubmit) loginSubmit.addEventListener('click', handleLoginSubmit);

  // Bargain Modal
  const bargainClose = document.getElementById('bargainModalCloseBtn');
  const bargainSubmit = document.getElementById('submitBargainOfferBtn');
  if (bargainClose) bargainClose.addEventListener('click', closeBargainModal);
  if (bargainSubmit) bargainSubmit.addEventListener('click', handleBargainSubmit);

  // Store Inventory Modal
  const storeClose = document.getElementById('storeInventoryModalCloseBtn');
  const storeSearchBtn = document.getElementById('storeSearchPincodeBtn');
  if (storeClose) storeClose.addEventListener('click', closeStoreInventoryModal);
  if (storeSearchBtn) {
    storeSearchBtn.addEventListener('click', () => {
      const pin = document.getElementById('storeSearchPincodeInput').value;
      openStoreInventoryModal(pin);
    });
  }

  // Notification Modal
  const notifClose = document.getElementById('notificationModalCloseBtn');
  if (notifClose) notifClose.addEventListener('click', closeNotificationModal);

  // Pincode Modal
  const pinTrigger = document.getElementById('pincodeTriggerBtn');
  const pinClose = document.getElementById('pincodeModalCloseBtn');
  if (pinTrigger) pinTrigger.addEventListener('click', openPincodeModal);
  if (pinClose) pinClose.addEventListener('click', closePincodeModal);

  const applyPinBtn = document.getElementById('applyPincodeBtn');
  if (applyPinBtn) {
    applyPinBtn.addEventListener('click', async () => {
      const pinInput = document.getElementById('pincodeModalInput');
      const pin = pinInput ? pinInput.value.trim() : '';
      if (!pin) return;
      const res = await api.checkPincode(pin);
      if (res.success) {
        state.pincode = res.pincode;
        state.locationCity = res.city;
        const text = document.getElementById('headerPincodeText');
        if (text) text.innerHTML = `${res.city} ${res.pincode} <i class="bi bi-chevron-down" style="font-size: 10px;"></i>`;
        closePincodeModal();
        showToast(res.deliveryMessage, 'success', 'bi-geo-alt-fill');
      } else {
        showToast(res.message, 'error');
      }
    });
  }

  // Orders Modal
  const ordersTrigger = document.getElementById('ordersTriggerBtn');
  const ordersClose = document.getElementById('ordersModalCloseBtn');
  if (ordersTrigger) ordersTrigger.addEventListener('click', openOrdersModal);
  if (ordersClose) ordersClose.addEventListener('click', () => document.getElementById('ordersModal').classList.remove('active'));

  // Wishlist Header
  const wishlistBtn = document.getElementById('wishlistHeaderBtn');
  if (wishlistBtn) {
    wishlistBtn.addEventListener('click', async () => {
      const res = await api.getWishlist();
      if (res.success && res.items.length) {
        state.products = res.items;
        renderProductsGrid(res.items);
        const countDisplay = document.getElementById('resultsCountDisplay');
        if (countDisplay) countDisplay.innerHTML = `Showing <strong>${res.items.length}</strong> items from your Wishlist`;
        showToast(`Loaded ${res.items.length} items from your Wishlist`, 'info', 'bi-heart-fill');
      } else {
        showToast('Your wishlist is empty!', 'info', 'bi-heart');
      }
    });
  }

  // Filters
  const priceSlider = document.getElementById('priceRangeSlider');
  const maxPriceInput = document.getElementById('maxPriceInput');
  if (priceSlider && maxPriceInput) {
    priceSlider.addEventListener('input', (e) => {
      maxPriceInput.value = e.target.value;
      state.maxPrice = parseFloat(e.target.value);
    });
    priceSlider.addEventListener('change', () => fetchAndRenderProducts());
    maxPriceInput.addEventListener('change', (e) => {
      priceSlider.value = e.target.value;
      state.maxPrice = parseFloat(e.target.value);
      fetchAndRenderProducts();
    });
  }

  const assuredCheckbox = document.getElementById('assuredFilterCheck');
  if (assuredCheckbox) {
    assuredCheckbox.addEventListener('change', (e) => {
      state.onlyAssured = e.target.checked;
      fetchAndRenderProducts();
    });
  }

  const dealsCheckbox = document.getElementById('dealsFilterCheck');
  if (dealsCheckbox) {
    dealsCheckbox.addEventListener('change', (e) => {
      state.onlyDeals = e.target.checked;
      fetchAndRenderProducts();
    });
  }

  const rentCheckbox = document.getElementById('rentFilterCheck');
  if (rentCheckbox) {
    rentCheckbox.addEventListener('change', (e) => {
      state.onlyRentals = e.target.checked;
      fetchAndRenderProducts();
    });
  }

  const ratingRadios = document.querySelectorAll('input[name="ratingFilter"]');
  ratingRadios.forEach(r => {
    r.addEventListener('change', (e) => {
      state.minRating = parseFloat(e.target.value);
      fetchAndRenderProducts();
    });
  });

  const clearFiltersBtn = document.getElementById('clearFiltersBtn');
  if (clearFiltersBtn) clearFiltersBtn.addEventListener('click', resetAllFilters);

  const sortSelect = document.getElementById('sortSelect');
  if (sortSelect) {
    sortSelect.addEventListener('change', (e) => {
      state.sortBy = e.target.value;
      fetchAndRenderProducts();
    });
  }

  const backToTop = document.getElementById('backToTopBtn');
  if (backToTop) {
    backToTop.addEventListener('click', () => {
      window.scrollTo({ top: 0, behavior: 'smooth' });
    });
  }

  // Checkout Multi-Step
  const toStep2 = document.getElementById('checkoutToStep2Btn');
  if (toStep2) {
    toStep2.addEventListener('click', () => {
      const name = document.getElementById('addrFullName').value;
      const phone = document.getElementById('addrPhone').value;
      const line = document.getElementById('addrLine').value;
      const city = document.getElementById('addrCity').value;
      const pin = document.getElementById('addrPincode').value;

      if (!name || !line || !pin) {
        showToast('Please complete required address fields', 'error');
        return;
      }

      state.checkoutData.address = { fullName: name, phone, addressLine: line, city, pincode: pin };
      state.checkoutStep = 2;
      updateCheckoutStepView();
    });
  }

  const toStep3 = document.getElementById('checkoutToStep3Btn');
  if (toStep3) {
    toStep3.addEventListener('click', () => {
      const selectedSpeed = document.querySelector('input[name="shippingSpeed"]:checked');
      if (selectedSpeed) state.checkoutData.deliverySpeed = selectedSpeed.value;
      state.checkoutStep = 3;
      updateCheckoutStepView();
    });
  }

  const step2Back = document.getElementById('checkoutBackStep1Btn');
  if (step2Back) step2Back.addEventListener('click', () => {
    state.checkoutStep = 1;
    updateCheckoutStepView();
  });

  const step3Back = document.getElementById('checkoutBackStep2Btn');
  if (step3Back) step3Back.addEventListener('click', () => {
    state.checkoutStep = 2;
    updateCheckoutStepView();
  });

  document.querySelectorAll('.payment-method-card').forEach(card => {
    card.addEventListener('click', () => {
      document.querySelectorAll('.payment-method-card').forEach(c => c.classList.remove('selected'));
      card.classList.add('selected');
      const radio = card.querySelector('input[type="radio"]');
      if (radio) {
        radio.checked = true;
        state.checkoutData.paymentMethod = radio.value;
      }
    });
  });

  // Complete Order & Notify Founder & Customer
  const completeOrderBtn = document.getElementById('completeOrderBtn');
  if (completeOrderBtn) {
    completeOrderBtn.addEventListener('click', async () => {
      completeOrderBtn.disabled = true;
      completeOrderBtn.innerHTML = `<i class="bi bi-arrow-repeat" style="animation: spin 1s infinite linear; display: inline-block;"></i> Notifying Founder & Processing...`;

      try {
        const orderRes = await api.placeOrder(state.checkoutData);
        if (orderRes.success) {
          state.checkoutStep = 4;
          updateCheckoutStepView();

          const o = orderRes.order;
          const founder = orderRes.founderInfo;
          const successBox = document.getElementById('checkoutStep4Content');

          if (successBox) {
            const founderWaUrl = `https://wa.me/917418362054?text=${encodeURIComponent(`Hi Founder ${founder.name}, Order #${o.id} confirmed for ₹${o.total}! Customer: ${o.address.fullName}`)}`;

            successBox.innerHTML = `
              <div class="order-success-screen">
                <div class="success-check-circle"><i class="bi bi-check-lg"></i></div>
                <h2 style="font-size: 24px; font-weight: 800; color: var(--text-dark);">Order Placed Successfully!</h2>
                <div class="order-id-badge">Order ID: ${o.id}</div>
                
                <!-- Founder & Customer Alert Banner -->
                <div style="background: #eff6ff; border: 1.5px solid #93c5fd; border-radius: var(--radius-md); padding: 14px; margin: 16px auto; max-width: 520px; text-align: left; font-size: 13px;">
                  <div style="font-weight: 800; color: #1e40af; margin-bottom: 6px; display: flex; align-items: center; gap: 6px;">
                    <i class="bi bi-bell-fill" style="color: #ef4444;"></i> Carrier SMS & Email Dispatches Sent:
                  </div>
                  <div>• <strong>Founder Alerted</strong>: ${founder.name} (<span style="color: #1d4ed8;">${founder.phone}</span> • <span style="color: #1d4ed8;">${founder.email}</span>)</div>
                  <div>• <strong>Customer Alerted</strong>: ${o.address.fullName} (${o.address.phone})</div>
                  <div style="margin-top: 10px; display: flex; gap: 8px;">
                    <a href="${founderWaUrl}" target="_blank" style="background: #25d366; color: #fff; font-size: 11.5px; font-weight: 700; padding: 6px 12px; border-radius: 4px; display: inline-flex; align-items: center; gap: 6px;">
                      <i class="bi bi-whatsapp"></i> Chat with Founder on WhatsApp
                    </a>
                    <button onclick="openNotificationModal()" style="background: var(--bg-main); border: 1px solid var(--border-color); color: var(--text-dark); font-size: 11.5px; font-weight: 700; padding: 6px 12px; border-radius: 4px;">
                      View Dispatch Logs
                    </button>
                  </div>
                </div>

                <div class="tracking-timeline" style="max-width: 500px; margin: 24px auto;">
                  ${o.timeline.map((node) => `
                    <div class="timeline-node ${node.completed ? 'completed' : ''}">
                      <div class="timeline-dot"><i class="bi ${node.completed ? 'bi-check' : 'bi-circle'}"></i></div>
                      <span class="timeline-label">${node.title}</span>
                    </div>
                  `).join('')}
                </div>

                <div style="background: var(--bg-main); max-width: 440px; margin: 16px auto; padding: 14px; border-radius: var(--radius-md); text-align: left; font-size: 13px;">
                  <div style="font-weight: 700; color: var(--text-dark); margin-bottom: 4px;">Delivering to:</div>
                  <div>${o.address.fullName} (${o.address.phone})</div>
                  <div style="color: var(--text-muted);">${o.address.addressLine}, ${o.address.city} - ${o.address.pincode}</div>
                  <div style="margin-top: 8px; font-weight: 700; color: var(--accent-green);"><i class="bi bi-truck"></i> Expected: ${o.estimatedDelivery}</div>
                </div>

                <div style="display: flex; gap: 12px; justify-content: center; margin-top: 24px;">
                  <button id="viewMyOrdersAfterCheckoutBtn" style="background: var(--primary-blue); color: #fff; font-weight: 700; padding: 12px 24px; border-radius: var(--radius-sm);">View My Orders</button>
                  <button id="continueShoppingBtn" style="background: var(--bg-main); color: var(--text-dark); font-weight: 700; padding: 12px 24px; border-radius: var(--radius-sm);">Continue Shopping</button>
                </div>
              </div>
            `;

            const viewOrders = document.getElementById('viewMyOrdersAfterCheckoutBtn');
            if (viewOrders) {
              viewOrders.addEventListener('click', () => {
                closeCheckoutModal();
                openOrdersModal();
              });
            }

            const contShop = document.getElementById('continueShoppingBtn');
            if (contShop) {
              contShop.addEventListener('click', () => {
                closeCheckoutModal();
                fetchAndRenderProducts();
              });
            }
          }

          await refreshCart();
          showToast(`Order placed! Founder (${founder.phone}) notified instantly.`, 'success', 'bi-bag-check-fill');
        } else {
          showToast(orderRes.message, 'error');
        }
      } catch (err) {
        console.error(err);
        showToast('Payment processing error', 'error');
      } finally {
        completeOrderBtn.disabled = false;
        completeOrderBtn.innerHTML = `<i class="bi bi-lock-fill"></i> PAY & CONFIRM ORDER`;
      }
    });
  }

  const checkoutClose = document.getElementById('checkoutModalCloseBtn');
  if (checkoutClose) checkoutClose.addEventListener('click', closeCheckoutModal);

  // Price History Modal Close Triggers
  const phCloseBtn = document.getElementById('priceHistoryModalCloseBtn');
  if (phCloseBtn) phCloseBtn.addEventListener('click', closePriceHistoryModal);
  const phModal = document.getElementById('priceHistoryModal');
  if (phModal) {
    phModal.addEventListener('click', (e) => {
      if (e.target === phModal) closePriceHistoryModal();
    });
  }

  // Quick Rental Modal Close Triggers
  const rentCloseBtn = document.getElementById('rentalModalCloseBtn');
  if (rentCloseBtn) rentCloseBtn.addEventListener('click', closeRentalModal);
  const rentModal = document.getElementById('rentalModal');
  if (rentModal) {
    rentModal.addEventListener('click', (e) => {
      if (e.target === rentModal) closeRentalModal();
    });
  }
}
