// Основные элементы
const monthYearElement = document.getElementById('monthYear');
const daysContainer = document.getElementById('daysContainer');
const prevMonthButton = document.getElementById('prevMonth');
const nextMonthButton = document.getElementById('nextMonth');
const dateInput = document.getElementById('dateInput');

// Текущая дата и искомая дата
let currentDate = new Date();
let searchedDate = null;

// Функция генерации календаря
function generateCalendar() {
    const year = currentDate.getFullYear();
    const month = currentDate.getMonth();
    
    // Обновляем заголовок (месяц и год) без "г."
    let monthYearString = currentDate.toLocaleDateString('ru-RU', { 
        month: 'long', 
        year: 'numeric' 
    });
    monthYearString = monthYearString.replace(' г.', '');
    monthYearElement.textContent = monthYearString;
    
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
    let dayCounter = startDayIndex + 1;
    
    for (let i = 1; i <= lastDay.getDate(); i++) {
        const dayElement = document.createElement('div');
        dayElement.textContent = i;
        
        // Проверяем, является ли день сегодняшним
        if (i === today.getDate() && 
            month === today.getMonth() && 
            year === today.getFullYear()) {
            dayElement.classList.add('today');
        }
        
        // Проверяем, является ли день искомой датой
        if (searchedDate && 
            i === searchedDate.getDate() && 
            month === searchedDate.getMonth() && 
            year === searchedDate.getFullYear()) {
            dayElement.classList.add('searched');
        }
        
        daysContainer.appendChild(dayElement);
        dayCounter++;
    }
}

// Обработчики кнопок
prevMonthButton.addEventListener('click', () => {
    currentDate.setMonth(currentDate.getMonth() - 1);
    generateCalendar();
});

nextMonthButton.addEventListener('click', () => {
    currentDate.setMonth(currentDate.getMonth() + 1);
    generateCalendar();
});

// Функция для обновления времени
function updateCurrentTime() {
    const now = new Date();
    const timeElement = document.getElementById('currentTime');
    
    if (timeElement) {
        const hours = String(now.getHours()).padStart(2, '0');
        const minutes = String(now.getMinutes()).padStart(2, '0');
        const seconds = String(now.getSeconds()).padStart(2, '0');
        
        timeElement.textContent = `${hours}:${minutes}:${seconds}`;
    }
}

// Обработчик для кнопки "Поиск даты" с автозаполнением точек
document.getElementById('searchDate').addEventListener('click', function() {
    // Показываем поле ввода
    dateInput.style.display = 'block';
    dateInput.focus();
    dateInput.value = '';
});

// Обработчик ввода с автоформатированием
dateInput.addEventListener('input', function(e) {
    let value = e.target.value.replace(/\D/g, ''); // Удаляем все нецифры
    
    // Автоматически ставим точки после 2-й и 5-й цифр
    if (value.length > 4) {
        value = value.substring(0, 2) + '.' + value.substring(2, 4) + '.' + value.substring(4, 8);
    } else if (value.length > 2) {
        value = value.substring(0, 2) + '.' + value.substring(2, 4);
    }
    
    e.target.value = value;
    
    // Если введено 8 цифр (ДДММГГГГ), обрабатываем дату
    const cleanValue = value.replace(/\D/g, '');
    if (cleanValue.length === 8) {
        const day = parseInt(cleanValue.substring(0, 2));
        const month = parseInt(cleanValue.substring(2, 4));
        const year = parseInt(cleanValue.substring(4, 8));
        
        const testDate = new Date(year, month - 1, day);
        
        if (testDate.getDate() === day && 
            testDate.getMonth() === month - 1 && 
            testDate.getFullYear() === year) {
            
            // Устанавливаем искомую дату и переходим к ней
            searchedDate = testDate;
            currentDate = new Date(testDate);
            generateCalendar();
            
            // Скрываем поле ввода после успешного ввода
            dateInput.style.display = 'none';
            dateInput.value = '';
        }
    }
});

// Скрываем поле ввода при потере фокуса
dateInput.addEventListener('blur', function() {
    dateInput.style.display = 'none';
    dateInput.value = '';
});

// Обработчик для кнопки "Домой"
document.getElementById('goHome').addEventListener('click', function() {
    // Сбрасываем поиск и возвращаемся к сегодняшней дате
    searchedDate = null;
    currentDate = new Date();
    generateCalendar();
});

// Запускаем часы и обновляем каждую секунду
updateCurrentTime();
setInterval(updateCurrentTime, 1000);

// Инициализация
generateCalendar();
