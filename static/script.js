var loggedUser = {};
var signedUser = {};

function loadFilms() {

    const ul = document.getElementById('films'); 
    ul.innerHTML = '';

    fetch('../films/')
    .then((resp) => resp.json()) 
    .then(function(data) {
        
        return data.films.map(function(film) {
            let span = document.createElement('span');
            span.innerHTML = 
                `<table>
                  <tr>
                    <th width=30%>
                        <img type="filmImage" src="${film.linkImmagine}">
                                 
                    </th>                    
                    <th>
                        <h1 type="titolo">
                            ${film.titolo} (${film.anno})
                        </h1>
                      <h5 style="padding: 10px 40px;">
                        ${film.durata}min 
                      </h5>
                      <p style="padding-left: 40px;">
                        ${film.descrizione}
                      </p>
                    </th>
                  </tr>
                </table>`;
            
            ul.appendChild(span);
        })
    })
    .catch( error => console.error(error) );
    
}
loadFilms();

function loadOne(){
    const ul = document.getElementById('films'); 
    var titolo = document.getElementById("Cerca").value;
    ul.innerHTML = '';
    fetch('../films/' + titolo)
    .then((resp) => resp.json())
    .then(
        function(data) { 
        console.log(data);
        return data.film.map(function(film) { 
            
            let span = document.createElement('span');
            span.innerHTML =
                `<table>
                    <tr>
                        <th>
                            <h1 type="titolo">
                                ${film.titolo}
                            </h1>
                        </th>
                    </tr>
                </table> 
                <table>
                    <tr>
                        <th> 
                            <iframe
                                src="${film.linkTrailer}">
                            </iframe>
                            <h1>
                                Scrivi la tua recensione
                            </h1>

                            <form class="recensioni" action="/" method="POST" >
                                <table>
                                <tr>
                                    <th style="padding: 20px">
                                    <input 
                                        name="titolo" 
                                        id= "titolo"
                                        placeholder= "Titolo..."
                                        type="titolo"
                                    />
                                    <h5 type="valutazione">
                                        Valutazione
                                    </h5>
                                    <input type="radio" id="1" name="valutazione" value="1">
                                        <label for="1">
                                            <img src="image/stella.png" >
                                        </label><br>
                                    <input type="radio" id="2" name="valutazione" value="2">
                                        <label for="2">
                                            <img src="image/stella.png" >
                                            <img src="image/stella.png" >
                                        </label><br>
                                    <input type="radio" id="3" name="valutazione" value="3">
                                        <label for="3">
                                            <img src="image/stella.png" >
                                            <img src="image/stella.png" >
                                            <img src="image/stella.png">
                                        </label><br>
                                    <input type="radio" id="4" name="valutazione" value="4">
                                        <label for="4">
                                            <img src="image/stella.png">
                                            <img src="image/stella.png">
                                            <img src="image/stella.png">
                                            <img src="image/stella.png">
                                        </label><br>
                                    <input type="radio" id="5" name="valutazione" value="5">
                                        <label for="5">
                                            <img src="image/stella.png">
                                            <img src="image/stella.png">
                                            <img src="image/stella.png">
                                            <img src="image/stella.png">
                                            <img src="image/stella.png">
                                        </label><br>
                                    <input name="commento" id= "commento" type="commento"/>
                                    </th>
                                    <th>
                                        <input type="image" src= "image/invio.png"  onclick="recensione(${film.self})" border="0" width="50" height="50"/>
                                    </th>
                                </tr>
                                </table>
                            </form>
                            <ul id="recensioni" style="padding:20px">
                            </ul>
                            
                        </th>
                        <th style="vertical-align:top; padding: 20px">  
                            <h1>
                                ${film.titolo}(${film.anno})      
                            </h1>
                            <h5>
                                ${film.durata}min     
                            </h5>      
                            </h1>
                            <p>
                                ${film.descrizione}
                            </p>                      
                            
                        </th>              
                    </tr>
                    <tr>                   
                        <form action="" method="GET" >
                    
                    </tr>
                </table>
                <p></p>`;
            
            // Append all our elements
            ul.appendChild(span);
            loadRecensioni(film._id);
        })
    })
    .catch( error => console.error(error) );
}

function loadRecensioni(filmId){

    const ul = document.getElementById('recensioni'); 
    ul.innerHTML = '';

    fetch('../recensioni/'+filmId)
    .then((resp) => resp.json()) 
    .then(function(data) {
        
        return data.recensione.map(function(recensione) {
            
            let span = document.createElement('span');
            span.innerHTML = 
                `<table type="utente">      
                    <tr style=" background: none;">
                        <th style="padding: 10px">
                            <input type="image" src="image/defaultuser.png" name="" style="width:50px;height:50px;">
                        </th>
                        <th>
                            <h3>
                                ${recensione.utente.username}
                            </h3>
                        </th>
                    </tr>
                </table>
                <table>
                    <tr style="background-color: #191919">                   
                        <th>                       
                            <h3 style="padding: 20px; margin: 0%">
                                ${recensione.titolo}
                            </h3>
                            <h5 style="margin: 0%"> 
                                ${recensione.valutazione} <img src="image/stella.png">
                            </h5>
                            <p>
                                ${recensione.commento}
                            </p>
                        </th>
                    </tr>
                </table>
                <p></p>`;
            
            ul.appendChild(span);
        })
    })
    .catch( error => console.error(error) );
}

