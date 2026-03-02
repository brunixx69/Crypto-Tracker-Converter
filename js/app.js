/**
 * Main App Module
 */
import { fetchTopCryptos } from './api.js';
import { renderCryptos, showLoading, showError, filterCryptos } from './dom.js';

// DOM Elements
const searchInput = document.getElementById('search-input');
const themeToggle = document.getElementById('theme-toggle');
const themeIcon = document.getElementById('theme-icon');
const retryBtn = document.getElementById('retry-btn');

// State
let cryptoData = [];
let favorites = JSON.parse(localStorage.getItem('favorites')) || [];

/**
 * Initialize Theme
 */
const initTheme = () => {
    const savedTheme = localStorage.getItem('theme') || 'dark';
    document.documentElement.setAttribute('data-theme', savedTheme);
    updateThemeIcon(savedTheme);
};

/**
 * Toggle Dark/Light Mode
 */
const toggleTheme = () => {
    const currentTheme = document.documentElement.getAttribute('data-theme');
    const newTheme = currentTheme === 'dark' ? 'light' : 'dark';

    document.documentElement.setAttribute('data-theme', newTheme);
    localStorage.setItem('theme', newTheme);
    updateThemeIcon(newTheme);
};

/**
 * Update Theme Icon (SVG paths)
 * @param {string} theme 
 */
const updateThemeIcon = (theme) => {
    if (theme === 'dark') {
        themeIcon.innerHTML = `
            <circle cx="12" cy="12" r="5"></circle>
            <line x1="12" y1="1" x2="12" y2="3"></line>
            <line x1="12" y1="21" x2="12" y2="23"></line>
            <line x1="4.22" y1="4.22" x2="5.64" y2="5.64"></line>
            <line x1="18.36" y1="18.36" x2="19.78" y2="19.78"></line>
            <line x1="1" y1="12" x2="3" y2="12"></line>
            <line x1="21" y1="12" x2="23" y2="12"></line>
            <line x1="4.22" y1="19.78" x2="5.64" y2="18.36"></line>
            <line x1="18.36" y1="5.64" x2="19.78" y2="4.22"></line>
        `;
    } else {
        themeIcon.innerHTML = `
            <path d="M21 12.79A9 9 0 1 1 11.21 3 7 7 0 0 0 21 12.79z"></path>
        `;
    }
};

/**
 * Handle Price Animations
 * @param {Array} newData 
 */
const animatePriceChanges = (newData) => {
    newData.forEach(coin => {
        const oldCoin = cryptoData.find(c => c.id === coin.id);
        if (oldCoin && oldCoin.current_price !== coin.current_price) {
            const priceEl = document.getElementById(`price-${coin.id}`);
            if (priceEl) {
                const isUp = coin.current_price > oldCoin.current_price;
                const animationClass = isUp ? 'price-up' : 'price-down';

                priceEl.classList.add(animationClass);
                setTimeout(() => priceEl.classList.remove(animationClass), 1000);
            }
        }
    });
};

/**
 * Load and Initialize Market Data
 */
const initAppData = async () => {
    showLoading();
    try {
        const newData = await fetchTopCryptos();
        animatePriceChanges(newData);
        cryptoData = newData;
        renderCryptos(cryptoData, favorites);
    } catch (error) {
        if (error.message === 'RATE_LIMIT') {
            showError('RATE_LIMIT');
        } else {
            showError('GENERAL');
        }
    }
};

/**
 * Toggle Favorite Logic
 * @param {string} id 
 */
const toggleFavorite = (id) => {
    if (favorites.includes(id)) {
        favorites = favorites.filter(favId => favId !== id);
    } else {
        favorites.push(id);
    }
    localStorage.setItem('favorites', JSON.stringify(favorites));
    renderCryptos(cryptoData, favorites);
};

/**
 * Set up Event Listeners (Event Delegation)
 */
const setupEventListeners = () => {
    // Search
    searchInput.addEventListener('input', (e) => {
        filterCryptos(e.target.value);
    });

    // Theme
    themeToggle.addEventListener('click', toggleTheme);
    retryBtn.addEventListener('click', initAppData);

    // Crypto Grid Delegation (Accordion & Favorites)
    const grid = document.getElementById('crypto-grid');
    grid.addEventListener('click', (e) => {
        const card = e.target.closest('.card');
        const starBtn = e.target.closest('.card__star');

        if (!card) return;

        // 1. Manejo de Favoritos (Estrella)
        if (starBtn) {
            e.stopPropagation(); // Evitar que el clic llegue a la tarjeta y la expanda
            toggleFavorite(card.dataset.id);
            return; // Salir de la función aquí
        }

        // 2. Manejo de Acordeón (Expansión)
        // Solo expandimos si NO se hizo clic en el panel de la calculadora ni en el input
        if (card && !e.target.closest('.calculator')) {
            const isExpanding = !card.classList.contains('card--expanded');

            // [Opcional] Cerrar otras tarjetas abiertas antes de abrir la nueva (Efecto Pro)
            if (isExpanding) {
                document.querySelectorAll('.card--expanded').forEach(otherCard => {
                    otherCard.classList.remove('card--expanded');
                });
            }

            // Alternar la clase en la tarjeta actual
            card.classList.toggle('card--expanded');
        }
    });

    // Calculator Inputs
    grid.addEventListener('input', (e) => {
        if (e.target.classList.contains('calculator__input')) {
            const input = e.target;
            const amount = parseFloat(input.value) || 0;
            const price = parseFloat(input.dataset.price);
            const resultEl = input.parentElement.querySelector('.calculator__result');

            const total = amount * price;
            resultEl.textContent = new Intl.NumberFormat('en-US', {
                style: 'currency',
                currency: 'USD'
            }).format(total);
        }
    });
};

// Auto-refresh every 2 minutes if the user is active
setInterval(() => {
    if (!document.hidden) initAppData();
}, 120000);

// Initialize App
document.addEventListener('DOMContentLoaded', () => {
    initTheme();
    setupEventListeners();
    initAppData();
});
