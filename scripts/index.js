// @todo: Темплейт карточки
const cardTemplate = document.querySelector('#card-template').content;
// @todo: DOM узлы
const cardsList = document.querySelector('.places__list');

// @todo: Функция создания карточки
function createCard(item, delCard) {
  const cardItem = cardTemplate.querySelector('.card').cloneNode(true);
  const deleteButton = cardItem.querySelector('.card__delete-button');
  const cardImage = cardItem.querySelector('.card__image');
  
  cardImage.src = item.link;
  cardImage.alt = item.name;
  cardItem.querySelector('.card__title').textContent = item.name;

  deleteButton.addEventListener('click', function() {
    delCard(cardItem);
  });

  return cardItem;
}

// @todo: Функция удаления карточки
function deleteCard(cardItem) {
cardItem.remove();
}

// @todo: Вывести карточки на страницу
initialCards.forEach((element) => {
  cardsList.append(createCard(element, deleteCard));
});
