import { Notify } from 'notiflix/build/notiflix-notify-aio';
import SimpleLightbox from 'simplelightbox';
import 'simplelightbox/dist/simple-lightbox.min.css';
import fetchImg from './sass/fetch_img';

const btn = document.querySelector('button');
const form = document.querySelector('#search-form');
const loadMore = document.querySelector('.load-more');
const galleryBox = document.querySelector('.gallery');

let page = 1;
let perPage = 100;
let inputValue = '';
loadMore.setAttribute('hidden', true);

// SIMPLELIGHTBOX

let simplelightbox = new SimpleLightbox('.gallery a', {
  captionsData: 'alt',
  captionDelay: 250,
});

btn.addEventListener('click', onSubmit);
page = 1;
async function onSubmit(event) {
  event.preventDefault();
  loadMore.setAttribute('hidden', true);
  inputValue = form.searchQuery.value.trim();
  galleryBox.innerHTML = '';

  if (!inputValue) {
    Notify.failure(
      'Sorry, there are no images matching your search query. Please try again.'
    );
    return;
  }

  await fetchImg(inputValue, page, perPage).then(data => {
    if (!data.total) {
      Notify.failure(
        'Sorry, there are no images matching your search query. Please try again.'
      );
      return;
    }
    galleryBox.insertAdjacentHTML('beforeend', createMarckUp(data.hits));
    Notify.info(`Hooray! We found ${data.total} images.`);
    loadMore.removeAttribute('hidden', true);
    styleImgCss();
    simplelightbox.refresh();
  });
}

function createMarckUp(array) {
  if (array.length === 0) {
  }
  return array.map(
    ({
      webformatURL,
      largeImageURL,
      tags,
      likes,
      views,
      comments,
      downloads,
    }) => {
      return `
<div class="photo-card">
<a class="link" href="${largeImageURL}">
  <img src="${webformatURL}" alt="${tags}" loading="lazy" width='300px' height='200px' /></a>
  <div class="info">
    <p class="info-item">
      <b>Likes</b>
      <span class="span">${likes}</span>
    </p>
    <p class="info-item">
      <b>Views</b>
      <span class="span">${views}</span>
    </p>
    <p class="info-item">
      <b>Comments</b>
      <span class="span">${comments}</span>
    </p>
    <p class="info-item">
      <b>Downloads</b>
      <span class="span">${downloads}</span>
    </p>
  </div>
</div>
  `;
    }
  );
}

// LOAD MORE

loadMore.addEventListener('click', onLoadMore);

async function onLoadMore() {
  page += 1;

  {
  }
  await fetchImg(inputValue, page, perPage).then(data => {
    galleryBox.insertAdjacentHTML('beforeend', createMarckUp(data.hits));
    styleImgCss();
    simplelightbox.refresh();

    // if (perPageSum >= data.totalHits)
    if (page === Math.round(data.totalHits / perPage)) {
      loadMore.setAttribute('hidden', true);
      Notify.warning(
        "We're sorry, but you've reached the end of search results."
      );
      page = 1;
      return;
    }
  });
}

// STYLE CSS

function styleImgCss() {
  setTimeout(() => {
    const infoItems = document.querySelectorAll('.info-item');
    infoItems.forEach(
      infoItem => (infoItem.style.cssText = 'display: grid; color: #c6c6c6; ')
    );

    const infoElems = document.querySelectorAll('.info');
    infoElems.forEach(infoElem => {
      infoElem.style.cssText = 'display: flex; justify-content: space-between;';
    });
  }, 300);
}
