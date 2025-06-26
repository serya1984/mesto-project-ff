



export function openModal(element) {
    element.style.display = "flex";
    element.classList.add('popup_is-opened')
};

export function closeModal(element) {
  element.classList.remove('popup_is-opened')
}

