function loadFilms() {

    const ul = document.getElementById('films'); 
    ul.innerHTML = '';

    fetch('http://localhost:3000/films/')
    .then((resp) => resp.json()) 
    .then(function(data) {
        
        return data.films.map(function(film) {
            
            let li = document.createElement('li');
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
            
            li.appendChild(span);
            ul.appendChild(li);
        })
    })
    .catch( error => console.error(error) );
    
}
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
            while(titolo.indexOf>0){
                titmod= titmod+" "+titolo[0].split("+");
            }
            if (titmod!=""){
                loadOne(titmod)
            }else{
                
            }      
            
            console.log(titmod)
            loadOne(titolo[0]);
            return;
        }
    }
    
}
loadfilmchoose();

function loadOne(titolo){
    const ul = document.getElementById('films'); 
    ul.innerHTML = '';

    fetch('http://localhost:3000/films/'+titolo)
    .then((resp) => resp.json())
    .then(
        function(data) { 
        console.log(data);
        return data.film.map(function(film) { 
             
            let li = document.createElement('li');
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
            
            // Append all our elements
            li.appendChild(span);
            ul.appendChild(li);
        })
    })
    .catch( error => console.error(error) );
}


