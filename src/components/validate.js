export function enableValidation(config) {
  const formList = Array.from(document.querySelectorAll(config.formSelector));
  formList.forEach((formElement) => {
    setEventListeners(formElement, config);
  });
}

function setEventListeners(formElement, config) {
  const inputList = Array.from(formElement.querySelectorAll(config.inputSelector));
  const buttonElement = formElement.querySelector(config.submitButtonSelector);

  toggleButtonState(inputList, buttonElement, config);

  inputList.forEach((inputElement) => {
    inputElement.addEventListener('input', () => {
      checkInputValidity(formElement, inputElement, config);
      toggleButtonState(inputList, buttonElement, config);
    });
  });
}

function showInputError(inputElement, errorElement, errorMessage, config) {
  inputElement.classList.add(config.inputErrorClass);
  errorElement.textContent = errorMessage;
  errorElement.classList.add(config.errorClass);
}

function hideInputError(inputElement, errorElement, config) {
  inputElement.classList.remove(config.inputErrorClass);
  errorElement.classList.remove(config.errorClass);
  errorElement.textContent = '';
}

function checkInputValidity(formElement, inputElement, config) {
  const errorElement = formElement.querySelector(`.${inputElement.id}-error`);

  if (inputElement.validity.patternMismatch) {
    showInputError(inputElement, errorElement, 'Разрешены только латинские, кириллические буквы, дефисы и пробелы', config);
  }
  else if (inputElement.validity.typeMismatch) {
    showInputError(inputElement, errorElement, 'Введите адрес сайта.', config);}
     else if (inputElement.validity.valueMissing) {
    showInputError(inputElement, errorElement, 'Заполните это поле', config);
  } else if (inputElement.validity.tooShort) {
    showInputError(inputElement, errorElement, `Минимум ${inputElement.minLength} символа`, config);
  } else {
    hideInputError(inputElement, errorElement, config);
  }
}


function toggleButtonState(inputList, buttonElement, config) {
  const hasInvalidInput = inputList.some((inputElement) => !inputElement.validity.valid);
  buttonElement.disabled = hasInvalidInput;
  buttonElement.classList.toggle(config.inactiveButtonClass, hasInvalidInput);
}

export function clearValidation(formElement, config) {
  const inputList = Array.from(formElement.querySelectorAll(config.inputSelector));
  const buttonElement = formElement.querySelector(config.submitButtonSelector);

  inputList.forEach((inputElement) => {
    const errorElement = formElement.querySelector(`.${inputElement.id}-error`);
    if (errorElement) {
      errorElement.textContent = '';
    }
    inputElement.classList.remove(config.inputErrorClass);
  });

  buttonElement.classList.add(config.inactiveButtonClass);
  buttonElement.disabled = true;
}
