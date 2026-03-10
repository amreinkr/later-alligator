'use strict';

const translations = {
  en: {
    tagline:      'Add time to any start time — see you later!',
    startLabel:   'Start date & time',
    addTimeLabel: 'Add time',
    unitYr:       'yr',
    unitDay:      'day',
    unitHr:       'hr',
    unitMin:      'min',
    calculateBtn: 'Calculate ➜',
    resultLabel:  'Result',
    yearsAria:    'Years',
    daysAria:     'Days',
    hoursAria:    'Hours',
    minutesAria:  'Minutes',
  },
  es: {
    tagline:      '¡Agrega tiempo a cualquier hora de inicio — hasta luego!',
    startLabel:   'Fecha y hora de inicio',
    addTimeLabel: 'Agregar tiempo',
    unitYr:       'año',
    unitDay:      'día',
    unitHr:       'hr',
    unitMin:      'min',
    calculateBtn: 'Calcular ➜',
    resultLabel:  'Resultado',
    yearsAria:    'Años',
    daysAria:     'Días',
    hoursAria:    'Horas',
    minutesAria:  'Minutos',
  },
};

function setLanguage(lang) {
  const t = translations[lang];
  if (!t) return;

  document.querySelectorAll('[data-i18n]').forEach(el => {
    const key = el.dataset.i18n;
    if (t[key] !== undefined) el.textContent = t[key];
  });

  document.querySelectorAll('[data-i18n-aria]').forEach(el => {
    const key = el.dataset.i18nAria;
    if (t[key] !== undefined) el.setAttribute('aria-label', t[key]);
  });

  document.querySelectorAll('.lang-btn').forEach(btn => {
    btn.classList.toggle('active', btn.dataset.lang === lang);
  });

  document.documentElement.lang = lang;
}

document.querySelectorAll('.lang-btn').forEach(btn => {
  btn.addEventListener('click', () => setLanguage(btn.dataset.lang));
});

const originDateInput = document.getElementById('originDate');
const originInput     = document.getElementById('originTime');
const yearsInput      = document.getElementById('years');
const daysInput       = document.getElementById('days');
const hoursInput      = document.getElementById('hours');
const minutesInput    = document.getElementById('minutes');
const calculateBtn    = document.getElementById('calculateBtn');
const resultSection   = document.getElementById('result');
const resultTime      = document.getElementById('resultTime');
const resultDate      = document.getElementById('resultDate');

// Default origin date to today
originDateInput.value = toDateInputValue(new Date());

// Spinner buttons (+/- for hours and minutes)
document.querySelectorAll('.spin-btn').forEach(btn => {
  btn.addEventListener('click', () => {
    const target = document.getElementById(btn.dataset.target);
    const dir    = btn.dataset.dir === 'up' ? 1 : -1;
    const min    = parseInt(target.min, 10);
    const max    = parseInt(target.max, 10);
    const next   = Math.min(max, Math.max(min, (parseInt(target.value, 10) || 0) + dir));
    target.value = next;
  });
});

// Clamp minutes to 0-59 on manual input
minutesInput.addEventListener('change', () => {
  let val = parseInt(minutesInput.value, 10) || 0;
  val = Math.min(59, Math.max(0, val));
  minutesInput.value = val;
});

yearsInput.addEventListener('change', () => {
  yearsInput.value = Math.max(0, parseInt(yearsInput.value, 10) || 0);
});

daysInput.addEventListener('change', () => {
  let val = parseInt(daysInput.value, 10) || 0;
  daysInput.value = Math.max(0, val);
});

hoursInput.addEventListener('change', () => {
  let val = parseInt(hoursInput.value, 10) || 0;
  hoursInput.value = Math.max(0, val);
});

calculateBtn.addEventListener('click', calculate);

setLanguage('en');

function calculate() {
  const dateVal = originDateInput.value; // "YYYY-MM-DD"
  const timeVal = originInput.value;     // "HH:MM"

  // Parse origin as a local date/time
  const [year, month, day] = dateVal.split('-').map(Number);
  const [hour, minute]     = timeVal.split(':').map(Number);

  const origin = new Date(year, month - 1, day, hour, minute, 0, 0);

  const addYears   = parseInt(yearsInput.value, 10)    || 0;
  const addDays    = parseInt(daysInput.value, 10)    || 0;
  const addHours   = parseInt(hoursInput.value, 10)   || 0;
  const addMinutes = parseInt(minutesInput.value, 10) || 0;

  // Add years by advancing the calendar year, then add remaining time
  const afterYears = new Date(origin);
  afterYears.setFullYear(afterYears.getFullYear() + addYears);
  const result = new Date(afterYears.getTime() + (addDays * 1440 + addHours * 60 + addMinutes) * 60 * 1000);

  resultTime.textContent = formatTime(result);
  resultDate.textContent = formatDate(result);

  resultSection.hidden = false;

  // Re-trigger animation on recalculate
  resultSection.style.animation = 'none';
  void resultSection.offsetWidth;
  resultSection.style.animation = '';
}

function formatTime(date) {
  const h      = date.getHours();
  const m      = date.getMinutes();
  const period = h >= 12 ? 'PM' : 'AM';
  const hour12 = h % 12 || 12;
  return `${hour12}:${String(m).padStart(2, '0')} ${period}`;
}

function formatDate(date) {
  return date.toLocaleDateString(undefined, { weekday: 'short', month: 'short', day: 'numeric', year: 'numeric' });
}

function toDateInputValue(date) {
  const y = date.getFullYear();
  const m = String(date.getMonth() + 1).padStart(2, '0');
  const d = String(date.getDate()).padStart(2, '0');
  return `${y}-${m}-${d}`;
}
