# Calendar Carousel - Portuguese Holidays

An interactive and animated calendar carousel built with HTML, CSS, and JavaScript, featuring Portuguese national holidays (including variable-date holidays like Easter and Corpus Christi). The calendar provides smooth month-to-month transitions and tooltips for holiday names.

---

## ✨ Features

* Dynamic calendar generation by month
* Automatic calculation of Easter-based holidays
* Highlights for:
  * Today's date
  * Portuguese national holidays
* Responsive design (mobile-friendly)
* Animated transitions between months
* Accessible tooltip system for holidays

---

## 🌍 Technologies Used

* HTML5
* CSS3 (Flexbox + Grid)
* JavaScript (ES6+)

---

## 📚 Project Structure

```
/
|-- index.html          # Main HTML page
|-- styles.css          # Main stylesheet
|-- calendar.js         # JavaScript logic (calendar, carousel, holidays)
```

---

## 🌐 How It Works

### Calendar Rendering Logic

Each calendar card corresponds to a single month. The JavaScript dynamically:

* Calculates the starting weekday
* Fills in blank days at the start of the grid
* Fills in days for the current month
* Checks for holidays and highlights them
* Adds today's date with a distinct style

### Carousel Behavior

Three months are shown in memory at all times:

* Previous month
* Current month (centered)
* Next month

Transitions are animated by moving the entire `.carousel-wrapper` via CSS transforms.

---

## 📆 Portuguese Holidays Included

* Fixed-date holidays (e.g., April 25th, June 10th)
* Easter Sunday (calculated)
* Good Friday (2 days before Easter)
* Corpus Christi (60 days after Easter)

### Example (2025)

```
- 2025-01-01  Ano Novo
- 2025-04-18  Sexta-feira Santa
- 2025-04-20  Domingo de Páscoa
- 2025-04-25  25 de Abril
- 2025-05-01  Dia do Trabalhador
- 2025-06-19  Corpo de Deus
...
```

---

## ⚖️ Accessibility

* Tooltips appear on `mouseenter` for holiday days
* Navigation buttons have `aria-label`
* Keyboard navigation can be added for future improvement

---

## 🚀 How to Use

1. Clone or download the project
2. Open `index.html` in a modern browser

---

## 🚧 Future Improvements

* Support for local/regional holidays
* Add dark mode toggle
* Keyboard navigation for carousel
* Localization for other countries

---

## 📖 License

This project is open-source and free to use under the MIT License.