const API_KEY = 'api_key=e7411f481045f4b4384d42d264184f84';
const BASE_URL = 'https://api.themoviedb.org/3';
const API_URL = BASE_URL + '/discover/movie?sort_by=popularity.desc&' + API_KEY;
const IMAGE_URL = 'https://image.tmdb.org/t/p/w500';

const SEARCH_URL = BASE_URL + '/search/movie?' + API_KEY;

const main = document.getElementById('main');
const form = document.getElementById('form');
const search = document.getElementById('search');
const tags = document.getElementById('tags');
const prev = document.getElementById('prev');
const current = document.getElementById('current');
const next = document.getElementById('next');

var prevPage = 0;
var currentPage = 1;
var nextPage = 2;
var lastUrl = '';
var totalPages = 100;


const genres = [
    {
        "id": 28,
        "name": "Action"
    },
    {
        "id": 12,
        "name": "Adventure"
    },
    {
        "id": 16,
        "name": "Animation"
    },
    {
        "id": 35,
        "name": "Comedy"
    },
    {
        "id": 80,
        "name": "Crime"
    },
    {
        "id": 99,
        "name": "Documentary"
    },
    {
        "id": 18,
        "name": "Drama"
    },
    {
        "id": 10751,
        "name": "Family"
    },
    {
        "id": 14,
        "name": "Fantasy"
    },
    {
        "id": 36,
        "name": "History"
    },
    {
        "id": 27,
        "name": "Horror"
    },
    {
        "id": 10402,
        "name": "Music"
    },
    {
        "id": 9648,
        "name": "Mystery"
    },
    {
        "id": 10749,
        "name": "Romance"
    },
    {
        "id": 878,
        "name": "Science Fiction"
    },
    {
        "id": 10770,
        "name": "TV Movie"
    },
    {
        "id": 53,
        "name": "Thriller"
    },
    {
        "id": 10752,
        "name": "War"
    },
    {
        "id": 37,
        "name": "Western"
    }
]

var selectedGenre = []
setGenre();

function setGenre() {
    tags.innerHTML = '';
    genres.forEach(genre => {
        const tagsEl = document.createElement('div');
        tagsEl.classList.add('tag');
        tagsEl.id = genre.id;
        tagsEl.innerHTML = genre.name;
        tagsEl.addEventListener('click', () => {
            if (selectedGenre.length == 0) {
                selectedGenre.push(genre.id);
            }
            else {
                if (selectedGenre.includes(genre.id)) {
                    selectedGenre.forEach((id, index) => {
                        if (id == genre.id) {
                            selectedGenre.splice(index, 1);
                        }
                    })
                }
                else {
                    selectedGenre.push(genre.id);
                }
            }
            getMovies(API_URL + '&with_genres=' + encodeURI(selectedGenre.join(',')))
            highlightSelection()
        });
        tags.appendChild(tagsEl);
    })
}

function highlightSelection() {
    const tagsToRemove = document.querySelectorAll('.tag');
    tagsToRemove.forEach(tag => {
        tag.classList.remove('highlight')
    })
    clearBtn()
    if (selectedGenre.length != 0) {
        selectedGenre.forEach(id => {
            const highlightedTag = document.getElementById(id);
            highlightedTag.classList.add('highlight');
        })
    }
}


function clearBtn() {
    let clearBtn = document.getElementById('clear');
    if (clearBtn) {
        clearBtn.classList.add('highlight');
    } else {

        let clear = document.createElement('div');
        clear.classList.add('tag', 'hightlight');
        clear.id = 'clear';
        clear.innerHTML = 'Clear x';
        clear.addEventListener('click', () => {
            selectedGenre = [];
            setGenre();
            getMovies(API_URL);
        })
        tags.append(clear);
    }
}


getMovies(API_URL);

function getMovies(url) {

    lastUrl = url;
    fetch(url).then(res => res.json()).then(data => {
        if (data.results.length != 0) {
            showMovies(data.results);
            prevPage = data.page - 1;
            currentPage = data.page;
            nextPage = data.page + 1;
            totalPages = data.total_pages;
            current.innerText = currentPage;
            if (currentPage <= 1) {
                prev.classList.add('disabled')
                next.classList.remove('disabled')
            }
            else if (currentPage >= totalPages) {
                prev.classList.remove('disabled')
                next.classList.add('disabled')
            }
            else {
                prev.classList.remove('disabled')
                next.classList.remove('disabled')
            }
            console.log(data.results);
            tags.scrollIntoView({ behavior: "smooth" })
        } else {
            main.innerHTML = '<h1 class="no-results">No Results Found</h1>'
        }
    })

}

