const express = require('express');
const router = express.Router();
const mongoose = require('mongoose');

const Prenotazione = require('../MODELS/prenotatione');
const Infofilm = require('../MODELS/infofilm');
const Utente = require('../MODELS/utente');
const checkAuth = require('../MIDDLEWARE/check-auth');

// gestore richieste GET
router.get('/', /*checkAuth,*/ (req, res, next) => {
    Prenotazione
    .find()
    .select('_id utente infofilm')
    .populate('utente','_id username email')
    .populate('infofilm','_id sala film giorno mese anno ora')
    .exec()
    .then(result => {
        res.status(200).json({
            count: result.length,
            prenotazioni: result.map(doc => {
                return {
                    _id: doc._id,
                    utente: doc.utente,
                    infofilm: doc.infofilm,
                    request: {
                        type: 'GET',
                        url: '../prenotazioni/' + doc._id
                    }
                }
            })            
        });
    })
    .catch(err => {
        res.status(500).json({            
            error: 'Errore nella richiesta delle prenotazioni'
        });
    });
});

// gestore richieste GET
router.get('/:prenotazioneProp', /*checkAuth*/ (req, res, next) => {
    const prop = req.params.prenotazioneProp;
    Prenotazione
    .findById(prop)
    .select('_id utente infofilm')
    .populate('utente','_id username email')
    .populate('infofilm','_id sala film giorno mese anno ora')
    .exec()
    .then(result => {
        if (result.length != 0) {
            res.status(200).json({
                prenotazione: result
            });
        }
    })
    .catch(err => {
        Prenotazione
        .find({utente : prop})
        .select('_id utente infofilm')
        .populate('utente','_id username email')
        .populate('infofilm','_id sala film giorno mese anno ora')
        .exec()
        .then(result => {
            if (result.length == 0){
                res.status(404).json({
                    error: 'Prenotazione non trovata'
                });
            }
            else {
                res.status(200).json({
                    prenotazione: result
                });
            }
        })
        .catch(err =>{
            res.status(500).json({
                error: 'Errore nel trovare informazioni sul film'
            });
        })
    });
});

// gestore richieste POST
router.post('/', checkAuth, (req, res, next) => {
    Infofilm.findById(req.body.infofilmId)
    .then(infofilm => {
        if (!infofilm){
            res.status(404).json({
                error: 'Impossibile creare prenotazioni su informazioni inesistenti'
            });
        }
        else {
            Utente.findById(req.body.utenteId)
            .then(utente => {
                if (!utente) {
                    res.status(404).json({
                        error: 'Impossibile creare prenotazioni di un utente inesistente'
                    });
                }
                const prenotazione = new Prenotazione({
                    _id: new mongoose.Types.ObjectId(),
                    utente: req.body.utenteId,
                    infofilm: req.body.infofilmId
                });
                return prenotazione
                .save()
            })
            .then(result => {
                res.status(201).json({
                    prenotazioneRegistrata: {
                        _id: result._id,
                        utente: result.utente,
                        infofilm: result.infofilm,
                    },
                    message: 'Prenotazione effettuata',
                    request: {
                        type: 'GET',
                        url: '../prenotazioni/' + result._id
                    }
                });
            })
            .catch(err => {
                res.status(500).json({
                    error: 'Operazione fallita'
                });
            });
        }
    });  
});

// gestore richieste DELETE
router.delete('/:prenotazioneId', /*checkAuth*/ (req, res, next) => {
    const id = req.params.prenotazioneId;
    Prenotazione
    .findById(id)
    .exec()
    .then(result => {
        if (result == null){
            res.status(404).json({
                error: 'Prenotazione non trovata'
            });
        }
        else {
            Prenotazione
            .deleteOne({_id : id})
            .exec()
            .then(result => {
                res.status(200).json({
                    message: 'Prenotazione cancellata'
                });
            })
        }
    })
    .catch(err => {
        res.status(500).json({
            error: 'Errore nella cancellazione della prenotazione'
        });
    });
});

module.exports = router;
