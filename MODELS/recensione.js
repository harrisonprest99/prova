const mongoose = require('mongoose');

const recensioneSchema = mongoose.Schema({
    _id: mongoose.Schema.Types.ObjectId,
    utente: { type: mongoose.Schema.Types.ObjectId, ref: 'Utente', required: true },
    film: { type: mongoose.Schema.Types.ObjectId, ref: 'Film', required: true },
    titolo : {type: String, required: true},
    valutazione : {type: Number, required: true},
    commento: {type: String, required: true}
});

module.exports = mongoose.model('Recensione', recensioneSchema);