function showMovies(data) {

    main.innerHTML = '';

    data.forEach(movie => {
        const { title, poster_path, vote_average, release_date, overview, id } = movie;
        const fullImagePath = poster_path ? IMAGE_URL + poster_path : Images / poster_not_found;
        const movieEl = document.createElement('div');
        movieEl.classList.add('movie');
        movieEl.innerHTML = `
        <img src="${fullImagePath}" alt="${title}">
            <div class="movie-info">
                <h3>${title}</h3>
                <span class="${getColor(vote_average)}">${vote_average}</span>
            </div>
            <div class="overview">
                <h2>Overview</h2>
                <h3>Released on ${covertTime(release_date)}</h3>
                ${overview}
                </br>
                <button class="know-more" id="${id}">Know More</button>
                </div>
        `
        main.appendChild(movieEl);

        document.getElementById(id).addEventListener('click', () => {
            openNav(movie);
        })
    })
}

const overlaycontent = document.getElementById('overlay-content');

/* Open when someone clicks on the span element */
function openNav(movie) {
    let id = movie.id;
    fetch(BASE_URL + '/movie/' + id + '/videos?' + API_KEY).then(res => res.json()).then(videoData => {
        console.log(videoData);
        if (videoData) {
            document.getElementById("myNav").style.width = "100%";
            if (videoData.results.length != 0) {
                var embed = [];
                var dots = [];
                videoData.results.forEach((video, index) => {
                    let { name, site, key } = video;
                    if (site == 'YouTube') {
                        embed.push(
                            `<iframe width="560" height="315" src="https://www.youtube.com/embed/${key}" title="${name}" class="embed hide" frameborder="0" allow="accelerometer; autoplay; clipboard-write; encrypted-media; gyroscope; picture-in-picture" allowfullscreen></iframe>`
                        )
                        dots.push(
                            `<span class="dot">${index + 1}</span>`
                        )
                    }
                })
                var content = `
                <h1 class="movie-title">${movie.original_title}</h1>
                </br>
                ${embed.join('')}
                </br>
                <div class="dots">${dots.join('')}</div>
                `
                overlaycontent.innerHTML = content;
                activeSilde = 0;
                showVideos();
            }
            else {
                overlaycontent.innerHTML = '<h1 class="no-results">No Results Found</h1>';
            }
        }

    })
}


var activeSilde = 0;
var totalVideos = 0;
function showVideos() {
    let embedClasses = document.querySelectorAll('.embed');
    let dots = document.querySelectorAll('.dot');
    totalVideos = embedClasses.length;
    embedClasses.forEach((embeTag, index) => {
        if (activeSilde == index) {
            embeTag.classList.add('show');
            embeTag.classList.remove('hide');
        }
        else {
            embeTag.classList.add('hide');
            embeTag.classList.remove('show');
        }
    })
    dots.forEach((dot,index)=>{
        if(activeSilde==index){
            dot.classList.add('active');
        }
        else{
            dot.classList.remove('active'); 
        }
    })
}


const leftArrow = document.getElementById('left-arrow');
const rightArrow = document.getElementById('right-arrow');

leftArrow.addEventListener('click', () => {
    if (activeSilde > 0) {
        activeSilde = activeSilde - 1;
    } else {
        activeSilde = totalVideos - 1;
    }
    showVideos();
})

rightArrow.addEventListener('click', () => {
    if (activeSilde < (totalVideos - 1)) {
        activeSilde = activeSilde + 1;
    }
    else {
        activeSilde = 0;
    }
    showVideos();
})

/* Close when someone clicks on the "x" symbol inside the overlay */
function closeNav() {
    document.getElementById("myNav").style.width = "0%";
}


function covertTime(time) {
    return new Date(time).toLocaleDateString('en-us', {
        year: 'numeric',
        month: 'long',
    })
}




function getColor(vote) {
    if (vote >= 8) {
        return 'green';
    }
    else if (vote >= 5) {
        return 'orange'
    }
    else {
        return 'red'
    }
}


form.addEventListener('submit', (e) => {
    e.preventDefault();
    const searchTerm = search.value;
    selectedGenre = [];
    setGenre();
    if (searchTerm) {
        getMovies(SEARCH_URL + '&query=' + searchTerm);
    }
    else {
        getMovies(API_URL);
    }
})

prev.addEventListener('click', () => {
    if (prevPage > 0) {
        pageCall(prevPage);
    }
})

next.addEventListener('click', () => {
    if (nextPage <= totalPages) {
        pageCall(nextPage);
    }
})

function pageCall(page) {
    let urlSplit = lastUrl.split('?');
    let queryParams = urlSplit[1].split('&');
    let key = queryParams[queryParams.length - 1].split('=');
    if (key[0] != 'page') {
        let url = lastUrl + '&page=' + page;
        getMovies(url);
    }
    else {
        key[1] = page.toString();
        let a = key.join('=');
        queryParams[queryParams.length - 1] = a;
        let b = queryParams.join('&');
        let url = urlSplit[0] + '?' + b;
        console.log(url);
        getMovies(url);
    }
}


