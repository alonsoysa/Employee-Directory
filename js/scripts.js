// Get and display 12 random 
let apiUsers;
let searchList = [];
let modalWrapper;
const body = document.querySelector('body');
const gallery = document.querySelector('#gallery');
const searchContainer = document.querySelector('.search-container');
    
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

    generateForm();
    generateModalWrappers();
}

function generateCard(user, index) {
    const picURL =  user.picture.large; 
    const firstName = user.name.first
    const lastName = user.name.last
    const email = user.email;
    const city = user.location.city;
    const state = user.location.state;

    const html = `
        <div class="card">
            <div class="card-img-container">
                <img class="card-img" src="${picURL}" alt="${firstName} ${lastName} profile picture">
            </div>
            <div class="card-info-container">
                <h3 id="name" class="card-name cap">${firstName} ${lastName}</h3>
                <p class="card-text">${email}</p>
                <p class="card-text cap">${city}, ${state}</p>
            </div>
        </div>
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

function generateModalWrappers() {
    const htmlFull = `<div id="modal-wrapper"></div>`;
    // Insert After
    gallery.insertAdjacentHTML('afterend', htmlFull);

    modalWrapper = document.querySelector('#modal-wrapper');

    modalWrapper.addEventListener('click', () => {
        const closeBTN = event.target.closest('#modal-close-btn');
        const prevBTN = event.target.closest('#modal-prev');
        const nextBTN = event.target.closest('#modal-next');

        if (closeBTN) {
            document.querySelector('.modal-container').remove();
        }

        if (prevBTN) {
            modalToggle(true);
        }

        if (nextBTN) {
            modalToggle();
        }
    });
}

function modalToggle(prev) {
    const index = parseInt(document.querySelector('.modal-info-container').getAttribute('data-id'));
    const apiUserCount = apiUsers.length - 1;
    let newUserID = 0;

    if (prev) {
        if (index > 0) {
            newUserID = index - 1;
        } else {
            newUserID = apiUserCount;
        }
    } else {
        if (index < apiUserCount) {
            newUserID = index + 1;
        } else {
            newUserID = 0;
        }
    }
    generateSingleModal(apiUsers[newUserID], newUserID);
}

function generateSingleModal(user, index, toggle) {
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

    let htmlStart;
    let htmlMiddle;
    let htmlLast;

    if (!toggle) {
        htmlStart = `
            <div class="modal-container">
                <div class="modal">
                    <button type="button" id="modal-close-btn" class="modal-close-btn"><strong>X</strong></button>
        `;
    }

    htmlMiddle = `
        <div id="modal-info-container-wrapper">
            <div class="modal-info-container" data-id="${index}">
                <img class="modal-img" src="${picURL}" alt="${firstName} ${lastName} profile picture">
                <h3 class="modal-name cap">${firstName} ${lastName}</h3>
                <p class="modal-text">${email}</p>
                <p class="modal-text cap">${city}</p>
                <hr>
                <p class="modal-text">${phone}</p>
                <p class="modal-text">${address}</p>
                <p class="modal-text">${birthday}</p>
            </div>
        </div>
    `;

    if (!toggle) {
        htmlLast = `</div>
                <div class="modal-btn-container">
                    <button type="button" id="modal-prev" class="modal-prev btn">Prev</button>
                    <button type="button" id="modal-next" class="modal-next btn">Next</button>
                </div>
            </div>
        `;
    }
    
    // Insert After
    if (!toggle) {
        modalWrapper.innerHTML = htmlStart + htmlMiddle + htmlLast;
    } else {
        document.querySelector('#modal-info-container-wrapper').innerHTML = htmlMiddle;
    }
}



function generateForm() {
    let globalTimeout = null; 
    const names = document.querySelectorAll('.card .card-name');
    const html = `
        <form action="#" method="get">
            <input type="search" id="search-input" class="search-input" placeholder="Search..."><input type="submit" value="&#x1F50D;" id="search-submit" class="search-submit">
        </form>`;

    searchContainer.innerHTML = html;

    const searchField = document.querySelector('#search-input');
    searchField.addEventListener('keyup', e => {
        let keyword = e.target.value.toLowerCase();
        // A
        // Listen for when someone pressed enter and execute right away
        if (e.keyCode === 13) {
            triggerSearch(keyword, names);
        }

        // Otherwise wait .3 seconds before executing code.
        // This prevents from code running too many times
        else {
            if (globalTimeout != null) {
                clearTimeout(globalTimeout);
            }
            globalTimeout = setTimeout(() => {
                triggerSearch(keyword, names);
            }, 750);
        }
        return false;
    });

    const searchButton = document.querySelector('#search-submit');
    searchButton.addEventListener('click', e => {
        let keyword = searchField.value.toLowerCase();
        triggerSearch(keyword, names);
        return false;
    });
}

function triggerSearch(keyword, names) {
    searchList.length = 0;

    // Pushes any matching names to global array searchList
    for (let i = 0; i < names.length; i++) {

        let studentName = names[i].textContent.toLowerCase();

        if (studentName.includes(keyword)) {
            let li = names[i].parentNode.parentNode;
            searchList.push(li);
        }
    }

    const cards = document.querySelectorAll('.card');

    if (searchList.length > 0) {
        cards.forEach(item => {
            item.style.display = 'none';
        });
        searchList.forEach(item => {
            item.style.display = '';
        });
    } else {
        cards.forEach(item => {
            item.style.display = '';
        });
    }
    
}

// ------------------------------------------
//  Listeners
// ------------------------------------------
gallery.addEventListener('click', function (e) {
    // find the closest .card parent
    var el = event.target.closest('.card');
    if (el) {
        const index = [...el.parentElement.children].indexOf(el);
        generateSingleModal(apiUsers[index], index);
    }
});



