export function createCard(data, userId, handleDelete, handleImageClick, handleLike) {
  const cardTemplate = document.querySelector("#card-template").content;
  const cardElement = cardTemplate.querySelector(".card").cloneNode(true);
  const cardImage = cardElement.querySelector(".card__image");
  const cardTitle = cardElement.querySelector(".card__title");
  const deleteButton = cardElement.querySelector(".card__delete-button");
  const likeButton = cardElement.querySelector(".card__like-button");
  const likeCount = cardElement.querySelector(".card__like-count");

  // Устанавливаем данные
  cardImage.src = data.link;
  cardImage.alt = data.name;
  cardTitle.textContent = data.name;
  likeCount.textContent = data.likes.length;

  // Показываем корзину только для своих карточек
  if (data.owner._id !== userId) {
    deleteButton.style.display = "none";
  } else {
    deleteButton.addEventListener("click", () => handleDelete(data._id, cardElement));
  }

  // Обработчик лайка
  likeButton.addEventListener("click", () => handleLike(data._id, likeButton, likeCount));

  // Обработчик открытия изображения
  cardImage.addEventListener("click", () => handleImageClick(data));

  // Если текущий пользователь уже лайкнул карточку
  if (data.likes.some(like => like._id === userId)) {
    likeButton.classList.add("card__like-button_is-active");
  }

  return cardElement;
}
