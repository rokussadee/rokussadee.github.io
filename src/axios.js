import axios from "axios"

const instance = axios.create({
//    baseURL: 'https://localhost:3000',
//    baseURL: 'https://discjunky-api.vercel.app',
//    baseURL: 'https://rokussadee.com',
//  baseURL: "https://discjunky-api-web2ss.onrender.com",
  baseURL: 'https://docker-discjunky-api.onrender.com',
    headers: {
      'Content-Type': 'application/json'
    },
    withCredentials: false, // Enable cookies and authentication headers
})

export default instance
