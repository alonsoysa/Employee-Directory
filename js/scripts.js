//=============================================================================
// GLOBAL VARIABLES
//=============================================================================
let apiUsers; // holds fetch data return
let searchList = []; // holds current search array el
let modalWrapper;  // Use for targeting buttons
const gallery = document.querySelector('#gallery');
const searchContainer = document.querySelector('.search-container');
    
//=============================================================================
// FETCH DATA
//=============================================================================

/**
 * Fetches data and returns json Object
 *
 * @param {string} url api url
 * @returns {jsonObject}
 */
function fetchData(url) {
    return fetch(url)
            .then(checkStatus)
            .then(res => res.json())
            .catch(error => console.log('bad', error));
}

fetchData('https://randomuser.me/api/?results=12&nat=us')
    .then(data => generateUsers(data.results))
    .then(generateForm)
    .then(generateModalWrappers);

//=============================================================================
// HELPER FUNCTIONS
//=============================================================================

/**
 * Handles rejections or resolution of an asynchronous connection
 *
 * @param {string} response 
 * @returns {promise}
 */
function checkStatus(response) {
    if (response.ok) {
        return Promise.resolve(response);
    } else {
        return Promise.reject(new Error(response.statusText));
    }
}

/**
 * Formats birthday date
 *
 * @param {json} user object with user information
 * @returns {string} markup
 */
function formatBirthday(string) {
    const event = new Date(string);
    const date = ('0' + event.getDate()).slice(-2);
    const month = ('0' + event.getMonth()).slice(-2);
    let year = event.getFullYear().toString().slice(-2);
    let birthday = date + '/' + month + '/' + year;
    return birthday;
}

/**
 * Abbreviates States
 * https://gist.github.com/calebgrove/c285a9510948b633aa47
 * Usage
 * abbrState('ny', 'name'); --> 'New York'
 * abbrState('New York', 'abbr'); --> 'NY'
 * 
 * @param {string} input State
 * @param {string} to type name or abbr
 * @returns {string} 
 */
function abbrState(input, to) {

    var states = [
        ['Arizona', 'AZ'],
        ['Alabama', 'AL'],
        ['Alaska', 'AK'],
        ['Arkansas', 'AR'],
        ['California', 'CA'],
        ['Colorado', 'CO'],
        ['Connecticut', 'CT'],
        ['Delaware', 'DE'],
        ['Florida', 'FL'],
        ['Georgia', 'GA'],
        ['Hawaii', 'HI'],
        ['Idaho', 'ID'],
        ['Illinois', 'IL'],
        ['Indiana', 'IN'],
        ['Iowa', 'IA'],
        ['Kansas', 'KS'],
        ['Kentucky', 'KY'],
        ['Louisiana', 'LA'],
        ['Maine', 'ME'],
        ['Maryland', 'MD'],
        ['Massachusetts', 'MA'],
        ['Michigan', 'MI'],
        ['Minnesota', 'MN'],
        ['Mississippi', 'MS'],
        ['Missouri', 'MO'],
        ['Montana', 'MT'],
        ['Nebraska', 'NE'],
        ['Nevada', 'NV'],
        ['New Hampshire', 'NH'],
        ['New Jersey', 'NJ'],
        ['New Mexico', 'NM'],
        ['New York', 'NY'],
        ['North Carolina', 'NC'],
        ['North Dakota', 'ND'],
        ['Ohio', 'OH'],
        ['Oklahoma', 'OK'],
        ['Oregon', 'OR'],
        ['Pennsylvania', 'PA'],
        ['Rhode Island', 'RI'],
        ['South Carolina', 'SC'],
        ['South Dakota', 'SD'],
        ['Tennessee', 'TN'],
        ['Texas', 'TX'],
        ['Utah', 'UT'],
        ['Vermont', 'VT'],
        ['Virginia', 'VA'],
        ['Washington', 'WA'],
        ['West Virginia', 'WV'],
        ['Wisconsin', 'WI'],
        ['Wyoming', 'WY'],
    ];

    if (to == 'abbr') {
        input = input.replace(/\w\S*/g, function (txt) { return txt.charAt(0).toUpperCase() + txt.substr(1).toLowerCase(); });
        for (i = 0; i < states.length; i++) {
            if (states[i][0] == input) {
                return (states[i][1]);
            }
        }
    } else if (to == 'name') {
        input = input.toUpperCase();
        for (i = 0; i < states.length; i++) {
            if (states[i][1] == input) {
                return (states[i][0]);
            }
        }
    }
}

//=============================================================================
// CARD FUNCTIONS
//=============================================================================

