/**
 * DOM Manipulation Module
 */

const grid = document.getElementById('crypto-grid');
const errorMsg = document.getElementById('error-message');

/**
 * Format currency values (USD)
 * @param {number} value 
 * @returns {string} Formatted currency
 */
const formatCurrency = (value) => {
    return new Intl.NumberFormat('en-US', {
        style: 'currency',
        currency: 'USD',
        minimumFractionDigits: value < 1 ? 4 : 2,
        maximumFractionDigits: value < 1 ? 6 : 2
    }).format(value);
};

/**
 * Creates a crypto card element
 * @param {Object} crypto 
 * @param {boolean} isFavorite
 * @returns {HTMLElement}
 */
const createCardElement = (crypto, isFavorite) => {
    const isPositive = crypto.price_change_percentage_24h >= 0;
    const card = document.createElement('article');
    card.className = 'card';
    card.dataset.id = crypto.id;
    card.dataset.name = crypto.name.toLowerCase();
    card.dataset.symbol = crypto.symbol.toLowerCase();
    card.dataset.price = crypto.current_price;

    card.innerHTML = `
        <button class="card__star ${isFavorite ? 'card__star--active' : ''}" aria-label="Favorito">
            <svg width="20" height="20" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2">
                <polygon points="12 2 15.09 8.26 22 9.27 17 14.14 18.18 21.02 12 17.77 5.82 21.02 7 14.14 2 9.27 8.91 8.26 12 2"></polygon>
            </svg>
        </button>

        <div class="card__header">
            <div class="card__info">
                <img src="${crypto.image}" alt="${crypto.name}" class="card__icon" loading="lazy">
                <div class="card__name-wrapper">
                    <span class="card__name">${crypto.name}</span>
                    <span class="card__symbol">${crypto.symbol}</span>
                </div>
            </div>
            <span class="card__rank">#${crypto.market_cap_rank}</span>
        </div>

        <div class="card__price-section">
            <p class="card__price" id="price-${crypto.id}">${formatCurrency(crypto.current_price)}</p>
        </div>

        <div class="card__stats">
            <span class="card__change ${isPositive ? 'card__change--positive' : 'card__change--negative'}">
                ${isPositive ? '↑' : '↓'} ${Math.abs(crypto.price_change_percentage_24h).toFixed(2)}%
            </span>
            <div class="card__cap">
                <span class="card__symbol">Cap: </span>
                <span>${(crypto.market_cap / 1e9).toFixed(2)}B</span>
            </div>
        </div>

        <div class="card__details">
            <div class="detail-item">
                <span class="detail-item__label">Volumen (24h):</span>
                <span>${formatCurrency(crypto.total_volume)}</span>
            </div>
            <div class="detail-item">
                <span class="detail-item__label">Máximo (ATH):</span>
                <span>${formatCurrency(crypto.ath)}</span>
            </div>
            
            <div class="calculator">
                <span class="calculator__title">Calculadora Bidireccional</span>
                <div class="calculator__input-group">
                    <div class="calculator__field">
                        <label class="calculator__label">${crypto.symbol.toUpperCase()}</label>
                        <input type="number" class="calculator__input calculator__input--crypto" placeholder="0.00" step="any" data-price="${crypto.current_price}" data-type="crypto">
                    </div>
                    <div class="calculator__field">
                        <label class="calculator__label">USD</label>
                        <input type="number" class="calculator__input calculator__input--usd" placeholder="0.00" step="any" data-price="${crypto.current_price}" data-type="usd">
                    </div>
                </div>
            </div>
        </div>
    `;
    return card;
};

/**
 * Renders the crypto grid using DocumentFragment for performance
 * @param {Array} cryptos 
 * @param {Array} favorites List of favorite IDs
 */
export function renderCryptos(cryptos, favorites = []) {
    const fragment = document.createDocumentFragment();

    // Sort: favorites first
    const sortedCryptos = [...cryptos].sort((a, b) => {
        const aFav = favorites.includes(a.id);
        const bFav = favorites.includes(b.id);
        if (aFav && !bFav) return -1;
        if (!aFav && bFav) return 1;
        return 0;
    });

    sortedCryptos.forEach(crypto => {
        const isFavorite = favorites.includes(crypto.id);
        const card = createCardElement(crypto, isFavorite);
        if (isFavorite) card.classList.add('card--favorite');
        fragment.appendChild(card);
    });

    grid.innerHTML = '';
    grid.appendChild(fragment);
    errorMsg.classList.add('hidden');
}

/**
 * Shows Skeleton Loaders for a professional feel
 */
export function showLoading() {
    grid.innerHTML = '';
    const fragment = document.createDocumentFragment();

    // Create 12 skeletons
    for (let i = 0; i < 12; i++) {
        const skeleton = document.createElement('div');
        skeleton.className = 'card card--skeleton';
        skeleton.innerHTML = `
            <div class="card__header">
                <div class="card__info">
                    <div class="skeleton skeleton--icon"></div>
                    <div class="card__name-wrapper">
                        <div class="skeleton skeleton--text" style="width: 80px"></div>
                        <div class="skeleton skeleton--text" style="width: 40px"></div>
                    </div>
                </div>
            </div>
            <div class="card__price-section">
                <div class="skeleton skeleton--price"></div>
            </div>
            <div class="card__stats">
                <div class="skeleton skeleton--badge"></div>
                <div class="skeleton skeleton--text" style="width: 60px"></div>
            </div>
        `;
        fragment.appendChild(skeleton);
    }

    grid.appendChild(fragment);
    errorMsg.classList.add('hidden');
}

/**
 * Shows the error state with friendly messages
 */
export function showError(type = 'GENERAL') {
    grid.innerHTML = '';
    const title = errorMsg.querySelector('p');

    if (type === 'RATE_LIMIT') {
        title.innerHTML = '<strong>¡Cuidado!</strong> Has superado el límite de peticiones de CoinGecko. Por favor, espera un minuto e intenta de nuevo.';
    } else {
        title.textContent = '¡Ups! No pudimos obtener los datos. Por favor, reintenta más tarde.';
    }

    errorMsg.classList.remove('hidden');
}

/**
 * Filters the cards in the DOM based on search term
 * @param {string} searchTerm 
 */
export function filterCryptos(searchTerm) {
    const cards = grid.querySelectorAll('.card:not(.card--skeleton)');
    const term = searchTerm.toLowerCase().trim();
    let visibleCount = 0;

    cards.forEach(card => {
        const name = card.dataset.name;
        const symbol = card.dataset.symbol;

        if (name.includes(term) || symbol.includes(term)) {
            card.style.display = 'flex';
            visibleCount++;
        } else {
            card.style.display = 'none';
        }
    });

    // Handle empty state
    let noResults = document.getElementById('no-results-msg');
    if (visibleCount === 0 && term !== '') {
        if (!noResults) {
            noResults = document.createElement('div');
            noResults.id = 'no-results-msg';
            noResults.className = 'empty-state';
            noResults.innerHTML = `
                <p>No se encontraron resultados para "<strong>${searchTerm}</strong>"</p>
                <button class="btn btn--primary" onclick="document.getElementById('search-input').value = ''; document.getElementById('search-input').dispatchEvent(new Event('input'))">Limpiar búsqueda</button>
            `;
            grid.appendChild(noResults);
        }
    } else if (noResults) {
        noResults.remove();
    }
}
