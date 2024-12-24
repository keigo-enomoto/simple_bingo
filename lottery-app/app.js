// 各等の残り人数
let remainFirst = 0;
let remainSecond = 0;
let remainThird = 0;

function updateDisplayCircles(containerId, count, className) {
  const container = document.getElementById(containerId);
  container.innerHTML = '';
  for (let i = 0; i < count; i++) {
    const circle = document.createElement('span');
    circle.classList.add('circle', className);
    container.appendChild(circle);
  }
}

function updateDisplay() {
  // 数字の代わりに丸を表示
  updateDisplayCircles('remainFirstContainer', remainFirst, 'first');
  updateDisplayCircles('remainSecondContainer', remainSecond, 'second');
  updateDisplayCircles('remainThirdContainer', remainThird, 'third');

  const drawButton = document.getElementById('drawButton');
  if (remainFirst === 0 && remainSecond === 0 && remainThird === 0) {
    drawButton.disabled = true;
  } else {
    drawButton.disabled = false;
  }
}

document.getElementById('initButton').addEventListener('click', () => {
  const first = parseInt(document.getElementById('firstCount').value);
  const second = parseInt(document.getElementById('secondCount').value);
  const third = parseInt(document.getElementById('thirdCount').value);

  if (first < 0 || second < 0 || third < 0) {
    alert('当選人数は0以上を指定してください。');
    return;
  }

  remainFirst = first;
  remainSecond = second;
  remainThird = third;

  updateDisplay();
  document.getElementById('result').textContent = '';
});

document.getElementById('drawButton').addEventListener('click', () => {
  // 残っている等を配列に格納
  let candidates = [];

  // 各等の当選確率は1/3
  // if (remainFirst > 0) candidates.push('1等');
  // if (remainSecond > 0) candidates.push('2等');
  // if (remainThird > 0) candidates.push('3等');

  // 各等の残りの当選数に応じた確率
  for( let i=0; i<remainFirst; i++) candidates.push('1等');
  for( let i=0; i<remainSecond; i++) candidates.push('2等');
  for( let i=0; i<remainThird; i++) candidates.push('3等');

  const resultElement = document.getElementById('result');
  resultElement.textContent = ''; // 前回結果をクリア

  if (candidates.length === 0) {
    resultElement.textContent = 'すべての当選枠が埋まりました。';
    return;
  }

  // ルーレット演出
  let duration = 3000; // 3秒
  let startTime = Date.now();
  let interval = 50; // 初期表示間隔(ms)
  let timerId;

  function roulette() {
    let elapsed = Date.now() - startTime;
    let progress = elapsed / duration;

    if (progress < 1) {
      // 表示間隔を徐々に増加（スローに）
      interval = 50 + progress * 450;
      // 候補からランダムに選んで表示
      let show = candidates[Math.floor(Math.random() * candidates.length)];
      resultElement.textContent = show;

      clearTimeout(timerId);
      timerId = setTimeout(roulette, interval);
    } else {
      // 最終的な当選等を決定
      let final = candidates[Math.floor(Math.random() * candidates.length)];
      resultElement.textContent = final + ' 当選！';

      // pulseクラスを付与
      resultElement.classList.add('pulse');
      resultElement.addEventListener('animationend', () => {
        resultElement.classList.remove('pulse');
      }, { once: true });

      // 選ばれた等の残数を1減らす
      switch(final) {
        case '1等':
          remainFirst--;
          break;
        case '2等':
          remainSecond--;
          break;
        case '3等':
          remainThird--;
          break;
      }

      updateDisplay();
    }
  }

  roulette();
});
