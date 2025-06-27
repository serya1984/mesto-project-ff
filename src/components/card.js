// @todo: Темплейт карточки
const cardTemplate = document.querySelector("#card-template").content;

// @todo: Функция создания карточки
export function createCard(item, delCard, openPopup, likeCard) {
  const cardItem = cardTemplate.querySelector(".card").cloneNode(true);
  const deleteButton = cardItem.querySelector(".card__delete-button");
  const cardImage = cardItem.querySelector(".card__image");
  const cardLikeButton = cardItem.querySelector('.card__like-button')

  cardImage.src = item.link;
  cardImage.alt = item.name;
  cardItem.querySelector(".card__title").textContent = item.name;

  deleteButton.addEventListener("click", function () {
    delCard(cardItem);
  });

  cardImage.addEventListener("click", function (evt) {
    openPopup(cardImage);
  });

  cardLikeButton.addEventListener('click', function(evt) {
    likeCard(cardLikeButton);
  });

  return cardItem;
}

// @todo: Функция удаления карточки
export function deleteCard(cardItem) {
  cardItem.remove();
};
