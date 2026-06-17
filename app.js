// ============ ЛОКАЛЬНОЕ ХРАНИЛИЩЕ ============
let users = JSON.parse(localStorage.getItem('talants_users')) || [
    { id: '1', email: 'admin@talants.ru', password: 'Admin2025', name: 'Мария Петровна', role: 'admin', groupId: null },
    { id: '2', email: 'teacher@mail.tu', password: 'ppp22rrtt66', name: 'Анна Сергеевна', role: 'teacher', groupId: 'g1' },
    { id: '3', email: 'roditell77@mail.ru', password: 'ppp22rrtt66', name: 'Елена Иванова', role: 'parent', groupId: null }
];

let specialists = JSON.parse(localStorage.getItem('talants_specialists')) || [
    { id: 's1', name: 'Ольга Владимировна', type: 'Логопед', phone: '+7(999)123-45-67' },
    { id: 's2', name: 'Ирина Петровна', type: 'Психолог', phone: '+7(999)234-56-78' },
    { id: 's3', name: 'Сергей Александрович', type: 'Музыкальный руководитель', phone: '+7(999)345-67-89' }
];

let kids = JSON.parse(localStorage.getItem('talants_kids')) || [
    { id: 'k1', name: 'Миша Иванов', parentId: '3', groupId: 'g1' },
    { id: 'k2', name: 'Алиса Иванова', parentId: '3', groupId: 'g1' }
];

let groups = JSON.parse(localStorage.getItem('talants_groups')) || [
    { id: 'g1', name: 'Солнышко' },
    { id: 'g2', name: 'Звёздочки' },
    { id: 'g3', name: 'Ромашки' }
];

let circles = JSON.parse(localStorage.getItem('talants_circles')) || [
    { id: 'c1', name: 'Логопедическая коррекция', weekday: 'Понедельник', time: '15:00', specialistId: 's1' },
    { id: 'c2', name: 'Развитие речи', weekday: 'Среда', time: '16:00', specialistId: 's1' },
    { id: 'c3', name: 'Психологическая поддержка', weekday: 'Пятница', time: '15:30', specialistId: 's2' },
    { id: 'c4', name: 'Музыкальные занятия', weekday: 'Вторник', time: '14:00', specialistId: 's3' }
];

let circleRequests = JSON.parse(localStorage.getItem('talants_circle_requests')) || [];
let individualActivities = JSON.parse(localStorage.getItem('talants_individual_activities')) || [
    { id: 'a1', name: 'Логопед' },
    { id: 'a2', name: 'Психолог' },
    { id: 'a3', name: 'Музыка' }
];
let assignedActivities = JSON.parse(localStorage.getItem('talants_assigned_activities')) || [];

let scheduleCommon = JSON.parse(localStorage.getItem('talants_schedule')) || [
    { id: 'sch1', time: '08:30', title: 'Утренний приём детей', description: 'Встреча детей, осмотр, беседа с родителями' },
    { id: 'sch2', time: '09:00', title: 'Завтрак', description: '' },
    { id: 'sch3', time: '09:30', title: 'Образовательная деятельность', description: 'Занятия по программе' },
    { id: 'sch4', time: '11:00', title: 'Прогулка', description: 'На свежем воздухе' },
    { id: 'sch5', time: '12:30', title: 'Обед', description: '' },
    { id: 'sch6', time: '13:30', title: 'Тихий час', description: 'Дневной сон' },
    { id: 'sch7', time: '15:30', title: 'Полдник', description: '' },
    { id: 'sch8', time: '16:00', title: 'Свободная деятельность', description: 'Игры, кружки' }
];

let privateMessages = JSON.parse(localStorage.getItem('talants_private_messages')) || [];
let messages = JSON.parse(localStorage.getItem('talants_messages')) || [];

let currentUser = null;
let selectedChildId = null;
let adminSelectedChatGroupId = null;
let selectedPrivateChatUserId = null;

const WEEKDAYS = ['Понедельник', 'Вторник', 'Среда', 'Четверг', 'Пятница'];

function saveData() {
    localStorage.setItem('talants_users', JSON.stringify(users));
    localStorage.setItem('talants_specialists', JSON.stringify(specialists));
    localStorage.setItem('talants_kids', JSON.stringify(kids));
    localStorage.setItem('talants_groups', JSON.stringify(groups));
    localStorage.setItem('talants_circles', JSON.stringify(circles));
    localStorage.setItem('talants_circle_requests', JSON.stringify(circleRequests));
    localStorage.setItem('talants_individual_activities', JSON.stringify(individualActivities));
    localStorage.setItem('talants_assigned_activities', JSON.stringify(assignedActivities));
    localStorage.setItem('talants_schedule', JSON.stringify(scheduleCommon));
    localStorage.setItem('talants_private_messages', JSON.stringify(privateMessages));
    localStorage.setItem('talants_messages', JSON.stringify(messages));
}

function escapeHtml(str) {
    if (!str) return '';
    return str.replace(/[&<>]/g, m => ({ '&': '&amp;', '<': '&lt;', '>': '&gt;' }[m]));
}

function closeModal() {
    const modal = document.querySelector('.modal-overlay');
    if (modal) modal.remove();
}

function showModal(html) {
    closeModal();
    const overlay = document.createElement('div');
    overlay.className = 'modal-overlay';
    overlay.innerHTML = `<div class="modal-content">${html}</div>`;
    document.body.appendChild(overlay);
}

// ============ АВТОРИЗАЦИЯ ============
function showLogin() {
    document.getElementById("content").innerHTML = `
        <div class="card">
            <div class="card-title"><i class="fas fa-key"></i> Вход в систему</div>
            <input id="loginEmail" placeholder="Email">
            <input id="loginPass" type="password" placeholder="Пароль">
            <div id="loginError" class="error-msg"></div>
            <button onclick="doLogin()"><i class="fas fa-sign-in-alt"></i> Войти</button>
            <div class="small">Тестовые аккаунты:<br>
            Администратор: admin@talants.ru / Admin2025<br>
            Воспитатель: teacher@mail.tu / ppp22rrtt66<br>
            Родитель: roditell77@mail.ru / ppp22rrtt66</div>
        </div>
    `;
}

