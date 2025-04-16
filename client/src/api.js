import axios from 'axios';

const API = axios.create({
  baseURL: 'blur-api-ruby.vercel.app:5000/api'
});

export default API;
