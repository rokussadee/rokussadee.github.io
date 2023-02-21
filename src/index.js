
import instance from "./axios.js"

async function getUserData() {
  const params = new URLSearchParams(window.location.search);
  console.log(params.get('access_token'))
  const token = params.get('access_token');
  try {
    instance.get(`/getUser?token=${token}`, {
      headers: {
        Authorization: `Bearer ${token}`
      }
    })
    .then(response => response.data)
    .then(result => {
      console.log(result)
    }) 
  } catch (e) {
    console.log(e.message)
  }
  // await fetch(`http://localhost:8888/api/getUser/?token=${token}`)
  // .then(data => {
  //   console.log(data)
  // })
  // .catch(e => {
  //   console.log('error fetching data')
  //   console.error(e)
  // })
}

getUserData();