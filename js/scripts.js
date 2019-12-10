// Get and display 12 random 
const gallery = document.querySelector('#gallery');
    
// ------------------------------------------
//  FETCH FUNCTIONS
// ------------------------------------------
function fetchData(url) {
    return fetch(url)
            .then(checkStatus)
            .then(res => res.json())
            .catch(error => console.log('bad', error));
}

fetchData('https://randomuser.me/api/?results=12')
    .then(data => generateUsers(data.results));


// ------------------------------------------
//  HELPER FUNCTIONS
// ------------------------------------------
function checkStatus(response) {
    if (response.ok) {
        return Promise.resolve(response);
    } else {
        return Promise.reject(new Error(response.statusText));
    }
}

function generateUsers(data) {
    // Set the global apiUsers to the current randomUser data
    apiUsers = data;

    // Add cards to the app
    const cardsHTML = data.map((item, index) => generateCardHTML(item, index)).join('');
    gallery.innerHTML = cardsHTML;

    let popupsHTML = data.map((item, index) => generateModalHTML(item, index)).join('');

    popupsHTML = '<div class="modal-container">' + popupsHTML;
    popupsHTML += `<div class="modal-btn-container">
                    <button type="button" id="modal-prev" class="modal-prev btn">Prev</button>
                    <button type="button" id="modal-next" class="modal-next btn">Next</button>
                </div>`;
    popupsHTML += '</div>';

    // Insert After
    gallery.insertAdjacentHTML('afterend', popupsHTML);
}

function generateCardHTML(item, index) {
    console.log(item);

    const picURL =  item.picture.large;
    const firstName = item.name.first
    const lastName = item.name.last
    const email = item.email;
    const city = item.location.city;
    const state = item.location.state;

    const html = `
        <a class="card" data-id="${index}">
            <div class="card-img-container">
                <img class="card-img" src="${picURL}" alt="${firstName} ${lastName} profile picture">
            </div>
            <div class="card-info-container">
                <h3 id="name" class="card-name cap">${firstName} ${lastName}</h3>
                <p class="card-text">${email}</p>
                <p class="card-text cap">${city}, ${state}</p>
            </div>
        </a>
    `;
    return html;
}

function generateModalHTML(item, index) {
    const picURL = item.picture.large;
    const firstName = item.name.first
    const lastName = item.name.last
    const email = item.email;
    const city = item.location.city;
    const state = item.location.state;
    const phone = item.phone;
    const birthday = item.dob.date;
    let address = item.location.street.number + ' ' 
        address += item.location.street.name + ', ';
        address += city + ', ';
        address += state + ' ';
        address += item.location.postcode;

    const html = `
            <div class="modal" data-id="${index}">
                <button type="button" id="modal-close-btn" class="modal-close-btn"><strong>X</strong></button>
                <div class="modal-info-container">
                    <img class="modal-img" src="${picURL}" alt="${firstName} ${lastName} profile picture">
                    <h3 id="name" class="modal-name cap">${firstName} ${lastName}</h3>
                    <p class="modal-text">${email}</p>
                    <p class="modal-text cap">${city}</p>
                    <hr>
                    <p class="modal-text">${phone}</p>
                    <p class="modal-text">${address}</p>
                    <p class="modal-text">${birthday}</p>
                </div>
            </div>
        `;
    
    return html;
}

// ------------------------------------------
//  Listeners
// ------------------------------------------
gallery.addEventListener('click', (event) => {
    let card; 
    if (event.target.hasAttribute('data-id')) {
        card = event.target.getAttribute('data-id');
    } else {
        if ( !event.target.closest('.card') ) return;
        card = event.target.closest('.card').getAttribute('data-id');
    }

    const modalContainer = document.querySelector('.modal-container');
    const targetModal = document.querySelector('.modal-container [data-id="' + card + '"]');
    console.log(targetModal);
    modalContainer.classList.add('js-active');
    targetModal.classList.add('js-active');
});