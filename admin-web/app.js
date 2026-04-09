const API_URL = 'http://localhost:3000';

function getToken() {
    return localStorage.getItem('token');
}

function setToken(token) {
    localStorage.setItem('token', token);
}

function clearToken() {
    localStorage.removeItem('token');
}

function showLogin() {
    document.getElementById('loginPage').classList.remove('hidden');
    document.getElementById('app').classList.add('hidden');
}

function showApp() {
    document.getElementById('loginPage').classList.add('hidden');
    document.getElementById('app').classList.remove('hidden');
    loadPage('dashboard');
}

function loadPage(page) {
    const content = document.getElementById('pageContent');

    document.querySelectorAll('.nav-link').forEach(link => {
        link.classList.remove('active');
        if (link.dataset.page === page) {
            link.classList.add('active');
        }
    });

    if (page === 'dashboard') {
        content.innerHTML = `
            <h2>Ověření slevy</h2>
            <form id="pinForm" style="max-width: 300px; margin-top: 20px;">
                <input type="text" id="pinCode" placeholder="PIN kód" maxlength="6" required
                       style="text-align: center; font-size: 20px; letter-spacing: 3px; text-transform: uppercase;">
                <button type="submit">Ověřit</button>
                <p id="pinResult"></p>
            </form>
        `;
        setupPinForm();
    } else if (page === 'nabidky') {
        content.innerHTML = '<h2>Nabídky</h2><p>Seznam nabídek.</p>';
    } else if (page === 'nova-nabidka') {
        content.innerHTML = '<h2>Nová nabídka</h2><p>Formulář pro vytvoření nabídky.</p>';
    } else if (page === 'kalendar') {
        content.innerHTML = '<h2>Kalendář</h2><p>Kalendář nabídek.</p>';
    } else if (page === 'nastaveni') {
        content.innerHTML = `
            <form id="settingsForm" class="settings-form">
                <div class="settings-grid">
                    <div class="settings-section">
                        <h3>Základní informace</h3>
                        <div class="form-group">
                            <label>Název podniku</label>
                            <input type="text" id="businessName" required>
                        </div>
                        <div class="form-group">
                            <label>Kategorie</label>
                            <select id="businessType">
                                <option value="kavarna">Kavárna</option>
                                <option value="bistro">Bistro</option>
                                <option value="restaurace">Restaurace</option>
                                <option value="pizzerie">Pizzerie</option>
                                <option value="cukrarna">Cukrárna</option>
                                <option value="hospoda">Hospoda</option>
                                <option value="kvetinarstvi">Květinářství</option>
                                <option value="kadernictvi">Kadeřnictví</option>
                                <option value="ostatni">Ostatní</option>
                            </select>
                        </div>
                        <div class="form-group">
                            <label>Adresa</label>
                            <input type="text" id="businessAddress" required>
                        </div>
                    </div>
                    <div class="settings-section">
                        <h3>Otevírací doba</h3>
                        <div class="opening-hours">
                            <div class="hour-row"><span>Pondělí</span><input type="time" id="oh-mon-open"> – <input type="time" id="oh-mon-close"></div>
                            <div class="hour-row"><span>Úterý</span><input type="time" id="oh-tue-open"> – <input type="time" id="oh-tue-close"></div>
                            <div class="hour-row"><span>Středa</span><input type="time" id="oh-wed-open"> – <input type="time" id="oh-wed-close"></div>
                            <div class="hour-row"><span>Čtvrtek</span><input type="time" id="oh-thu-open"> – <input type="time" id="oh-thu-close"></div>
                            <div class="hour-row"><span>Pátek</span><input type="time" id="oh-fri-open"> – <input type="time" id="oh-fri-close"></div>
                            <div class="hour-row"><span>Sobota</span><input type="time" id="oh-sat-open"> – <input type="time" id="oh-sat-close"></div>
                            <div class="hour-row"><span>Neděle</span><input type="time" id="oh-sun-open"> – <input type="time" id="oh-sun-close"></div>
                        </div>
                    </div>
                </div>
                <div class="settings-section settings-full">
                    <h3>Popis podniku</h3>
                    <div class="form-group">
                        <label>Krátký popis (zobrazí se zákazníkům)</label>
                        <textarea id="businessDescription" rows="4"></textarea>
                    </div>
                </div>
                <button type="submit" class="btn-primary">Uložit změny</button>
                <p id="settingsResult"></p>
            </form>
        `;
        loadSettings();
    }
}

