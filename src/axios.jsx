import axios from 'axios'

const backendUrl = import.meta.env.VITE_BACKEND_URL

const instance = axios.create({
  baseURL: backendUrl,
//   headers: {'X-Custom-Header': 'foobar'}
});

export default instance
