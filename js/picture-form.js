import { isEscapeKey } from './util.js';
import { showFormError, showFormSuccess } from './alert-manager.js';
import { effectSlider, renderEffect } from './effects-slider.js';
import { sendData } from './api.js';

const formNode = document.querySelector('.img-upload__form');
const pictureUploadForm = formNode.querySelector('.img-upload__overlay');
const pictureUploadInput = formNode.querySelector('.img-upload__input');
const pictureFormCancelButton = formNode.querySelector('.img-upload__cancel');
const hashtagInput = formNode.querySelector('.text__hashtags');
const descriptionInput = formNode.querySelector('.text__description');
const scaleDownButton = formNode.querySelector('.scale__control--smaller');
const scaleUpButton = formNode.querySelector('.scale__control--bigger');
const scaleControl = formNode.querySelector('.scale__control--value');
const sliderContainer = document.querySelector('.effect-level');
const effectContainer = document.querySelector('.effects');
const uploadedPicture = document.querySelector('.img-upload__preview img');
const submitButton = document.querySelector('.img-upload__submit');
const effectsPreview = document.querySelectorAll('.effects__preview');

const MAX_COMMENT_LENGTH = 140;

// Дополнительное состояние кнопки
const SubmitButtonText = {
  IDLE: 'Опубликовать',
  SENDING: 'Публикую...'
};

// Максимальное количество хештегов
const MAX_HASHTAGS_COUNT = 5;

// Настройки изменения масштаба изображения
const MIN_SCALE = 25;
const MAX_SCALE = 100;
const COUNT_STEP = 25;

// Регулярное выражение для валидации одного хештега
const hashtagRegex = /^#[a-zа-яё0-9]{1,19}$/i;

// Функция для проверки фокуса на полях формы
const isFieldFocused = () => document.activeElement === hashtagInput || document.activeElement === descriptionInput;

const displayFormAlertError = () => {
  showFormError();
  const formErrorAlert = document.body.lastElementChild;
  const buttonAlert = formErrorAlert.querySelector('.error__button');
  const containerAlert = formErrorAlert.querySelector('.error__inner');
  if (formErrorAlert) {
    buttonAlert.addEventListener('click', () => {
      formErrorAlert.remove();
    });
    document.removeEventListener('keydown', onDocumentKeydown);
    document.addEventListener('keydown', (evt) => {
      if (evt.key === 'Escape' && (evt.target !== formErrorAlert)) {
        formErrorAlert.remove();
        document.addEventListener('keydown', onDocumentKeydown);
      }
    });
    document.addEventListener('click', (evt) => {
      if (evt.target !== containerAlert) {
        formErrorAlert.remove();
      }
    });
  }
};

const displayFormAlertSuccess = () => {
  showFormSuccess();
  const formAlertSuccess = document.body.lastElementChild;
  const buttonSuccessAlert = formAlertSuccess.querySelector('.success__button');
  const containerSuccessAlert = formAlertSuccess.querySelector('.success__inner');
  if (formAlertSuccess && formAlertSuccess.classList.contains('success')) {
    buttonSuccessAlert.addEventListener('click', () => {
      formAlertSuccess.remove();
    });
    document.addEventListener('keydown', (evt) => {
      if (evt.key === 'Escape' && (evt.target !== formAlertSuccess)) {
        formAlertSuccess.remove();
      }
    });
    document.addEventListener('click', (evt) => {
      if (evt.target !== containerSuccessAlert) {
        formAlertSuccess.remove();
      }
    });
  }
};

// Валидация формы редактирования изображения
const pristine = new Pristine(formNode, {
  classTo: 'img-upload__field-wrapper',
  errorTextParent: 'img-upload__field-wrapper',
  errorTextClass: 'img-upload__field-wrapper--error',
});


// Функция закрытия формы
const closePictureForm = () => {
  pictureUploadForm.classList.add('hidden');
  pristine.reset();
  document.removeEventListener('keydown', onDocumentKeydown);

  formNode.reset();
  scaleControl.setAttribute('value', `${100}%`);
  uploadedPicture.style.filter = 'none';
  document.body.classList.remove('modal-open');
  if (effectSlider.noUiSlider) {
    effectSlider.noUiSlider.destroy();
  }
};

