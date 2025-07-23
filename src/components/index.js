import { closeModal, openModal, closeModalByOverlay } from "./modal.js";
import { createCard } from "./card.js";
import { enableValidation, clearValidation } from "./validation.js";
import {
  loadCards,
  editProfile,
  getProfile,
  addCard,
  toggleLike,
  avatarChange,
  removeCard,
} from "./api.js";

// @todo: DOM узлы
const cardsList = document.querySelector(".places__list");
const editButton = document.querySelector(".profile__edit-button");
const addButton = document.querySelector(".profile__add-button");
const closeButtons = document.querySelectorAll(".popup__close");
const popupEdit = document.querySelector(".popup_type_edit");
const popupAddCard = document.querySelector(".popup_type_new-card");
const popupDeleteCard = document.querySelector(".popup__delete_card");
const popupNewAvatar = document.querySelector(".popup__new_avatar");
const formPopupEdit = document.forms[0];
const formNewCard = document.forms[1];
const formNewAvatar = document.forms[3];
const nameInput = formPopupEdit.querySelector(".popup__input_type_name");
const jobInput = formPopupEdit.querySelector(".popup__input_type_description");
const popupItemImage = document.querySelector(".popup_type_image");
const profileTitle = document.querySelector(".profile__title");
const profileDescription = document.querySelector(".profile__description");
const profileImage = document.querySelector(".profile__image");
const popups = document.querySelectorAll(".popup");
const avatarImage = document.querySelector(".profile__image");

// @todo: Вывести карточки на страницу//
getProfile().then((profileInfo) => {
  const userId = profileInfo._id;
  loadCards()
    .then((cards) => {
      cards.forEach((cardsInfo) => {
        cardsList.append(
          createCard(
            cardsInfo,
            openDeletePopup,
            openPopupImage,
            addLikeCard,
            userId
          )
        );
      });
    })
    .catch((err) => {
      console.log(err);
    });
});

getProfile()
  .then((profileInfo) => {
    profileTitle.textContent = profileInfo.name;
    profileDescription.textContent = profileInfo.about;
    profileImage.style.backgroundImage = `url(${profileInfo.avatar})`;
  })
  .catch((err) => {
    console.log(err);
  });

setupEditPopupOpenButton(editButton, popupEdit);

addButton.addEventListener("click", function (evt) {
  clearValidation(formNewCard, {
    formSelector: ".popup__form",
    inputSelector: ".popup__input",
    submitButtonSelector: ".popup__button",
    inactiveButtonClass: "popup__button_disabled",
    inputErrorClass: "popup__input_type_error",
    errorClass: "popup__error_visible",
  });
  formNewCard.reset();
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
  button.addEventListener("click", function (evt) {
    nameInput.value = profileTitle.textContent;
    jobInput.value = profileDescription.textContent;

    clearValidation(formPopupEdit, {
      formSelector: ".popup__form",
      inputSelector: ".popup__input",
      submitButtonSelector: ".popup__button",
      inactiveButtonClass: "popup__button_disabled",
      inputErrorClass: "popup__input_type_error",
      errorClass: "popup__error_visible",
    });
    openModal(element);
  });
}

closeButtons.forEach(function (item) {
  const popup = item.closest(".popup");
  item.addEventListener("click", function (evt) {
    closeModal(popup);
  });
});

popups.forEach(function (item) {
  item.classList.add("popup_is-animated");
  item.addEventListener("click", function (evt) {
    closeModalByOverlay(evt);
  });
});

function handleFormEditSubmit(evt) {
  evt.preventDefault();

  const popupButton = formPopupEdit.querySelector(".popup__button");

  loadingForm(true, popupButton);

  profileTitle.textContent = nameInput.value;
  profileDescription.textContent = jobInput.value;

  editProfile(nameInput.value, jobInput.value)
    .catch((err) => {
      console.log(err);
    })
    .finally(() => {
      loadingForm(false, popupButton);
      closeModal(popupEdit);
    });
}

formPopupEdit.addEventListener("submit", handleFormEditSubmit);

function addNewCard(evt) {
  evt.preventDefault();

  const inputTitle = formNewCard.querySelector(".popup__input_type_card-name");
  const inputLink = formNewCard.querySelector(".popup__input_type_url");
  const popupButton = formNewCard.querySelector(".popup__button");

  loadingForm(true, popupButton);

  addCard(inputTitle.value, inputLink.value)
    .then((data) => {
      const userId = data.owner._id;
      cardsList.prepend(
        createCard(data, openDeletePopup, openPopupImage, addLikeCard, userId)
      );
    })
    .catch((err) => {
      console.log(err);
    })
    .finally(() => {
      loadingForm(false, popupButton);
      closeModal(popupAddCard);
    });

  formNewCard.reset();
}

formNewCard.addEventListener("submit", addNewCard);

function addLikeCard(cardId, cardItem, cardLikeButton) {
  const isLiked = cardLikeButton.classList.contains(
    "card__like-button_is-active"
  );

  toggleLike(cardId, isLiked)
    .then((data) => {
      cardItem.querySelector(".like__counter").textContent = data.likes.length;
      cardLikeButton.classList.toggle("card__like-button_is-active");
    })
    .catch((err) => {
      console.log(err);
    });
}

enableValidation({
  formSelector: ".popup__form",
  inputSelector: ".popup__input",
  submitButtonSelector: ".popup__button",
  inactiveButtonClass: "popup__button_disabled",
  inputErrorClass: "popup__input_type_error",
  errorClass: "popup__error_visible",
});

avatarImage.addEventListener("click", function () {
  clearValidation(popupNewAvatar, {
    formSelector: ".popup__form",
    inputSelector: ".popup__input",
    submitButtonSelector: ".popup__button",
    inactiveButtonClass: "popup__button_disabled",
    inputErrorClass: "popup__input_type_error",
    errorClass: "popup__error_visible",
  });
  formNewAvatar.reset();
  openModal(popupNewAvatar);
});

popupNewAvatar.addEventListener("submit", function (evt) {
  evt.preventDefault();
  const url = document.querySelector(".popup__input_new_avatar").value;
  const popupButton = popupNewAvatar.querySelector(".popup__button");

  loadingForm(true, popupButton);

  avatarChange(url)
    .then((data) => {
      profileImage.style.backgroundImage = `url(${data.avatar})`;
    })
    .catch((err) => {
      console.log(err);
    })
    .finally(() => {
      loadingForm(false, popupButton);
      closeModal(popupNewAvatar);
    });
});

function loadingForm(isLoading, button) {
  if (isLoading) {
    button.textContent = "Сохранение...";
  } else {
    button.textContent = "Сохранить";
  }
}

let cardForDelete = {};

function openDeletePopup(cardId, cardItem) {
  cardForDelete = {
    id: cardId,
    cardItem,
  };
  openModal(popupDeleteCard);
}

function hendleDeleteFormSudmit(evt) {
  evt.preventDefault();

  if (!cardForDelete.cardItem) return;

  removeCard(cardForDelete.id)
    .then(() => {
      cardForDelete.cardItem.remove();
      closeModal(popupDeleteCard);
      cardForDelete = {};
    })
    .catch((err) => {
      console.log(err);
    });
}

popupDeleteCard
  .querySelector(".button__confirm_deletion")
  .addEventListener("click", hendleDeleteFormSudmit);
