// Get and display 12 random 
let apiUsers;
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

fetchData('https://randomuser.me/api/?results=12&nat=us')
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

    // add cards to screen
    const cardsHTML = data.map((user, index) => generateCard(user, index)).join('');
    gallery.innerHTML = cardsHTML;
}

function generateCard(user, index) {
    const picURL =  user.picture.large; 
    const firstName = user.name.first
    const lastName = user.name.last
    const email = user.email;
    const city = user.location.city;
    const state = user.location.state;

    const html = `
        <a class="card" data-id="${index}" data-info-picture="">
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

function formatBirthday(string){
    const event = new Date(string);
    const date = ('0' + event.getDate() ).slice(-2);
    const month = ('0' + event.getMonth()).slice(-2);
    let year = event.getFullYear().toString().slice(-2);
    let birthday = date + '/' + month + '/' + year;
    return birthday;
}

function generateModal(user) {
    const picURL = user.picture.large;
    const firstName = user.name.first
    const lastName = user.name.last
    const email = user.email;
    const city = user.location.city;
    const state = user.location.state;
    const phone = user.phone;
    const birthday = formatBirthday(user.dob.date);
    let address = user.location.street.number + ' ' 
        address += user.location.street.name + ', ';
        address += city + ', ';
        address += state + ' ';
        address += user.location.postcode;

    const htmlStart = `
            <div class="modal-container">
                <div class="modal">
                    <button type="button" id="modal-close-btn" class="modal-close-btn"><strong>X</strong></button>
        `;

    const htmlMiddle = `
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
        `;

    const htmlLast = `</div>
                <div class="modal-btn-container">
                    <button type="button" id="modal-prev" class="modal-prev btn">Prev</button>
                    <button type="button" id="modal-next" class="modal-next btn">Next</button>
                </div>
            </div>`;

    const htmlFull = htmlStart + htmlMiddle + htmlLast;
    
    // Insert After
    gallery.insertAdjacentHTML('afterend', htmlFull);

    document.querySelector('#modal-close-btn').addEventListener('click', () =>{
        document.querySelector('.modal-container').remove();
    });
}

// ------------------------------------------
//  Listeners
// ------------------------------------------
gallery.addEventListener('click', function (e) {
    // find the closest .card parent
    var el = event.target.closest('.card');
    if (el) {
        const index = [...el.parentElement.children].indexOf(el);
        generateModal(apiUsers[index]);
    }
});