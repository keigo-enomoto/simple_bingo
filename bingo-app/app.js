let pastNumbers = [];

document.getElementById('generateButton').addEventListener('click', () => {
  const min = parseInt(document.getElementById('minNumber').value);
  const max = parseInt(document.getElementById('maxNumber').value);

  if (min > max) {
    alert('最小値は最大値より小さくしてください。');
    return;
  }

  // 全番号が出尽くした場合
  if (pastNumbers.length >= (max - min + 1)) {
    alert('すべての番号が当選しました。');
    return;
  }

  const currentNumberEl = document.getElementById('currentNumber');
  currentNumberEl.textContent = '--';

  let duration = 3000; // 3秒ルーレット
  let startTime = Date.now();
  let interval = 50;
  let timerId;

  function roulette() {
    let elapsed = Date.now() - startTime;
    let progress = elapsed / duration;

    if (progress < 1) {
      // まだ時間内なら候補を表示
      let candidate;
      do {
        candidate = Math.floor(Math.random() * (max - min + 1)) + min;
      } while (pastNumbers.includes(candidate));

      currentNumberEl.textContent = candidate;
      currentNumberEl.classList.remove('roulette');
      void currentNumberEl.offsetWidth;
      currentNumberEl.classList.add('roulette');

      interval = 50 + progress * 450;
      clearTimeout(timerId);
      timerId = setTimeout(roulette, interval);
    } else {
      // 終了後、最終当選番号を決定
      let number;
      do {
        number = Math.floor(Math.random() * (max - min + 1)) + min;
      } while (pastNumbers.includes(number));

      pastNumbers.push(number);
      currentNumberEl.textContent = number;
      addPastNumber(number);

      currentNumberEl.classList.add('final');
      currentNumberEl.addEventListener('animationend', () => {
        currentNumberEl.classList.remove('final');
      }, { once: true });
    }
  }

  roulette();
});

document.getElementById('addManualButton').addEventListener('click', () => {
  const min = parseInt(document.getElementById('minNumber').value);
  const max = parseInt(document.getElementById('maxNumber').value);
  const manualNumberInput = document.getElementById('manualNumber');
  const manualNum = parseInt(manualNumberInput.value);

  if (isNaN(manualNum)) {
    alert('有効な数字を入力してください。');
    return;
  }

  if (manualNum < min || manualNum > max) {
    alert(`指定範囲外です。${min}～${max}の範囲で入力してください。`);
    return;
  }

  if (pastNumbers.includes(manualNum)) {
    alert('その番号は既に当選済みです。');
    return;
  }

  pastNumbers.push(manualNum);
  const currentNumberEl = document.getElementById('currentNumber');
  currentNumberEl.textContent = manualNum;
  addPastNumber(manualNum);
  manualNumberInput.value = '';

  currentNumberEl.classList.add('final');
  currentNumberEl.addEventListener('animationend', () => {
    currentNumberEl.classList.remove('final');
  }, { once: true });
});

function addPastNumber(num) {
  const li = document.createElement('li');
  li.textContent = num;
  document.getElementById('pastNumbers').appendChild(li);
}
