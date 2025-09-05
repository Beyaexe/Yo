let hiragana = {
  "あ": { checked: false, pronunciation: "A" },
  "い": { checked: false, pronunciation: "I" },
  "う": { checked: false, pronunciation: "U" },
  "え": { checked: false, pronunciation: "E" },
  "お": { checked: false, pronunciation: "O" },

  "か": { checked: false, pronunciation: "KA" },
  "き": { checked: false, pronunciation: "KI" },
  "く": { checked: false, pronunciation: "KU" },
  "け": { checked: false, pronunciation: "KE" },
  "こ": { checked: false, pronunciation: "KO" },

  "さ": { checked: false, pronunciation: "SA" },
  "し": { checked: false, pronunciation: "SHI" },
  "す": { checked: false, pronunciation: "SU" },
  "せ": { checked: false, pronunciation: "SE" },
  "そ": { checked: false, pronunciation: "SO" },

  "た": { checked: false, pronunciation: "TA" },
  "ち": { checked: false, pronunciation: "CHI" },
  "つ": { checked: false, pronunciation: "TSU" },
  "て": { checked: false, pronunciation: "TE" },
  "と": { checked: false, pronunciation: "TO" },

  "な": { checked: false, pronunciation: "NA" },
  "に": { checked: false, pronunciation: "NI" },
  "ぬ": { checked: false, pronunciation: "NU" },
  "ね": { checked: false, pronunciation: "NE" },
  "の": { checked: false, pronunciation: "NO" },

  "は": { checked: false, pronunciation: "HA" },
  "ひ": { checked: false, pronunciation: "HI" },
  "ふ": { checked: false, pronunciation: "FU" },
  "へ": { checked: false, pronunciation: "HE" },
  "ほ": { checked: false, pronunciation: "HO" },

  "ま": { checked: false, pronunciation: "MA" },
  "み": { checked: false, pronunciation: "MI" },
  "む": { checked: false, pronunciation: "MU" },
  "め": { checked: false, pronunciation: "ME" },
  "も": { checked: false, pronunciation: "MO" },

  "や": { checked: false, pronunciation: "YA" },
  "ゆ": { checked: false, pronunciation: "YU" },
  "よ": { checked: false, pronunciation: "YO" },

  "ら": { checked: false, pronunciation: "RA" },
  "り": { checked: false, pronunciation: "RI" },
  "る": { checked: false, pronunciation: "RU" },
  "れ": { checked: false, pronunciation: "RE" },
  "ろ": { checked: false, pronunciation: "RO" },

  "わ": { checked: false, pronunciation: "WA" },
  "を": { checked: false, pronunciation: "WO" },

  "ん": { checked: false, pronunciation: "N" }
};


/*Áudios*/
let sounds = {
  '1-4': "sounds/1-5.mp3",
  '5-10': "sounds/6-10.mp3",
  '11-22': "sounds/11-22.mp3",
  '23': "sounds/23.mp3",
  '24-35': "sounds/24-35.mp3",
  '36-45': "sounds/36-45.mp3",
  // '46': "sounds/46.mp3",
  'fail': "sounds/fail.mp3",
  'gameover': "sounds/gameover.mp3",
  'Sadness and Sorrow': "sounds/Sadness and Sorrow.mp3"
};

// Cache de áudios
const audioCache = {};
for (let key in sounds) {
  const audio = new Audio(sounds[key]);
  audio.preload = "auto";  
  audioCache[key] = audio;
}

// Música de fundo
const backgroundMusic = new Audio("sounds/music.mp3");
backgroundMusic.loop = true;
backgroundMusic.volume = 0.085;
backgroundMusic.preload = "auto";

// Música game over
const gameOverMusic = new Audio("sounds/Sadness and Sorrow.mp3");
gameOverMusic.volume = 0.8
gameOverMusic.preload = "auto";

// Variáveis globais
const selectedHiragana = document.getElementById("selectedHiragana")
const choices = document.querySelectorAll("#choices .choice")
const choicesContainer = document.getElementById("choices");
let currentAnswer = "";
let score = 0;
const scoreElement = document.getElementById("score");
const hitMessage = document.getElementById('hitMessage');
let seconds = 60;
const timeRemaining = document.getElementById('timer')
const imgNezuko = nezuko.querySelector('img');


//Iniciar o carregamento
document.addEventListener("DOMContentLoaded", () => {
  sortHiragana()

  //Iniciar a música
  document.addEventListener("click", () => {
  backgroundMusic.play()
  timerRun()
}, { once: true })

});


function sortHiragana(){
    let caracteres = Object.entries(hiragana).filter(([k, v]) => v.checked === false)
    const randomNumber = Math.floor(Math.random() * caracteres.length)

    const [key, value] = caracteres[randomNumber]
    if (value.checked === false){
        value.checked = true
        sortChoices(value)
    }

    //resetar animação fade
    selectedHiragana.innerHTML = key;
    animationFade(selectedHiragana, "fade-in")

}

