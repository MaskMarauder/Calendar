// Function to calculate the date of Easter Sunday for a given year
// Uses an algorithm known as Computus, which is based on cycles of the moon and solar years
function getEasterDate(year) {
    const f = Math.floor,
        G = year % 19,                         // Golden Number - used to determine the position in the Metonic cycle
        C = f(year / 100),                     // Century
        H = (C - f(C / 4) - f((8 * C + 13) / 25) + 19 * G + 15) % 30,
        I = H - f(H / 28) * (1 - f(29 / (H + 1)) * f((21 - G) / 11)),
        J = (year + f(year / 4) + I + 2 - C + f(C / 4)) % 7,
        L = I - J,
        month = 3 + f((L + 40) / 44),         // Month (March = 3)
        day = L + 28 - 31 * f(month / 4);     // Day of month

    // Returns a Date object representing Easter Sunday
    return new Date(year, month - 1, day);
}

// Formats a Date object into a string 'YYYY-MM-DD'
// Useful for comparing and displaying dates consistently
function formatDate(date) {
    const y = date.getFullYear();
    const m = (date.getMonth() + 1).toString().padStart(2, '0');  // Month (0-based index)
    const d = date.getDate().toString().padStart(2, '0');         // Day
    return `${y}-${m}-${d}`;
}

// Adds a specific number of days to a Date object and returns a new Date
// This helps calculate holidays relative to Easter (which changes every year)
function addDays(date, days) {
    const result = new Date(date);
    result.setDate(result.getDate() + days);
    return result;
}

// Generates an array of Portuguese public holidays for the given year
// Some holidays are fixed dates, others depend on Easter
function generatePortugueseHolidays(year) {
    const easter = getEasterDate(year);
    const goodFriday = addDays(easter, -2);   // Good Friday is two days before Easter
    const corpusChristi = addDays(easter, 60); // Corpus Christi is 60 days after Easter

    // Returns an array of objects with holiday date and name
    return [
        { data: `${year}-01-01`, nome: "Ano Novo" },
        { data: formatDate(goodFriday), nome: "Sexta-feira Santa" },
        { data: formatDate(easter), nome: "Domingo de Páscoa" },
        { data: `${year}-04-25`, nome: "25 de Abril" },
        { data: `${year}-05-01`, nome: "Dia do Trabalhador" },
        { data: formatDate(corpusChristi), nome: "Corpo de Deus" },
        { data: `${year}-06-10`, nome: "Dia de Portugal" },
        { data: `${year}-08-15`, nome: "Assunção de Nossa Senhora" },
        { data: `${year}-10-05`, nome: "Implantação da República" },
        { data: `${year}-11-01`, nome: "Dia de Todos os Santos" },
        { data: `${year}-12-01`, nome: "Restauração da Independência" },
        { data: `${year}-12-08`, nome: "Imaculada Conceição" },
        { data: `${year}-12-25`, nome: "Natal" }
    ];
}

// Main class to create and manage a carousel-style calendar UI component
class CalendarCarousel {
    constructor() {
        this.currentDate = new Date();                     // Tracks the currently displayed month/year
        this.carousel = document.getElementById('carousel'); // Reference to the container element
        this.holidays = generatePortugueseHolidays(this.currentDate.getFullYear()); // Holiday data for the year
        this.isAnimating = false;                           // Flag to prevent multiple animations overlapping
        this.render();                                      // Initial rendering of the calendar
    }

    // Checks if a given date matches any holiday; returns the holiday object if found
    isHoliday(date) {
        const dStr = formatDate(date);
        return this.holidays.find(h => h.data === dStr);
    }

