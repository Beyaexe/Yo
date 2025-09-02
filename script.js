let hiragana = {
  "あ": { checked: false, image: "img/あ.png", pronunciation: "A" },
  "い": { checked: false, image: "img/い.png", pronunciation: "I" },
  "う": { checked: false, image: "", pronunciation: "U" },
  "え": { checked: false, image: "", pronunciation: "E" },
  "お": { checked: false, image: "", pronunciation: "O" },

  /*"か": { checked: false, image: "", pronunciation: "KA" },
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

  "ん": { checked: false, image: "", pronunciation: "N" }*/
}


const selectedHiragana = document.getElementById("selectedHiragana")
const choices = document.querySelectorAll("#choices .choice")
let currentAnswer = "";
let score = 0;
const scoreElement = document.getElementById("score");

document.addEventListener("DOMContentLoaded", () => {
    sortHiragana()
    console.log(Object.keys(hiragana).length);
});


function sortHiragana(){
    let caracteres = Object.entries(hiragana).filter(([k, v]) => v.checked === false)
    const randomNumber = Math.floor(Math.random() * caracteres.length)

    const [key, value] = caracteres[randomNumber];
    if (value.checked === false){
        value.checked = true

        selectedHiragana.innerHTML = `<img src="${value.image}" alt="${key}"/>`     
        sortChoices(value)
    }
    
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
    })

}



//Tentativa de acerto
choices.forEach(div => {
    div.addEventListener("click", () => {
        if (div.innerText === currentAnswer) {
            for (let key in hiragana) {
              if (hiragana[key].pronunciation === currentAnswer) {
                  hiragana[key].checked = true
                  break
              } 
            }
            score++
            scoreElement.innerText = `${score}/46`;

            if(score === Object.keys(hiragana).length){
              win()
            }
            sortHiragana() 
        } 
        else{
          gameover()
        }
    });
});

function gameover() {
    alert("Você perdeu!");
    resetGame()
}

function win() {
    alert("Ganhou");
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
  const petal = document.createElement("img");
  petal.src = petalImages[Math.floor(Math.random() * petalImages.length)];
  petal.classList.add("petal");

  petal.style.left = `${Math.random() * 100}vw`;

  const size = Math.random() * 14 + 13; 
  petal.style.width = `${size}px`;

  const drift = Math.random() * 40 - 20; 
  petal.style.setProperty("--drift", `${drift}vw`);

  const duration = Math.random() * 2 + 2; 
  petal.style.animationDuration = `${duration}s`;

  const rotation = Math.random() * 360;
  petal.style.transform = `rotate(${rotation}deg)`;

  petalContainer.appendChild(petal);

  setTimeout(() => petal.remove(), duration * 1000);
}
setInterval(createPetal, 400);