var loggedUser = {};
var signedUser = {};

function loadFilms() {
    const ul = document.getElementById('films'); 
    ul.innerHTML = '';
    let slidespan = document.createElement('span');
    slidespan.innerHTML=`
            <div class="slideshow-container" >
                <ul id="button"></ul>
                <div id="slides">
                </div>
            </div>
            <div id="dots" style="text-align:center"></div>`;
    
    ul.appendChild(slidespan);
    slideshow();

    fetch('../films/')
    .then((resp) => resp.json()) 
    .then(function(data) {
        
        return data.films.map(function(film) {
            let span = document.createElement('span');
            span.innerHTML = 
                `<table style="width:94vw; margin:1vw 2vw">
                  <tr>
                    <th width=30%>
                        <input type="text" name="titolo" id= "${film.titolo}" value="${film.titolo}" style="display:none"/>
                        <input type="button" id="${film.titolo}" style="background-image: url('${film.linkImmagine}');" onclick="loadOne2(id)">    
                    </th>                    
                    <th>
                        <h1 type="titolo">
                            ${film.titolo} (${film.anno})
                        </h1>
                        <h5>
                            ${film.durata}min 
                        </h5>
                        <p>
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
        if (data.error!=null){
            let err = document.createElement('span');
                err.innerHTML =
                    `<h1 type="filmerror">
                        Errore: ${data.error}
                    </h1>`; 
                ul.appendChild(err)           
        }else{
            return data.film.map(function(film) { 
            
                let span = document.createElement('span');
                span.innerHTML =
                    `<table style="margin: 2vw; margin-top:8vw;">
                        <tr>
                            <th> 
                                <iframe 
                                    src="${film.linkTrailer}"
                                    frameborder="0"
                                    allowfullscreen="allowfullscreen">
                                </iframe>
                                <h1>
                                    Scrivi la tua recensione
                                </h1>
    
                                <ul id="formrecensioni" style="padding: 0vw 2vw; background-color: #0a0a0a">
                                </ul>
                                
                                <ul id="recensioni" style="padding: 0vw 2vw; background-color: #0a0a0a">
                                </ul>
                                
                            </th>
                            <th style="vertical-align:top;">  
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

                    </table>
                    <p></p>`;
                
                // Append all our elements
                ul.appendChild(span);
                loadForm(film._id);
                loadRecensioni(film._id);
            })
        }
        
    })
    .catch( error => console.error(error) );
}
function loadOne2(titolo){
    const ul = document.getElementById('films'); 
    var titolo2 = document.getElementById(titolo).value;
    ul.innerHTML = '';
    fetch('../films/' + titolo2)
    .then((resp) => resp.json())
    .then(
        function(data) { 
        console.log(data);
        return data.film.map(function(film) { 
            
            let span = document.createElement('span');
            span.innerHTML =
                `<table style="margin: 2vw; margin-top:8vw;">
                    <tr>
                        <th> 
                            <iframe 
                                src="${film.linkTrailer}"
                                frameborder="0"
                                allowfullscreen="allowfullscreen">
                            </iframe>
                            <h1>
                                Scrivi la tua recensione
                            </h1>

                            <ul id="formrecensioni" style="padding: 0vw 2vw; background-color: #0a0a0a">
                            </ul>
                            
                            <ul id="recensioni" style="padding: 0vw 2vw; background-color: #0a0a0a">
                            </ul>
                            
                        </th>
                        <th style="vertical-align:top;">  
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
                            
                            <input  type="button" onclick="goToPrenotazioni('${film._id}')" value="Prenota un posto" style="width: 10vw; height: 3vw; background-color: rgb(50, 60, 204); font-size: 1vw; margin: 5vw; color: whitesmoke;"/>
                            
                        </th>          
                    </tr>
                </table>
                <p></p>`;
            
            // Append all our elements
            ul.appendChild(span);
            loadForm(film._id);
            loadRecensioni(film._id);
        })
    })
    .catch( error => console.error(error) );
}

function loadForm(filmId){
    console.log(filmId)
    if (filmId!=0){
        const form = document.getElementById('formrecensioni');
        form.innerHTML =`
        <form class="recensioni" action="/" method="POST" >
            <table style="margin-right:1vw">
            <tr>
                <th style="padding: 2vw">
                <input 
                    name="titolo" 
                    id= "titolo"
                    placeholder= "Titolo..."
                    type="titolo"
                />
                <h5 type="valutazione">
                    Valutazione
                </h5>
                <input 
                    name="valutazione" 
                    id= "valutazione"
                    placeholder= "Valutazione 1-5"
                    type="titolo"
                    style="width: 9vw"
                />
                <input name="commento" id= "commento" type="commento"/>
                </th>
                <th>
                    <input type="button" style="background-image: url('image/invio.png');background-size: cover; width: 2.5vw; height: 2.5vw; padding-left: 0;" onclick="recensione('${filmId}')">
                </th>
            </tr>
            </table>
        </form>`;
    }  else {
        const formnull = document.getElementById('formrecensioni');
        formnull.innerHTML =`<h5 type="valutazione">
        Recensione effettuata!
    </h5>`;
    }
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
                    <tr>
                        <th style="padding: 0vw;">
                            <input type="image" src="image/defaultuser.png" name="" style="width:2vw;height:2vw;">
                        </th>
                        <th>
                            <h3 style="margin: 0; font-weight: 500; font-size:1vw;">
                                ${recensione.utente.username}
                            </h3>
                        </th>
                    </tr>
                </table>
                <table style="width:50vw">
                    <tr style="background-color: #191919">                   
                        <th>                       
                            <h3 style="padding: 20px; margin: 0%">
                                ${recensione.titolo}
                            </h3>
                            <h5 style="margin: 0%"> 
                                ${recensione.valutazione} <img src="image/stella.png" style="width:1vw; height:1vw;">
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
            <input  type="text" placeholder="Email" name="email" id="loginEmail"/>
            <input  type="password" placeholder="Password" name="email" id="loginPassword"/>
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
        loggedUser._id = data._id;
        loggedUser.username=data.username;
        loggedUser.self = data.self;
        
        if(loggedUser.email==null){
            errore.innerHTML=
            `<h3 style="color: #b53131">
                ${data.error}
            </h3>`
        }
        if(loggedUser.username!=null){
            loadFilms();
            userName.innerHTML = 
            `<input type="image" src="image/defaultuser.png">`
        }
        
        return;
    })
    .catch( error => console.error(error) ); // If there is any error you will catch them here

};

function goToSignup(){
    const ul = document.getElementById('films');
    ul.innerHTML = 
        `<form class="box" action="utenti/signup" method="post" name="signform" id="signform" style="margin: 3vw 33vw; margin-top: 11vw">
            
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
    var username = document.getElementById("signUsername").value;
    var email = document.getElementById("signEmail").value;
    var password = document.getElementById("signPassword").value;
    var errore= document.getElementById("signedUser")
     
    //var userName = document.getElementById("userName");
    console.log(email);
    console.log(username);

    fetch('../utenti/signup', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify( { username: username, email: email, password: password } ),
    })
    .then((resp) => resp.json()) // Transform the data into json
    .then(function(data) { // Here you get the data to modify as you please
        console.log(data.error); 
        errore.innerHTML=
        `<h3 style="color: #b53131">
            ${data.error}
        </h3>`       
        return;
    })
    .catch(function(error) {
        console.log(error);
        errore.innerHTML=
        `<h3 style="color: #b53131">
            ${error}
        </h3>`
    }); // If there is any error you will catch them here

};

function recensione(filmvalue){
    var titolo = document.getElementById("titolo").value;
    var valutazione = document.getElementById("valutazione").value;
    var commento = document.getElementById("commento").value;
    
    fetch('../recensioni/', {
        method: 'POST',
        headers: {
            'Content-Type': 'application/json',
            'Authorization': "Bearer " + loggedUser.token
        },        
        body: JSON.stringify( { utenteId: loggedUser._id, filmId: filmvalue, titolo: titolo, valutazione: valutazione, commento: commento} ),
    })
    .then((resp) =>{
        console.log(resp);
        loadRecensioni(filmvalue);
        loadForm(0);
        return
    }) 
    .catch( error => console.log(error) ); // If there is any error you will catch them here

};
function goToPrenotazioni(filmvalue){
    console.log(filmvalue);
    const ul = document.getElementById('films');
    ul.innerHTML = 
        `<form class="box" action=""  name="prenotazioneform" id="prenotazioneform" style="margin: 3vw 33vw; margin-top: 11vw">
            
            <h1>Inserisci una data</h1>
            <input  type="text" placeholder="mm/gg/aaaa" name="data" id="data"/>
            
            <input  type="button" value="Cerca per questo giorno" onclick="prenota('${filmvalue}')"/>
            <span id="prenotaora"></span>
        </form>`;

};

function prenota(filmvalue){
    var datavalue = document.getElementById("data").value;
    var prenotaora = document.getElementById('prenotaora');
    prenotaora.innerHTML=``;
    console.log(datavalue);
    console.log(filmvalue);
    fetch('../infofilms/' + filmvalue)
    .then((resp) => resp.json())
    .then(
        function(data) { 
        console.log(data);
        return data.infofilm.map(function(infofilm) { 
            console.log(infofilm);
            if(infofilm.data==datavalue){
                let span = document.createElement('span');
                span.innerHTML =
                `<form class="box" action="infofilm/" method="post" name="prenotaora" id="prenotaora" style="margin: 3vw 33vw; margin-top: 11vw">
                    <h1>${infofilm.ora}</h1>
                    <input  type="button" value="Registrati" onclick="prenotaorario('${infofilm._id}')"/>
                    <span id="signedUser"></span>
                </form>`;
                prenotaora.appendChild(span);
            }            
        });
    });
}
function prenotaorario(infofilmvalue){
    //get the form object
    console.log(infofilmvalue);

    fetch('../prenotazioni', {
        method: 'POST',
        headers: {
            'Content-Type': 'application/json',
            'Authorization': "Bearer " + loggedUser.token
        },
        body: JSON.stringify( { utenteId: loggedUser._id, infofilmId: infofilmvalue} ),
    })
    .then((resp) =>{
        console.log(resp);
        return
    })
    .catch( error => console.error(error) ); // If there is any error you will catch them here

};




var slideIndex = 1;

// Next/previous controls
function plusSlides(n) {
  showSlides(slideIndex += n);
}

// Thumbnail image controls
function currentSlide(n) {
  showSlides(slideIndex = n);
}

function showSlides(n) {
  var i;
  var slides = document.getElementsByClassName("mySlides");
  var dots = document.getElementsByClassName("dot");
  if (n > slides.length) {slideIndex = 1}
  if (n < 1) {slideIndex = slides.length}
  for (i = 0; i < slides.length; i++) {
      slides[i].style.display = "none";
  }
  for (i = 0; i < dots.length; i++) {
      dots[i].className = dots[i].className.replace(" active", "");
  }
  slides[slideIndex-1].style.display = "block";
  dots[slideIndex-1].className += " active";
}

function slideshow(){
    var button = document.getElementById("button");
    button.innerHTML=
    `<a class="prev" onclick="plusSlides(-1)">&#10094;</a>
    <a class="next" onclick="plusSlides(1)">&#10095;</a>`
    const filmSlide = document.getElementById("slides");
    const dots= document.getElementById("dots");
    filmSlide.innerHTML='';
    dots.innerHTML='';
    var i=0;

    fetch('../films/')
    .then((resp) => resp.json()) 
    .then(function(data) {
        return data.films.map(function(film) {
            let filmspan= document.createElement('span');
            let dotspan = document.createElement('span');
            i=i+1;
            filmspan.innerHTML=`
            <div class="mySlides fade" align="middle">
                <img src="${film.linkBanner}" style="height: 29vw; width: 99vw">
            </div>
            `;
            dotspan.innerHTML=`
            <span class="dot" onclick="currentSlide(${i})"></span>
            `;  
            dots.appendChild(dotspan);  
            filmSlide.appendChild(filmspan);
            showSlides(1);
        })
        
    })
    .catch( error => console.error(error) );
}
