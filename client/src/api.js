import axios from 'axios';

const API = axios.create({
  baseURL: 'https://blur-api-ruby.vercel.app/api'
});

export default API;
