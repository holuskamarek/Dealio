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

async function login(email, password) {
    const res = await fetch(`${API_URL}/auth/login`, {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({ email, password })
    });
    return res.json();
}

async function verifyPin(pinCode) {
    const res = await fetch(`${API_URL}/redemptions/redeem`, {
        method: 'POST',
        headers: {
            'Content-Type': 'application/json',
            'Authorization': `Bearer ${getToken()}`
        },
        body: JSON.stringify({ pin_code: pinCode })
    });
    return res.json();
}

const loginForm = document.getElementById('loginForm');
if (loginForm) {
    if (getToken()) {
        window.location.href = 'dashboard.html';
    }
    
    loginForm.addEventListener('submit', async (e) => {
        e.preventDefault();
        const email = document.getElementById('email').value;
        const password = document.getElementById('password').value;
        const error = document.getElementById('error');
        
        try {
            const data = await login(email, password);
            if (data.access_token) {
                setToken(data.access_token);
                window.location.href = 'dashboard.html';
            } else {
                error.textContent = data.message || 'Chyba přihlášení';
            }
        } catch (err) {
            error.textContent = 'Chyba spojení se serverem';
        }
    });
}

const pinForm = document.getElementById('pinForm');
if (pinForm) {
    if (!getToken()) {
        window.location.href = 'index.html';
    }
    
    pinForm.addEventListener('submit', async (e) => {
        e.preventDefault();
        const pinCode = document.getElementById('pinCode').value;
        const result = document.getElementById('result');
        
        try {
            const data = await verifyPin(pinCode);
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
    
    document.getElementById('logout').addEventListener('click', () => {
        clearToken();
        window.location.href = 'index.html';
    });
}

