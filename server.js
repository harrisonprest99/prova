const mongoose = require('mongoose');
const app = require('./app.js');

const port = process.env.PORT || 3000;

app.locals.db = mongoose.connect(process.env.DB_URL, { useUnifiedTopology: true , useNewUrlParser: true})
.then(() => {
    console.log("Connessione al database effettuata");
    app.listen(port, () => {
        console.log("Server avviato sulla porta: " + port);
    });      
});