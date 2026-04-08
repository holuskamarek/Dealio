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
        content.innerHTML = '<h2>Nastavení</h2><p>Nastavení podniku.</p>';
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

