import axios from 'axios'

export const api = axios.create({
  baseurl: '/api',
  timeout: 60000
})