    // Creates a single calendar "card" representing one month
    // Offset parameter allows generating previous (-1), current (0), or next (1) months
    createCalendarCard(offset = 0) {
        const tempDate = new Date(this.currentDate);
        tempDate.setMonth(tempDate.getMonth() + offset);   // Adjust month by offset

        // Find the first weekday of the month and adjust to start week on Monday
        const firstDay = new Date(tempDate.getFullYear(), tempDate.getMonth(), 1).getDay();
        const adjustedFirstDay = (firstDay + 6) % 7;

        // Find number of days in the month
        const daysInMonth = new Date(tempDate.getFullYear(), tempDate.getMonth() + 1, 0).getDate();

        // Create the card element container
        const card = document.createElement('div');
        card.className = 'calendar-card';

        // Add calendar header with month/year and navigation buttons
        card.innerHTML = `
            <div class="calendar-header">
                <button class="nav-button prev" aria-label="Previous Month">‹</button>
                <h3>${tempDate.toLocaleString('pt-PT', { month: 'long', year: 'numeric' })}</h3>
                <button class="nav-button next" aria-label="Next Month">›</button>
            </div>
            <div class="calendar-grid">
                <div class="calendar-day-header">Mon</div>
                <div class="calendar-day-header">Tue</div>
                <div class="calendar-day-header">Wed</div>
                <div class="calendar-day-header">Thu</div>
                <div class="calendar-day-header">Fri</div>
                <div class="calendar-day-header">Sat</div>
                <div class="calendar-day-header">Sun</div>
            </div>
        `;

        const grid = card.querySelector('.calendar-grid');

        // Add empty placeholder days for alignment before the first day of the month
        for (let i = 0; i < adjustedFirstDay; i++) {
            const emptyDay = document.createElement('div');
            emptyDay.className = 'calendar-day empty';
            grid.appendChild(emptyDay);
        }

        // Add day elements for every day in the month
        for (let day = 1; day <= daysInMonth; day++) {
            const dayElement = document.createElement('div');
            dayElement.className = 'calendar-day';
            dayElement.textContent = day;

            const dateToCheck = new Date(tempDate.getFullYear(), tempDate.getMonth(), day);
            const holiday = this.isHoliday(dateToCheck);
            const today = new Date();

            // If day is a holiday, add tooltip and special styling
            if (holiday) {
                const tooltip = document.createElement('div');
                tooltip.className = 'tooltip';
                tooltip.textContent = holiday.nome;
                dayElement.appendChild(tooltip);
                dayElement.classList.add('holiday');

                // Show tooltip on mouse enter and position it properly
                dayElement.addEventListener('mouseenter', () => {
                    tooltip.style.display = 'block';

                    // Position tooltip intelligently based on available space
                    const cardRect = card.getBoundingClientRect();
                    const tooltipRect = tooltip.getBoundingClientRect();
                    const dayRect = dayElement.getBoundingClientRect();

                    const spaceLeft = dayRect.left - cardRect.left;
                    const spaceRight = cardRect.right - dayRect.right;

                    if (spaceLeft < tooltipRect.width / 2) {
                        tooltip.style.left = '0';
                        tooltip.style.right = 'auto';
                        tooltip.style.transform = 'none';
                        tooltip.style.setProperty('--arrow-left', '10px');
                    } else if (spaceRight < tooltipRect.width / 2) {
                        tooltip.style.left = 'auto';
                        tooltip.style.right = '0';
                        tooltip.style.transform = 'none';
                    } else {
                        tooltip.style.left = '50%';
                        tooltip.style.right = 'auto';
                        tooltip.style.transform = 'translateX(-50%)';
                    }
                });

                // Hide tooltip when mouse leaves
                dayElement.addEventListener('mouseleave', () => {
                    tooltip.style.display = 'none';
                });
            }

            // Highlight today's date
            if (day === today.getDate() &&
                tempDate.getMonth() === today.getMonth() &&
                tempDate.getFullYear() === today.getFullYear()) {
                dayElement.classList.add('today');
            }

            grid.appendChild(dayElement);
        }

        return card;
    }

    // Updates the carousel container with three calendar cards: previous, current, and next month
    updateCarousel() {
        this.carousel.innerHTML = ''; // Clear existing content

        const wrapper = document.createElement('div');
        wrapper.className = 'carousel-wrapper';

        // Create cards for previous, current, and next month
        [-1, 0, 1].forEach(offset => {
            wrapper.appendChild(this.createCalendarCard(offset));
        });

        this.carousel.appendChild(wrapper);

        // Center the view on the current month card initially
        wrapper.style.transition = 'none';
        wrapper.style.transform = `translateX(-${this.carousel.offsetWidth + 28}px)`;
        this.wrapper = wrapper;
    }

    // Renders the carousel and sets up event listeners for navigation
    render() {
        this.updateCarousel();

        // Listen for clicks on navigation buttons to slide the carousel left or right
        this.carousel.addEventListener('click', (e) => {
            if (this.isAnimating) return; // Ignore clicks during animation

            if (e.target.classList.contains('next') || e.target.classList.contains('prev')) {
                this.isAnimating = true;
                const direction = e.target.classList.contains('next') ? -1 : 1;
                const shiftAmount = this.carousel.offsetWidth + 28;

                // Animate the sliding transition
                this.wrapper.style.transition = 'transform 0.5s ease';
                this.wrapper.style.transform = `translateX(${(direction + 1) * shiftAmount * -1}px)`;

                // After animation finishes, update the current month and re-render
                setTimeout(() => {
                    this.currentDate.setMonth(this.currentDate.getMonth() - direction);
                    this.holidays = generatePortugueseHolidays(this.currentDate.getFullYear());
                    this.updateCarousel();
                    this.isAnimating = false;
                }, 500);
            }
        });
    }
}

// Instantiates the calendar carousel on page load
new CalendarCarousel();
