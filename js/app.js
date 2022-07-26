import { dictionary } from './dictionary.js';
import { Cells, Keys } from './cells.js';

const cellContainer = document.querySelector('.cell-container');
let btnCheck = document.querySelector('.check-btn');
let btnReset = document.querySelector('.reset-btn');
const keyboardContainer = document.querySelector('.keyboard-container');
const popUp = document.querySelector('.pop-up');
const popUpWrap = document.querySelector('.pop-up__wrap');
const popUpStart = document.querySelector('.pop-up__start');
const popUpWin = document.querySelector('.pop-up__win');
const popUpLost = document.querySelector('.pop-up__lost');
const popUpAbsent = document.querySelector('.pop-up__absent');
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
  if (event.key === 'Enter') {
    const activeCells = getActiveCells();
    if (activeCells.length === wordLength) {
      checkInputWord();
    }
    return;
  }
}
function trackKeyClick(event) {
  const regexp = new RegExp('^[а-щА-ЩЬьЮюЯяЇїІіЄєҐґ]$', 'g');
  const keyTargetValue = event.target.dataset.keys;
  
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
  if (checkBtnState) {
    btnCheck.classList.remove('disabled');
  } else {
    btnCheck.classList.add('disabled');
  }
  btnCheck.disabled = !checkBtnState;
  checkBtnState = !checkBtnState;
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
function getKeys() {
  return keyboardContainer.querySelectorAll('.key');
}
function findKeyInKeyBoard(letter) {
  const keysArr = [...getKeys()];
  let keyNum;
  keysArr.forEach((key, i) => {
    if (key.dataset.keys === letter) {
      keyNum = i;
    }
  })
  return keysArr[keyNum];
}

function checkInputWord() {
  const activeCells = getActiveCells();
  const word = collectInputLetter();
  popUpAbsent.classList.add('hide');
  popUpLost.classList.add('hide');
  if (dictionary.includes(word, 0)) {
    const wordArr = word.split('');
    wordArr.forEach((letter, i) => {
      let pos = 0;
      while (randomWord.indexOf(letter, pos) >= 0) {
        pos = randomWord.indexOf(letter, pos);
        if (pos !== notFound && pos === i) {
          activeCells[i].classList.remove('active');
          activeCells[i].classList.add('correct');

          const keyElement = findKeyInKeyBoard(letter);
          if (keyElement.classList.contains('wrong-place')) {
            keyElement.classList.remove('wrong-place');
          }
          keyElement.classList.add('correct');

        } else if (pos !== notFound && pos !== i) {
          activeCells[i].classList.remove('active');
          activeCells[i].classList.add('wrong-place');

          const keyElement = findKeyInKeyBoard(letter);
          if (!keyElement.classList.contains('correct')) {
            keyElement.classList.add('wrong-place');
          }
        }
        pos += 1;
      }
      pos = 0;
      if (randomWord.indexOf(letter, pos) === notFound) {
        activeCells[i].classList.remove('active');
        activeCells[i].classList.add('wrong');

        const keyElement = findKeyInKeyBoard(letter);
        keyElement.classList.add('wrong');
      }
    });
    getNextCell();

    const checkedCells = getCheckedCells();
    
    if (word === randomWord) {
      popUpStart.classList.add('hide');
      popUpWrap.classList.remove('close');
      popUp.classList.remove('close__back');
      popUpWin.classList.remove('hide');
    } else if (checkedCells.length === totalCellsNumber) {
      popUpStart.classList.add('hide');
      popUpWrap.classList.remove('close');
      popUp.classList.remove('close__back');
      popUpLost.classList.remove('hide');
    }
    checkBtn();  
  } else {
    popUpStart.classList.add('hide');
    popUpWrap.classList.remove('close');
    popUp.classList.remove('close__back');
    popUpAbsent.classList.remove('hide');
    const activeCells = [...getActiveCells()];
    activeCells.forEach(() => {
      deleteKey();
    });
  }  
}
// Btn Listeners
btnCheck.addEventListener('click', checkInputWord);
btnReset.addEventListener('click', () => {
  document.location.reload();
});

//Pop-Up close
popUp.addEventListener('click', (event) => {
  const target = event.target;
  if (target.classList.contains('pop-up__close') ||
    target.classList.contains('pop-up')) {
    popUpWrap.classList.add('close');
    popUp.classList.add('close__back');
  }
})
