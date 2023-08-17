const BASE_URL = `https://webdev.alphacamp.io/`
const INDEX_URL = BASE_URL + `api//movies/`
const POSTER_URL = BASE_URL + `posters/`

const movies = JSON.parse(localStorage.getItem('favoriteMovies')) || []

let dataPanel = document.querySelector('#data-panel')
let searchForm = document.querySelector('#search-form')
let searchInput = document.querySelector('#search-input')

//把所需要的API資訊以HTML形式渲染進網頁
function renderMovieList(data){
    let rawHTML = ``
    data.forEach((item) => { 
        
        rawHTML += `
            <div class="col-sm-3">
                <div class="mb-2'">
                    <div class="card">
                        <img src="${POSTER_URL + item.image}" class="card-img-top" alt="Movie Poster">
                        <div class="card-body">
                            <h5 class="card-title" id="movie-modal-title">${item.title}</h5>
                        </div>
                        <div class="card-footer">
                            <button 
                            class='btn btn-primary btn-show-movie' 
                            data-bs-toggle="modal"
                            data-bs-target="#movie-modal"
                            data-id='${item.id}'
                            >More</button>
                            <button class='btn btn-danger btn-remove-favorite' data-id='${item.id}'>x</button>
                        </div>
                    </div>
                </div>
            </div>
        `
    })

    dataPanel.innerHTML = rawHTML
}

//加入收藏清單的function
function addToFavorite(id) {
    const list = JSON.parse(localStorage.getItem('favoriteMovies')) || [] //JSON.parse()：取出時，將 JSON 格式的字串轉回 JavaScript 原生物件。
    const movie = movies.find((movie) => movie.id === id)
    if (list.some((movie) => movie.id === id)) {
      return alert('此電影已經在收藏清單中！')
    }
    list.push(movie)
    localStorage.setItem('favoriteMovies', JSON.stringify(list)) //JSON.stringify() ：存入時，將資料轉為 JSON 格式的字串。
  }

  
//製作Modal的內容
function showMovieModal(id) {
  const modalTitle = document.querySelector('#aaaaa');
  const modalImage = document.querySelector('#movie-modal-image');
  const modalDate = document.querySelector('#movie-modal-date');
  const modalDescription = document.querySelector('#movie-modal-description');

  axios
    .get(INDEX_URL + id)
    .then((response) => {
      const data = response.data.results;
      modalTitle.innerText = data.title;
      modalDate.innerText = data.release_date;
      modalDescription.innerText = data.description;
      modalImage.innerHTML = `<img src="${POSTER_URL + data.image}" alt="${data.title}">`;
    });
}




//製作Modal的監聽器
dataPanel.addEventListener('click', (event) => {
  if (event.target.matches('.btn-show-movie')) {
    showMovieModal(Number(event.target.dataset.id))
    //修改以下
  } else if (event.target.matches('.btn-remove-favorite')) {
    removeFromFavorite(Number(event.target.dataset.id))
  }
})


function removeFromFavorite(id) {
  if (!movies || !movies.length) return
  //透過 id 找到要刪除電影的 index
  const movieIndex = movies.findIndex((movie) => movie.id === id)
  if(movieIndex === -1) return
  //刪除該筆電影
  movies.splice(movieIndex,1)
  //存回 local storage
  localStorage.setItem('favoriteMovies', JSON.stringify(movies))
  //更新頁面
  renderMovieList(movies)
}


  renderMovieList(movies)
