import axios from 'axios';

const API = axios.create({
  baseURL: 'https://blur-api-ruby.vercel.app/api'
  // baseURL: 'http://localhost:5000/api'
});

export default API;
