import { clearValidation } from './validate.js';

export function openModal(popup, formElement = null, config = null) {
  document.addEventListener("keydown", handleEscClose);
  popup.classList.add("popup_is-animated");

  // ✅ Проверка: если есть форма и конфиг — сбрасываем валидацию
  if (formElement && config) {
    clearValidation(formElement, config);
  }

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
