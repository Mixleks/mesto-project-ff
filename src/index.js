import "./pages/index.css";
import { createCard } from "./components/card.js";
import { openModal, closeModal } from "./components/modal.js";
import { initialCards } from "./cards.js";

const placesList = document.querySelector(".places__list");
const popupImage = document.querySelector(".popup_type_image");
const popupImagePicture = popupImage.querySelector(".popup__image");
const popupImageCaption = popupImage.querySelector(".popup__caption");
const profileName = document.querySelector(".profile__title");
const profileDescription = document.querySelector(".profile__description");
// === Обработчики ===
function handleDeleteCard(cardElement) {
  cardElement.remove();
}

function handleImageClick(data) {
  popupImagePicture.src = data.link;
  popupImagePicture.alt = data.name;
  popupImageCaption.textContent = data.name;

  openModal(popupImage);
}

function handleLike(button) {
  button.classList.toggle("card__like-button_is-active");
}

// === Рендерим начальные карточки ===
initialCards.forEach((cardData) => {
  const card = createCard(
    cardData,
    handleDeleteCard,
    handleImageClick,
    handleLike
  );
  placesList.append(card);
});

// === Работа с попапами ===
const popupEdit = document.querySelector(".popup_type_edit");
const popupAdd = document.querySelector(".popup_type_new-card");
const editButton = document.querySelector(".profile__edit-button");
const addButton = document.querySelector(".profile__add-button");
const closeButtons = document.querySelectorAll(".popup__close");

// Открытие
editButton.addEventListener("click", () => {
  nameInput.value = profileName.textContent;
  jobInput.value = profileDescription.textContent;
  openModal(popupEdit);
});
addButton.addEventListener("click", () => openModal(popupAdd));

// Закрытие по кнопке
closeButtons.forEach((btn) => {
  btn.addEventListener("click", () => {
    closeModal(btn.closest(".popup"));
  });
});

// Закрытие по оверлею
document.querySelectorAll(".popup").forEach((popup) => {
  popup.addEventListener("mousedown", (evt) => {
    if (evt.target === popup) closeModal(popup);
  });
});

// === Форма редактирования профиля ===
const formElement = document.querySelector('form[name="edit-profile"]');
const nameInput = formElement.querySelector(".popup__input_type_name");
const jobInput = formElement.querySelector(".popup__input_type_description");

formElement.addEventListener("submit", (evt) => {
  evt.preventDefault();
  profileName.textContent = nameInput.value;
  profileDescription.textContent = jobInput.value;
  closeModal(formElement.closest(".popup"));
});

// === Форма добавления карточки ===
const addCardForm = document.forms["new-place"];
const titleInput = addCardForm.elements["place-name"];
const linkInput = addCardForm.elements.link;

addCardForm.addEventListener("submit", (evt) => {
  evt.preventDefault();

  const cardData = {
    name: titleInput.value,
    link: linkInput.value,
  };

  const newCard = createCard(
    cardData,
    handleDeleteCard,
    handleImageClick,
    handleLike
  );
  placesList.prepend(newCard);

  addCardForm.reset();
  closeModal(addCardForm.closest(".popup"));
});
