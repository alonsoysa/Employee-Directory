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
    .then(data => generateCards(data.results));


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

function generateCards(data) {
    const html = data.map(item => generateCardHTML(item)).join('');
    gallery.innerHTML = html;
}

function generateCardHTML(item) {
    console.log(item);

    const picURL =  item.picture.large;
    const firstName = item.name.first
    const lastName = item.name.last
    const email = item.email;
    const city = item.location.city;
    const state = item.location.state;

    const html = `
        <div class="card">
            <div class="card-img-container">
                <img class="card-img" src="${picURL}" alt="$${firstName} ${lastName} profile picture">
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


