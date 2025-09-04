let hiragana = {

  "あ": { checked: false, image: "img/あ.png", pronunciation: "A" },
  "い": { checked: false, image: "img/い.png", pronunciation: "I" },
  "う": { checked: false, image: "", pronunciation: "U" },
  "え": { checked: false, image: "", pronunciation: "E" },
  "お": { checked: false, image: "", pronunciation: "O" },

  "か": { checked: false, image: "", pronunciation: "KA" },
  "き": { checked: false, image: "", pronunciation: "KI" },
  "く": { checked: false, image: "", pronunciation: "KU" },
  "け": { checked: false, image: "", pronunciation: "KE" },
  "こ": { checked: false, image: "", pronunciation: "KO" },

  "さ": { checked: false, image: "", pronunciation: "SA" },
  "し": { checked: false, image: "", pronunciation: "SHI" },
  "す": { checked: false, image: "", pronunciation: "SU" },
  "せ": { checked: false, image: "", pronunciation: "SE" },
  "そ": { checked: false, image: "", pronunciation: "SO" },

  "た": { checked: false, image: "", pronunciation: "TA" },
  "ち": { checked: false, image: "", pronunciation: "CHI" },
  "つ": { checked: false, image: "", pronunciation: "TSU" },
  "て": { checked: false, image: "", pronunciation: "TE" },
  "と": { checked: false, image: "", pronunciation: "TO" },

  "な": { checked: false, image: "", pronunciation: "NA" },
  "に": { checked: false, image: "", pronunciation: "NI" },
  "ぬ": { checked: false, image: "", pronunciation: "NU" },
  "ね": { checked: false, image: "", pronunciation: "NE" },
  "の": { checked: false, image: "", pronunciation: "NO" },

  "は": { checked: false, image: "", pronunciation: "HA" },
  "ひ": { checked: false, image: "", pronunciation: "HI" },
  "ふ": { checked: false, image: "", pronunciation: "FU" },
  "へ": { checked: false, image: "", pronunciation: "HE" },
  "ほ": { checked: false, image: "", pronunciation: "HO" },

  "ま": { checked: false, image: "", pronunciation: "MA" },
  "み": { checked: false, image: "", pronunciation: "MI" },
  "む": { checked: false, image: "", pronunciation: "MU" },
  "め": { checked: false, image: "", pronunciation: "ME" },
  "も": { checked: false, image: "", pronunciation: "MO" },

  "や": { checked: false, image: "", pronunciation: "YA" },
  "ゆ": { checked: false, image: "", pronunciation: "YU" },
  "よ": { checked: false, image: "", pronunciation: "YO" },

  "ら": { checked: false, image: "", pronunciation: "RA" },
  "り": { checked: false, image: "", pronunciation: "RI" },
  "る": { checked: false, image: "", pronunciation: "RU" },
  "れ": { checked: false, image: "", pronunciation: "RE" },
  "ろ": { checked: false, image: "", pronunciation: "RO" },

  "わ": { checked: false, image: "", pronunciation: "WA" },
  "を": { checked: false, image: "", pronunciation: "WO" },

  "ん": { checked: false, image: "", pronunciation: "N" }
}


let sounds = {
  '1-4': "sounds/1-5.mp3",
  '5-10': "sounds/6-10.mp3",
  '11-22': "sounds/11-22.mp3",
  '23': "sounds/23.mp3",
  '24-35': "sounds/24-35.mp3",
  '36-45': "sounds/36-45.mp3",
  '46': "sounds/44.mp3",
  'fail': "sounds/fail.mp3"
};


const selectedHiragana = document.getElementById("selectedHiragana")
const choices = document.querySelectorAll("#choices .choice")
const choicesContainer = document.getElementById("choices");
let currentAnswer = "";
let score = 0;
const scoreElement = document.getElementById("score");
const hitMessage = document.getElementById('hitMessage');


document.addEventListener("DOMContentLoaded", () => {
  sortHiragana()

  //Iniciar a música
  document.addEventListener("click", () => {
    backgroundMusic = new Audio("sounds/music.mp3");
    backgroundMusic.loop = true;       // repete
    backgroundMusic.volume = 0.1;      // volume mais baixo
    backgroundMusic.play();
  }, { once: true }); //
});


function sortHiragana(){
    let caracteres = Object.entries(hiragana).filter(([k, v]) => v.checked === false)
    const randomNumber = Math.floor(Math.random() * caracteres.length)

    const [key, value] = caracteres[randomNumber];
    if (value.checked === false){
        value.checked = true
        // selectedHiragana.innerHTML = `<img src="${value.image}" alt="${key}"/>` antes era imagem
        sortChoices(value)
    }

    //resetar animação fade
    selectedHiragana.innerHTML = key;
    animationFade(selectedHiragana, "fade-in");

}

function sortChoices(value) {

    currentAnswer = value.pronunciation; 

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
    if (soundKey) playSound(sounds[soundKey]);
    showHitMessage(score)


    for (let key in hiragana) {
      if (hiragana[key].pronunciation === currentAnswer) {
        hiragana[key].checked = true;
        break;
      }
    }

    scoreElement.innerText = `${score}/${Object.keys(hiragana).length}`;

    if (score === Object.keys(hiragana).length) return win()
    sortHiragana();
  } else {
    // playSound("sounds/fail.mp3")
    // gameover();
  }

});


function gameover() {
    resetGame()
}

function win() {
    resetGame()
}

function resetGame(){
  
  // coloca animações ou seja o que for aqui ou no gameover, ver qual é melhor

  for (let key in hiragana) {
    hiragana[key].checked = false
  }
  score = 0;
  scoreElement.innerText = `${score}/46`;
  sortHiragana()
}


/////////////////////

const petalContainer = document.getElementById('petal-container')
const petalImages = ["img/petal.png", "img/petal2.png", "img/petal3.png"];

function createPetal() {
  if (petalContainer.children.length > 20) return; // evita excesso
  const petal = document.createElement("img");
  petal.src = petalImages[Math.floor(Math.random() * petalImages.length)];
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
function playSound(src) {
  const audio = new Audio(src);
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
