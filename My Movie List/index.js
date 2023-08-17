const BASE_URL = `https://webdev.alphacamp.io/`
const INDEX_URL = BASE_URL + `api//movies/`
const POSTER_URL = BASE_URL + `posters/`
const MOVIES_PER_PAGE = 12

const movies = []

let dataPanel = document.querySelector('#data-panel')
let searchForm = document.querySelector('#search-form')
let searchInput = document.querySelector('#search-input')
let paginator = document.querySelector('#paginator')

//連接API把資料抓進來
axios
    .get(INDEX_URL)
    .then((response) => {
        movies.push(...response.data.results)
        renderPaginator(movies.length)
        renderMovieList(getMoviesByPage(1))
    })
    // .catch((err) => console.log('Error'))

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
                            <button class='btn btn-info btn-add-favorite' data-id='${item.id}'>+</button>
                        </div>
                    </div>
                </div>
            </div>
        `
    })

    dataPanel.innerHTML = rawHTML
}


//下方換頁的頁數
function renderPaginator(amount) {
    //計算總頁數
    const numberOfPages = Math.ceil(amount / MOVIES_PER_PAGE)
    //製作 template
    let rawHTML = ''
  
    for (let page = 1; page <= numberOfPages; page++) {
      rawHTML += `<li class="page-item"><a class="page-link" href="#" data-page="${page}">${page}</a></li>`
    }
    //放回 HTML
    paginator.innerHTML = rawHTML
  }

//下方換頁的頁數的監聽器
paginator.addEventListener('click', function onPaginatorClicked(event) {
    //如果被點擊的不是 a 標籤，結束
    if (event.target.tagName !== 'A') return
  
    //透過 dataset 取得被點擊的頁數
    const page = Number(event.target.dataset.page)
    //更新畫面
    renderMovieList(getMoviesByPage(page))
  })



//輸入page，1，就會回傳MOVIES_PER_PAGE的數量的movies的INDEX的0-11。
function getMoviesByPage(page) {
    //計算起始 index
    // const data = filteredMovies.length ? filteredMovies : movies
    const startIndex = (page - 1) * MOVIES_PER_PAGE
    //回傳切割後的新陣列
    return movies.slice(startIndex, startIndex + MOVIES_PER_PAGE)

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





//製作Modal的監聽器
dataPanel.addEventListener('click', function onPanelClicked(event) {
    if (event.target.matches('.btn-show-movie')) {
      showMovieModal(Number(event.target.dataset.id))
    } //新增收藏清單的監聽器
      else if (event.target.matches('.btn-add-favorite')) {
      addToFavorite(Number(event.target.dataset.id))
    }
  })

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




//製作Search Bar的監聽器
searchForm.addEventListener('submit', function onSearchFormSubmitted(event){
    event.preventDefault()//叫瀏覽器不要做預設的動作（因為每次按下Search，瀏覽器就會重新整理。）
    const keyword = searchInput.value.trim().toLowerCase()
    
    // if (!keyword.length){
    //     return alert('Please enter the valid string')
    // }

    //用for的作法：
    // for (const movie of movies){
    //     if (movie.title.toLowerCase().includes(keyword)){
    //         filteredMovies.push(movie)
    //     }
    // }

    //用.filter()的作法
    let filteredMovies = movies.filter(movie => movie.title.toLowerCase().includes(keyword))


    if (filteredMovies.length === 0){
        return  alert('Cannot find movies with the keyword.' + keyword)
    }

    //重製分頁器
    renderPaginator(filteredMovies.length)  
    //預設顯示第 1 頁的搜尋結果
    renderMovieList(getMoviesByPage(1)) 
})


