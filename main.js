const shoppingList = document.querySelector('.shopping-list')
const shoppingForm = document.querySelector('.shopping-form')

loadItems();

shoppingForm.addEventListener('submit', handleFormSubmit)

function loadItems() {
  const items = [
    {id:1, name: "Ägg", completed: false},
    {id:2, name: "Yogurt", completed: true},
    {id:3, name: "Brödd", completed: false},
    {id:4, name: "Oliv", completed: false},
  ];

  shoppingList.innerHTML = '';

  for(let item of items){
   const li = createListItem(item);
   shoppingList.appendChild(li)
  }
}

function addItem(input) {
  const id = generateId()
  /* console.log(id) */

  const newItem = createListItem({
    id: id,
    name: input.value,
    completed: false
  })
  /* shoppingList.appendChild(newItem) */ // appendChild liste sonuna ekler
  shoppingList.prepend(newItem) // prepend liste Basina ekler
  input.value = ''
}

function generateId() {
  return Date.now().toString();
}

function handleFormSubmit(e) {
  e.preventDefault();
  const input = document.getElementById('item-name')
  if(input.value.trim().length === 0){
    alert('OBS! Du måste skriva något ;)')
    return;
  }
  addItem(input);
}

function toggleCompleted(e){
  const li = e.target.parentElement;
  li.toggleAttribute('item-completed', e.target.checked)
}

function createListItem(item) {
  //chechkBox
  const input = document.createElement('input');
  input.type = 'checkbox';
  input.classList.add=('form-check-input')
  input.checked = item.completed;
  input.addEventListener('change', toggleCompleted)

  //item
  const div = document.createElement('div');
  div.textContent = item.name
  div.classList.add('item-name')

  //delete icon
  const deleteIcon = document.createElement('i')
  deleteIcon.className = 'fs-3 bi bi-x text-danger delete-icon'

  //create li
  const li = document.createElement('li')
  li.className = 'border rounded p-3 mb-1'
  li.toggleAttribute('item-completed', item.completed)

  li.appendChild(input)
  li.appendChild(div)
  li.appendChild(deleteIcon)

  return li;
}

