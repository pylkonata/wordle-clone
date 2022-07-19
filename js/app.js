import { dictionary } from './dictionary.js';
import { Cells, Keys } from './cells.js';
const cellContainer = document.querySelector('.cell-container');
let btnCheck = document.querySelector('.check-btn');
let btnReset = document.querySelector('.reset-btn');
const keyboardContainer = document.querySelector('.keyboard-container');
const wordLength = 5;
const notFound = -1;
const sec = 500;
const totalCellsNumber = 30;
let checkBtnState = true;

//Get Random Word
function getRandomNum(min, max) {
  return Math.floor(Math.random() * (max - min + 1)) + min;
}
let randomNum = getRandomNum(0, dictionary.length - 1);
let randomWord = dictionary[randomNum];
// console.log(randomWord);
//Create Cells, Keyboard
const cell = new Cells();
cell.createCells();
const key = new Keys();
key.createKeyboard();
//Start Game

function startGame() {
  document.addEventListener('keydown', trackKeyPress);
  keyboardContainer.addEventListener('pointerdown', trackKeyClick);
  getNextCell();
}
startGame();

function trackKeyPress(event) {
  const regexp = new RegExp('^[а-щА-ЩЬьЮюЯяЇїІіЄєҐґ]$', 'g');
  if (event.key.match(regexp)) {
    pressKey(event.key);
    return;
  }
  if (event.key === 'Backspace' || event.key === 'Delete') {
    deleteKey();
    return;
  }
}
function trackKeyClick(event) {
  const regexp = new RegExp('^[а-щА-ЩЬьЮюЯяЇїІіЄєҐґ]$', 'g');
  const keyTargetValue = event.target.dataset.keys;
  console.log(keyTargetValue);
  if (keyTargetValue.match(regexp)) {
    pressKey(keyTargetValue);
    return;
  }
  if (keyTargetValue === 'backspace') {
    deleteKey();
    return;
  }
  if (keyTargetValue === 'enter') {
    const activeCells = getActiveCells();
    if (activeCells.length === wordLength) {
      checkInputWord();
    }
    return;
  }
}
function pressKey(key) {
  const activeCells = getActiveCells();
  if (activeCells.length >= wordLength) {
    return;
  } else if (activeCells.length === wordLength - 1) {
    checkBtn();
  }
  const nextCell = cellContainer.querySelector(':not([data-letter])');
  if (nextCell.classList.contains('intarget')) {
    nextCell.classList.remove('intarget');
  }
  nextCell.focus();
  nextCell.dataset.letter = key.toLowerCase();
  nextCell.value = key;
  console.log(key);
  nextCell.classList.add('active');
}
function getNextCell() {
  const nextCell = cellContainer.querySelector(':not([data-letter])');
  if (nextCell) {
    nextCell.classList.add('intarget');
  }  
}
function getActiveCells() {
  return cellContainer.querySelectorAll('.active');
}
function getCheckedCells() {
  const wrongCells =cellContainer.querySelectorAll('.wrong');
  const wrongPlaceCells =cellContainer.querySelectorAll('.wrong-place');
  const correctCells = cellContainer.querySelectorAll('.correct');
  return [...wrongCells, ...wrongPlaceCells, ...correctCells];
}
function checkBtn() {
  let btnCheck = document.querySelector('.check-btn');
  console.log(checkBtnState);
  if (checkBtnState) {
    btnCheck.classList.remove('disabled');
  } else {
    btnCheck.classList.add('disabled');
  }
  btnCheck.disabled = !checkBtnState;
  checkBtnState = !checkBtnState;
  console.log(checkBtnState);
}
function deleteKey() {
  const activeCells = getActiveCells();
  if (activeCells.length === 0) {
    return;
  }
  
  if (activeCells.length === wordLength) {
    checkBtn();
  }
  const lastCell = activeCells[activeCells.length - 1];
  lastCell.focus();
  lastCell.value = '';
  lastCell.classList.remove('active');
  delete lastCell.dataset.letter;

  if (activeCells.length === 1) {
    getNextCell();
  }
}
function collectInputLetter() {
  const activeCells = [...getActiveCells()];
  return activeCells.reduce((word, item) => word + item.dataset.letter, '');  
}

function checkInputWord() {
  const activeCells = getActiveCells();
  const word = collectInputLetter();
  if (dictionary.includes(word, 0)) {
    const wordArr = word.split('');
    wordArr.forEach((letter, i) => {
      let pos = 0;
      while (randomWord.indexOf(letter, pos) >= 0) {
        pos = randomWord.indexOf(letter, pos);
        if (pos !== notFound && pos === i) {
          activeCells[i].classList.remove('active');
          activeCells[i].classList.add('correct');

        } else if (pos !== notFound && pos !== i) {

          activeCells[i].classList.remove('active');
          activeCells[i].classList.add('wrong-place');
        }
        pos += 1;
      }
      pos = 0;
      if (randomWord.indexOf(letter, pos) === notFound) {
        activeCells[i].classList.remove('active');
        activeCells[i].classList.add('wrong');
      }
    });
    getNextCell();
    if (word === randomWord) {
      setTimeout(() => {
        alert('Вітаю! Ви Виграли!');
      }, sec);
      setTimeout(() => {
        document.location.reload();
      }, sec);
      
    }
    const checkedCells = getCheckedCells();
    if (checkedCells.length === totalCellsNumber) {
      setTimeout(() => {
        alert('Ви програли :(');
      }, sec);
      setTimeout(() => {
        document.location.reload();
      }, sec);
    }
    checkBtn();  
  } else {
    alert("Цього слова не має у словнику");
    const activeCells = [...getActiveCells()];
    activeCells.forEach(() => {
      deleteKey();
    });
  }  
}

btnCheck.addEventListener('click', checkInputWord);
btnReset.addEventListener('click', () => {
  document.location.reload();
});
