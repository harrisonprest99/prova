const mongoose = require('mongoose');

const infofilmSchema = mongoose.Schema({
    _id: mongoose.Schema.Types.ObjectId,
    sala: { type: mongoose.Schema.Types.ObjectId, ref: 'Sala', required: true },
    film: { type: mongoose.Schema.Types.ObjectId, ref: 'Film', required: true },
    data: {type: String , required: true},
    ora: {type: Number , required: true},
    posti_liberi: {type: Number , required: true}
});

module.exports = mongoose.model('Infofilm', infofilmSchema);