window.doLogin = () => {
    const email = document.getElementById("loginEmail").value.trim();
    const pass = document.getElementById("loginPass").value;
    const errDiv = document.getElementById("loginError");
    
    if (!email || !pass) {
        errDiv.style.display = "block";
        errDiv.innerText = "Заполните поля";
        return;
    }
    
    const user = users.find(u => u.email === email && u.password === pass);
    if (!user) {
        errDiv.style.display = "block";
        errDiv.innerText = "Неверный email или пароль";
        return;
    }
    
    currentUser = user;
    selectedChildId = null;
    adminSelectedChatGroupId = null;
    selectedPrivateChatUserId = null;
    localStorage.setItem('talants_currentUser', JSON.stringify(user));
    updateTabBar();
    navigate('home');
};

window.logout = () => {
    currentUser = null;
    selectedChildId = null;
    localStorage.removeItem('talants_currentUser');
    document.getElementById("tabbar").innerHTML = "";
    showLogin();
};

// ============ НАСТРОЙКА ВКЛАДОК ПО РОЛИ ============
function updateTabBar() {
    if (!currentUser) return;
    const role = currentUser.role;
    const tabbar = document.getElementById("tabbar");
    
    const allTabs = [
        { id: 'home', icon: 'fa-home', label: 'Главная', roles: ['admin', 'teacher', 'parent'] },
        { id: 'kids', icon: 'fa-baby-carriage', label: 'Дети', roles: ['admin', 'parent'] },
        { id: 'circles', icon: 'fa-palette', label: 'Кружки', roles: ['admin', 'teacher', 'parent'] },
        { id: 'specialists', icon: 'fa-user-md', label: 'Специалисты', roles: ['admin'] },
        { id: 'activities', icon: 'fa-star', label: 'Занятия', roles: ['admin', 'teacher', 'parent'] },
        { id: 'schedule', icon: 'fa-calendar-alt', label: 'Расписание', roles: ['admin', 'teacher', 'parent'] },
        { id: 'groups', icon: 'fa-users', label: 'Группы', roles: ['admin', 'teacher'] },
        { id: 'registerUser', icon: 'fa-user-plus', label: 'Регистрация', roles: ['admin'] },
        { id: 'chat', icon: 'fa-comment-dots', label: 'Чат', roles: ['admin', 'teacher', 'parent'] },
        { id: 'private', icon: 'fa-envelope', label: 'Личные сообщения', roles: ['admin', 'teacher', 'parent'] },
        { id: 'profile', icon: 'fa-user', label: 'Профиль', roles: ['admin', 'teacher', 'parent'] }
    ];
    
    const visibleTabs = allTabs.filter(tab => tab.roles.includes(role));
    
    tabbar.innerHTML = visibleTabs.map(tab => `
        <div class="tab" onclick="navigate('${tab.id}')">
            <i class="fas ${tab.icon}"></i>
        </div>
    `).join('');
    
    tabbar.style.display = "flex";
}

// ============ РЕГИСТРАЦИЯ ПОЛЬЗОВАТЕЛЕЙ (ТОЛЬКО АДМИН) ============
function renderRegisterUser() {
    if (!currentUser) return `<div class="card">Войдите</div>`;
    if (currentUser.role !== "admin") {
        return `<div class="card"><div class="text-center">Доступ запрещён. Только для администратора.</div></div>`;
    }
    
    return `
        <div class="card">
            <div class="card-title"><i class="fas fa-user-plus"></i> Регистрация пользователей</div>
            <div class="small">Зарегистрируйте нового родителя или воспитателя</div>
            <input id="regUserName" placeholder="Имя пользователя">
            <input id="regUserEmail" placeholder="Email">
            <input id="regUserPass" type="password" placeholder="Пароль (мин 6)">
            <select id="regUserRole">
                <option value="parent">Родитель</option>
                <option value="teacher">Воспитатель</option>
            </select>
            <div id="regUserError" class="error-msg"></div>
            <div id="regUserSuccess" class="success-msg"></div>
            <button onclick="registerUser()"><i class="fas fa-save"></i> Зарегистрировать</button>
        </div>
    `;
}

window.registerUser = () => {
    const name = document.getElementById("regUserName")?.value.trim();
    const email = document.getElementById("regUserEmail")?.value.trim();
    const pass = document.getElementById("regUserPass")?.value;
    const role = document.getElementById("regUserRole")?.value;
    const errDiv = document.getElementById("regUserError");
    const sucDiv = document.getElementById("regUserSuccess");
    
    errDiv.style.display = "none";
    sucDiv.style.display = "none";
    
    if (!name || !email || !pass) {
        errDiv.style.display = "block";
        errDiv.innerText = "Заполните все поля";
        return;
    }
    if (pass.length < 6) {
        errDiv.style.display = "block";
        errDiv.innerText = "Пароль должен быть не менее 6 символов";
        return;
    }
    if (users.find(u => u.email === email)) {
        errDiv.style.display = "block";
        errDiv.innerText = "Email уже зарегистрирован";
        return;
    }
    
    users.push({ id: Date.now().toString(), email, password: pass, name, role, groupId: null });
    saveData();
    
    document.getElementById("regUserName").value = "";
    document.getElementById("regUserEmail").value = "";
    document.getElementById("regUserPass").value = "";
    
    sucDiv.style.display = "block";
    sucDiv.innerText = `✅ ${role === 'parent' ? 'Родитель' : 'Воспитатель'} ${name} зарегистрирован!`;
    setTimeout(() => sucDiv.style.display = "none", 3000);
};

// ============ ГЛАВНАЯ ============
function renderHome() {
    if (!currentUser) return `<div class="card">Ошибка</div>`;
    const roleIcon = currentUser.role === "admin" ? "👑" : (currentUser.role === "teacher" ? "👩‍🏫" : "👪");
    const roleName = currentUser.role === "admin" ? "Администратор" : (currentUser.role === "teacher" ? "Воспитатель" : "Родитель");
    return `
        <div class="card" style="text-align:center;">
            <div style="font-size: 48px;">${roleIcon}</div>
            <h3>${escapeHtml(currentUser.name)}</h3>
            <span class="badge">${roleName}</span>
            <div style="margin-top: 20px;">
                <button onclick="logout()"><i class="fas fa-sign-out-alt"></i> Выйти</button>
            </div>
        </div>
    `;
}

