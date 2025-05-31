// @todo: Темплейт карточки
const cardTemplate = document.querySelector('#card-template').content;
// @todo: DOM узлы
const cardsList = document.querySelector('.places__list');

// @todo: Функция создания карточки
function createCard(item, delCard) {
  const cardItem = cardTemplate.querySelector('.card').cloneNode(true);
  const delButton = cardItem.querySelector('.card__delete-button');
  

  cardItem.querySelector('.card__image').src = item.link;
  cardItem.querySelector('.card__image').alt = item.name;
  cardItem.querySelector('.card__title').textContent = item.name;

  delButton.addEventListener('click', delCard);

  return cardItem;
}

// @todo: Функция удаления карточки
function deleteCard() {
const listItem = document.querySelector('.card')
listItem.remove();
}

// @todo: Вывести карточки на страницу
initialCards.forEach((element) => {
  cardsList.append(createCard(element, deleteCard));
});
