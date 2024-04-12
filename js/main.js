import { data } from './data.js';
import { renderThumbnailsDebounced } from './render-thumbnails.js';
import { applyFilteredThumbnails } from './filter-thumbnails.js';
import { openBigPicture } from './picture-modal.js';
import './picture-form.js';

const thumbnailList = document.querySelector('.pictures');

if (data) {
  // Функция отрисовки полученных миниатюр
  renderThumbnailsDebounced(data);

  // Функция отрисовки отфильтрованных миниатюр
  applyFilteredThumbnails(data, renderThumbnailsDebounced);
}

// Обработчик нажатия на миниатюру
thumbnailList.addEventListener('click', (evt) => {
  const currentThumbnail = evt.target.closest('.picture');
  if (currentThumbnail) {
    openBigPicture(data, currentThumbnail.dataset.pictureId);
  }
});
