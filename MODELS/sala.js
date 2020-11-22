const mongoose = require('mongoose');

const salaSchema = mongoose.Schema({
    _id: mongoose.Schema.Types.ObjectId,
    nome : {type: String, required: true},
    posti_tot: {type: Number, required: true},
});

module.exports = mongoose.model('Sala', salaSchema);