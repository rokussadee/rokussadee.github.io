import axios from "axios"

const instance = axios.create({
  baseURL: 'https://discjunky-api-web2ss.onrender.com'
})

export default instance
