export function openModal(popup) {
  document.addEventListener("keydown", handleEscClose);
  popup.classList.add("popup_is-animated");
  setTimeout(() => popup.classList.add("popup_is-opened"), 10);
}

export function closeModal(popup) {
  popup.classList.remove("popup_is-opened");
  document.removeEventListener("keydown", handleEscClose);
  setTimeout(() => popup.classList.remove("popup_is-animated"), 600);
}

// Добавим универсальные функции открытия/закрытия

function handleEscClose(evt) {
  if (evt.key === "Escape") {
    const openedPopup = document.querySelector(".popup_is-opened");
    if (openedPopup) closeModal(openedPopup);
  }
}