function goToLogin(){
    const ul = document.getElementById('films');
    ul.innerHTML = 
        `<form class="box" action="utenti/login" method="post" name="loginform" id="loginform">
            <h1>ACCEDI</h1>
            <input  type="text"placeholder="Email" name="email" id="loginEmail"/>
            <input  type="password"placeholder="Password" name="email" id="loginPassword"/>
            <input  type="button" value="Accedi" onclick="login()"/>
            <span id="loggedUser"></span>
            <h3>Non sei registrato? <input  type="button" value="Registrati" onclick="goToSignup()"/></h3>
        </form>`;
}

function login()
{
    //get the form object
    var email = document.getElementById("loginEmail").value;
    var password = document.getElementById("loginPassword").value;
    var errore= document.getElementById("loggedUser")
     
    var userName = document.getElementById("userName");
    // console.log(email);

    fetch('../utenti/login', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify( { email: email, password: password } ),
    })
    .then((resp) => resp.json()) // Transform the data into json
    .then(function(data) { // Here you get the data to modify as you please
        console.log(data);
        loggedUser.token = data.token;
        loggedUser.email = data.email;
        loggedUser.id = data.id;
        loggedUser.username=data.username;
        loggedUser.self = data.self;
        console.log(loggedUser.email);
        // loggedUser.id = loggedUser.self.substring(loggedUser.self.lastIndexOf('/') + 1);
        if(loggedUser.email==null){
            errore.innerHTML=
            `<h3 style="color: #b53131">
                Email o password errati
            </h3>`
        }
        if(loggedUser.username!=null){
            loadFilms();
            userName.innerHTML = 
            `<table type="utente">      
                <tr style=" background: none;">
                    <th style="padding: 10px">
                        <input type="image" src="image/defaultuser.png" name="" style="width:40px;height:40px;">
                    </th>
                    <th>
                        <h3>
                            ${loggedUser.username}
                        </h3>
                    </th>
                </tr>
            </table>`
        }
        
        return;
    })
    .catch( error => console.error(error) ); // If there is any error you will catch them here

};

function goToSignup(){
    const ul = document.getElementById('films');
    ul.innerHTML = 
        `<form class="box" action="utenti/signup" method="post" name="signform" id="signform">
            
            <h1>REGISTRATI</h1>
            <input  type="text" placeholder="Username" name="username" id="signUsername"/>
            <input  type="text" placeholder="Email" name="email" id="signEmail"/>
            <input  type="password" placeholder="Password" name="email" id="signPassword"/>
            <input  type="button" value="Registrati" onclick="signup()"/>
            <span id="signedUser"></span>
        </form>`;
}

function signup()
{
    //get the form object
    var username = document.getElementById("signEmail").value;
    var email = document.getElementById("signEmail").value;
    var password = document.getElementById("signPassword").value;
    var errore= document.getElementById("signedUser")
     
    //var userName = document.getElementById("userName");
    // console.log(email);

    fetch('../utenti/signup', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify( { username: username, email: email, password: password } ),
    })
    .then((resp) => resp.json()) // Transform the data into json
    .then(function(data) { // Here you get the data to modify as you please
        console.log(data);
        loggedUser.email = data.email;
        loggedUser.id = data.id;
        loggedUser.username=data.username;

        if(loggedUser.email==null){
            errore.innerHTML=
            `<h3 style="color: #b53131">
                Email già esistente
            </h3>`
        }
        // loggedUser.id = loggedUser.self.substring(loggedUser.self.lastIndexOf('/') + 1);
        /*userName.innerHTML = 
        `<table type="utente">      
        <tr style=" background: none;">
            <th style="padding: 10px">
                <input type="image" src="image/defaultuser.png" name="" style="width:50px;height:50px;">
            </th>
            <th>
                <h3>
                    ${loggedUser.username}
                </h3>
            </th>
        </tr>
    </table>`*/
        return;
    })
    .catch( error => console.error(error) ); // If there is any error you will catch them here

};

function recensione(bookUrl)
{
    var titolo = document.getElementById("titolo").value;
    var valutazione = document.getElementById("valutazione").value;
    var commento = document.getElementById("commento").value;
    console.log(bookUrl);
    console.log(titolo);
    console.log(valutazione);
    console.log(commento);

    fetch('../recensioni', {
        method: 'POST',
        headers: {
            'Content-Type': 'application/json',
            'x-access-token': loggedUser.token
        },        
        body: JSON.stringify( { titolo: titolo, valutazione: valutazione, commento: commento, utente: loggedUser.self, film: filmUrl } ),
    })
    .then((resp) =>{
        console.log(resp);
        loadRecensioni();
        return
    }) 
    .catch( error => console.log(error) ); // If there is any error you will catch them here

};
