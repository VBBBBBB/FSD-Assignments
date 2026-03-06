// Data
const restaurants = [
    {
        id: 1,
        name: "La Piazza Web",
        cuisine: "Italian",
        rating: 4.8,
        price: "$$",
        image: "https://placehold.co/600x400/EA8C5F/ffffff?text=Italian+Feast",
        time: "30-45 min"
    },
    {
        id: 2,
        name: "Sakura Sushi",
        cuisine: "Asian",
        rating: 4.9,
        price: "$$$",
        image: "https://placehold.co/600x400/678E76/ffffff?text=Sushi+Platter",
        time: "25-40 min"
    },
    {
        id: 3,
        name: "Taco Fiesta",
        cuisine: "Mexican",
        rating: 4.5,
        price: "$",
        image: "https://placehold.co/600x400/8BA897/ffffff?text=Tacos",
        time: "20-35 min"
    },
    {
        id: 4,
        name: "The Morning Brew",
        cuisine: "Cafe",
        rating: 4.7,
        price: "$",
        image: "https://placehold.co/600x400/F3F1E6/1A1A1A?text=Coffee+%26+Brunch",
        time: "15-25 min"
    },
    {
        id: 5,
        name: "Dragon Wok",
        cuisine: "Asian",
        rating: 4.3,
        price: "$$",
        image: "https://placehold.co/600x400/EA8C5F/ffffff?text=Stir+Fry",
        time: "35-50 min"
    },
    {
        id: 6,
        name: "Pasta House",
        cuisine: "Italian",
        rating: 4.6,
        price: "$$",
        image: "https://placehold.co/600x400/557A64/ffffff?text=Pasta",
        time: "30-40 min"
    }
];

// Determine Page
const path = window.location.pathname;
const isListingPage = path.includes('restaurants.html');

if (isListingPage) {
    initListingPage();
} else {
    initHomePage();
}

function initHomePage() {
    // Search Button Click
    const searchBtn = document.querySelector('.hero-btn');
    if (searchBtn) {
        searchBtn.addEventListener('click', () => {
            const query = document.querySelector('.search-input').value;
            window.location.href = `restaurants.html?search=${encodeURIComponent(query)}`;
        });
    }

    // Category Clicks
    const cards = document.querySelectorAll('.category-card');
    cards.forEach(card => {
        card.addEventListener('click', () => {
            // Simple mapping based on class or text
            let cuisine = '';
            if (card.classList.contains('card-asian')) cuisine = 'Asian';
            else if (card.classList.contains('card-italian')) cuisine = 'Italian';
            else if (card.classList.contains('card-mexican')) cuisine = 'Mexican';
            else if (card.classList.contains('card-bistros')) cuisine = 'Cafe';

            window.location.href = `restaurants.html?cuisine=${encodeURIComponent(cuisine)}`;
        });
    });
}

function initListingPage() {
    const grid = document.getElementById('restaurant-grid');
    const countSpan = document.getElementById('count');

    // Parse URL params
    const urlParams = new URLSearchParams(window.location.search);
    const cuisineFilter = urlParams.get('cuisine');
    const searchFilter = urlParams.get('search');

    // Filter Logic
    let filtered = restaurants;

    if (cuisineFilter) {
        filtered = filtered.filter(r => r.cuisine === cuisineFilter);
        // Check filtering checkbox
        const checkbox = document.querySelector(`input[value="${cuisineFilter}"]`);
        if (checkbox) checkbox.checked = true;
    }

    if (searchFilter) {
        const lower = searchFilter.toLowerCase();
        filtered = filtered.filter(r =>
            r.name.toLowerCase().includes(lower) ||
            r.cuisine.toLowerCase().includes(lower)
        );
    }

    // Render
    renderRestaurants(filtered);

    // Sidebar Filter Listeners
    const inputs = document.querySelectorAll('.filter-option input');
    inputs.forEach(input => {
        input.addEventListener('change', () => {
            // Re-filter based on all checked boxes
            const checkedCuisines = Array.from(document.querySelectorAll('input[name="cuisine"]:checked')).map(cb => cb.value);
            // If no checkboxes, show all (or keep previous logic). Let's implement simple client-side logic

            let newFiltered = restaurants;
            if (checkedCuisines.length > 0) {
                newFiltered = newFiltered.filter(r => checkedCuisines.includes(r.cuisine));
            }

            renderRestaurants(newFiltered);
        });
    });
}

function renderRestaurants(list) {
    const grid = document.getElementById('restaurant-grid');
    const countSpan = document.getElementById('count');

    countSpan.textContent = list.length;
    grid.innerHTML = '';

    if (list.length === 0) {
        grid.innerHTML = '<p>No restaurants found matching your criteria.</p>';
        return;
    }

    list.forEach(r => {
        const card = document.createElement('div');
        card.className = 'rest-card';
        card.innerHTML = `
            <img src="${r.image}" alt="${r.name}" class="rest-image">
            <div class="rest-info">
                <div class="rest-meta">
                    <span class="cuisine-tag">${r.cuisine}</span>
                    <span class="rating-badge">★ ${r.rating}</span>
                </div>
                <h3 class="rest-name">${r.name}</h3>
                <div class="rest-meta">
                    <span>${r.time} • ${r.price}</span>
                </div>
                <button class="view-btn">View Menu</button>
            </div>
        `;
        grid.appendChild(card);
    });
}
