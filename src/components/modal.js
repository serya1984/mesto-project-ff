export function openModal(element) {
  element.classList.add("popup_is-opened");
  document.addEventListener("keydown", closeModalByEscape);
}

export function closeModal(element) {
  element.classList.remove("popup_is-opened");
  document.removeEventListener("keydown", closeModalByEscape);
}

function closeModalByEscape(evt) {
  if (evt.key === "Escape") {
    const openPopup = document.querySelector(".popup_is-opened");
    closeModal(openPopup);
  }
}

export function closeModalByOverlay(evt) {
  if (evt.target.classList.contains("popup")) {
    closeModal(evt.currentTarget);
  }
}
