const shoppingList = document.querySelector('.shopping-list')
const shoppingForm = document.querySelector('.shopping-form')
const filterButtons = document.querySelectorAll('.filter-buttons button')
const clearBtn = document.querySelector('.clearBtn')


document.addEventListener('DOMContentLoaded', function() {

  loadItems();
  updateState()

  shoppingForm.addEventListener('submit', handleFormSubmit)

  for(let button of filterButtons){
    button.addEventListener('click',handleFilterSelection)
  }

  clearBtn.addEventListener('click', clear)
}) 
// Titta på google -> DOMContentLoaded
/* DOMContentLoaded cagrildigi anda bilesenlerin tamamen olusturulmasi
html hazir hale geelecek DOM content gelecek */

function clear (){
  shoppingList.innerHTML = ''
  localStorage.clear('shoppingItems')
  updateState()
}

function updateState(){
  const isEmpty = shoppingList.querySelectorAll('li').length === 0;
  const alert = document.querySelector('.alert')
  const filterBtnsContainer = document.querySelector('.filter-buttons')
/*   if(isEmpty){
    alert.classList.toggle('d-block')
  } else {
    alert.classList.toggle('d-none')
  } */

 alert.classList.toggle('d-none', !isEmpty)
 clearBtn.classList.toggle('d-none', isEmpty)
 filterBtnsContainer.classList.toggle('d-none', isEmpty)

}

function saveToLS(){
  const listItems = shoppingList.querySelectorAll('li')
  const listAll = []

  for(let li of listItems){
    const id = li.getAttribute('item-id')
    const name = li.querySelector('.item-name').textContent;
    const completed = li.hasAttribute('item-completed')

    listAll.push({id: id, name: name, completed: completed})
  }

  localStorage.setItem('shoppingItems', JSON.stringify(listAll))
}

function loadItems() {
/*   const items = [
    {id:1, name: "Ägg", completed: false},
    {id:2, name: "Yogurt", completed: true},
    {id:3, name: "Brödd", completed: false},
    {id:4, name: "Oliv", completed: false},
  ]; */

  const items = JSON.parse(localStorage.getItem('shoppingItems')) || []

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

  updateFilteredItems()

  saveToLS()

  updateState()
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
  //checkboxta ki islemler
  const li = e.target.parentElement;
  li.toggleAttribute('item-completed', e.target.checked)
  updateFilteredItems()
  saveToLS()
}

function removeItem(e) {
  /* console.log(e.target.parentElement) */
   const li = e.target.parentElement
   shoppingList.removeChild(li)
   saveToLS()
   updateState()
}

function openEditMode(e) {
  const li = e.target.parentElement
  if(li.hasAttribute('item-completed') == false){
    e.target.contentEditable = true;
    //contentEditable veriyi guncelleme
  }
}

function closeEditMode(e) {
  e.target.contentEditable = false
  /*Blur metoduyla mouse baska bir yere gittiginde 
  contentEdittable i false yap*/
  saveToLS()
}

function cancelEnter(e) {
  if(e.key == 'Enter'){
    e.preventDefault() //Default  ozelligi kapatiyoruz
    closeEditMode()
  }
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
  div.addEventListener('click', openEditMode)
  div.addEventListener('blur', closeEditMode)
  div.addEventListener('keydown', cancelEnter)
  
  //delete icon
  const deleteIcon = document.createElement('i')
  deleteIcon.className = 'fs-3 bi bi-x text-danger delete-icon'
  deleteIcon.addEventListener('click', removeItem)

  //create li
  const li = document.createElement('li')
  li.setAttribute("item-id", item.id)
  li.className = 'border rounded p-3 mb-1'
  li.toggleAttribute('item-completed', item.completed)

  li.appendChild(input)
  li.appendChild(div)
  li.appendChild(deleteIcon)

  return li;
}

function handleFilterSelection(e) {
  const filterBtn = e.target;

  for(let button of filterButtons){
    button.classList.add('btn-secondary')
    button.classList.remove('btn-primary')
  }
  filterBtn.classList.add('btn-primary')
  filterBtn.classList.remove('btn-secondary')

  //Hangi buton seciliyor
  /* console.log(filterBtn.getAttribute('item-filter')) */
  filterItems(filterBtn.getAttribute('item-filter'))
}

function filterItems(filterType) {
  const liItems = shoppingList.querySelectorAll('li');
  for(let li of liItems){

    //ClassList te yaptigimiz isleme if oncesi sifirlama diyebiliriz
    li.classList.remove('d-flex');
    li.classList.remove('d-none');
    
    const itemCompleted = li.hasAttribute('item-completed')
    /* FilterType console loga yazdirdigimiz all,incomplete,complete */
    if(filterType == "completed"){
      //tamamlananlari goster
      li.classList.toggle(itemCompleted ? 'd-flex':'d-none')
    } else if(filterType == "incomplete"){
      //tamamlanmayanlari goster 
      li.classList.toggle(itemCompleted ? 'd-none':'d-flex')
    } else {
      //hepsini goster
      li.classList.toggle('d-flex')
    } 
  }
}

function updateFilteredItems() {
  //active olan butonu sec
  const activeFilter = document.querySelector('.btn-primary[item-filter]')
  filterItems(activeFilter.getAttribute("item-filter"))
}