// ============ ДЕТИ ============
function renderKids() {
    if (!currentUser) return `<div class="card">Войдите</div>`;
    
    if (currentUser.role === "parent") {
        const myKids = kids.filter(k => k.parentId === currentUser.id);
        let kidsHtml = myKids.map(k => `
            <div class="list-item ${selectedChildId === k.id ? 'active' : ''}" onclick="selectChild('${k.id}')">
                <span>👶 ${escapeHtml(k.name)} ${k.groupId ? `<span class="assigned-badge">${groups.find(g => g.id === k.groupId)?.name}</span>` : ''}</span>
                <i class="fas fa-chevron-right"></i>
            </div>
        `).join('');
        
        return `
            <div class="card">
                <div class="card-title"><i class="fas fa-baby-carriage"></i> Мои дети</div>
                <div>${kidsHtml || "<div class='text-center'>Нет детей</div>"}</div>
                ${selectedChildId ? `<div class="success-msg" style="display:block; margin-top:15px;">✅ Выбран: ${escapeHtml(myKids.find(k => k.id === selectedChildId)?.name)}</div>` : `<div class="error-msg" style="display:block; margin-top:15px;">⚠️ Выберите ребёнка</div>`}
            </div>
        `;
    }
    
    if (currentUser.role === "admin") {
        const parents = users.filter(u => u.role === 'parent');
        
        let allKidsHtml = kids.map(k => {
            const parent = users.find(u => u.id === k.parentId);
            return `
                <div class="list-item">
                    <span>👶 ${escapeHtml(k.name)} (родитель: ${parent?.name || 'не указан'}) ${k.groupId ? `<span class="assigned-badge">${groups.find(g => g.id === k.groupId)?.name}</span>` : ''}</span>
                    <select onchange="assignKidToGroup('${k.id}', this.value)" class="inline-select" style="width:auto;">
                        <option value="">Без группы</option>
                        ${groups.map(g => `<option value="${g.id}" ${k.groupId === g.id ? 'selected' : ''}>${escapeHtml(g.name)}</option>`).join('')}
                    </select>
                    <button onclick="deleteKid('${k.id}')" class="small-btn delete-btn">🗑️</button>
                </div>
            `;
        }).join('');
        
        let addChildForm = `
            <hr>
            <h4>Добавить ребёнка</h4>
            <div class="flex">
                <select id="addChildParentSelect" style="flex:2;">
                    <option value="">Выберите родителя</option>
                    ${parents.map(p => `<option value="${p.id}">${escapeHtml(p.name)} (${escapeHtml(p.email)})</option>`).join('')}
                </select>
                <input id="addChildName" placeholder="Имя ребёнка" style="flex:2;">
                <select id="addChildGroupId" class="inline-select" style="width:auto;">
                    <option value="">Без группы</option>
                    ${groups.map(g => `<option value="${g.id}">${escapeHtml(g.name)}</option>`).join('')}
                </select>
                <button onclick="addChildToExistingParent()" class="small-btn">Добавить</button>
            </div>
        `;
        
        return `<div class="card"><div class="card-title"><i class="fas fa-users-viewfinder"></i> Все дети</div>${addChildForm}<div>${allKidsHtml || "Нет детей"}</div></div>`;
    }
    
    return `<div class="card"><div class="text-center">Только для родителей</div></div>`;
}

window.addChildToExistingParent = () => {
    const parentId = document.getElementById("addChildParentSelect")?.value;
    const childName = document.getElementById("addChildName")?.value.trim();
    const groupId = document.getElementById("addChildGroupId")?.value;
    
    if (!parentId) { alert("Выберите родителя"); return; }
    if (!childName) { alert("Введите имя ребёнка"); return; }
    
    kids.push({
        id: Date.now().toString(),
        name: childName,
        parentId: parentId,
        groupId: groupId || null
    });
    saveData();
    
    document.getElementById("addChildName").value = "";
    alert(`✅ Ребёнок ${childName} добавлен!`);
    navigate('kids');
};

window.selectChild = (id) => {
    selectedChildId = id;
    alert("Ребёнок выбран!");
    navigate('kids');
};

window.assignKidToGroup = (kidId, groupId) => {
    const kid = kids.find(k => k.id === kidId);
    if (kid) {
        kid.groupId = groupId || null;
        saveData();
        alert(`✅ Ребёнок ${kid.name} назначен в группу`);
        navigate('kids');
    }
};

window.deleteKid = (kidId) => {
    if (confirm("Удалить ребёнка? Это действие нельзя отменить!")) {
        kids = kids.filter(k => k.id !== kidId);
        circleRequests = circleRequests.filter(r => r.childId !== kidId);
        assignedActivities = assignedActivities.filter(a => a.childId !== kidId);
        saveData();
        navigate('kids');
    }
};

// ============ СПЕЦИАЛИСТЫ (ТОЛЬКО АДМИН) ============
function renderSpecialists() {
    if (!currentUser) return `<div class="card">Войдите</div>`;
    if (currentUser.role !== "admin") {
        return `<div class="card"><div class="text-center">Доступ запрещён. Только для администратора.</div></div>`;
    }
    
    let specialistsHtml = specialists.map(s => `
        <div class="list-item">
            <span><strong>${escapeHtml(s.name)}</strong> — ${escapeHtml(s.type)}<br><small>${escapeHtml(s.phone || '')}</small></span>
            <button onclick="deleteSpecialist('${s.id}')" class="small-btn delete-btn">🗑️</button>
        </div>
    `).join('');
    
    return `
        <div class="card">
            <div class="card-title"><i class="fas fa-user-md"></i> Специалисты дополнительного образования</div>
            <div class="small">Логопеды, психологи, музыкальные руководители и другие</div>
            <div>${specialistsHtml || "Нет специалистов"}</div>
            <hr>
            <h4>Добавить специалиста</h4>
            <input id="newSpecName" placeholder="ФИО специалиста">
            <input id="newSpecType" placeholder="Специальность (Логопед, Психолог...)">
            <input id="newSpecPhone" placeholder="Телефон">
            <button onclick="addSpecialist()"><i class="fas fa-plus"></i> Добавить специалиста</button>
        </div>
    `;
}

