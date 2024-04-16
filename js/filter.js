const filtersContainer = document.querySelector('.img-filters');
const filterButtons = document.querySelectorAll('.img-filters__button');

const AMOUNT_RANDOM_ELEMENTS = 10;

// Функция, показывающая фильтры
const showFilters = () => filtersContainer.classList.remove('img-filters--inactive');

// Функция, возвращающая массив миниатюр без фильтрации
const getDefaultFilter = (thumbnails) => thumbnails;

// Функция, возвращающая массив миниатюр, отсортированных по количеству комментариев
const getDiscussedFilter = (thumbnails) => thumbnails.slice().sort((a, b) => b.comments.length - a.comments.length);

// Функция, возвращающая массив случайных миниатюр
const getRandomFilter = (thumbnails) => {
  const shuffledArray = [...thumbnails].sort(() => 0.5 - Math.random());
  return shuffledArray.slice(0, AMOUNT_RANDOM_ELEMENTS);
};

const filterFunctions = {
  'filter-default': getDefaultFilter,
  'filter-discussed': getDiscussedFilter,
  'filter-random': getRandomFilter,
};

// Функция, переключающая активный фильтр
const toggleActiveFilter = (evt) => {
  if (evt.target.classList.contains('img-filters__button')) {
    filterButtons.forEach((filterButton) => filterButton.classList.remove('img-filters__button--active'));
    evt.target.classList.add('img-filters__button--active');
  }
};

// Функция, применяющая фильтрацию миниатюр и вызывающая функцию обратного вызова
const applyFilteredThumbnails = (thumbnails, callback) => {
  filtersContainer.addEventListener('click', (evt) => {
    toggleActiveFilter(evt);

    const filterFunction = filterFunctions[evt.target.id];
    if (filterFunction) {
      const filteredThumbnails = filterFunction(thumbnails);
      callback(filteredThumbnails);
    }
  });
};

const initFilters = (thumbnails, callback) => {
  showFilters();
  applyFilteredThumbnails(thumbnails, callback);
};

export { initFilters };