/**
 * Loops through object and generates users
 *
 * @param {json} data response from api
 */
function generateUsers(data) {
    // Assign user data to apiUser
    apiUsers = data;

    // Loop through users and creates html
    const cardsHTML = data.map((user, index) => generateCard(user, index)).join('');

    // Insert to the page
    gallery.innerHTML = cardsHTML;

    // Listeners for opening modals
    gallery.addEventListener('click', function (e) {
        // find the closest .card parent
        var el = event.target.closest('.card');
        if (el) {
            const index = [...el.parentElement.children].indexOf(el);
            generateSingleModal(apiUsers[index], index);
        }
    });
}

/**
 * Creates markup for a user
 *
 * @param {json} user object with user information
 * @returns {string} markup
 */
function generateCard(user) {
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

/**
 * Creates necessary markup for modals
 * It also adds listeners for modal actions
 */
function generateModalWrappers() {
    // Insert wrapper
    const htmlFull = `<div id="modal-wrapper"></div>`;
    gallery.insertAdjacentHTML('afterend', htmlFull);

    // define global modal wrapper
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

/**
 * Toggles to next or previous modal
 *
 * @param {boolean} prev if is supposed to go backwards or not
 */
function modalToggle(prev) {
    // Gets current ID
    const index = parseInt(document.querySelector('.modal-info-container').getAttribute('data-id'));
    const apiUserCount = apiUsers.length - 1;
    let newUserID = 0;

    // If is previous go backwards
    if (prev) {
        if (index > 0) {
            newUserID = index - 1;
        } else {
            newUserID = apiUserCount;
        }
    } 
    // Otherwise move forward
    else {
        if (index < apiUserCount) {
            newUserID = index + 1;
        }
    }
    generateSingleModal(apiUsers[newUserID], newUserID);
}

/**
 * Creates markup for modal
 * Only replaces part of the modal if is toggling
 *
 * @param {object} user json user object
 * @param {integer} index current user id sequence
 * @param {boolean} toggle if is being use for toggle
 */
function generateSingleModal(user, index, toggle) {
    const picURL = user.picture.large;
    const firstName = user.name.first
    const lastName = user.name.last
    const email = user.email;
    const city = user.location.city;
    const state = abbrState(user.location.state, 'abbr');
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

    htmlMiddle = `
        <div id="modal-info-container-wrapper">
            <div class="modal-info-container" data-id="${index}">
                <img class="modal-img" src="${picURL}" alt="${firstName} ${lastName} profile picture">
                <h3 class="modal-name cap">${firstName} ${lastName}</h3>
                <p class="modal-text"><a href="mailto:${email}">${email}</a></p>
                <p class="modal-text cap">${city}</p>
                <hr>
                <p class="modal-text"><a href="tel:${phone}">${phone}</a></p>
                <p class="modal-text">${address}</p>
                <p class="modal-text">Birthday: ${birthday}</p>
            </div>
        </div>
    `;

    if (!toggle) {
        htmlStart = `
            <div class="modal-container">
                <div class="modal">
                    <button type="button" id="modal-close-btn" class="modal-close-btn"><strong>X</strong></button>
        `;

        htmlLast = `</div>
                <div class="modal-btn-container">
                    <button type="button" id="modal-prev" class="modal-prev btn">Prev</button>
                    <button type="button" id="modal-next" class="modal-next btn">Next</button>
                </div>
            </div>
        `;

        modalWrapper.innerHTML = htmlStart + htmlMiddle + htmlLast;
    } else {
        document.querySelector('#modal-info-container-wrapper').innerHTML = htmlMiddle;
    }
}

//=============================================================================
// SEARCH FUNCTIONS
//=============================================================================

/**
 * Creates search functionality
 */
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

        // Otherwise wait .25 seconds before executing code.
        // This prevents from code running too many times
        else {
            if (globalTimeout != null) {
                clearTimeout(globalTimeout);
            }
            globalTimeout = setTimeout(() => {
                triggerSearch(keyword, names);
            }, 250);
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

/**
 * Creates markup for modal
 * Only replaces part of the modal if is toggling
 *
 * @param {string} keyword string to search
 * @param {array} names array of elements to compare keyword
 */
function triggerSearch(keyword, names) {
    // Reset search results
    searchList.length = 0;

    // Pushes any matching names to global array searchList
    for (let i = 0; i < names.length; i++) {
        let studentName = names[i].textContent.toLowerCase();
        if (studentName.includes(keyword)) {
            let li = names[i].parentNode.parentNode;
            searchList.push(li);
        }
    }

    // Hides or displays cards based on searchlist
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
