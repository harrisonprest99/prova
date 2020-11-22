const mongoose = require('mongoose');

const filmSchema = mongoose.Schema({
    _id: mongoose.Schema.Types.ObjectId,
    titolo: {type: String, required: true},
    descrizione: String,
    anno: {type: Number, required: true},
    durata: {type: Number, required: true}
});

module.exports = mongoose.model('Film', filmSchema);
