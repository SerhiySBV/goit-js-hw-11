import axios from 'axios';

export default async function fetchImg(inputEL, page, perPage) {
  const BASE_URL = 'https://pixabay.com/api/';
  const KEY = '31683714-8e8fa74a4326fd0a6ea7edcf8&';
  try {
    const resp = await axios.get(`
      ${BASE_URL}?key=${KEY}q=${inputEL}&type=photo&orientation=horizontal&safesearch=true&per_page=${perPage}&page=${page}`);
    return resp.data;
  } catch (error) {
    console.error(error.message);
  }
}
