let teachers = JSON.parse(localStorage.getItem('teachers')) || [
    { id: 1, name: "Иванов Иван Иванович", gender: "Мужской", age: 45, workload: {} },
    { id: 2, name: "Петрова Анна Сергеевна", gender: "Женский", age: 38, workload: {} },
    { id: 3, name: "Сидоров Алексей Владимирович", gender: "Мужской", age: 52, workload: {} },
    { id: 4, name: "Кузнецова Ольга Петровна", gender: "Женский", age: 41, workload: {} },
    { id: 5, name: "Смирнов Дмитрий Алексеевич", gender: "Мужской", age: 47, workload: {} }
];

const subjects = [
    "Математический анализ",
    "Теория алгоритмов",
    "Базы данных",
    "Программирование",
    "Иностранный язык"
];

let currentTeacherId = null;

const teachersList = document.getElementById('teachersList');
const searchInput = document.getElementById('searchInput');
const genderFilter = document.getElementById('genderFilter');
const addTeacherBtn = document.getElementById('addTeacherBtn');
const addTeacherModal = document.getElementById('addTeacherModal');
const manageWorkloadModal = document.getElementById('manageWorkloadModal');
const workloadForm = document.getElementById('workloadForm');

function renderTeachers() {
    const searchQuery = searchInput.value.toLowerCase();
    const gender = genderFilter.value;

    const filteredTeachers = teachers.filter(teacher => {
        return teacher.name.toLowerCase().includes(searchQuery) &&
            (gender === "" || teacher.gender === gender);
    });

    teachersList.innerHTML = filteredTeachers.map(teacher => `
        <div class="teacher-card">
            <div class="teacher-info">
                <h3>${teacher.name}</h3>
                <p>${teacher.gender}, ${teacher.age} лет</p>
            </div>
            <div class="teacher-actions">
                <button class="manage-btn" data-id="${teacher.id}">Управление</button>
            </div>
        </div>
    `).join('');

    document.querySelectorAll('.manage-btn').forEach(button => {
        button.addEventListener('click', () => {
            currentTeacherId = button.dataset.id;
            showManageModal(currentTeacherId);
        });
    });
}

function showManageModal(teacherId) {
    const teacher = teachers.find(t => t.id == teacherId);
    workloadForm.innerHTML = subjects.map(subject => `
        <div class="workload-item">
            <label>${subject}</label>
            <input type="number" value="${teacher.workload[subject] || 0}" min="0">
        </div>
    `).join('');
    manageWorkloadModal.style.display = 'flex';
}

function saveWorkload() {
    const teacher = teachers.find(t => t.id == currentTeacherId);
    const inputs = workloadForm.querySelectorAll('input');
    inputs.forEach((input, index) => {
        teacher.workload[subjects[index]] = parseInt(input.value) || 0;
    });
    localStorage.setItem('teachers', JSON.stringify(teachers));
    manageWorkloadModal.style.display = 'none';
    renderTeachers();
}

function fireTeacher() {
    teachers = teachers.filter(t => t.id != currentTeacherId);
    localStorage.setItem('teachers', JSON.stringify(teachers));
    manageWorkloadModal.style.display = 'none';
    renderTeachers();
}

searchInput.addEventListener('input', renderTeachers);
genderFilter.addEventListener('change', renderTeachers);

addTeacherBtn.addEventListener('click', () => {
    addTeacherModal.style.display = 'flex';
});

document.getElementById('addTeacherForm').addEventListener('submit', (e) => {
    e.preventDefault();
    const newTeacher = {
        id: Date.now(),
        name: document.getElementById('teacherName').value,
        gender: document.getElementById('teacherGender').value,
        age: parseInt(document.getElementById('teacherAge').value),
        workload: {}
    };
    teachers.push(newTeacher);
    localStorage.setItem('teachers', JSON.stringify(teachers));
    addTeacherModal.style.display = 'none';
    renderTeachers();
});

document.getElementById('saveWorkloadBtn').addEventListener('click', saveWorkload);
document.getElementById('fireTeacherBtn').addEventListener('click', fireTeacher);
document.getElementById('cancelWorkloadBtn').addEventListener('click', () => {
    manageWorkloadModal.style.display = 'none';
});

document.querySelectorAll('.close').forEach(button => {
    button.addEventListener('click', () => {
        addTeacherModal.style.display = 'none';
        manageWorkloadModal.style.display = 'none';
    });
});

window.addEventListener('click', (e) => {
    if (e.target === addTeacherModal || e.target === manageWorkloadModal) {
        addTeacherModal.style.display = 'none';
        manageWorkloadModal.style.display = 'none';
    }
});

renderTeachers();