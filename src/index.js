import instance from "./axios.js"

async function getUserData() {
  const params = new URLSearchParams(window.location.search);
  const token = params.get('access_token');
  console.log(token)
  let albumList;

  try {
    instance.get(`api/getUser?token=${token}`, {
      headers: {
        Authorization: `Bearer ${token}`
      }
    })
    .then(response => response.data)
    .then(async (result) => {
      albumList = await getAlbumListings(result)
      console.log('FE: index.js line 19', albumList)
      let templateLiterals = '';
      albumList.forEach(async (object, index) => {
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
                    <a href="${listing.link}">visit link</a>
                  </article>
                  <figure>
                    <img src="${listing.discogs_image}">
                    <div>
                      <p><span>${listing.price}</span></p>
                    </div>
                    <input class="add-container" type="checkbox" id="${index}_${key}-heart"/>
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
            <img src="${object.thumbnail}">
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
      
        templateLiterals += html;
      });
      document.getElementById('favorites').innerHTML = templateLiterals
    })
    .then(function() {
      [...document.querySelectorAll(".album-block-container")].forEach(function (item) {
        item.addEventListener('click', (e) => {
          console.log(e.currentTarget, e.target)
          e.currentTarget == e.target ? console.log("clicked frame") : console.log("other element")
          if(e.currentTarget.classList.contains("closed")) {
            dynamicCards(e.currentTarget.getAttribute("data-index"))
          }
        });
      });
    });
  } catch (e) {
    console.log(e.message)
  }
}

async function getAlbumListings(spotifyList) {
  let data = await instance({
    method: 'post',
    url: '/getDiscogsListings',
    data: {
      sort: 'newestfirst',
      list: spotifyList,
      limit: 1,
      format: '*'
    },
    transformResponse: [(data) => {
      return JSON.parse(data)
    }]
  })
  console.log('FE: index.js line 66', data)
  
  return data.data
}

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

function dynamicCards(index) {
  [...document.querySelectorAll(".album-block-container")].forEach(function(item) {
    item.getAttribute("data-index") == index ? item.classList.replace("closed", "open") : item.classList.replace("open", "closed")
  });
}

 getUserData(); 
