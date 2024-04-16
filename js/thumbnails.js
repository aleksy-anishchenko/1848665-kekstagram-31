import { getData } from './api.js';
import { removeElements, debounce } from './util';
import { showDataError } from './alert-manager.js';
import { initFilters } from './filter.js';
import { openBigPicture } from './post-picture.js';

const picturesContainer = document.querySelector('.pictures');
const thumbnailTemplate = document.querySelector('#picture').content.querySelector('.picture');

// Задержка для debounce
const DEBOUNCE_DELAY = 500;

// Создает элемент миниатюры на основе данных
const createThumbnailElement = ({ id, url, description, likes, comments }) => {
  const thumbnail = thumbnailTemplate.cloneNode(true);
  // Устанавливаем идентификатор миниатюры
  thumbnail.dataset.pictureId = id;
  thumbnail.querySelector('.picture__img').src = url;
  thumbnail.querySelector('.picture__img').alt = description;
  thumbnail.querySelector('.picture__likes').textContent = likes;
  thumbnail.querySelector('.picture__comments').textContent = comments.length;
  return thumbnail;
};

// Отрисовывает миниатюры в контейнере
const renderThumbnails = (thumbnails) => {
  const thumbnailFragment = document.createDocumentFragment();

  // Перебираем миниатюры и добавляем их в фрагмент
  thumbnails.forEach((thumbnail) => {
    thumbnailFragment.appendChild(createThumbnailElement(thumbnail));
  });

  // Очищаем существующие миниатюры
  removeElements('.picture');
  picturesContainer.appendChild(thumbnailFragment);
};

// Создаем debounced версию функции renderThumbnails
const renderThumbnailsDebounced = debounce(renderThumbnails, DEBOUNCE_DELAY);

const initThumbnails = async () => {
  const data = await getData().catch(showDataError);

  if (data.length) {
    renderThumbnails(data);

    // Показываем фильтры
    initFilters(data, renderThumbnailsDebounced);

    // Обработчик нажатия на миниатюру
    picturesContainer.addEventListener('click', (evt) => {
      const closestThumbnail = evt.target.closest('.picture');
      if (closestThumbnail) {
        const postData = data.find((num) => num.id === Number(closestThumbnail.dataset.pictureId));
        openBigPicture(postData);
      }
    });
  }
};

export { initThumbnails };
