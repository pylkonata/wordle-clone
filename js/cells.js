export class Cells {
  
  createCells() {
    const cellContainer = document.querySelector('.cell-container');
    const fragment = document.createDocumentFragment();
    for (let i = 0; i < 30; i++){
      const inputCell = document.createElement('input');
      inputCell.classList.add('cell');
      inputCell.setAttribute('type', 'text');
      inputCell.disabled = true;
      fragment.append(inputCell);
    }
    cellContainer.innerHTML = '';
    cellContainer.appendChild(fragment);
  }
  
}
export class Keys {
  createKeyboard() {
    const alphabet = ['й', 'ц', 'у', 'к', 'е', 'н', 'г', 'ш', 'щ', 'з', 'х',
      'ї', 'ф', 'і', 'в', 'а', 'п', 'р', 'о', 'л', 'д', 'ж', 'є', 'ґ', 'enter',
      'я', 'ч', 'с', 'м', 'и', 'т', 'ь', 'б', 'ю', 'backspace'];
    const keyboardContainer = document.querySelector('.keyboard-container');
    const fragment = document.createDocumentFragment();
    alphabet.forEach(letter => {
      const keyBtn = document.createElement('button');
      keyBtn.classList.add('key');
      if (letter !== 'backspace') {
        keyBtn.innerText = letter;
      }  
      keyBtn.dataset.keys = letter;
      fragment.append(keyBtn);
    });
    keyboardContainer.innerHTML = '';
    keyboardContainer.appendChild(fragment);
  }
}

