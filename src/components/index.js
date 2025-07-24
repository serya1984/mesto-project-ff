import { closeModal, openModal, closeModalByOverlay } from "./modal.js";
import { createCard, addLikeCard } from "./card.js";
import { enableValidation, clearValidation } from "./validation.js";
import {
  loadCards,
  editProfile,
  getProfile,
  addCard,
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
const formPopupEdit = document.querySelector(".form__edit_card");
const formNewCard = document.querySelector(".form__new_card");
const formNewAvatar = document.querySelector(".form__new_avatar");
const nameInput = formPopupEdit.querySelector(".popup__input_type_name");
const jobInput = formPopupEdit.querySelector(".popup__input_type_description");
const popupItemImage = document.querySelector(".popup_type_image");
const profileTitle = document.querySelector(".profile__title");
const profileDescription = document.querySelector(".profile__description");
const profileImage = document.querySelector(".profile__image");
const popups = document.querySelectorAll(".popup");
const avatarImage = document.querySelector(".profile__image");
const formEditPopupButton = formPopupEdit.querySelector(".popup__button");
const formAddCardButton = formNewCard.querySelector(".popup__button");
const formnewAvatarButton = formNewAvatar.querySelector(".popup__button");

const validationConfig = {
  formSelector: ".popup__form",
  inputSelector: ".popup__input",
  submitButtonSelector: ".popup__button",
  inactiveButtonClass: "popup__button_disabled",
  inputErrorClass: "popup__input_type_error",
  errorClass: "popup__error_visible",
};

Promise.all([getProfile(), loadCards()])
  .then(([profileInfo, cards]) => {
    profileTitle.textContent = profileInfo.name;
    profileDescription.textContent = profileInfo.about;
    profileImage.style.backgroundImage = `url(${profileInfo.avatar})`;

    const userId = profileInfo._id;
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
    console.log("Ошибка при загрузке данных:", err);
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

    clearValidation(formPopupEdit, validationConfig);
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

  loadingForm(true, formEditPopupButton);

  editProfile(nameInput.value, jobInput.value)
    .then((data) => {
      console.log(data)
      profileTitle.textContent = data.name;
      profileDescription.textContent = data.about;
      closeModal(popupEdit);
    })
    .catch((err) => {
      console.log(err);
    })
    .finally(() => {
      loadingForm(false, formEditPopupButton);
    });
}

formPopupEdit.addEventListener("submit", handleFormEditSubmit);

function addNewCard(evt) {
  evt.preventDefault();

  const inputTitle = formNewCard.querySelector(".popup__input_type_card-name");
  const inputLink = formNewCard.querySelector(".popup__input_type_url");

  loadingForm(true, formAddCardButton);

  addCard(inputTitle.value, inputLink.value)
    .then((data) => {
      const userId = data.owner._id;
      cardsList.prepend(
        createCard(data, openDeletePopup, openPopupImage, addLikeCard, userId)
      );
      closeModal(popupAddCard);
    })
    .catch((err) => {
      console.log(err);
    })
    .finally(() => {
      loadingForm(false, formAddCardButton);
    });

  formNewCard.reset();
}

formNewCard.addEventListener("submit", addNewCard);

enableValidation(validationConfig);

avatarImage.addEventListener("click", function () {
  formNewAvatar.reset();
  clearValidation(popupNewAvatar, validationConfig);
  openModal(popupNewAvatar);
});

popupNewAvatar.addEventListener("submit", function (evt) {
  evt.preventDefault();
  const url = document.querySelector(".popup__input_new_avatar").value;

  loadingForm(true, formnewAvatarButton);

  avatarChange(url)
    .then((data) => {
      profileImage.style.backgroundImage = `url(${data.avatar})`;
      closeModal(popupNewAvatar);
    })
    .catch((err) => {
      console.log(err);
    })
    .finally(() => {
      loadingForm(false, formnewAvatarButton);
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
