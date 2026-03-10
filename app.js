'use strict';

const originInput   = document.getElementById('originTime');
const hoursInput    = document.getElementById('hours');
const minutesInput  = document.getElementById('minutes');
const calculateBtn  = document.getElementById('calculateBtn');
const resultSection = document.getElementById('result');
const resultTime    = document.getElementById('resultTime');

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

hoursInput.addEventListener('change', () => {
  let val = parseInt(hoursInput.value, 10) || 0;
  hoursInput.value = Math.max(0, val);
});

calculateBtn.addEventListener('click', calculate);

function calculate() {
  const [originHours, originMinutes] = originInput.value.split(':').map(Number);
  const addHours   = parseInt(hoursInput.value, 10)   || 0;
  const addMinutes = parseInt(minutesInput.value, 10) || 0;

  const totalMinutes = originHours * 60 + originMinutes + addHours * 60 + addMinutes;

  // Wrap around 24 hours
  const resultHours   = Math.floor(totalMinutes / 60) % 24;
  const resultMins    = totalMinutes % 60;

  resultTime.textContent = formatTime(resultHours, resultMins);

  resultSection.hidden = false;

  // Re-trigger animation on recalculate
  resultSection.classList.remove('pop');
  void resultSection.offsetWidth;
}

function formatTime(h, m) {
  const period = h >= 12 ? 'PM' : 'AM';
  const hour12 = h % 12 || 12;
  return `${hour12}:${String(m).padStart(2, '0')} ${period}`;
}