window.addSpecialist = () => {
    const name = document.getElementById("newSpecName")?.value.trim();
    const type = document.getElementById("newSpecType")?.value.trim();
    const phone = document.getElementById("newSpecPhone")?.value.trim();
    if (!name || !type) { alert("Заполните ФИО и специальность"); return; }
    specialists.push({ id: Date.now().toString(), name, type, phone });
    saveData();
    navigate('specialists');
};

window.deleteSpecialist = (id) => {
    if (confirm("Удалить специалиста?")) {
        specialists = specialists.filter(s => s.id !== id);
        // Также удаляем связанные кружки
        circles = circles.filter(c => c.specialistId !== id);
        saveData();
        navigate('specialists');
    }
};

// ============ КРУЖКИ ============
function renderCircles() {
    if (!currentUser) return `<div class="card">Войдите</div>`;
    const role = currentUser.role;
    
    if (role === "admin" || role === "teacher") {
        let circlesHtml = circles.map(c => {
            const specialist = specialists.find(s => s.id === c.specialistId);
            return `
                <div class="circle-card">
                    <div class="circle-header">
                        <strong>${escapeHtml(c.name)}</strong>
                        ${role === "admin" ? `<button onclick="deleteCircle('${c.id}')" class="small-btn delete-btn">🗑️</button>` : ''}
                    </div>
                    <div class="circle-time">📅 ${c.weekday || 'Не указан'} | 🕐 ${c.time || 'Не указано'}</div>
                    ${specialist ? `<div class="circle-time">👨‍🏫 Специалист: ${escapeHtml(specialist.name)} (${escapeHtml(specialist.type)})</div>` : ''}
                    <div class="small">Записано детей: ${circleRequests.filter(r => r.circleId === c.id && r.status === 'approved').length}</div>
                    ${role === "admin" ? `<button onclick="editCircleSchedule('${c.id}')" class="small-btn" style="margin-top:5px;">✏️ Редактировать</button>` : ''}
                </div>
            `;
        }).join('');
        
        const pendingRequests = circleRequests.filter(r => r.status === 'pending');
        let pendingHtml = pendingRequests.map(r => `
            <div class="request-item">
                <div><strong>👶 ${escapeHtml(r.childName)}</strong> — <strong>${escapeHtml(r.circleName)}</strong></div>
                <div class="small">📅 ${r.selectedWeekday || '?'} в ${r.selectedTime || '?'} | 👪 родитель: ${escapeHtml(r.parentName)}</div>
                <div class="flex" style="margin-top: 10px;">
                    <button onclick="approveRequest('${r.id}')" class="small-btn approve">✅ Одобрить</button>
                    <button onclick="rejectRequest('${r.id}')" class="small-btn reject">❌ Отказать</button>
                </div>
            </div>
        `).join('');
        
        let addForm = "";
        if (role === "admin") {
            addForm = `
                <hr>
                <h4>Добавить кружок</h4>
                <div class="flex">
                    <input id="newCircleName" placeholder="Название кружка" style="flex:2;">
                    <select id="newCircleWeekday" class="inline-select">
                        <option value="">День недели</option>
                        ${WEEKDAYS.map(d => `<option value="${d}">${d}</option>`).join('')}
                    </select>
                    <input id="newCircleTime" placeholder="Время" style="flex:1;">
                </div>
                <select id="newCircleSpecialist" style="margin-top:8px;">
                    <option value="">Выберите специалиста</option>
                    ${specialists.map(s => `<option value="${s.id}">${escapeHtml(s.name)} (${escapeHtml(s.type)})</option>`).join('')}
                </select>
                <button onclick="addCircle()">Добавить кружок</button>
            `;
        }
        
        return `<div class="card"><div class="card-title"><i class="fas fa-palette"></i> Кружки</div>
            <h4>Существующие кружки</h4>
            ${circlesHtml || "Нет кружков"}
            ${addForm}
            <hr>
            <h4>Заявки на кружки (${pendingRequests.length})</h4>
            ${pendingHtml || "<div class='text-center'>Нет заявок</div>"}
        </div>`;
    }
    
    if (role === "parent") {
        if (!selectedChildId) {
            return `<div class="card"><div class="text-center">⚠️ Сначала выберите ребёнка</div></div>`;
        }
        
        const myRequests = circleRequests.filter(r => r.childId === selectedChildId);
        const approvedCircles = myRequests.filter(r => r.status === 'approved');
        const pendingRequests = myRequests.filter(r => r.status === 'pending');
        
        let enrolledHtml = approvedCircles.map(r => {
            const specialist = specialists.find(s => s.id === r.specialistId);
            return `
                <div class="circle-card">
                    <div class="circle-header">
                        <strong>${escapeHtml(r.circleName)}</strong>
                        <button onclick="cancelRequest('${r.circleId}')" class="small-btn delete-btn">Отказаться</button>
                    </div>
                    <div class="circle-time">📅 ${r.selectedWeekday || '?'} | 🕐 ${r.selectedTime || '?'}</div>
                    ${specialist ? `<div class="circle-time">👨‍🏫 ${escapeHtml(specialist.name)}</div>` : ''}
                </div>
            `;
        }).join('');
        
        let pendingHtml = pendingRequests.map(r => `
            <div class="circle-card" style="opacity:0.7;">
                <div><strong>${escapeHtml(r.circleName)}</strong></div>
                <div class="small">⏳ На рассмотрении</div>
            </div>
        `).join('');
        
        let availableCirclesHtml = circles.filter(c => !myRequests.some(r => r.circleId === c.id)).map(c => {
            const specialist = specialists.find(s => s.id === c.specialistId);
            return `
                <div class="circle-card">
                    <div><strong>${escapeHtml(c.name)}</strong></div>
                    <div class="circle-time">📅 ${c.weekday} | 🕐 ${c.time}</div>
                    ${specialist ? `<div class="circle-time">👨‍🏫 ${escapeHtml(specialist.name)}</div>` : ''}
                    <button onclick="showScheduleOptions('${c.id}', '${escapeHtml(c.name)}', '${c.specialistId || ''}')" class="small-btn" style="margin-top:8px;">📝 Записаться</button>
                </div>
            `;
        }).join('');
        
        return `<div class="card"><div class="card-title"><i class="fas fa-palette"></i> Кружки</div>
            <h4>✅ Записан</h4>
            ${enrolledHtml || "<div class='text-center'>Нет записей</div>"}
            <hr>
            <h4>⏳ Ожидают</h4>
            ${pendingHtml || "<div class='text-center'>Нет</div>"}
            <hr>
            <h4>📢 Доступные</h4>
            ${availableCirclesHtml || "<div class='text-center'>Нет доступных кружков</div>"}
        </div>`;
    }
    
    return `<div class="card"><div class="text-center">Доступно только для родителей, воспитателей и администратора</div></div>`;
}

