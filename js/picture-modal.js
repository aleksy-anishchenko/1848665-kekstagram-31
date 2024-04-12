import { clearComments, renderComments } from './render-comments.js';

const pictureModal = document.querySelector('.big-picture');
const modalImage = pictureModal.querySelector('.big-picture__img').querySelector('img');
const likesCount = pictureModal.querySelector('.likes-count');
const pictureDescription = pictureModal.querySelector('.social__caption');
const closeButton = pictureModal.querySelector('.big-picture__cancel');
const totalComments = pictureModal.querySelector('.social__comment-total-count');

// Отображает модальное окно
const openBigPicture = (data, pictureId) => {
  // Получение обьекта выбранной миниатюры с массива
  const currentThumbnail = data.find((num) => num.id === Number(pictureId));

  // Отчистка комментариев
  clearComments();

  // Добавление комментариев
  renderComments(currentThumbnail.comments);

  // Заполнение данных в модальном окне
  modalImage.src = currentThumbnail.url;
  likesCount.textContent = currentThumbnail.likes;
  pictureDescription.textContent = currentThumbnail.description;
  totalComments.textContent = currentThumbnail.comments.length;

  // Отображение модального окна
  pictureModal.classList.remove('hidden');
  document.body.classList.add('modal-open');

  // Обработчик закрытия модального окна по кнопке
  closeButton.addEventListener('click', () => {
    document.body.classList.remove('modal-open');
    pictureModal.classList.add('hidden');
  });

  // Обработчик закрытия модального окна по клавише
  document.addEventListener('keydown', (evt) => {
    if (evt.key === 'Escape') {
      evt.preventDefault();
      document.body.classList.remove('modal-open');
      pictureModal.classList.add('hidden');
    }
  });
};

export { openBigPicture };
