const searchInput = document.getElementById('searchInput');
const searchButton = document.getElementById('iconContainer');
const imageList = document.getElementById('imageList');
const buttonLoadMoreImages = document.getElementById('buttonLoadMoreImages');

let search, timeout, modal, modalTopPart, modalBottomPart, isModalClosed = true, images = [],
    page = 1, pageSize = 20, isLoadButtonVisible = "none", loadMoreClickCounter = 1;


function handleDebounceInputCapture() {
    timeout = setTimeout(() => {
        handleSearchInput(clearTimeout);
    }, 250);
}

function handleSearchInput(cb) {
    search = searchInput.value;
    cb(timeout);
}

function handleLoadNextPage() {
    page++;
    handleSearchApi().then(data => {
        if (data.total === 0) {
            images = [];
        }
        if (data && page > 1) {
            images.push(data.hits);
        }
        handleShowLoadButton(data);
        createImageList();
    });
}

if (buttonLoadMoreImages) {
    buttonLoadMoreImages.addEventListener('click', handleLoadNextPage);
    buttonLoadMoreImages.style.setProperty('display', "none");
}


function handleShowLoadButton(data) {
    const totalImages = data.totalHits;
    const pages = Math.floor(totalImages / pageSize) + 1;
    if (data.total === 0 || page === pages) {
        isLoadButtonVisible = "none";
    }
    else {
        isLoadButtonVisible = "block";
    }
    buttonLoadMoreImages.style.setProperty('display', isLoadButtonVisible);
}


async function handleSearchApi() {
    const MY_API_KEY = '31161391-10c38618ac342ad384660a321';
    search = search.replace(' ', '+');
    const api = `https://pixabay.com/api/?key=${MY_API_KEY}&q=${search}&page=${page}&image_type=photo&per_page=${pageSize}`;

    const controller = new AbortController();

    setTimeout(() => {
        controller.abort();
    }, 1000);

    return fetch(api)
        .then(response => response.json())
        .then(data => {
            if (data) {
                return data;
            }
        })
        .catch(err => console.log(err))
}

async function handleUnfoundSearch() {
    imageList.innerHTML = "";
    search = search.replace('+', ' ');
    const htmlContent =
        `<h1>${search}</h1>
        <p>Sorry, we couldn't find any matches</p>
        `;
    imageList.innerHTML = htmlContent;
    imageList.setAttribute('id', '');
    imageList.classList.add('imageListUnfound');
}

function createImageList() {
    images = images.flat();
    imageList.innerHTML = "";
    if (images.length === 0) {
        handleUnfoundSearch();
    } else {
        imageList.setAttribute('id', 'imageList');
        imageList.classList.remove('imageListUnfound');
    }
    images.forEach(img => {
        const image = document.createElement('img');
        if (image) {
            image.src = img.webformatURL;
            const imageContainer = document.createElement('div');
            if (imageContainer) {
                imageContainer.classList.add('imageContainer');
                imageContainer.appendChild(image);
                imageList.appendChild(imageContainer);
            }
        }
        if (isModalClosed) {
            handleOpenModalOnImageClick(image, img);
        }
    })
}

function handleOpenModalOnImageClick(img, imgInfo) {
    img.addEventListener('click', () => {
        isModalClosed = false;
        const imgSrc = img.src;
        const newImage = document.createElement('img');
        newImage.src = imgSrc;
        if (modal) {
            modal.remove();
        }
        if (imageList) {
            modal = document.createElement('div');
            isModalClosed = false;
            modal.style.display = 'block'
            modal.classList.add('modal');
            imageList.appendChild(modal);
            modalTopPart = document.createElement('div');
            modalBottomPart = document.createElement('div');
            modal.appendChild(modalTopPart);

            modal.appendChild(modalBottomPart);
            if (modalTopPart) {
                modalTopPart.appendChild(newImage);
                modalTopPart.innerHTML += '<i class="close fa-regular fa-rectangle-xmark"></i>';
                const closeModalIcon = document.getElementsByClassName("close")[0];
                closeModalIcon.addEventListener('click', handleCloseModalOnIconClick);
            }
            if (modalBottomPart && imgInfo) {
                const htmlInfo =
                    `<p><strong>views</strong>: ${imgInfo.views}</p>
                     <p><strong>downloads</strong>: ${imgInfo.downloads}</p>
                     <p><strong>collections</strong>: ${imgInfo.collections}</p>
                     <p><strong>likes</strong>: ${imgInfo.likes}</p>
                     <p><strong>comments</strong>: ${imgInfo.comments}</p>
                    `;
                modalBottomPart.innerHTML = htmlInfo;
            }
        }
    });
}

function handleCloseModalOnIconClick() {
    if (!isModalClosed) {
        modal.style.display = "none";
        isModalClosed = true;
    }
}
if (searchInput) {
    searchInput.addEventListener('input', handleDebounceInputCapture);
    searchInput.addEventListener('keypress', (e) => {
        if (e.key === 'Enter') {
            e.preventDefault();
            handleDebounceInputCapture();
            loadFirstPage();
        }
    });
}

if (searchButton) {
    searchButton.addEventListener('click', loadFirstPage);
}

async function loadFirstPage() {
    page = 1;
    handleSearchApi().then(data => {
        if (data.total === 0) {
            images = [];
        }
        else {
            images = data.hits;
        }
        handleShowLoadButton(data);
        createImageList();
    })
}
