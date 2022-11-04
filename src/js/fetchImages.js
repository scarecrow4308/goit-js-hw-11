import axios from 'axios';

export class ImageClass {
  #API_KEY = '30576183-1ebdc1a7ab65c6ad0d15a4f10';
  #BASE_URL = 'https://pixabay.com/api/';
  constructor() {
    this.query = null;
    this.page = 1;
    this.totalHits = null;
    this.total_pages = 0;
    this.per_page = 40;
  }
  async fetchPhotos() {
    try {
      const { data } = await axios.get(this.#BASE_URL, {
        params: {
          q: this.query,
          page: this.page,
          per_page: this.per_page,
          orientation: 'horizontal',
          key: this.#API_KEY,
        },
      });
      return data;
    } catch (err) {
      console.log(err);
    }
  }
}