window.addCircle = () => {
    const name = document.getElementById("newCircleName")?.value.trim();
    const weekday = document.getElementById("newCircleWeekday")?.value;
    const time = document.getElementById("newCircleTime")?.value.trim();
    const specialistId = document.getElementById("newCircleSpecialist")?.value;
    if (!name) { alert("Введите название кружка"); return; }
    circles.push({ id: Date.now().toString(), name, weekday: weekday || "Не указан", time: time || "Не указано", specialistId: specialistId || null });
    saveData();
    document.getElementById("newCircleName").value = "";
    document.getElementById("newCircleWeekday").value = "";
    document.getElementById("newCircleTime").value = "";
    navigate('circles');
};

window.deleteCircle = (circleId) => {
    if (confirm("Удалить кружок?")) {
        circles = circles.filter(c => c.id !== circleId);
        circleRequests = circleRequests.filter(r => r.circleId !== circleId);
        saveData();
        navigate('circles');
    }
};

window.editCircleSchedule = (circleId) => {
    const circle = circles.find(c => c.id === circleId);
    if (!circle) return;
    const newWeekday = prompt("День недели:", circle.weekday);
    const newTime = prompt("Время:", circle.time);
    if (newWeekday !== null) circle.weekday = newWeekday || "Не указан";
    if (newTime !== null) circle.time = newTime || "Не указано";
    saveData();
    navigate('circles');
};

window.showScheduleOptions = (circleId, circleName, specialistId) => {
    const circle = circles.find(c => c.id === circleId);
    if (!circle) return;
    
    showModal(`
        <h3 style="margin-bottom:16px;">${escapeHtml(circleName)}</h3>
        <p>Выберите расписание:</p>
        <div style="margin:12px 0; padding:12px; background:#f8fafc; border:1px solid #e2e8f0; display:flex; justify-content:space-between; align-items:center;">
            <span>📅 ${circle.weekday} в ${circle.time}</span>
            <button onclick="selectScheduleOption('${circleId}', '${circle.weekday}', '${circle.time}', '${specialistId}')" class="small-btn">✅ Выбрать</button>
        </div>
        <button onclick="closeModal()" class="small-btn" style="background:#b33c3c; color:white;">Отмена</button>
    `);
};

window.selectScheduleOption = (circleId, weekday, time, specialistId) => {
    closeModal();
    if (!selectedChildId) { alert("Сначала выберите ребёнка!"); return; }
    const kid = kids.find(k => k.id === selectedChildId);
    const circle = circles.find(c => c.id === circleId);
    
    const existing = circleRequests.find(r => r.circleId === circleId && r.childId === selectedChildId);
    if (existing) {
        alert("Вы уже отправляли заявку");
        return;
    }
    
    circleRequests.push({
        id: Date.now().toString(),
        circleId, circleName: circle.name,
        childId: selectedChildId, childName: kid.name,
        parentId: currentUser.id, parentName: currentUser.name,
        specialistId: specialistId || null,
        selectedWeekday: weekday, selectedTime: time,
        status: 'pending', createdAt: new Date().toLocaleString()
    });
    saveData();
    alert(`✅ Заявка на "${circle.name}" отправлена!`);
    navigate('circles');
};

window.cancelRequest = (circleId) => {
    if (confirm("Отказаться от кружка?")) {
        circleRequests = circleRequests.filter(r => !(r.circleId === circleId && r.childId === selectedChildId));
        saveData();
        alert("✅ Отказ оформлен");
        navigate('circles');
    }
};

window.approveRequest = (requestId) => {
    const request = circleRequests.find(r => r.id === requestId);
    if (request) {
        request.status = 'approved';
        saveData();
        alert(`✅ Заявка одобрена!`);
        navigate('circles');
    }
};

window.rejectRequest = (requestId) => {
    const request = circleRequests.find(r => r.id === requestId);
    if (request) {
        request.status = 'rejected';
        saveData();
        alert(`❌ Заявка отклонена.`);
        navigate('circles');
    }
};

