const newItem = document.querySelector('.newItem');
const addItem = document.querySelector('.addItem');
const container = document.querySelector('.container');
const clearAll = document.querySelector('.clearAll');
addItem.addEventListener('click', addNewItem);
clearAll.addEventListener('click', clearAllItems);
let arrayDo = [];
let arrayDone = [];
render();
moveItems();

function render() {
    if (localStorage.getItem('itemsDo')) {
        arrayDo = JSON.parse(localStorage.getItem('itemsDo'));
        arrayDo.forEach(element => {
            const newRow = `<div class="row">
    <div>
      <div class="item" draggable="true">${element}</div>
    </div>
    <div class="placeholder"></div>
  </div>`;
            container.insertAdjacentHTML('beforeend', newRow);
        });
    }
    if (localStorage.getItem('itemsDone')) {
        arrayDone = JSON.parse(localStorage.getItem('itemsDone'));
        arrayDone.forEach(element => {
            const newRow = `<div class="row">
    <div>
      <div class="placeholder"></div>
    </div>
    <div class="item" draggable="false">${element}</div>
  </div>`;
            container.insertAdjacentHTML('beforeend', newRow);
        });
    }
}

function addNewItem() {
    if (newItem.value !== '') {
        const newRow = `<div class="row">
            <div>
              <div class="item" draggable="true">${newItem.value}</div>
            </div>
            <div class="placeholder"></div>
          </div>`;
        container.insertAdjacentHTML('beforeend', newRow);
        arrayDo.push(newItem.value);
        newItem.value = "";
        localStorage.setItem('itemsDo', JSON.stringify(arrayDo));
    }
    moveItems();
}

function moveItems() {
    const items = document.querySelectorAll('.item');
    const placeholders = document.querySelectorAll('.placeholder');
    let activeElement = null;

    for (const placeholder of placeholders) {
        placeholder.addEventListener('dragover', dragover);
        placeholder.addEventListener('dragenter', dragenter);
        placeholder.addEventListener('dragleave', dragleave);
        placeholder.addEventListener('drop', dragdrop);
    }
    for (const item of items) {
        item.addEventListener('dragstart', dragstart);
        item.addEventListener('dragend', dragend);
    }
}

function dragstart(event) {
    setTimeout(() => {
        event.target.classList.add('hide');
        activeElement = event.target;
        event.target.classList.add('hold');
    }, 0)
}

function dragend(event) {
    event.target.classList.remove('hold', 'hide');
    activeElement.draggable = false;
}

function dragover(event) {
    event.preventDefault();
}

function dragenter(event) {
    event.target.classList.add('hovered');
}

function dragleave(event) {
    event.target.classList.remove('hovered');
}

function dragdrop(event, clb) {
    event.target.classList.remove('hovered');
    event.target.append(activeElement);
    activeElement.removeEventListener('dragstart', dragstart);
    activeElement.removeEventListener('dragenter', dragenter);
    activeElement.removeEventListener('dragleave', dragleave);
    activeElement.removeEventListener('dragdrop', dragdrop);

    clb = function () {
        let ind = arrayDo.indexOf(activeElement.textContent);
        arrayDo.splice(ind, 1);
        localStorage.setItem('itemsDo', JSON.stringify(arrayDo));
        arrayDone.push(activeElement.textContent);
        localStorage.setItem('itemsDone', JSON.stringify(arrayDone));
    }
    clb();
}

function clearAllItems() {
    localStorage.clear();
    arrayDo = '';
    arrayDone = '';
    location.reload();
}