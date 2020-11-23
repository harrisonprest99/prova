function loadfilmchoose(){
    const ul = document.getElementById('films'); 
    ul.innerHTML = '';
    if(window.location.href=="http://localhost:3000/"){
        loadFilms();
        return;
    } 
    else {
        var path = window.location.href.slice(23);
        var arr = path.split("=");
        var type= arr[0];
        if (type=="titolo"){
            titolo=arr[1].split("&");
            var titmod="";
            var titpost=titolo[0].split("+");
            var i=0;
            while(titpost[i]!=null){
                if(i==0){
                    titmod=titpost[i];
                }else{
                    titmod=titmod+" "+titpost[i];                
                }
                i++;
                console.log(titmod)
                
            }
            if (titmod!=""){
                loadOne(titmod)
            }else{
                loadOne(titolo[0]);
            }      
            return;
        }
    }
    
}
loadfilmchoose();

function loadFilms() {

    const ul = document.getElementById('films'); 
    ul.innerHTML = '';

    fetch('http://localhost:3000/films/')
    .then((resp) => resp.json()) 
    .then(function(data) {
        
        return data.films.map(function(film) {
            
            let span = document.createElement('span');
            span.innerHTML = 
                `<table style="width:100%"; border: 1px solid black;>
                  <tr style=
                  "background-color : rgb(0, 0, 0);">
                    <th style="width: 40%" >
                      <a href="films/${film._id}">
                      <img 
                        src="image/tolotolo.jpg"
                        style=
                            "width:640px;
                            height:360px;">
                      </a>
                    </th>                    
                    <th>
                      <h2 style=
                          "color: whitesmoke;
                          text-align:left;
                          vertical-align:top;
                          font-size:200%;
                          font-family:verdana;"
                          >${film.titolo}
                      </h2>
                      <h5 style=
                          "color: whitesmoke;
                          text-align:left;
                          vertical-align:top;
                          font-family:verdana;"
                          >${film.anno}      ${film.durata}min 
                      </h5>
                      <p style=
                          "color: whitesmoke;
                          text-align:left;
                          vertical-align: top;
                          font-size:100%;
                          font-family:arial;">
                          ${film.descrizione}
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


function loadOne(titolo){
    const ul = document.getElementById('films'); 
    ul.innerHTML = '';

    fetch('http://localhost:3000/films/'+titolo)
    .then((resp) => resp.json())
    .then(
        function(data) { 
        console.log(data);
        return data.film.map(function(film) { 
             
            
            let span = document.createElement('span');
            span.innerHTML =
                `<table style="width:100%";>
                    <tr style=
                        "background-color : rgb(0, 0, 0);
                        widht: 100%";>
                        <th>
                            <h1 style=
                                "color: whitesmoke;
                                text-align:left;
                                vertical-align:top;
                                padding: 20px;
                                font-size:300%;
                                font-family:verdana;"
                                >${film.titolo}
                            </h1>
                        </th>
                    </tr>
                    <tr style=
                        "background-color : rgb(0, 0, 0);">
                        <th>
                            <iframe 
                                width="1080" 
                                height="720"
                                src="https://www.youtube.com/embed/we1sS9EJt8w">
                            </iframe>
                            <h1 style=
                                "color: whitesmoke;
                                text-align:left;
                                vertical-align:top;
                                padding: 20px;
                                font-size:150%;
                                font-family:verdana;"
                                >Scrivi la tua recensione
                            </h1>
                            <form action="" method="POST" >
                                <table 
                                stile="padding:20 px">
                                <tr stile="padding:20 px">
                                    <th stile= "color:white;padding:20 px; ">
                                    <input 
                                        name="titolo" 
                                        id= "titolo"
                                        value= "Titolo..."
                                        style=  
                                        "background-color : rgb(0, 0, 0);
                                        color:white;
                                        font-size: medium;
                                        width:1000px;
                                        height:30px;
                                        padding: 10px"/>
                                    <h5 style=
                                        "color: whitesmoke;
                                        text-align:left;
                                        vertical-align:top;
                                        font-size:100%;
                                        font-family:verdana;"
                                        >Valutazione
                                    </h5>
                                    <input type="radio" id="1" name="valutazione" value="1">
                                        <label for="1">
                                            <img src="image/stella.png" alt="stella" style="width:20px;height:20px;">
                                        </label><br>
                                    <input type="radio" id="2" name="valutazione" value="2">
                                        <label for="2">
                                            <img src="image/stella.png" alt="stella" style="width:20px;height:20px;">
                                            <img src="image/stella.png" alt="stella" style="width:20px;height:20px;">
                                        </label><br>
                                    <input type="radio" id="3" name="valutazione" value="3">
                                        <label for="3">
                                            <img src="image/stella.png" alt="stella" style="width:20px;height:20px;">
                                            <img src="image/stella.png" alt="stella" style="width:20px;height:20px;">
                                            <img src="image/stella.png" alt="stella" style="width:20px;height:20px;">
                                        </label><br>
                                    <input type="radio" id="4" name="valutazione" value="4">
                                        <label for="4">
                                            <img src="image/stella.png" alt="stella" style="width:20px;height:20px;">
                                            <img src="image/stella.png" alt="stella" style="width:20px;height:20px;">
                                            <img src="image/stella.png" alt="stella" style="width:20px;height:20px;">
                                            <img src="image/stella.png" alt="stella" style="width:20px;height:20px;">
                                        </label><br>
                                    <input type="radio" id="5" name="valutazione" value="5">
                                        <label for="5">
                                            <img src="image/stella.png" alt="stella" style="width:20px;height:20px;">
                                            <img src="image/stella.png" alt="stella" style="width:20px;height:20px;">
                                            <img src="image/stella.png" alt="stella" style="width:20px;height:20px;">
                                            <img src="image/stella.png" alt="stella" style="width:20px;height:20px;">
                                            <img src="image/stella.png" alt="stella" style="width:20px;height:20px;">
                                        </label><br>
                                    <input 
                                        name="commento" 
                                        id= "commento"
                                        value= "Scrivi recensione..."
                                        style=  
                                        "background-color : rgb(0, 0, 0);
                                        color:white;
                                        font-size: medium;
                                        width:1000px;
                                        height:300px;"/>
                                    </th>
                                    <th>
                                        <input 
                                        type="image"
                                        src= "image/invio.png"
                                        border="0"
                                        width="50" 
                                        height="50"
                                    />
                                    </input>
                                    </th>
                                </tr>
                                </table>
                            </form>
                            <ul 
                                id="recensioni"
                                style=
                                background-color : rgb(100, 100, 100);
                                text-align:left;
                                font-family:verdana;">
                            </ul>
                            
                        </th>
                        <th style="vertical-align:top; padding: 20px">  
                            <h1 style=
                                "color: whitesmoke;
                                text-align:left;
                                vertical-align:top;
                                font-family:verdana;"
                                >${film.titolo}(${film.anno})      
                            </h1>
                            <h4 style=
                                "color: whitesmoke;
                                text-align:left;
                                vertical-align:top;
                                font-family:verdana;"
                                >${film.durata}min     
                            </h4>      
                            </h1>
                            <p style=
                                "color: whitesmoke;
                                text-align:left;
                                vertical-align: top;
                                font-size:125%;
                                font-family:arial;">
                                ${film.descrizione}
                            </p>                      
                             
                        </th>              
                    </tr>
                    <tr style=
                        "background-color : rgb(0, 0, 0);">                   
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

    fetch('http://localhost:3000/recensioni/'+filmId)
    .then((resp) => resp.json()) 
    .then(function(data) {
        
        return data.recensione.map(function(recensione) {
            
            let span = document.createElement('span');
            span.innerHTML = 
                `<table style="width:10%; padding: 10px">      
                    <tr style=
                    "background-color : rgb(0, 0, 0);">
                    <th stile="padding: 10px">
                        <img src="image/defaultuser.png" alt="user" style="width:50px;height:50px;">
                    </th>
                    <th>
                        <h2 style=
                            "color: whitesmoke;
                            text-align:left;
                            vertical-align:top;
                            font-size:100%;
                            font-family:verdana;"
                            >${recensione.utente.username}
                        </h2>
                    </th>
                    </tr>
                </table>
                <table style="width:100%; padding: 10px; margin: 0px">
                    <tr style=
                    "background-color : rgb(30, 30, 30);">                   
                    <th>
                        
                        
                        <h2 style=
                            "color: whitesmoke;
                            text-align:left;
                            vertical-align:top;
                            font-size:200%;
                            font-family:verdana;"
                            >${recensione.titolo}
                        </h2>
                        <h4 style=
                            "color: whitesmoke;
                            text-align:left;
                            vertical-align:top;
                            font-family:verdana;"
                            >${recensione.valutazione} <img src="image/stella.png" alt="stella" style="width:20px;height:20px;">
                        </h4>
                        <p style=
                            "color: whitesmoke;
                            text-align:left;
                            vertical-align: top;
                            font-size:100%;
                            font-family:arial;">
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