// ============ ИНДИВИДУАЛЬНЫЕ ЗАНЯТИЯ ============
function renderActivities() {
    if (!currentUser) return `<div class="card">Войдите</div>`;
    const role = currentUser.role;
    
    let activitiesHtml = individualActivities.map(act => `
        <div class="list-item"><span>⭐ ${escapeHtml(act.name)}</span>${role === "admin" ? `<button onclick="deleteActivity('${act.id}')" class="small-btn delete-btn">🗑️</button>` : ''}</div>
    `).join('');
    
    let assignedHtml = "";
    if (role === "parent") {
        if (!selectedChildId) {
            assignedHtml = `<div class="text-center">⚠️ Сначала выберите ребёнка</div>`;
        } else {
            const myAssigned = assignedActivities.filter(a => a.childId === selectedChildId);
            const kidName = kids.find(k => k.id === selectedChildId)?.name;
            assignedHtml = `<h4>📖 Занятия для ${kidName}</h4>`;
            if (myAssigned.length === 0) assignedHtml += "<div class='text-center'>Нет занятий</div>";
            else {
                myAssigned.forEach(a => {
                    const act = individualActivities.find(act => act.id === a.activityId);
                    if (act) assignedHtml += `<div class="schedule-item">⭐ ${escapeHtml(act.name)}</div>`;
                });
            }
        }
    } else if (role === "admin" || role === "teacher") {
        let selectHtml = `<select id="assignChildSelect"><option value="">Выбрать ребёнка</option>${kids.map(k => `<option value="${k.id}">${escapeHtml(k.name)}</option>`).join("")}</select>`;
        let selectActivityHtml = `<select id="assignActivitySelect"><option value="">Выбрать занятие</option>${individualActivities.map(act => `<option value="${act.id}">${escapeHtml(act.name)}</option>`).join("")}</select>`;
        
        let assignedList = "";
        for (let kid of kids) {
            const kidAssignments = assignedActivities.filter(a => a.childId === kid.id);
            if (kidAssignments.length > 0) {
                assignedList += `<div style="margin-top:10px;"><strong>👶 ${escapeHtml(kid.name)}:</strong> `;
                assignedList += kidAssignments.map(a => {
                    const act = individualActivities.find(act => act.id === a.activityId);
                    return act ? `<span class="badge">⭐ ${escapeHtml(act.name)}</span> ` : "";
                }).join('');
                assignedList += `</div>`;
            }
        }
        
        assignedHtml = `<hr><h4>📋 Назначение занятий</h4>
            <div class="flex">${selectHtml}${selectActivityHtml}</div>
            <button onclick="assignActivityToChild()">➕ Назначить</button>
            <hr><h4>✅ Текущие назначения</h4>${assignedList || "Нет назначений"}`;
    }
    
    let addForm = "";
    if (role === "admin") {
        addForm = `<hr><input id="newActivityName" placeholder="Название занятия"><button onclick="addActivity()"><i class="fas fa-plus"></i> Добавить занятие</button>`;
    }
    
    return `<div class="card"><div class="card-title"><i class="fas fa-star"></i> Индивидуальные занятия</div><div>${activitiesHtml || "Нет занятий"}</div>${addForm}${assignedHtml}</div>`;
}

window.addActivity = () => {
    const name = document.getElementById("newActivityName")?.value.trim();
    if (!name) { alert("Введите название занятия"); return; }
    individualActivities.push({ id: Date.now().toString(), name });
    saveData();
    navigate('activities');
};

window.deleteActivity = (activityId) => {
    if (confirm("Удалить занятие?")) {
        individualActivities = individualActivities.filter(a => a.id !== activityId);
        assignedActivities = assignedActivities.filter(a => a.activityId !== activityId);
        saveData();
        navigate('activities');
    }
};

window.assignActivityToChild = () => {
    const childId = document.getElementById("assignChildSelect")?.value;
    const activityId = document.getElementById("assignActivitySelect")?.value;
    if (!childId || !activityId) { alert("Выберите ребёнка и занятие"); return; }
    
    const alreadyAssigned = assignedActivities.find(a => a.childId === childId && a.activityId === activityId);
    if (alreadyAssigned) {
        alert("Это занятие уже назначено");
        return;
    }
    
    assignedActivities.push({ childId, activityId });
    saveData();
    alert("✅ Занятие назначено!");
    navigate('activities');
};

// ============ РАСПИСАНИЕ (РАСШИРЕННОЕ) ============
function renderSchedule() {
    if (!currentUser) return `<div class="card">Войдите</div>`;
    const role = currentUser.role;
    const canEdit = (role === "admin" || role === "teacher");
    
    let commonHtml = scheduleCommon.map((item, index) => `
        <div class="schedule-item">
            <div>
                <strong>🕐 ${escapeHtml(item.time)} — ${escapeHtml(item.title)}</strong>
                ${item.description ? `<br><span style="font-size:0.8rem; color:#6b7a8f;">${escapeHtml(item.description)}</span>` : ''}
            </div>
            ${canEdit ? `<button onclick="editScheduleItem(${index})" class="small-btn" style="background:#1a3a5c; color:white;">✏️</button>` : ''}
            ${canEdit ? `<button onclick="deleteScheduleItem(${index})" class="small-btn delete-btn">🗑️</button>` : ''}
        </div>
    `).join('');
    
    let addForm = "";
    if (canEdit) {
        addForm = `
            <hr>
            <h4>Добавить событие</h4>
            <div class="flex">
                <input id="newScheduleTime" placeholder="Время (08:30)" style="flex:1;">
                <input id="newScheduleTitle" placeholder="Название" style="flex:2;">
            </div>
            <input id="newScheduleDesc" placeholder="Описание (необязательно)">
            <button onclick="addScheduleItem()"><i class="fas fa-plus"></i> Добавить</button>
        `;
    }
    
    return `<div class="card"><div class="card-title"><i class="fas fa-calendar-alt"></i> Расписание дня</div>${commonHtml}${addForm}</div>`;
}

window.addScheduleItem = () => {
    const time = document.getElementById("newScheduleTime")?.value.trim();
    const title = document.getElementById("newScheduleTitle")?.value.trim();
    const desc = document.getElementById("newScheduleDesc")?.value.trim();
    if (!time || !title) { alert("Заполните время и название"); return; }
    scheduleCommon.push({ id: 'sch' + Date.now(), time, title, description: desc || '' });
    saveData();
    document.getElementById("newScheduleTime").value = "";
    document.getElementById("newScheduleTitle").value = "";
    document.getElementById("newScheduleDesc").value = "";
    navigate('schedule');
};

window.editScheduleItem = (index) => {
    const item = scheduleCommon[index];
    if (!item) return;
    const newTime = prompt("Время:", item.time);
    const newTitle = prompt("Название:", item.title);
    const newDesc = prompt("Описание:", item.description);
    if (newTime !== null) item.time = newTime || item.time;
    if (newTitle !== null) item.title = newTitle || item.title;
    if (newDesc !== null) item.description = newDesc || item.description;
    saveData();
    navigate('schedule');
};

window.deleteScheduleItem = (index) => {
    if (confirm("Удалить этот пункт?")) {
        scheduleCommon.splice(index, 1);
        saveData();
        navigate('schedule');
    }
};

