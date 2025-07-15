export function createCard(data, handleDelete, handleImageClick, handleLike) {
  const cardTemplate = document.querySelector("#card-template").content;
  const cardElement = cardTemplate.querySelector(".card").cloneNode(true);

  const cardImage = cardElement.querySelector(".card__image");
  const cardTitle = cardElement.querySelector(".card__title");
  const deleteButton = cardElement.querySelector(".card__delete-button");
  const likeButton = cardElement.querySelector(".card__like-button");

  cardImage.src = data.link;
  cardImage.alt = data.name;
  cardTitle.textContent = data.name;

  likeButton.addEventListener("click", () => handleLike(likeButton));

  deleteButton.addEventListener("click", () => handleDelete(cardElement));

  cardImage.addEventListener("click", () => handleImageClick(data));

  return cardElement;
}
