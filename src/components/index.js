import { initialCards } from "./cards.js";
import { closeModal, openModal, closeModalByOverlay} from "./modal.js";
import { createCard, deleteCard } from "./card.js";

// @todo: DOM узлы
const cardsList = document.querySelector(".places__list");
const editButton = document.querySelector(".profile__edit-button");
const addButton = document.querySelector(".profile__add-button");
const closeButtons = document.querySelectorAll(".popup__close");
const popupEdit = document.querySelector(".popup_type_edit");
const popupAddCard = document.querySelector(".popup_type_new-card");
const formPopupEdit = document.forms[0];
const nameInput = formPopupEdit.querySelector(".popup__input_type_name");
const jobInput = formPopupEdit.querySelector(".popup__input_type_description");
const formNewCard = document.forms[1];
const popupItemImage = document.querySelector(".popup_type_image");
const profileTitle = document.querySelector(".profile__title");
const profileDescription = document.querySelector(".profile__description");
const popups = document.querySelectorAll(".popup");

// @todo: Вывести карточки на страницу
initialCards.forEach((element) => {
  cardsList.append(
    createCard(element, deleteCard, openPopupImage, addLikeCard)
  );
});

setupEditPopupOpenButton(editButton, popupEdit);
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

function setupEditPopupOpenButton(button, element) {
  const inputName = document.querySelector(".popup__input_type_name");
  const inputTypeOfDescription = document.querySelector(
    ".popup__input_type_description"
  );

  button.addEventListener("click", function (evt) {
    inputName.value = profileTitle.textContent;
    inputTypeOfDescription.value = profileDescription.textContent;
    openModal(element);
  });
}

closeButtons.forEach(function (item) {
  const popup = item.closest('.popup');
  item.addEventListener("click", function (evt) {
    closeModal(popup);
  });
});

popups.forEach(function (item) {
     item.classList.add("popup_is-animated");
     item.addEventListener('click', function(evt) {
      closeModalByOverlay(evt);
     })
});


function handleFormEditSubmit(evt) {
  evt.preventDefault();

  profileTitle.textContent = nameInput.value;
  profileDescription.textContent = jobInput.value;

  closeModal(popupEdit);
}

formPopupEdit.addEventListener("submit", handleFormEditSubmit);

function addNewCard(evt) {
  evt.preventDefault();

  const inputTitle = formNewCard.querySelector(".popup__input_type_card-name");
  const inputLink = formNewCard.querySelector(".popup__input_type_url");
  const newOdj = { name: inputTitle.value, link: inputLink.value };

  cardsList.prepend(createCard(newOdj, deleteCard, openPopupImage));
  closeModal(popupAddCard);

  formNewCard.reset();
}

formNewCard.addEventListener('submit', addNewCard);


function addLikeCard(cardLikeButton) {
  cardLikeButton.classList.toggle("card__like-button_is-active");
}