// ============ ГРУППЫ ============
function renderGroups() {
    if (!currentUser) return `<div class="card">Войдите</div>`;
    const role = currentUser.role;
    
    let groupsInfo = groups.map(g => {
        const kidsInGroup = kids.filter(k => k.groupId === g.id);
        const teacher = users.find(u => u.role === 'teacher' && u.groupId === g.id);
        return `
            <div class="group-stat-card">
                <div class="flex" style="justify-content:space-between;">
                    <strong>📁 ${escapeHtml(g.name)}</strong>
                    ${role === "admin" ? `<button onclick="deleteGroup('${g.id}')" class="small-btn delete-btn">🗑️</button>` : ''}
                </div>
                ${teacher ? `<div class="small">👩‍🏫 Воспитатель: ${escapeHtml(teacher.name)}</div>` : ''}
                <div class="small">👶 Детей: ${kidsInGroup.length}</div>
                <div class="small">${kidsInGroup.map(k => k.name).join(', ') || 'нет детей'}</div>
            </div>
        `;
    }).join('');
    
    let addForm = "";
    if (role === "admin") {
        addForm = `<div class="flex"><input id="newGroupName" placeholder="Название группы" style="flex:1;"><button onclick="addGroup()" class="small-btn">➕ Создать</button></div><hr>`;
    }
    
    let teachersList = "";
    if (role === "admin") {
        const teachers = users.filter(u => u.role === 'teacher');
        teachersList = `
            <hr>
            <h4>👩‍🏫 Назначение воспитателя</h4>
            <div class="flex">
                <select id="assignTeacherSelect" style="flex:1;">
                    <option value="">Выберите воспитателя</option>
                    ${teachers.map(t => `<option value="${t.id}">${escapeHtml(t.name)}</option>`).join('')}
                </select>
                <select id="assignTeacherGroupSelect" style="flex:1;">
                    <option value="">Выберите группу</option>
                    ${groups.map(g => `<option value="${g.id}">${escapeHtml(g.name)}</option>`).join('')}
                </select>
                <button onclick="assignTeacherToGroup()" class="small-btn">📌 Назначить</button>
            </div>
        `;
    }
    
    return `<div class="card"><div class="card-title"><i class="fas fa-users"></i> Группы</div>${addForm}${groupsInfo}${teachersList}</div>`;
}

window.addGroup = () => {
    const name = document.getElementById("newGroupName")?.value.trim();
    if (!name) return;
    groups.push({ id: Date.now().toString(), name });
    saveData();
    navigate('groups');
};

window.deleteGroup = (groupId) => {
    if (confirm("Удалить группу?")) {
        groups = groups.filter(g => g.id !== groupId);
        kids.forEach(k => { if (k.groupId === groupId) k.groupId = null; });
        users.forEach(u => { if (u.groupId === groupId) u.groupId = null; });
        saveData();
        navigate('groups');
    }
};

window.assignTeacherToGroup = () => {
    const teacherId = document.getElementById("assignTeacherSelect")?.value;
    const groupId = document.getElementById("assignTeacherGroupSelect")?.value;
    if (!teacherId || !groupId) { alert("Выберите воспитателя и группу"); return; }
    const teacher = users.find(u => u.id === teacherId);
    if (teacher) {
        teacher.groupId = groupId;
        saveData();
        alert(`✅ ${teacher.name} назначен в группу`);
        navigate('groups');
    }
};

// ============ ЛИЧНЫЕ СООБЩЕНИЯ ============
function renderPrivateMessages() {
    if (!currentUser) return `<div class="card">Войдите</div>`;
    
    // Список пользователей для чата (все кроме текущего)
    const otherUsers = users.filter(u => u.id !== currentUser.id);
    
    let chatHtml = "";
    if (selectedPrivateChatUserId) {
        const chatPartner = users.find(u => u.id === selectedPrivateChatUserId);
        const msgs = privateMessages.filter(m => 
            (m.fromId === currentUser.id && m.toId === selectedPrivateChatUserId) ||
            (m.fromId === selectedPrivateChatUserId && m.toId === currentUser.id)
        );
        
        chatHtml = `
            <div style="margin-bottom:15px;">
                <strong>💬 Чат с ${escapeHtml(chatPartner?.name || '')}</strong>
                <button onclick="selectedPrivateChatUserId=null; navigate('private')" class="small-btn" style="background:#b33c3c; color:white; width:auto;">✕ Закрыть</button>
            </div>
            <div id="privateChatContainer" class="chat-container">
                ${msgs.map(m => `
                    <div class="message-item ${m.fromId === currentUser.id ? 'message-mine' : 'message-other'} message-personal">
                        <div>${escapeHtml(m.text)}</div>
                        <div class="message-time">${m.time}</div>
                    </div>
                `).join('') || "Нет сообщений"}
            </div>
            <div class="flex">
                <input id="privateChatInput" placeholder="Сообщение..." style="flex:1;">
                <button onclick="sendPrivateMessage()" class="small-btn">📤</button>
            </div>
        `;
    }
    
    let usersList = otherUsers.map(u => `
        <div class="list-item" onclick="selectedPrivateChatUserId='${u.id}'; navigate('private')">
            <span>${u.role === 'admin' ? '👑' : (u.role === 'teacher' ? '👩‍🏫' : '👪')} ${escapeHtml(u.name)}</span>
            <i class="fas fa-chevron-right"></i>
        </div>
    `).join('');
    
    return `<div class="card">
        <div class="card-title"><i class="fas fa-envelope"></i> Личные сообщения</div>
        ${chatHtml || `
            <div class="small">Выберите пользователя для личного общения:</div>
            ${usersList || "Нет других пользователей"}
        `}
    </div>`;
}

window.sendPrivateMessage = () => {
    const text = document.getElementById("privateChatInput")?.value.trim();
    if (!text || !selectedPrivateChatUserId) return;
    
    privateMessages.push({
        id: Date.now().toString(),
        fromId: currentUser.id,
        toId: selectedPrivateChatUserId,
        text,
        time: new Date().toLocaleTimeString([], { hour: '2-digit', minute: '2-digit' })
    });
    saveData();
    document.getElementById("privateChatInput").value = "";
    navigate('private');
    setTimeout(() => {
        const c = document.getElementById("privateChatContainer");
        if (c) c.scrollTop = c.scrollHeight;
    }, 100);
};

