import instance from "./axios.js";

async function getUserWishlist() {
  try {
    //    fetch('../mockwishlist.json')
    //.then(response => response.json())

    const token = sessionStorage.getItem('spotifyAccessToken');
    instance.get('/api/getUserId', {
      headers: {
        Authorization: `Bearer ${token}`
      }
    })
    .then(response => response.data)
    .then(async user_id => {
      const wishlistResponse = await instance.get(`/crud/getWishlist?id=${user_id}`)
      return wishlistResponse
    })
    .then(response => response.data)
    .then(async result => {
      console.log('ln12:',result)
      const wishlist_scraped = await getDiscogsWishlist(result) 
      return wishlist_scraped
    })
    .then( dataset => {
      let templateLiterals =`
        <div class="album-block-container open">
          <div class="album-block">
            <img class="album-bg" src="${dataset[0].discogs_image}">
            <div class="album-content">
              <div>
                  <ul id="item-container"></ul>
                </div>
              </div>
            </div>
          <div class="gradient-overlay"></div>
        </div>
       `;
      document.getElementById("wishlist").innerHTML = templateLiterals;
      dataset.forEach(async (listing, index) => {
        let listingsHtml = '';
      

            const listingHtml = `
               <li>
                <div class="listing ${index == 0 ? "open" : "closed"}">
                  <figure>
                    <img src="${listing.discogs_image}">
                    <div style="transform: rotate(${Math.floor(Math.random() * 20) - 25}deg);">
                     <p class="card-price"><span>${listing.price}</span></p>
                    </div>
                    <input class="add-container" type="checkbox" id="${index}-heart" data-id="${listing.item_link}" checked/>
                    <label for="${index}-heart" style="font-variation-settings: 'FILL' 0, 'wght' 200, 'GRAD' 0, 'opsz' 48;">
                    </label>
                  </figure>
                </div> 
              </li>
            `;

            listingsHtml += listingHtml;
      
      
        document.getElementById("item-container").insertAdjacentHTML('beforeend', listingsHtml);
      });
    })
    .then(async () => {
      const user_id = await getUserId();
      [...document.querySelectorAll("input.add-container")].forEach(function(item) {
        console.log(item.getAttribute("data-id"))
//        checkWishlist(user_id, item)
        item.addEventListener('change', (e) => {
          const item_link = e.target.getAttribute("data-id")
          console.log(item_link)
          console.log(e.target.checked)
          e.target.checked ? addItemToWishlist(user_id, item_link) : removeItemFromWishlist(user_id, item_link)
        })
      })
    })
    
  } catch(err) {
    console.log(err)
  }
}

async function getDiscogsWishlist(link_array) {
  console.log(link_array)
  let data = await instance({
    method: 'post',
    url: '/discogs/getDiscogsWishlist',
    data: {
      link_array: link_array
    },
    transformResponse: [(data) => {
      console.log(data)
      return JSON.parse(data)
    }]
  })
  console.log('wishlistjs ln156', data)
  
  console.log(data)
  return data.data
}

function dynamicCards(index) {
  [...document.querySelectorAll(".album-block-container")].forEach(function(item) {
    item.getAttribute("data-index") == index ? item.classList.replace("closed", "open") : item.classList.replace("open", "closed")
  });
};

async function getUserId() {
  const params = new URLSearchParams(window.location.search);
  const token = params.get('access_token');

  let user_id = await instance({
    method: 'get',
    url: '/api/getUserId',
    transformResponse: [(data) => {
      return JSON.parse(data)
    }]
  })
  .then(response => {
    console.log('user_id:', response.data.toString())
    return response.data.toString()
  })
  .catch(e => {
    console.log(e)
  })

  return user_id
}

async function addItemToWishlist(user_id, item_link) {
  console.log('item_link:', item_link)
  let data = await instance({
    method: 'post',
    url: '/crud/postItem',
    data: {
      user_id: user_id,
      item_link: item_link
    },
    transformResponse: [(data) => {
      return JSON.parse(data)
    }]
  })

  console.log(data)
  return data 
}

async function removeItemFromWishlist(user_id, item_link) {
  console.log('item_link:', item_link)
  let data = await instance({
    method: 'delete',
    url: '/crud/deleteItem',
    data: {
      user_id: user_id,
      item_link: item_link
    },
    transformResponse: [(data) => {
      return JSON.parse(data)
    }]
  })

  console.log(data)
  return data
}

getUserWishlist();