document.addEventListener('DOMContentLoaded', () => {
    if (getToken()) {
        showApp();
    } else {
        showLogin();
    }

    document.getElementById('loginForm').addEventListener('submit', async (e) => {
        e.preventDefault();
        const email = document.getElementById('email').value;
        const password = document.getElementById('password').value;
        const error = document.getElementById('error');

        try {
            const res = await fetch(`${API_URL}/auth/login`, {
                method: 'POST',
                headers: { 'Content-Type': 'application/json' },
                body: JSON.stringify({ email, password })
            });
            const data = await res.json();

            if (data.access_token) {
                setToken(data.access_token);
                showApp();
            } else {
                error.textContent = data.message || 'Chyba přihlášení';
            }
        } catch (err) {
            error.textContent = 'Chyba spojení se serverem';
        }
    });

    document.querySelectorAll('.nav-link').forEach(link => {
        link.addEventListener('click', (e) => {
            e.preventDefault();
            loadPage(link.dataset.page);
        });
    });

    document.getElementById('logoutBtn').addEventListener('click', () => {
        clearToken();
        showLogin();
    });
});

function setupPinForm() {
    const form = document.getElementById('pinForm');
    if (!form) return;

    form.addEventListener('submit', async (e) => {
        e.preventDefault();
        const pinCode = document.getElementById('pinCode').value;
        const result = document.getElementById('pinResult');

        try {
            const res = await fetch(`${API_URL}/redemptions/redeem`, {
                method: 'POST',
                headers: {
                    'Content-Type': 'application/json',
                    'Authorization': `Bearer ${getToken()}`
                },
                body: JSON.stringify({ pin_code: pinCode })
            });
            const data = await res.json();

            if (data.success) {
                result.className = 'success';
                result.textContent = `✓ ${data.data.promotion.title} - ${data.data.user.name}`;
                document.getElementById('pinCode').value = '';
            } else {
                result.className = 'error';
                result.textContent = data.message || 'Neplatný PIN';
            }
        } catch (err) {
            result.className = 'error';
            result.textContent = 'Chyba spojení';
        }
    });
}

let currentBusiness = null;

async function loadSettings() {
    try {
        const res = await fetch(`${API_URL}/businesses/my`, {
            headers: { 'Authorization': `Bearer ${getToken()}` }
        });
        const data = await res.json();

        if (data.success && data.data) {
            currentBusiness = data.data;
            document.getElementById('businessName').value = currentBusiness.name || '';
            document.getElementById('businessAddress').value = currentBusiness.address || '';
            document.getElementById('businessType').value = currentBusiness.type || 'ostatni';
            document.getElementById('businessDescription').value = currentBusiness.description || '';

            const hours = currentBusiness.opening_hours || {};
            const dayMap = { monday: 'mon', tuesday: 'tue', wednesday: 'wed', thursday: 'thu', friday: 'fri', saturday: 'sat', sunday: 'sun' };
            for (const [day, abbr] of Object.entries(dayMap)) {
                if (hours[day]) {
                    document.getElementById(`oh-${abbr}-open`).value = hours[day].open || '';
                    document.getElementById(`oh-${abbr}-close`).value = hours[day].close || '';
                }
            }
        }
    } catch (err) {
        console.error('Chyba načítání nastavení:', err);
    }

    document.getElementById('settingsForm').addEventListener('submit', saveSettings);
}

async function saveSettings(e) {
    e.preventDefault();
    const result = document.getElementById('settingsResult');

    if (!currentBusiness) {
        result.className = 'error';
        result.textContent = 'Nemáš žádný podnik';
        return;
    }

    const dayMap = { mon: 'monday', tue: 'tuesday', wed: 'wednesday', thu: 'thursday', fri: 'friday', sat: 'saturday', sun: 'sunday' };
    const opening_hours = {};
    for (const [abbr, day] of Object.entries(dayMap)) {
        const open = document.getElementById(`oh-${abbr}-open`).value;
        const close = document.getElementById(`oh-${abbr}-close`).value;
        if (open && close) {
            opening_hours[day] = { open, close };
        }
    }

    const data = {
        name: document.getElementById('businessName').value,
        address: document.getElementById('businessAddress').value,
        type: document.getElementById('businessType').value,
        description: document.getElementById('businessDescription').value,
        opening_hours
    };

    try {
        const res = await fetch(`${API_URL}/businesses/${currentBusiness.id}`, {
            method: 'PUT',
            headers: {
                'Content-Type': 'application/json',
                'Authorization': `Bearer ${getToken()}`
            },
            body: JSON.stringify(data)
        });
        const response = await res.json();

        if (response.success) {
            result.className = 'success';
            result.textContent = 'Změny uloženy';
            currentBusiness = response.data;
        } else {
            result.className = 'error';
            result.textContent = response.message || 'Chyba při ukládání';
        }
    } catch (err) {
        result.className = 'error';
        result.textContent = 'Chyba spojení';
    }
}