// ============ ЧАТ ГРУПП ============
function renderChat() {
    if (!currentUser) return `<div class="card">Войдите</div>`;
    const role = currentUser.role;
    
    let currentGroupId = null;
    let groupName = "";
    let chatSelectorHtml = "";
    
    if (role === "admin") {
        if (!adminSelectedChatGroupId && groups.length > 0) adminSelectedChatGroupId = groups[0].id;
        currentGroupId = adminSelectedChatGroupId;
        const selectedGroup = groups.find(g => g.id === currentGroupId);
        groupName = selectedGroup?.name || "не выбрана";
        chatSelectorHtml = `<div class="flex"><select id="adminChatGroupSelect" class="inline-select" style="flex:1;">${groups.map(g => `<option value="${g.id}" ${g.id === currentGroupId ? 'selected' : ''}>${escapeHtml(g.name)}</option>`).join('')}</select><button onclick="changeAdminChatGroup()" class="small-btn">Выбрать</button></div>`;
    } 
    else if (role === "teacher") {
        currentGroupId = currentUser.groupId;
        const group = groups.find(g => g.id === currentGroupId);
        groupName = group?.name || "группы";
        if (!currentGroupId) return `<div class="card"><div class="text-center">Вы не назначены в группу</div></div>`;
    } 
    else if (role === "parent") {
        if (!selectedChildId) return `<div class="card"><div class="text-center">⚠️ Сначала выберите ребёнка</div></div>`;
        const kid = kids.find(k => k.id === selectedChildId);
        currentGroupId = kid?.groupId;
        const group = groups.find(g => g.id === currentGroupId);
        groupName = group?.name || "группы";
        if (!currentGroupId) return `<div class="card"><div class="text-center">Ребёнок не в группе</div></div>`;
    }
    
    const chatMessages = messages.filter(m => m.groupId === currentGroupId);
    const messagesHtml = chatMessages.map(m => `
        <div class="message-item ${m.senderId === currentUser.id ? 'message-mine' : 'message-other'}">
            <div><strong>${escapeHtml(m.senderName)}</strong></div>
            <div>${escapeHtml(m.text)}</div>
            <div class="message-time">${m.time}</div>
        </div>
    `).join('');
    
    return `<div class="card"><div class="card-title"><i class="fas fa-comments"></i> Чат ${groupName}</div>${chatSelectorHtml}<div id="chatContainer" class="chat-container">${messagesHtml || "💬 Нет сообщений"}</div><div class="flex"><input id="chatInput" placeholder="Сообщение..." style="flex:1;"><button onclick="sendMessage()" class="small-btn">📤</button></div></div>`;
}

window.changeAdminChatGroup = () => {
    const select = document.getElementById("adminChatGroupSelect");
    if (select && select.value) { adminSelectedChatGroupId = select.value; navigate('chat'); }
};

window.sendMessage = () => {
    const text = document.getElementById("chatInput")?.value.trim();
    if (!text) return;
    let groupId = null;
    const role = currentUser.role;
    if (role === "admin") groupId = adminSelectedChatGroupId;
    else if (role === "teacher") groupId = currentUser.groupId;
    else if (role === "parent" && selectedChildId) groupId = kids.find(k => k.id === selectedChildId)?.groupId;
    if (!groupId) return;
    messages.push({ id: Date.now().toString(), groupId, text, senderId: currentUser.id, senderName: currentUser.name, time: new Date().toLocaleTimeString([], { hour: '2-digit', minute: '2-digit' }) });
    saveData();
    document.getElementById("chatInput").value = "";
    navigate('chat');
    setTimeout(() => { const c = document.getElementById("chatContainer"); if (c) c.scrollTop = c.scrollHeight; }, 100);
};

// ============ ПРОФИЛЬ ============
function renderProfile() {
    if (!currentUser) return `<div class="card"><button onclick="showLogin()">Войти</button></div>`;
    const roleName = currentUser.role === "admin" ? "Администратор" : (currentUser.role === "teacher" ? "Воспитатель" : "Родитель");
    return `<div class="card"><div class="card-title"><i class="fas fa-user-circle"></i> Профиль</div><div class="text-center"><div style="font-size:70px;">👤</div><div><strong>${escapeHtml(currentUser.name)}</strong></div><div>📧 ${escapeHtml(currentUser.email)}</div><div class="badge">${roleName}</div><button onclick="logout()" style="margin-top:20px;">Выйти</button></div></div>`;
}

// ============ НАВИГАЦИЯ ============
function navigate(screen) {
    const content = document.getElementById("content");
    content.style.opacity = "0";
    
    setTimeout(() => {
        let html = "";
        if (screen === "home") html = renderHome();
        else if (screen === "kids") html = renderKids();
        else if (screen === "circles") html = renderCircles();
        else if (screen === "specialists") html = renderSpecialists();
        else if (screen === "activities") html = renderActivities();
        else if (screen === "schedule") html = renderSchedule();
        else if (screen === "groups") html = renderGroups();
        else if (screen === "registerUser") html = renderRegisterUser();
        else if (screen === "chat") html = renderChat();
        else if (screen === "private") html = renderPrivateMessages();
        else if (screen === "profile") html = renderProfile();
        content.innerHTML = html;
        content.style.opacity = "1";
        
        if (screen === "chat") setTimeout(() => { const c = document.getElementById("chatContainer"); if (c) c.scrollTop = c.scrollHeight; }, 100);
        if (screen === "private") setTimeout(() => { const c = document.getElementById("privateChatContainer"); if (c) c.scrollTop = c.scrollHeight; }, 100);
        
        document.querySelectorAll('.tab').forEach(tab => {
            tab.classList.remove('active');
            if (tab.getAttribute('onclick')?.includes(`'${screen}'`)) tab.classList.add('active');
        });
    }, 50);
}

// ============ ЗАПУСК ============
const savedUser = localStorage.getItem('talants_currentUser');
if (savedUser) {
    currentUser = JSON.parse(savedUser);
    updateTabBar();
    navigate('home');
} else {
    showLogin();
}
