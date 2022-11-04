import Notiflix from 'notiflix';
import SimpleLightbox from 'simplelightbox';
import 'simplelightbox/dist/simple-lightbox.min.css';
import photoCard from '../templates/photoCard.hbs';
import { ImageClass } from './fetchImages';

const formEl = document.querySelector('.header__search-form');
const loadMoreBtn = document.querySelector('.load-more');
const galleryEl = document.querySelector('.gallery');
const images = new ImageClass();

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
  let data = await images.fetchPhotos(40);
  getImages(data);
  removeLoadMoreBtn();
});

const onSubmit = async e => {
  e.preventDefault();

  const inputEl = formEl.querySelector('.header__input');

  images.query = inputEl.value;
  images.page = 1;

  const data = await images.fetchPhotos(20);

  galleryEl.innerHTML = '';

  getImages(data);

  if (data.totalHits > 1) {
    Notiflix.Notify.success(`Hooray! We found ${data.totalHits} images.`);
  }

  removeLoadMoreBtn();
};

formEl.addEventListener('submit', onSubmit);
