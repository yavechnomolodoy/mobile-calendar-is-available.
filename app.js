// Основные элементы
const currentDateElement = document.getElementById('currentDate');
const monthYearElement = document.getElementById('monthYear');
const daysContainer = document.getElementById('daysContainer');
const prevMonthButton = document.getElementById('prevMonth');
const nextMonthButton = document.getElementById('nextMonth');

// Текущая дата
let currentDate = new Date();

// Функция обновления отображаемой даты
function updateCurrentDate() {
    const options = { 
        weekday: 'long', 
        year: 'numeric', 
        month: 'long', 
        day: 'numeric' 
    };
    currentDateElement.textContent = currentDate.toLocaleDateString('ru-RU', options);
}

// Функция генерации календаря
function generateCalendar() {
    const year = currentDate.getFullYear();
    const month = currentDate.getMonth();
    
    // Обновляем заголовок (месяц и год)
    monthYearElement.textContent = currentDate.toLocaleDateString('ru-RU', { 
        month: 'long', 
        year: 'numeric' 
    });
    
    // Очищаем контейнер дней
    daysContainer.innerHTML = '';
    
    // Первый день месяца
    const firstDay = new Date(year, month, 1);
    // Последний день месяца
    const lastDay = new Date(year, month + 1, 0);
    
    // Дней в предыдущем месяце (для заполнения пустых ячеек)
    const prevMonthLastDay = new Date(year, month, 0).getDate();
    // День недели первого дня (0 - воскресенье, 1 - понедельник и т.д.)
    const firstDayIndex = firstDay.getDay();
    // Корректировка для понедельника как первого дня
    const startDayIndex = firstDayIndex === 0 ? 6 : firstDayIndex - 1;
    
    // Добавляем дни предыдущего месяца
    for (let i = startDayIndex; i > 0; i--) {
        const dayElement = document.createElement('div');
        dayElement.textContent = prevMonthLastDay - i + 1;
        dayElement.style.color = '#ccc';
        daysContainer.appendChild(dayElement);
    }
    
    // Добавляем дни текущего месяца
    const today = new Date();
    for (let i = 1; i <= lastDay.getDate(); i++) {
        const dayElement = document.createElement('div');
        dayElement.textContent = i;
        
        // Проверяем, является ли день сегодняшним
        if (i === today.getDate() && 
            month === today.getMonth() && 
            year === today.getFullYear()) {
            dayElement.classList.add('today');
        }
        
        daysContainer.appendChild(dayElement);
    }
}

// Обработчики кнопок
prevMonthButton.addEventListener('click', () => {
    currentDate.setMonth(currentDate.getMonth() - 1);
    updateCurrentDate();
    generateCalendar();
});

nextMonthButton.addEventListener('click', () => {
    currentDate.setMonth(currentDate.getMonth() + 1);
    updateCurrentDate();
    generateCalendar();
});

// Инициализация
updateCurrentDate();
generateCalendar();