function sortChoices(value) {
    currentAnswer = value.pronunciation

    const correctIndex = Math.floor(Math.random() * choices.length)
    choices[correctIndex].innerText = value.pronunciation

    //Alternativas erradas ↓
    let wrongChoices = Object.entries(hiragana).filter(([k, v]) => v.pronunciation !== value.pronunciation)

    wrongChoices.sort(() => 0.5 - Math.random())

    let count = 0
    choices.forEach((div, i) => {
        if (i !== correctIndex) {
            const [kWrong, vWrong] = wrongChoices[count]
            div.innerText = vWrong.pronunciation
            count++
        }
        animationFade(div, "fade-in")
    })
    
}

choicesContainer.addEventListener("click", (e) => {
  const choiceEl = e.target.closest(".choice");
  if (!choiceEl || !choicesContainer.contains(choiceEl)) return; // clicou no gap: ignora

  const text = choiceEl.innerText.trim();
  if (text === currentAnswer) {
    score++;
    let soundKey = getSound(score);
    if (soundKey) playSound(soundKey); 

    showHitMessage(score)
    imgNezuko.src = "img/nezukoHappy.png"

    for (let key in hiragana) {
      if (hiragana[key].pronunciation === currentAnswer) {
        hiragana[key].checked = true;
        break;
      }
    }

    scoreElement.innerText = `${score}/${Object.keys(hiragana).length}`;

    if (score === Object.keys(hiragana).length) return win()
    sortHiragana()
  } else {
    imgNezuko.src = "img/nezukoApprehensive.png"
    playSound('fail')
    resetGame()
  }

});


function gameover() {
  if (backgroundMusic) {
    backgroundMusic.pause();
    backgroundMusic.currentTime = 0;
  }

  playSound('gameover', 0.4)
  gameOverMusic.play()
  document.querySelectorAll('#selectedHiragana, #choices, #score, #petal-container, #timer, #nezuko')
  .forEach(el => el.style.display = 'none');
  
  document.getElementById('gameOverContainer').style.display = 'flex';
}

function win() {
  resetGame()
}

function resetGame(){
  
  for (let key in hiragana) {
    hiragana[key].checked = false
  }
  score = 0;
  scoreElement.innerText = `${score}/46`;
  sortHiragana()
}

function restartGame(){
gameOverMusic.pause()
gameOverMusic.currentTime = 0;

document.querySelectorAll('#selectedHiragana, #choices, #score, #petal-container, #timer, #nezuko')
  .forEach(el => el.style.display = 'flex');

  document.getElementById('gameOverContainer').style.display = 'none'; 

  backgroundMusic.loop = true
  backgroundMusic.volume = 0.085
  backgroundMusic.play()

  seconds = 60
  timeRemaining.innerText = `Tempo restante: ${seconds}s`
  timerRun()
}


/////////////////////

const petalContainer = document.getElementById('petal-container')
const petalImages = ["img/petal.png", "img/petal2.png", "img/petal3.png"];

// Pré-carrega as imagens
const petalImgs = petalImages.map(src => {
  const img = new Image();
  img.src = src;
  return img;
});

function createPetal() {
  if (petalContainer.children.length > 20) return; 
  const petal = document.createElement("img");
  petal.src = petalImgs[Math.floor(Math.random() * petalImgs.length)].src; 
  petal.classList.add("petal");

  petal.style.left = `${Math.random() * 100}vw`;

  const size = Math.random() * 14 + 14; 
  petal.style.width = `${size}px`;

  const drift = Math.random() * 40 - 20; 
  petal.style.setProperty("--drift", `${drift}vw`);

  const duration = Math.random() * 2 + 3; 
  petal.style.animationDuration = `${duration}s`;

  const rotation = Math.random() * 360;
  petal.style.transform = `rotate(${rotation}deg)`;

  petalContainer.appendChild(petal);

  setTimeout(() => petal.remove(), duration * 1000);
}

setInterval(createPetal, 460);


//Animação de fade
function animationFade(el, animationClass) {
  el.classList.remove(animationClass);
  void el.offsetWidth; // força reflow
  el.classList.add(animationClass);
}

//Som ao acerto
function playSound(key, volume = 1) {
  const audio = audioCache[key];
  if (!audio) return;
  audio.currentTime = 0; // reinicia o áudio
  audio.volume = volume
  audio.play();
}



//Descobrir qual som usar
function getSound(score) {
  return Object.keys(sounds).find(key => {
    if (key.includes('-')) {
      return score >= +key.split('-')[0] && score <= +key.split('-')[1];
    }
    return +key === score;
  });
}


function showHitMessage(score) {
  let msg = "";
  if (score === 5) msg = "5 acertos!";
  else if (score === 10) msg = "10 acertos, continue assim!";
  else if (score === 15) msg = "15! Quem é você?";
  else if (score === 23) msg = "Metade! Gambateee!!";
  else if (score === 30) msg = "";

  if (!msg) return;

  hitMessage.textContent = msg;

  hitMessage.classList.remove("show");
  void hitMessage.offsetWidth; 
  hitMessage.classList.add("show");
}


function timerRun(){
  const timer = setInterval(() => {
    console.log('tick'); // <- teste
    seconds--;
    timeRemaining.innerText = `Tempo restante: ${seconds}s`; // atualiza layout se quiser

    if (seconds <= 0) {
      clearInterval(timer);
      gameover(); 
    }
  }, 1000);
}


