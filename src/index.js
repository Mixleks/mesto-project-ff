import "./pages/index.css";
import { createCard } from "./components/card.js";
import { openModal, closeModal } from "./components/modal.js";
import { enableValidation } from './components/validate.js';
import { getUserInfo, getInitialCards, updateUserInfo, addCard, deleteCard, changeLikeStatus, updateAvatar} from "./components/api.js";
import { clearValidation } from "./components/validate.js";

const validationConfig = {
  formSelector: '.popup__form',
  inputSelector: '.popup__input',
  submitButtonSelector: '.popup__button',
  inactiveButtonClass: 'popup__button_disabled',
  inputErrorClass: 'popup__input_type_error',
  errorClass: 'popup__input-error_active'
};
// === Список карточек ===
const placesList = document.querySelector(".places__list");
// === Попап с картинкой ===
const popupImage = document.querySelector(".popup_type_image");
const popupImagePicture = popupImage.querySelector(".popup__image");
const popupImageCaption = popupImage.querySelector(".popup__caption");
// === Профиль ===
const profileName = document.querySelector(".profile__title");
const profileDescription = document.querySelector(".profile__description");
const profileAvatar = document.querySelector(".profile__image");
// === Попап подтверждения удаления ===
const popupConfirm = document.querySelector(".popup_type_confirm");
const confirmButton = popupConfirm.querySelector(".popup__button_confirm");
// === Аватар ===
const popupAvatar = document.querySelector(".popup_type_avatar");
const avatarForm = document.forms["update-avatar"];
const avatarInput = avatarForm.elements["avatar"];
const avatarEditButton = document.querySelector(".profile__avatar-edit-button"); // клик по аватару

let cardToDelete = null; // храним элемент
let cardIdToDelete = null; // храним id

enableValidation(validationConfig);

// Сохранение...
function renderLoading(button, isLoading, initialText = "Сохранить") {
  button.textContent = isLoading ? "Сохранение..." : initialText;
}

// === Обработчики ===
function handleDeleteCard(cardId, cardElement) {
  cardToDelete = cardElement;
cardIdToDelete = cardId;
 openModal(popupConfirm);
}


confirmButton.addEventListener("click", () => {
  if (cardIdToDelete && cardToDelete) {
    deleteCard(cardIdToDelete)
    .then(() =>{
       cardToDelete.remove();
        closeModal(popupConfirm);
        cardIdToDelete = null;
        cardToDelete = null;
    })
    .catch(err => console.error(`Ошибка при удалении: ${err}`));
  }
})

function handleImageClick(data) {
  popupImagePicture.src = data.link;
  popupImagePicture.alt = data.name;
  popupImageCaption.textContent = data.name;
  openModal(popupImage);
}

function handleLike(cardId, likeButton, likeCount) {
  const isLiked = likeButton.classList.contains("card__like-button_is-active");

  changeLikeStatus(cardId, isLiked)
    .then((updatedCard) => {
      likeButton.classList.toggle("card__like-button_is-active");
      likeCount.textContent = updatedCard.likes.length; // ✅ всегда из ответа сервера
    })
    .catch((err) => console.error(`Ошибка лайка: ${err}`));
}

// Новая функция обновления профиля
function renderUserInfo(userData) {
  if (!userData || !userData.name) {
    console.error("Данные пользователя не получены:", userData);
    return;
  }
  profileName.textContent = userData.name;
  profileDescription.textContent = userData.about;
 profileAvatar.style.backgroundImage = `url(${userData.avatar})`;
}

// ✅ Рендер карточек с API
function renderCards(cards, userId) {
  cards.forEach(cardData => {
    const cardElement = createCard(cardData, userId, handleDeleteCard, handleImageClick, handleLike);
    placesList.append(cardElement);
  });
}

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
  const editProfileForm = popupEdit.querySelector(".popup__form");
  openModal(popupEdit, editProfileForm, validationConfig);
  clearValidation(editProfileForm, validationConfig);
});

addButton.addEventListener("click", () => {
  const addCardFormElement = popupAdd.querySelector(".popup__form");
  openModal(popupAdd, addCardFormElement, validationConfig);
 clearValidation(addCardForm, validationConfig);
 addCardFormElement.reset();
});

avatarEditButton.addEventListener('click', () => {
  openModal(popupAvatar, avatarForm, validationConfig);
  clearValidation(avatarForm, validationConfig);
  avatarForm.reset();
});

avatarForm.addEventListener('submit', (evt) => {
  evt.preventDefault();

   const saveButton = avatarForm.querySelector('.popup__button');
   renderLoading(saveButton, true); // ✅ Показать "Сохранение..."
  updateAvatar(avatarInput.value)
    .then((updatedUser) => {
      renderUserInfo(updatedUser);
      closeModal(popupAvatar);
      avatarForm.reset();
    })
    .catch(err => console.error(`Ошибка обновления аватара: ${err}`))
      .finally(() => renderLoading(saveButton, false));
});

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
const editProfileForm = document.forms['edit-profile'];
const nameInput = editProfileForm.querySelector(".popup__input_type_name");
const jobInput = editProfileForm.querySelector(".popup__input_type_description");

editProfileForm.addEventListener("submit", (evt) => {
  evt.preventDefault();
 const saveButton = editProfileForm.querySelector('.popup__button');
 renderLoading(saveButton, true); // ✅ Показать "Сохранение..."
  const nameValue = nameInput.value;
  const jobValue = jobInput.value;

  updateUserInfo(nameValue, jobValue)
    .then((updatedUser) => {
       renderUserInfo(updatedUser);;
      closeModal(editProfileForm.closest(".popup"));
    })
    .catch(err => console.error(`Ошибка обновления профиля: ${err}`))
    .finally(() => renderLoading(saveButton, false));
});

// === Форма добавления карточки ===
const addCardForm = document.forms["new-place"];
const titleInput = addCardForm.elements["place-name"];
const linkInput = addCardForm.elements.link;

let currentUserId = null;

addCardForm.addEventListener("submit", (evt) => {
  evt.preventDefault();
 const saveButton = addCardForm.querySelector('.popup__button');
 renderLoading(saveButton, true); // ✅ Показать "Сохранение..."
  const nameValue = titleInput.value;
  const linkValue = linkInput.value;

  addCard(nameValue, linkValue)
    .then((newCardData) => {
      const newCard = createCard(newCardData, currentUserId, handleDeleteCard, handleImageClick, handleLike);
      placesList.prepend(newCard);
      closeModal(addCardForm.closest(".popup"));
      addCardForm.reset();
    })
    .catch(err => console.error(`Ошибка добавления карточки: ${err}`))
    .finally(() => renderLoading(saveButton, false));
});

Promise.all([getUserInfo(), getInitialCards()])
  .then(([userData, cards]) => {
    currentUserId = userData._id;
    renderUserInfo(userData);
    renderCards(cards, currentUserId);
  })
  .catch(err => console.error('Ошибка загрузки:', err));