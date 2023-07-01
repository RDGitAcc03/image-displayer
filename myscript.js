const searchInput = document.getElementById('searchInput');
const searchButton = document.getElementById('iconContainer');
const imageList = document.getElementById('imageList');

let category, timeout;

function handleDebounceInputCapture() {
    timeout = setTimeout(() => {
        handleSearchInput(clearTimeout);
    }, 250);
}

function handleSearchInput(cb) {
    category = searchInput.value;
    cb(timeout);
    console.log(category);
}

function handleSearchClick() {
    const MY_API_KEY = '31161391-10c38618ac342ad384660a321';
    const api = `https://pixabay.com/api/?key=${MY_API_KEY}&q=${category}&per_page=20`;

    const controller = new AbortController();

    fetch(api, { signal: controller.signal })
        .then(response => response.json())
        .then(data => {
            console.log(data);
            createImageList(data.hits);
        })
        .catch(err => console.log(err))
    setTimeout(() => {
        controller.abort();
    }, 1000)
}

function createImageList(data) {
    imageList.innerHTML = "";
    data.forEach(img => {
        const image = document.createElement('img');
        const imageContainer = document.createElement('div');
        if (image) {
            image.src = img.webformatURL;
            imageContainer.classList.add('imageContainer');
            imageContainer.appendChild(image);
        }
        imageList.appendChild(imageContainer);
        handleOpenModalOnImageClick(imageContainer);
    })
}

function handleOpenModalOnImageClick(imgContainer) {
    imgContainer.addEventListener('click', () => {
        const modal = document.createElement('div');
        modal.classList.add('modal');
    });
}

searchInput.addEventListener('input', handleDebounceInputCapture);
searchInput.addEventListener('keypress', (e) => {
    if (e.key === 'Enter') {
        e.preventDefault();
        handleDebounceInputCapture();
        handleSearchClick();
    }
});
searchButton.addEventListener('click', handleSearchClick);