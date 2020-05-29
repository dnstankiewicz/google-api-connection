// Create API_KEY in Google Console for given project and paste below
const API_KEY = "";

var nextPageTokenVar = "";
let counter = 0;

const divInfo = document.getElementById("pag-ind");

const btnAuth = document.getElementById("log-in");
btnAuth.addEventListener('click', () => {
    authenticate().then(
        loadClient()
    ).catch(err => {
        console.log(err);
    })
});

const btnFetch = document.getElementById("get-data");
btnFetch.addEventListener('click', () => {
    if(counter !== 0 && isEmpty(nextPageTokenVar)){
        divInfo.innerHTML = "No more products to load";
    } else {
        counter++;
        execute(nextPageTokenVar).then(res => {
            nextPageTokenVar = res[0];
            cardCreate(res[1]);
            return nextPageTokenVar;
        }).then(res => {
            showPaginationInfo(res);
        }).catch(err => {
            console.log(err);
        });
    }

    
});

function isEmpty(str) {
    return (!str || 0 === str.length);
}

function authenticate() {
    return gapi.auth2.getAuthInstance()
        .signIn({scope: "https://www.googleapis.com/auth/photoslibrary https://www.googleapis.com/auth/photoslibrary.readonly https://www.googleapis.com/auth/photoslibrary.readonly.appcreateddata"})
        .then(function() { console.log("Sign-in successful"); },
            function(err) { console.error("Error signing in", err); });
}

function loadClient() {
    gapi.client.setApiKey(API_KEY);
    return gapi.client.load("https://content.googleapis.com/discovery/v1/apis/photoslibrary/v1/rest")
        .then(function() { console.log("GAPI client loaded for API"); },
            function(err) { console.error("Error loading GAPI client for API", err); });
}

function execute(nextPageTokenVar) {
    return gapi.client.photoslibrary.mediaItems.search({
        "resource": {
          "filters": {
            "mediaTypeFilter": {
              "mediaTypes": [
                "PHOTO"
              ]
            }
          },
        "pageSize": 100,
        "pageToken": nextPageTokenVar
    }})
    .then(function(response) {
        const products = [];
        nextPageTokenVar = response.result.nextPageToken;
        response.result.mediaItems.forEach(element => {
            products.push({
                name: element.filename,
                type: element.mimeType,
                imgUrl: element.baseUrl
            })
        })
        return [nextPageTokenVar,products];
    },
    function(err) { console.error("Execute error", err); });
}

function cardCreate(images) {

    images.forEach(element => {
        const cardInput = document.getElementById('card-input');

        let cardContainer = document.createElement('div');
        cardContainer.classList.add("py-4","col-6","col-md-3");
        cardInput.appendChild(cardContainer);

        let card = document.createElement('div');
        card.classList.add('card');
        cardContainer.appendChild(card);
    
        let cardImg = document.createElement('img');
        cardImg.classList.add("card-img");
        cardImg.src = element.imgUrl;
        cardImg.alt = "Item info";
        card.appendChild(cardImg);
    })
}

function showPaginationInfo(token) {
    if(isEmpty(token)){
        divInfo.innerHTML = "No more images to load :)";
    } else {
        divInfo.innerHTML = "There are more images to load!";
    }
}