// Функция проверки нажатия клавиши "Escape"
// Хостинг нужен что бы использовать функцию в closePictureForm() до ее обьявления
function onDocumentKeydown(evt) {
  if (isEscapeKey(evt) && !isFieldFocused()) {
    evt.preventDefault();
    closePictureForm();
  }
}

// Функция открытия формы
const openPictureForm = () => {
  pictureUploadForm.classList.remove('hidden');
  document.addEventListener('keydown', onDocumentKeydown);

  setPictureFormSubmit(closePictureForm);

  sliderContainer.classList.add('hidden');
  document.body.classList.add('modal-open');

  effectContainer.addEventListener('change', (evt) => {
    const currentEffect = evt.target.value;
    renderEffect(currentEffect);
  });
};

// Обработчик открытия формы полного изображения
pictureUploadInput.addEventListener('change', () => {
  const file = pictureUploadInput.files[0];
  if (file) {
    uploadedPicture.src = URL.createObjectURL(file);

    effectsPreview.forEach((element) => {
      element.style.backgroundImage = `url(${uploadedPicture.src})`;
    });
    openPictureForm(file);
  }
});

// Обработчик события нажатия кнопки закрытия формы
pictureFormCancelButton.addEventListener('click', () => {
  closePictureForm();
});

// Изменение масштаба изображения
scaleDownButton.addEventListener('click', () => {
  let currentScale = parseFloat(scaleControl.value);
  if (currentScale !== MIN_SCALE) {
    currentScale -= COUNT_STEP;
  }
  scaleControl.value = `${currentScale}%`;
  scaleControl.setAttribute('value', `${currentScale}%`);
  uploadedPicture.style.transform = `scale(${currentScale / 100})`;
});

scaleUpButton.addEventListener('click', () => {
  let currentScale = parseFloat(scaleControl.value);
  if (currentScale !== MAX_SCALE) {
    currentScale += COUNT_STEP;
  }
  scaleControl.value = `${currentScale}%`;
  scaleControl.setAttribute('value', `${currentScale}%`);
  uploadedPicture.style.transform = `scale(${currentScale / 100})`;
});

const isValidHashtag = (hashtags) => {
  const arrayHashtags = hashtags.toLowerCase().split(' ').filter(Boolean);
  return arrayHashtags.every((hashtag) => hashtagRegex.test(hashtag));
};

const isValidQuantityHashtags = (hashtags) => {
  const arrayHashtags = hashtags.toLowerCase().split(' ').filter(Boolean);
  return arrayHashtags.length <= MAX_HASHTAGS_COUNT;
};

const areValidUniqueHashtags = (hashtags) => {
  const arrayHashtags = hashtags.toLowerCase().split(' ').filter(Boolean);
  const arrayUniqueHashtags = new Set(arrayHashtags);
  return arrayHashtags.length === arrayUniqueHashtags.size;
};

const isValidDescription = (description) => description.length <= MAX_COMMENT_LENGTH;

pristine.addValidator(hashtagInput, isValidHashtag, 'Введён невалидный хэштег');
pristine.addValidator(hashtagInput, isValidQuantityHashtags, 'Превышено количество введенных хэштегов');
pristine.addValidator(hashtagInput, areValidUniqueHashtags, 'Введенные хэштеги повторяются');
pristine.addValidator(descriptionInput, isValidDescription, 'Максимальная длина введенного комментария 140 символов');

// Функции блокировки кнопок после отправки формы
const blockSubmitButton = () => {
  submitButton.disabled = true;
  submitButton.textContent = SubmitButtonText.SENDING;
};

const unblockSubmitButton = () => {
  submitButton.disabled = false;
  submitButton.textContent = SubmitButtonText.IDLE;
};

// Функция отправки формы
function setPictureFormSubmit(onSuccess) {
  formNode.addEventListener('submit', (evt) => {
    evt.preventDefault();

    const isValid = pristine.validate();
    if (isValid) {
      blockSubmitButton();
      sendData(new FormData(evt.target))
        .then(() => {
          onSuccess();
          displayFormAlertSuccess();
        })
        .catch(displayFormAlertError)
        .finally(unblockSubmitButton);
    }
  });
}

export { openPictureForm, closePictureForm, setPictureFormSubmit };
