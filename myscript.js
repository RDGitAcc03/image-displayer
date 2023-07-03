const searchInput = document.getElementById('searchInput');
const searchButton = document.getElementById('iconContainer');
const imageList = document.getElementById('imageList');

let category, timeout, modal, modalTopPart, modalBottomPart, isModalClosed = true;

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

searchInput.addEventListener('input', handleDebounceInputCapture);
searchInput.addEventListener('keypress', (e) => {
    if (e.key === 'Enter') {
        e.preventDefault();
        handleDebounceInputCapture();
        handleSearchClick();
    }
});
searchButton.addEventListener('click', handleSearchClick);