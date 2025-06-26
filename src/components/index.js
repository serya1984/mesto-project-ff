import { initialCards } from "./cards.js";
import {
  closeModal,
  openModal,
} from "./modal.js";
import { createCard } from "./card.js";

// @todo: DOM узлы
const cardsList = document.querySelector(".places__list");
const editButton = document.querySelector(".profile__edit-button");
const addButton = document.querySelector(".profile__add-button");
const closeButtons = document.querySelectorAll(".popup__close");
const popupEdit = document.querySelector(".popup_type_edit");
const popupAddCard = document.querySelector(".popup_type_new-card");
const popups = document.querySelectorAll(".popup");
const formElement = document.querySelector(".popup__form");
const nameInput = formElement.querySelector(".popup__input_type_name");
const jobInput = formElement.querySelector(".popup__input_type_description");
const formNewCard = document.forms[1];
const popupItemImage = document.querySelector(".popup_type_image");
const profileTitle = document.querySelector(".profile__title");
const profileDescription = document.querySelector(".profile__description");

// @todo: Функция удаления карточки
function deleteCard(cardItem) {
  cardItem.remove();
}

// @todo: Вывести карточки на страницу
initialCards.forEach((element) => {
  cardsList.append(
    createCard(element, deleteCard, openPopupImage, addLikeCard)
  );
});

openPopupEdit(editButton, popupEdit);
addButton.addEventListener("click", function (evt) {
  openModal(popupAddCard);
});

function openPopupImage(cardImage) {
  const popupImage = document.querySelector(".popup__image");
  const popupTitle = document.querySelector(".popup__caption");
  popupImage.src = cardImage.src;
  popupImage.alt = cardImage.alt;
  popupTitle.textContent = cardImage.alt;
  openModal(popupItemImage);
}

function openPopupEdit(button, element) {
  const inputName = document.querySelector(".popup__input_type_name");
  const inputTypeOfDescription = document.querySelector(
    ".popup__input_type_description"
  );

  inputName.value = profileTitle.textContent;
  inputTypeOfDescription.value = profileDescription.textContent;
  button.addEventListener("click", function (evt) {
    openModal(element);
  });
}

closeButtons.forEach(function (item) {
  item.addEventListener("click", function (evt) {
    closeModal(popupAddCard);
    closeModal(popupEdit);
    closeModal(popupItemImage);
  });
});

document.addEventListener("keydown", function (evt) {
  if (evt.key === "Escape") {
    closeModal(popupEdit);
    closeModal(popupAddCard);
    closeModal(popupItemImage);
  }
});

popups.forEach(function (item) {
  item.classList.add("popup_is-animated");
  item.addEventListener("click", function (evt) {
    if (evt.target.classList.contains("popup")) {
      closeModal(evt.currentTarget);
    }
  });
});

function handleFormSubmit(evt) {
  evt.preventDefault();

  profileTitle.textContent = nameInput.value;
  profileDescription.textContent = jobInput.value;

  closeModal(evt.currentTarget.parentElement.parentElement);
}

formElement.addEventListener("submit", handleFormSubmit);

function addNewCard(evt) {
  evt.preventDefault();

  const inputTitle = formNewCard.querySelector(".popup__input_type_card-name");
  const inputLink = formNewCard.querySelector(".popup__input_type_url");
  const newOdj = { name: inputTitle.value, link: inputLink.value };

  initialCards.unshift(newOdj);
  cardsList.prepend(createCard(newOdj, deleteCard, openPopupImage));
  closeModal(evt.currentTarget.parentElement.parentElement);
  formNewCard.reset();
}

formNewCard.addEventListener("submit", addNewCard);

function addLikeCard(cardLikeButton) {
  cardLikeButton.classList.toggle("card__like-button_is-active");
}
