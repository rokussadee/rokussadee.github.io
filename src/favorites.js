import instance from "./axios.js"

async function getUserData() {
  let token
  const params =new URLSearchParams(window.location.search) 
  console.log( params.get('access_token'), sessionStorage.getItem('spotifyAccessToken'))
  if(params.get('access_token') == null || params.get('access_token') == 'null') {
      token = sessionStorage.getItem('spotifyAccessToken')
  } else {
    token = params.get('access_token')
    sessionStorage.setItem('spotifyAccessToken', token)
  }

  let albumList;

  try {
//    fetch('../mockfavorites.json')
//    .then(response => response.json())
//    .then(albumList => {
    instance.get(`api/getUser?token=${token}`, {
      headers: {
        Authorization: `Bearer ${token}`
      }
    })
    .then(response => response.data)
    .then(async (result) => {
      albumList = await getAlbumListings(result)
      console.log('FE: index.js line 19', albumList)
      let templateLiterals = document.getElementById("favorites");
      albumList.forEach(async (object, index) => {
        console.log('the lost indexes:', index)
        let listingsHtml = '';
      
        for (const key in object.listings) {
          if (object.listings.hasOwnProperty(key)) {
            const listing = object.listings[key];
            console.log(key)

            const listingHtml = `
              <li>
                <div class="listing">
                  <article>
                    <h3>${listing.discogs_title}</h3>
                    <div class="listing-info">
                      <h3>Condition:</h3>
                      <p>${listing.condition}</p>
                    </div>
                    <hr>
                    <div class="listing-info">
                      <h3>Seller:</h3>
                      <p>${listing.seller_name}</p>
                    </div>
                    <div class="listing-info">
                      <h3>Feedback:</h3>
                      <p>${listing.seller_rating}</p>
                    </div>
                    <hr>
                    <div class="listing-info">
                      <h3>Shipping:</h3>
                      <p>${listing.shipping}</p>
                    </div>
                    <a href="${listing.link}" target="_blank">visit link</a>
                  </article>
                  <figure>
                    <img src="${listing.discogs_image}">
                    <div style="transform: rotate(${Math.floor(Math.random() * 20) - 25}deg);">
                     <p class="card-price"><span>${listing.price}</span></p>
                     </div>
                    <input class="add-container" type="checkbox" id="${index}_${key}-heart" data-id="${listing.link}" />
                    <label for="${index}_${key}-heart" style="font-variation-settings: 'FILL' 0, 'wght' 200, 'GRAD' 0, 'opsz' 48;">
                    </label>
                  </figure>
                </div> 
              </li>
            `;
      
            listingsHtml += listingHtml;
          }
        }
      
        let html = `
        <div data-index="${index}"class="album-block-container ${index == 0 ? "open" : "closed"}">
          <div data-index="${index}" class="vert-title-container">         
            <h3>${object.artists.toString().replace(/,/g, ", ")}: &nbsp;<span>${object.title}</span></h3>
          </div>
          <h2>${object.title}</h2>
          <h4>${object.artists.toString().replace(/,/g, ", ")}</h4>
          <div class="album-block">
            <img class="album-bg" src="${object.image}">
            <div class="album-content">
              <div>
                  <ul>${listingsHtml}</ul>
                </div>
              </div>
            </div>
          <div class="gradient-overlay"></div>
        </div>
        `;
      
        templateLiterals.insertAdjacentHTML('beforeend', html);
      });
//      document.getElementById('favorites').innerHTML = templateLiterals
    })
    .then(() => {
      [...document.querySelectorAll(".album-block-container")].forEach(function (item) {
        item.addEventListener('click', (e) => {
          console.log(e.currentTarget, e.target)
          e.currentTarget == e.target ? console.log("clicked frame") : console.log("other element")
          if(e.currentTarget.classList.contains("closed")) {
            dynamicCards(e.currentTarget.getAttribute("data-index"))
          }
        });
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
  } catch (e) {
    console.log(e.message)
  }
}

async function getAlbumListings(spotifyList) {
  console.log(spotifyList)
  let data = await instance({
    method: 'post',
    url: '/discogs/getDiscogsListings',
    data: {
      sort: 'newestfirst',
      list: spotifyList,
      limit: 1,
      format: '*'
    },
    transformResponse: [(data) => {
      console.log(data)
      return JSON.parse(data)
    }]
  })
  console.log('FE: index.js line 66', data)
  
  console.log(data.data)
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

async function checkWishlist(user_id, item_link) {
  
}

async function addItemToWishlist(user_id, item_link) {
  console.log('item_link:', item_link)
  let data = await instance({
    method: 'post',
    url: '/crud/postItem',
    data: {
      user_id: user_id,
      item_link: item_link
//      title: ,
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
//      title: ,
    },
    transformResponse: [(data) => {
      return JSON.parse(data)
    }]
  })

  console.log(data)
  return data
}

getUserData(); 
//fetch("../mockdata.json")
//    .then(response => response.json())
//    .then(data => {
//      let dataset = data.filter(function({id}) {
//        return !this.has(id) && this.add(id)
//      }, new Set)
//      let templateLiterals
//      dataset.forEach(async (object, index) => {
//        let listingsHtml = '';
//        console.log(object)
//      
//        for (const key in object.listings) {
//          if (object.listings.hasOwnProperty(key)) {
//            const listing = object.listings[key];
//
//            const listingHtml = `
//              <li>
//                <div class="listing">
//                  <article>
//                    <h3>${listing.discogs_title}</h3>
//                    <div class="listing-info">
//                      <h3>Condition:</h3>
//                      <p>${listing.condition}</p>
//                    </div>
//                    <hr>
//                    <div class="listing-info">
//                      <h3>Seller:</h3>
//                      <p>${listing.seller_name}</p>
//                    </div>
//                    <div class="listing-info">
//                      <h3>Feedback:</h3>
//                      <p>${listing.seller_rating}</p>
//                    </div>
//                    <hr>
//                    <div class="listing-info">
//                      <h3>Shipping:</h3>
//                      <p>${listing.shipping}</p>
//                    </div>
//                    <a href="${listing.link}">visit link</a>
//                  </article>
//                  <figure>
//                    <img src="${listing.discogs_image}">
//                    <div>
//                      <p><span>${listing.price}</span></p>
//                    </div>
//                    <input class="add-container" type="checkbox" id="${key}-heart"/>
//                    <label for="${key}-heart" style="font-variation-settings: 'FILL' 0, 'wght' 200, 'GRAD' 0, 'opsz' 48;">
//                    </label>
//                    </figure>
//                </div> 
//              </li>
//            `;
//            listingsHtml += listingHtml;
//          }
//        }
//      
//        let html = `
//        <div data-index="${index}"class="album-block-container ${index == 0 ? "open" : "closed"}">
//          <div data-index="${index}" class="vert-title-container">         
//            <h3>${object.artists.toString().replace(/,/g, ", ")}: &nbsp;<span>${object.title}</span></h3>
//            <img src="${object.thumbnail}">
//          </div>
//          <h2>${object.title}</h2>
//          <h4>${object.artists.toString().replace(/,/g, ", ")}</h4>
//          <div class="album-block">
//            <img class="album-bg" src="${object.image}">
//            <div class="album-content">
//              <div>
//                  <ul>${listingsHtml}</ul>
//                </div>
//              </div>
//            </div>
//          <div class="gradient-overlay"></div>
//        </div>
//        `;
//      
//        templateLiterals += html;
//      });
//      document.getElementById('favorites').innerHTML = templateLiterals
//    })
//    .then(function() {
//      [...document.querySelectorAll(".album-block-container")].forEach(function (item) {
//        item.addEventListener('click', (e) => {
//          console.log(e.currentTarget, e.target)
//          e.currentTarget == e.target ? console.log("clicked frame") : console.log("other element")
//          if(e.currentTarget.classList.contains("closed")) {
//            dynamicCards(e.currentTarget.getAttribute("data-index"))
//          }
//        });
//      });
//    });
