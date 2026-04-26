const API_URL = 'http://localhost:3000';
let currentBusiness = null;

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

async function showApp() {
    document.getElementById('loginPage').classList.add('hidden');
    document.getElementById('app').classList.remove('hidden');
    await loadCurrentBusiness();
    loadPage('dashboard');
}

async function loadCurrentBusiness() {
    try {
        const res = await fetch(`${API_URL}/businesses/my`, {
            headers: { 'Authorization': `Bearer ${getToken()}` }
        });
        const data = await res.json();
        if (data.success && data.data) {
            currentBusiness = data.data;
        }
    } catch (err) {
        console.error('Chyba načítání podniku:', err);
    }
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
            <div class="pin-container">
                <h2>Ověření slevy</h2>
                <form id="pinForm" class="pin-form">
                    <input type="text" id="pinCode" placeholder="PIN kód" maxlength="6" required>
                    <button type="submit" class="btn-primary">Ověřit</button>
                    <p id="pinResult"></p>
                </form>
            </div>
        `;
        setupPinForm();
    } else if (page === 'nabidky') {
        content.innerHTML = `
            <div class="page-header">
                <h2>Nabídky</h2>
                <button class="btn-primary" onclick="loadPage('nova-nabidka')">+ Nová nabídka</button>
            </div>
            <div id="promotionsList" class="promotions-list">
                <p>Načítám...</p>
            </div>
        `;
        loadPromotions();
    } else if (page === 'nova-nabidka' || page.startsWith('upravit-nabidku-')) {
        const editId = page.startsWith('upravit-nabidku-') ? page.replace('upravit-nabidku-', '') : null;
        content.innerHTML = `
            <h2>${editId ? 'Upravit nabídku' : 'Nová nabídka'}</h2>
            <form id="promotionForm" class="settings-form">
                <div class="settings-grid">
                    <div class="settings-section">
                        <h3>Základní informace</h3>
                        <div class="form-group">
                            <label>Název akce *</label>
                            <input type="text" id="promoTitle" required minlength="3" maxlength="100">
                        </div>
                        <div class="form-group">
                            <label>Popis</label>
                            <textarea id="promoDescription" rows="3" maxlength="500"></textarea>
                        </div>
                        <div class="form-group">
                            <label>Sleva (%) *</label>
                            <input type="number" id="promoDiscount" min="1" max="100" required>
                        </div>
                        <div class="form-group">
                            <label>Limit uplatnění</label>
                            <input type="number" id="promoLimit" min="1" placeholder="Neomezeno">
                        </div>
                    </div>
                    <div class="settings-section">
                        <h3>Platnost</h3>
                        <div class="form-group">
                            <label>Od *</label>
                            <input type="datetime-local" id="promoStart" required>
                        </div>
                        <div class="form-group">
                            <label>Do *</label>
                            <input type="datetime-local" id="promoEnd" required>
                        </div>
                        <div class="form-group">
                            <label>Cílové hodiny (např. 14:00-17:00)</label>
                            <input type="text" id="promoTargetHours" placeholder="Celý den">
                        </div>
                        <div class="form-group checkbox-group">
                            <label>
                                <input type="checkbox" id="promoActive" checked>
                                Aktivní
                            </label>
                        </div>
                    </div>
                </div>
                <div class="form-actions">
                    <button type="button" class="btn-secondary" onclick="loadPage('nabidky')">Zrušit</button>
                    <button type="submit" class="btn-primary">${editId ? 'Uložit změny' : 'Vytvořit nabídku'}</button>
                </div>
                <p id="promotionResult"></p>
            </form>
        `;
        setupPromotionForm(editId);
    } else if (page === 'kalendar') {
        content.innerHTML = `
            <div class="calendar-container">
                <div class="calendar-header">
                    <div class="calendar-nav">
                        <button class="cal-arrow" id="prevMonth">&lt;</button>
                        <span class="cal-month-title" id="calMonthTitle">Leden 2025</span>
                        <button class="cal-arrow" id="nextMonth">&gt;</button>
                    </div>
                    <div class="calendar-actions">
                        <button class="btn-primary" onclick="loadPage('nova-nabidka')">
                            <svg class="btn-icon" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2.5" stroke-linecap="round">
                                <line x1="12" y1="5" x2="12" y2="19"></line>
                                <line x1="5" y1="12" x2="19" y2="12"></line>
                            </svg>
                            Nová nabídka
                        </button>
                    </div>
                </div>
                <div class="calendar-grid" id="calendarGrid">
                </div>
            </div>
        `;
        initCalendar();
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

async function loadPromotions() {
    const container = document.getElementById('promotionsList');
    try {
        const res = await fetch(`${API_URL}/promotions/my`, {
            headers: { 'Authorization': `Bearer ${getToken()}` }
        });
        const data = await res.json();

        if (data.success && data.data.length > 0) {
            container.innerHTML = data.data.map(p => {
                const now = new Date();
                const start = new Date(p.start_datetime);
                const end = new Date(p.end_datetime);
                let status = 'inactive';
                let statusText = 'Neaktivní';
                if (p.is_active && start <= now && end >= now) {
                    status = 'active';
                    statusText = 'Aktivní';
                } else if (p.is_active && start > now) {
                    status = 'scheduled';
                    statusText = 'Naplánovaná';
                } else if (end < now) {
                    status = 'expired';
                    statusText = 'Ukončená';
                }
                return `
                    <div class="promotion-card">
                        <div class="promotion-info">
                            <h3>${p.title}</h3>
                            <p class="promotion-meta">
                                <span class="discount">-${p.discount_percent}%</span>
                                <span class="dates">${formatDate(start)} – ${formatDate(end)}</span>
                                <span class="status status-${status}">${statusText}</span>
                            </p>
                        </div>
                        <div class="promotion-actions">
                            <button onclick="loadPage('upravit-nabidku-${p.id}')" class="btn-small">Upravit</button>
                            <button onclick="deletePromotion('${p.id}')" class="btn-small btn-danger">Smazat</button>
                        </div>
                    </div>
                `;
            }).join('');
        } else {
            container.innerHTML = '<p class="empty-state">Zatím nemáš žádné nabídky. <a href="#" onclick="loadPage(\'nova-nabidka\'); return false;">Vytvoř první!</a></p>';
        }
    } catch (err) {
        container.innerHTML = '<p class="error">Chyba při načítání nabídek</p>';
    }
}

function formatDate(date) {
    return date.toLocaleDateString('cs-CZ', { day: 'numeric', month: 'numeric' });
}

async function deletePromotion(id) {
    if (!confirm('Opravdu chceš smazat tuto nabídku?')) return;

    try {
        const res = await fetch(`${API_URL}/promotions/${id}`, {
            method: 'DELETE',
            headers: { 'Authorization': `Bearer ${getToken()}` }
        });
        const data = await res.json();
        if (data.success) {
            loadPromotions();
        } else {
            alert(data.message || 'Chyba při mazání');
        }
    } catch (err) {
        alert('Chyba spojení');
    }
}

async function setupPromotionForm(editId) {
    if (editId) {
        try {
            const res = await fetch(`${API_URL}/promotions/${editId}`, {
                headers: { 'Authorization': `Bearer ${getToken()}` }
            });
            const data = await res.json();
            if (data.success && data.data) {
                const p = data.data;
                document.getElementById('promoTitle').value = p.title || '';
                document.getElementById('promoDescription').value = p.description || '';
                document.getElementById('promoDiscount').value = p.discount_percent || '';
                document.getElementById('promoLimit').value = p.limit || '';
                document.getElementById('promoStart').value = toLocalDatetime(p.start_datetime);
                document.getElementById('promoEnd').value = toLocalDatetime(p.end_datetime);
                document.getElementById('promoTargetHours').value = (p.target_hours || []).join(', ');
                document.getElementById('promoActive').checked = p.is_active;
            }
        } catch (err) {
            console.error('Chyba načítání nabídky:', err);
        }
    } else {
        const now = new Date();
        const nextWeek = new Date(now.getTime() + 7 * 24 * 60 * 60 * 1000);
        document.getElementById('promoStart').value = toLocalDatetime(now);
        document.getElementById('promoEnd').value = toLocalDatetime(nextWeek);
    }

    document.getElementById('promotionForm').addEventListener('submit', (e) => savePromotion(e, editId));
}

function toLocalDatetime(date) {
    const d = new Date(date);
    return d.toISOString().slice(0, 16);
}

async function savePromotion(e, editId) {
    e.preventDefault();
    const result = document.getElementById('promotionResult');

    if (!currentBusiness) {
        result.className = 'error';
        result.textContent = 'Nemáš žádný podnik';
        return;
    }

    const targetHoursRaw = document.getElementById('promoTargetHours').value.trim();
    const target_hours = targetHoursRaw ? targetHoursRaw.split(',').map(h => h.trim()) : [];

    const data = {
        business_id: currentBusiness.id,
        title: document.getElementById('promoTitle').value,
        description: document.getElementById('promoDescription').value,
        discount_percent: parseInt(document.getElementById('promoDiscount').value),
        limit: document.getElementById('promoLimit').value ? parseInt(document.getElementById('promoLimit').value) : null,
        start_datetime: new Date(document.getElementById('promoStart').value).toISOString(),
        end_datetime: new Date(document.getElementById('promoEnd').value).toISOString(),
        target_hours: target_hours.length > 0 ? target_hours : null,
        is_active: document.getElementById('promoActive').checked
    };

    try {
        const url = editId ? `${API_URL}/promotions/${editId}` : `${API_URL}/promotions`;
        const method = editId ? 'PUT' : 'POST';

        const res = await fetch(url, {
            method,
            headers: {
                'Content-Type': 'application/json',
                'Authorization': `Bearer ${getToken()}`
            },
            body: JSON.stringify(data)
        });
        const response = await res.json();

        if (response.success) {
            loadPage('nabidky');
        } else {
            result.className = 'error';
            result.textContent = response.message || 'Chyba při ukládání';
        }
    } catch (err) {
        result.className = 'error';
        result.textContent = 'Chyba spojení';
    }
}

let calendarDate = new Date();
let calendarPromotions = [];

const MONTHS_CZ = ['Leden', 'Únor', 'Březen', 'Duben', 'Květen', 'Červen',
                   'Červenec', 'Srpen', 'Září', 'Říjen', 'Listopad', 'Prosinec'];
const DAYS_CZ = ['PO', 'ÚT', 'ST', 'ČT', 'PÁ', 'SO', 'NE'];
const EVENT_COLORS = [
    { bg: '#e0f2fe', border: '#0ea5e9', text: '#0369a1' },
    { bg: '#dcfce7', border: '#22c55e', text: '#166534' },
    { bg: '#fef3c7', border: '#f59e0b', text: '#92400e' },
    { bg: '#fce7f3', border: '#ec4899', text: '#9d174d' },
    { bg: '#ede9fe', border: '#8b5cf6', text: '#5b21b6' },
    { bg: '#ffedd5', border: '#f97316', text: '#9a3412' },
];

async function initCalendar() {
    await loadCalendarPromotions();
    renderCalendar();

    document.getElementById('prevMonth').addEventListener('click', () => {
        calendarDate.setMonth(calendarDate.getMonth() - 1);
        renderCalendar();
    });

    document.getElementById('nextMonth').addEventListener('click', () => {
        calendarDate.setMonth(calendarDate.getMonth() + 1);
        renderCalendar();
    });
}

async function loadCalendarPromotions() {
    try {
        const res = await fetch(`${API_URL}/promotions/my`, {
            headers: { 'Authorization': `Bearer ${getToken()}` }
        });
        const data = await res.json();
        if (data.success) {
            calendarPromotions = data.data;
        }
    } catch (err) {
        console.error('Chyba načítání akcí:', err);
    }
}

function renderCalendar() {
    const grid = document.getElementById('calendarGrid');
    const title = document.getElementById('calMonthTitle');

    const year = calendarDate.getFullYear();
    const month = calendarDate.getMonth();

    title.textContent = `${MONTHS_CZ[month]} ${year}`;

    const firstDay = new Date(year, month, 1);
    const lastDay = new Date(year, month + 1, 0);
    const startDay = (firstDay.getDay() + 6) % 7;
    const daysInMonth = lastDay.getDate();

    let html = '<div class="cal-weekdays">';
    DAYS_CZ.forEach(day => {
        html += `<div class="cal-weekday">${day}</div>`;
    });
    html += '</div><div class="cal-days">';


    for (let i = 0; i < startDay; i++) {
        html += '<div class="cal-day cal-day-empty"></div>';
    }

    const today = new Date();
    for (let day = 1; day <= daysInMonth; day++) {
        const date = new Date(year, month, day);
        const isToday = date.toDateString() === today.toDateString();
        const dayPromotions = getPromotionsForDate(date);

        html += `<div class="cal-day${isToday ? ' cal-day-today' : ''}">
            <span class="cal-day-num">${day}</span>
            <div class="cal-day-events">`;

        dayPromotions.slice(0, 2).forEach(p => {
            const colorIndex = calendarPromotions.findIndex(cp => cp.id === p.id) % EVENT_COLORS.length;
            const color = EVENT_COLORS[colorIndex];
            html += `<div class="cal-event" style="background:${color.bg};border-left-color:${color.border};color:${color.text}" onclick="loadPage('upravit-nabidku-${p.id}')">${p.title}</div>`;
        });

        if (dayPromotions.length > 2) {
            html += `<div class="cal-event-more">+${dayPromotions.length - 2} další</div>`;
        }

        html += '</div></div>';
    }

    html += '</div>';
    grid.innerHTML = html;
}

function getPromotionsForDate(date) {
    return calendarPromotions.filter(p => {
        const start = new Date(p.start_datetime);
        const end = new Date(p.end_datetime);
        start.setHours(0, 0, 0, 0);
        end.setHours(23, 59, 59, 999);
        date.setHours(12, 0, 0, 0);
        return date >= start && date <= end;
    });
}

