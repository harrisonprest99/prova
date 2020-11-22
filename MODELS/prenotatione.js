const mongoose = require('mongoose');

const prenotazioneSchema = mongoose.Schema({
    _id: mongoose.Schema.Types.ObjectId,
    utente: {type: mongoose.Schema.Types.ObjectId, ref: 'Utente', required: true},
    infofilm: { type: mongoose.Schema.Types.ObjectId, ref: 'Infofilm', required: true }
});

module.exports = mongoose.model('Prenotazione', prenotazioneSchema);