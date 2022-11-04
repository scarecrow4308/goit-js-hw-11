import Notiflix from 'notiflix';
import SimpleLightbox from 'simplelightbox';
import 'simplelightbox/dist/simple-lightbox.min.css';
import photoCard from '../templates/photoCard.hbs';
import { ImageClass } from './fetchImages';

const formEl = document.querySelector('.header__search-form');
const loadMoreBtn = document.querySelector('.load-more');
const searchBtn = document.querySelector('.header__search-btn');
const inputEl = document.querySelector('.header__input');
const galleryEl = document.querySelector('.gallery');
const images = new ImageClass();

inputEl.addEventListener('input', () => {
  searchBtn.disabled = false;
});

const getImages = data => {
  const { hits, totalHits, total } = data;
  loadMoreBtn.classList.remove('visually-hidden');
  images.total_pages = Math.ceil(totalHits / images.per_page);

  if (!total) {
    loadMoreBtn.classList.add('visually-hidden');
    Notiflix.Notify.failure(
      'Oops, there are no images mathis your search query. Please try again.'
    );
    return;
  }

  hits.forEach(el => {
    galleryEl.insertAdjacentHTML('beforeend', photoCard(el));
  });

  const lightBoxGallery = new SimpleLightbox('.gallery a');
  lightBoxGallery.on('show.simplelightbox', function () {});
};

const removeLoadMoreBtn = () => {
  if (images.page === images.total_pages) {
    loadMoreBtn.classList.add('visually-hidden');
    Notiflix.Notify.warning(
      "We're sorry, but you've reached the end of search results"
    );
  }

  return;
};

loadMoreBtn.addEventListener('click', async () => {
  images.page++;

  loadMoreBtn.disabled = true;
  setTimeout(() => (loadMoreBtn.disabled = false), 1000);

  let data = await images.fetchPhotos();
  getImages(data);
  removeLoadMoreBtn();
});

const onSubmit = async e => {
  e.preventDefault();

  searchBtn.disabled = true;

  images.query = inputEl.value;
  images.page = 1;

  const data = await images.fetchPhotos();

  galleryEl.innerHTML = '';

  getImages(data);

  if (data.totalHits > 1) {
    Notiflix.Notify.success(`Hooray! We found ${data.totalHits} images.`);
  }

  removeLoadMoreBtn();
};

formEl.addEventListener('submit', onSubmit);
