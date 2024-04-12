const ALERT_SHOW_TIME = 5000;

// Функция показа сообщения с ошибкой загрузки изображений от других пользователей
const showDataError = () => {
  const templateGetAlert = document.querySelector('#data-error').content.querySelector('.data-error');
  const newAlert = templateGetAlert.cloneNode(true);
  document.body.appendChild(newAlert);
  setTimeout(() => {
    newAlert.remove();
  }, ALERT_SHOW_TIME);
};

// Функция показа сообщения с ошибкой загрузки изображения
const showFormError = () => {
  const templateSendErrorAlert = document.querySelector('#error').content.querySelector('.error');
  const newAlert = templateSendErrorAlert.cloneNode(true);
  document.body.appendChild(newAlert);
};

// Функция показа сообщения об успешной загрузке изображения
const showFormSuccess = () => {
  const templateSendAlert = document.querySelector('#success').content.querySelector('.success');
  const newAlert = templateSendAlert.cloneNode(true);
  document.body.appendChild(newAlert);
};

export { showDataError, showFormError, showFormSuccess };
