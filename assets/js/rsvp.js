document.addEventListener('DOMContentLoaded', () => {
    // --- State and Configuration ---
    let submitted = false;

    const appetizerData = [
        {value: "Balsamic Salad", img: "assets/images/appetizer/balsamic-salad.png"},
        {value: "Calamari Fries", img: "assets/images/appetizer/calamari-fries.png"},
        {value: "Crispy Salmon Toro", img: "assets/images/appetizer/crispy-salmon-toro.png"},
        {value: "Garlic Butter Grilled Prawns", img: "assets/images/appetizer/garlic-butter-grilled-prawns.png"},
        {value: "Mega Crispy Corn", img: "assets/images/appetizer/mega-crispy-corn.png"},
        {value: "Salmon Ikura Bite", img: "assets/images/appetizer/salmon-ikura-bite.png"},
        {value: "Snow Crab Katsu", img: "assets/images/appetizer/snow-crab-katsu.png"},
        {value: "Spicy Salmon", img: "assets/images/appetizer/spicy-salmon.png"},
        {value: "Sweet Potato Fries", img: "assets/images/appetizer/sweet-potato-fries.png"},
        {value: "Truffle Soup", img: "assets/images/appetizer/truffle-soup.png"},
    ];

    const mainDishData = [
        {value: "Aglio Olio Bacon Pasta", img: "assets/images/main-dish/aglio-olio-bacon-pasta.png"},
        {value: "Black Ocean Pasta", img: "assets/images/main-dish/black-ocean-pasta.png"},
        {value: "Chashu Don", img: "assets/images/main-dish/chashu-don.png"},
        {value: "Chicken Miso Butter", img: "assets/images/main-dish/chicken-miso-butter.png"},
        {value: "Creamy Carbonara Pasta", img: "assets/images/main-dish/creamy-carbonara-pasta.png"},
        {value: "Duck Confit Orange", img: "assets/images/main-dish/duck-confit-orange.png"},
        {value: "Le Saumon Lava Roll", img: "assets/images/main-dish/le-saumon-lava-roll.png"},
        {value: "Teriyaki Tori Don", img: "assets/images/main-dish/teriyaki-tori-don.png"},
        {value: "Truffle Ravioli", img: "assets/images/main-dish/truffle-ravioli.png"},
        {value: "Wagyu Garlic Fried Rice", img: "assets/images/main-dish/wagyu-garlic-fried-rice.png"},
    ];

    const beverageData = [
        {value: "Caramel Crumble Frappe", img: "assets/images/beverages/caramel-crumble-frappe.png"},
        {value: "Mango Yogurt Smoothie", img: "assets/images/beverages/mango-yogurt-smoothie.png"},
        {value: "Mixberry Yogurt Sparkling", img: "assets/images/beverages/mixberry-yogurt-sparkling.png"},
        {value: "Orange Espresso", img: "assets/images/beverages/orange-espresso.png"},
        {value: "Peachy Cold Brew", img: "assets/images/beverages/peachy-cold-brew.png"},
        {value: "Strawberry Matcha", img: "assets/images/beverages/strawberry-matcha.png"},
        {value: "Strawberry Smoothie", img: "assets/images/beverages/strawberry-smoothie.png"},
        {value: "Tropical Fruit Frappe", img: "assets/images/beverages/tropical-fruit-frappe.png"},
    ];

    // --- DOM Element References ---
    const formContainer = document.getElementById("form-container");
    const rsvpForm = document.getElementById('rsvp-form');
    const hiddenIframe = document.getElementById('hidden_iframe');
    const attendingSelect = document.getElementById('is-attending');
    const guestCountSelect = document.getElementById('guest-count');
    const attendingDetails = document.getElementById('attending-details');
    const guestMenuDetails = document.getElementById('guest-menu-details');

    // --- Functions ---
    function showSuccessMessage() {
        const attendance = attendingSelect.value;
        let messageHtml;
        if (attendance === 'No') {
            messageHtml = `
                <div class="text-center py-16">
                    <h2 class="text-3xl serif-font text-[#6c584c] mb-4">Thank you for your RSVP!</h2>
                    <p class="text-gray-700 text-lg">We’ll miss you, but we’re so grateful for your warm wishes.</p>
                </div>
            `;
        } else {
            messageHtml = `
                <div class="text-center py-16">
                    <h2 class="text-3xl text-green-600 font-semibold mb-4">🎉 Thank You!</h2>
                    <p class="text-gray-700 text-lg">Your RSVP has been submitted successfully.</p>
                </div>
            `;
        }
        if (formContainer) {
            formContainer.innerHTML = messageHtml;
        }
    }

    function clearMenuSelection(inputsContainerId) {
        const optionsContainer = document.getElementById(inputsContainerId.replace('-inputs', '-options'));
        if (optionsContainer) {
            optionsContainer.querySelectorAll('.menu-option.selected').forEach(opt => opt.classList.remove('selected'));
        }
        const inputsContainer = document.getElementById(inputsContainerId);
        if (inputsContainer) {
            inputsContainer.innerHTML = '';
        }
    }

    function validateRsvp() {
        const isAttending = attendingSelect.value === 'Yes';
        if (!isAttending) return true; // If not attending, always valid

        const appetizerSelected = document.querySelectorAll('#appetizer-selection-inputs input').length > 0;
        const mainDishSelected = document.querySelectorAll('#main-dish-selection-inputs input').length > 0;
        const beverageSelected = document.querySelectorAll('#beverage-selection-inputs input').length > 0;


        if (!appetizerSelected || !mainDishSelected || !beverageSelected) {
            alert("Please select an appetizer and a main dish, and a beverage for yourself.");
            return false;
        }

        const guestCount = guestCountSelect.value;
        if (guestCount === '1') {
            const guestAppetizerSelected = document.querySelectorAll('#guest-appetizer-selection-inputs input').length > 0;
            const guestMainDishSelected = document.querySelectorAll('#guest-main-dish-selection-inputs input').length > 0;
            const guestBeverageSelected = document.querySelectorAll('#guest-beverage-selection-inputs input').length > 0;
            if (!guestAppetizerSelected || !guestMainDishSelected || !guestBeverageSelected) {
                alert("Please select an appetizer and a main dish, and a beverage for your guest.");
                return false;
            }
        }
        return true;
    }

    function createMenuItem(item, type = 'food') {
        const imageClasses = type === 'beverage'
            ? 'w-full h-32 object-contain'
            : 'w-full h-32 object-cover';
        return `
            <div class="menu-option cursor-pointer border-2 border-gray-300 rounded-lg p-2 text-center transition-all hover:scale-105 hover:-translate-y-1 hover:shadow-xl" data-value="${item.value}">
                <div class="relative rounded-md overflow-hidden">
                    <img src="${item.img}" alt="${item.value}" class="${imageClasses}">
                    <span class="absolute bottom-0 left-0 right-0 p-1 bg-black/50 text-white text-xs font-medium text-center">${item.value}</span>
                </div>
            </div>
        `;
    }

    function populateMenu(containerId, data, type = 'food') {
        const container = document.getElementById(containerId);
        if (container) container.innerHTML = data.map(item => createMenuItem(item, type)).join('');
    }

    function setupMenuSelection(optionsContainerId, inputsContainerId, entryId) {
        const optionsContainer = document.getElementById(optionsContainerId);
        const inputsContainer = document.getElementById(inputsContainerId);
        if (!optionsContainer || !inputsContainer) return;

        optionsContainer.addEventListener('click', (e) => {
            const clickedOption = e.target.closest('.menu-option');
            if (!clickedOption) return;

            const isSelected = clickedOption.classList.contains('selected');
            optionsContainer.querySelectorAll('.menu-option').forEach(opt => opt.classList.remove('selected'));

            if (!isSelected) {
                clickedOption.classList.add('selected');
            }

            inputsContainer.innerHTML = '';
            if (clickedOption.classList.contains('selected')) {
                const newInput = document.createElement('input');
                newInput.type = 'hidden';
                newInput.name = entryId;
                newInput.value = clickedOption.dataset.value;
                inputsContainer.appendChild(newInput);
            }
        });
    }

    // --- Event Listeners and Initial Setup ---

    // Populate all menus from data arrays
    populateMenu('appetizer-options', appetizerData, 'food');
    populateMenu('main-dish-options', mainDishData, 'food');
    populateMenu('beverage-options', beverageData, 'beverage');
    populateMenu('guest-appetizer-options', appetizerData, 'food');
    populateMenu('guest-main-dish-options', mainDishData, 'food');
    populateMenu('guest-beverage-options', beverageData, 'beverage');

    // Setup selection logic for all menus
    setupMenuSelection('appetizer-options', 'appetizer-selection-inputs', 'entry.588393791');
    setupMenuSelection('main-dish-options', 'main-dish-selection-inputs', 'entry.2109138769');
    setupMenuSelection('beverage-options', 'beverage-selection-inputs', 'entry.261692406');
    setupMenuSelection('guest-appetizer-options', 'guest-appetizer-selection-inputs', 'entry.898720481');
    setupMenuSelection('guest-main-dish-options', 'guest-main-dish-selection-inputs', 'entry.421453520');
    setupMenuSelection('guest-beverage-options', 'guest-beverage-selection-inputs', 'entry.1484470508');

    // Handle form submission
    if (rsvpForm) {
        rsvpForm.addEventListener('submit', (event) => {
            if (!validateRsvp()) {
                event.preventDefault(); // Stop submission if validation fails
            } else {
                submitted = true; // Mark as submitted for the iframe's load event
            }
        });
    }

    // Handle iframe load for success message
    if (hiddenIframe) {
        hiddenIframe.addEventListener('load', () => {
            if (submitted) {
                showSuccessMessage();
            }
        });
    }

    // Show/hide fields based on attendance
    if (attendingSelect) {
        attendingSelect.addEventListener('change', (e) => {
            if (e.target.value === 'Yes') {
                attendingDetails.style.display = 'block';
            } else {
                attendingDetails.style.display = 'none';
                guestMenuDetails.style.display = 'none';
            }
        });
    }

    // Show/hide guest menus based on guest count
    if (guestCountSelect) {
        guestCountSelect.addEventListener('change', (e) => {
            if (e.target.value === '1') {
                guestMenuDetails.style.display = 'block';
            } else {
                guestMenuDetails.style.display = 'none';
                clearMenuSelection('guest-appetizer-selection-inputs');
                clearMenuSelection('guest-main-dish-selection-inputs');
                clearMenuSelection('guest-beverage-selection-inputs');
            }
        });
    }
});
