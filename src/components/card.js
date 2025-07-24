import { toggleLike } from './api.js'

// @todo: Темплейт карточки
const cardTemplate = document.querySelector("#card-template").content;

// @todo: Функция создания карточки
export function createCard(item, delCard, openPopup, likeCard, userId) {
  const cardItem = cardTemplate.querySelector(".card").cloneNode(true);
  const deleteButton = cardItem.querySelector(".card__delete-button");
  const cardImage = cardItem.querySelector(".card__image");
  const cardLikeButton = cardItem.querySelector(".card__like-button");
  const cardLikeСounter = cardItem.querySelector('.like__counter')

  cardImage.src = item.link;
  cardImage.alt = item.name;
  cardItem.querySelector(".card__title").textContent = item.name;
  cardItem.querySelector(".like__counter").textContent = item.likes.length;

  if (item.owner._id === userId) {
    deleteButton.addEventListener("click", function (evt) {
      delCard(item._id, cardItem);
    });
  } else {
    deleteButton.remove();
  }

  cardImage.addEventListener("click", function (evt) {
    openPopup(cardImage);
  });

  item.likes.forEach(function (like) {
    if (like._id === userId) {
      cardItem
        .querySelector(".card__like-button")
        .classList.add("card__like-button_is-active");
    }
  });

  cardLikeButton.addEventListener("click", function (evt) {
    likeCard(item._id, cardLikeButton, cardLikeСounter);
  });

  return cardItem;
}

export function addLikeCard(cardId, cardLikeButton, cardLikeСounter) {
  const isLiked = cardLikeButton.classList.contains(
    "card__like-button_is-active"
  );

  toggleLike(cardId, isLiked)
    .then((data) => {
      cardLikeСounter.textContent = data.likes.length;
      cardLikeButton.classList.toggle("card__like-button_is-active");
    })
    .catch((err) => {
      console.log(err);
    });
}
