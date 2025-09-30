// Основные элементы
const monthYearElement = document.getElementById('monthYear');
const daysContainer = document.getElementById('daysContainer');
const prevMonthButton = document.getElementById('prevMonth');
const nextMonthButton = document.getElementById('nextMonth');

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

// Обработчик для кнопки "Поиск даты" с автозаполнением точек и выделением
document.getElementById('searchDate').addEventListener('click', function() {
    // Создаем стилизованное окно ввода с большим шрифтом
    const input = prompt(
        '🔍 ПОИСК ДАТЫ\n\n' +
        'ВВЕДИТЕ 8 ЦИФР:\n' +
        '■■■■■■■■■■■■■■■■■■■■■■■■■■■■■■■■■■■■■■■\n' +
        'ПРИМЕР: 2 5 1 2 2 0 2 4\n' +
        'РЕЗУЛЬТАТ: 25.12.2024\n' +
        '■■■■■■■■■■■■■■■■■■■■■■■■■■■■■■■■■■■■■■■\n\n' +
        'ЦИФРЫ ДАТЫ:'
    );
    
    if (input) {
        // Удаляем все НЕцифры
        const cleanInput = input.replace(/\D/g, '');
        
        if (cleanInput.length === 8) {
            // Автоматически разбиваем и форматируем с точками
            const day = cleanInput.substring(0, 2);
            const month = cleanInput.substring(2, 4);
            const year = cleanInput.substring(4, 8);
            
            const formattedDate = `${day}.${month}.${year}`;
            const dayNum = parseInt(day);
            const monthNum = parseInt(month);
            const yearNum = parseInt(year);
            
            // Проверяем корректность даты
            const testDate = new Date(yearNum, monthNum - 1, dayNum);
            
            if (testDate.getDate() === dayNum && 
                testDate.getMonth() === monthNum - 1 && 
                testDate.getFullYear() === yearNum) {
                
                // Устанавливаем искомую дату и переходим к ней
                searchedDate = testDate;
                currentDate = new Date(testDate); // Копируем дату чтобы не менять оригинал
                generateCalendar();
                
                // Показываем подтверждение с большой подсказкой
                alert(
                    '✅ ДАТА НАЙДЕНА!\n\n' +
                    `■■■■■■■■■■■■■■■■■■■■■■■■■■■■■■■■■■■■■■■\n` +
                    `ВЫ ИСКАЛИ: ${formattedDate}\n` +
                    `■■■■■■■■■■■■■■■■■■■■■■■■■■■■■■■■■■■■■■■\n\n` +
                    'Дата выделена 🟢 ЗЕЛЁНЫМ цветом'
                );
                
            } else {
                alert(
                    '❌ ОШИБКА!\n\n' +
                    'НЕКОРРЕКТНАЯ ДАТА!\n' +
                    'Проверьте числа месяца и дня'
                );
            }
        } else {
            alert(
                '❌ ОШИБКА!\n\n' +
                'НУЖНО 8 ЦИФР!\n\n' +
                'ПРИМЕР ВВОДА:\n' +
                '■■■■■■■■■■■■■■■■■■■■■■■■■■■■■■■■■■■■■■■\n' +
                '2 5 0 1 2 0 2 5\n' +
                '■■■■■■■■■■■■■■■■■■■■■■■■■■■■■■■■■■■■■■■\n\n' +
                'РЕЗУЛЬТАТ: 25.01.2025'
            );
        }
    }
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
