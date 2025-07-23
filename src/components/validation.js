 function showInputError(formSelector, inputSelector, errorMessage, validationConfig) {
  const errorElement = formSelector.querySelector(`.${inputSelector.id}-error`);

   inputSelector.classList.add(validationConfig.inputErrorClass);
   errorElement.textContent = errorMessage;
   errorElement.style.visibility = 'visible';
   errorElement.classList.add(validationConfig.errorClass);
};

function hideInputError(formSelector, inputSelector, validationConfig) {
const errorElement = formSelector.querySelector(`.${inputSelector.id}-error`)

  inputSelector.classList.remove(validationConfig.inputErrorClass);
  errorElement.style.visibility = 'hidden';
  errorElement.textContent = '';
  errorElement.classList.remove(validationConfig.errorClass);
};

function isValid(formSelector, inputSelector, validationConfig) {
if (inputSelector.validity.patternMismatch) {
  inputSelector.setCustomValidity(inputSelector.dataset.customErrorMessage);
}
else {
  inputSelector.setCustomValidity('');
}

    if(!inputSelector.validity.valid) {
        showInputError(formSelector, inputSelector, inputSelector.validationMessage, validationConfig);
    }
    else {
        hideInputError(formSelector, inputSelector, validationConfig);
    }
};

function setEventListener(formSelector, validationConfig) {
   const inputList = Array.from(formSelector.querySelectorAll(validationConfig.inputSelector));
   const submitButton = formSelector.querySelector(validationConfig.submitButtonSelector);

   inputList.forEach(function(inputSelector){
      inputSelector.addEventListener('input', function() {
        isValid(formSelector, inputSelector, validationConfig);

        toggleButtonState(inputList, submitButton, validationConfig);
      });
   });
};

export function enableValidation(validationConfig) {
  const formList = Array.from(document.querySelectorAll(validationConfig.formSelector));

  formList.forEach(function(formSelector) {
    setEventListener(formSelector, validationConfig);
  });
};

function hasInvalidInput(inputList) {
  return inputList.some(function(inputSelector) {
    return !inputSelector.validity.valid
  });
};

function toggleButtonState(inputList, submitButton, validationConfig) {
  if(hasInvalidInput(inputList)) {
    submitButton.disabled = true;
    submitButton.classList.add(validationConfig.inactiveButtonClass)
  }
  else {
    submitButton.disabled = false;
    submitButton.classList.remove(validationConfig.inactiveButtonClass)
  }
};

export function clearValidation(formSelector, validationConfig) {
   const inputList = Array.from(formSelector.querySelectorAll(validationConfig.inputSelector));

   inputList.forEach(function(inputSelector) {
    hideInputError(formSelector, inputSelector, validationConfig)
   });

   const submitButton = formSelector.querySelector(validationConfig.submitButtonSelector);

   submitButton.disabled = true;
   submitButton.classList.add(validationConfig.inactiveButtonClass);
}
