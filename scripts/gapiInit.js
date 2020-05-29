// Create OAuth credentials and add server adress e.x. http://localhost:8080
const CLIENT_ID = "";

gapi.load("client:auth2", function() {
    gapi.auth2.init({client_id: CLIENT_ID});
});