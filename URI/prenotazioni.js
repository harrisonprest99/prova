const express = require('express');
const router = express.Router();
const mongoose = require('mongoose');

const Prenotazione = require('../MODELS/prenotatione');
const Infofilm = require('../MODELS/infofilm');
const Utente = require('../MODELS/utente');
const checkAuth = require('../MIDDLEWARE/check-auth');

// gestore richieste GET
router.get('/', checkAuth, (req, res, next) => {
    Prenotazione
    .find()
    .select('_id utente infofilm')
    .populate('utente','_id username email')
    .populate('infofilm','_id sala film giorno mese anno ora')
    .exec()
    .then(result => {
        console.log(result);
        res.status(200).json({
            count: result.length,
            prenotazioni: result.map(doc => {
                return {
                    _id: doc._id,
                    utente: doc.utente,
                    infofilm: doc.infofilm,
                    request: {
                        type: 'GET',
                        url: 'http://localhost:3000/prenotazioni/' + doc._id
                    }
                }
            })            
        });
    })
    .catch(err => {
        console.log(err);
        res.status(500).json({            
            error: 'Errore nella richiesta delle prenotazioni'
        });
    });
});

// gestore richieste GET
router.get('/:prenotazioneProp', checkAuth, (req, res, next) => {
    const prop = req.params.prenotazioneProp;
    Prenotazione
    .findById(prop)
    .select('_id utente infofilm')
    .populate('utente','_id username email')
    .populate('infofilm','_id sala film giorno mese anno ora')
    .exec()
    .then(result => {
        if (result.length != 0) {
            console.log(result)
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
                console.log(err);
                res.status(404).json({
                    error: 'Prenotazione non trovata'
                });
            }
            else {
                console.log(result);
                res.status(200).json({
                    prenotazione: result
                });
            }
        })
        .catch(err =>{
            console.log(err);
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
            console.log("Impossibile creare prenotazioni su informazioni inesistenti")
            res.status(404).json({
                error: 'Impossibile creare prenotazioni su informazioni inesistenti'
            });
        }
    })
    Utente.findById(req.body.utenteId)
    .then(utente => {
        if (!utente){
            console.log("Impossibile creare prenotazioni di un utente inesistente")
            res.status(404).json({
                error: 'Impossibile creare prenotazioni di un utente inesistente'
            });
        }
        const prenotazione = new Prenotazione({
            _id : mongoose.Types.ObjectId(),
            utente: req.body.utenteId,
            infofilm: req.body.infofilmId
        });
        return prenotazione
        .save()
    })
    .then(result => {
        console.log(result);
        res.status(201).json({
            prenotazioneEffettuata: {
                _id: result._id,
                utente: result.utente,
                infofilm: result.infofilm
            },
            message: 'Prenotazione effettuata',
            request: {
                type: 'GET',
                url: 'http://localhost:3000/prenotazioni/' + result._id
            }
        });
    })
    .catch(err => {
        console.log(err);
        res.status(500).json({
            error: 'Errore nella creazione della prenotazione'
        })
    });
});

// gestore richieste DELETE
router.delete('/:prenotazioneId', checkAuth, (req, res, next) => {
    const id = req.params.prenotazioneId;
    Prenotazione
    .findById(id)
    .exec()
    .then(result => {
        if (result == null){
            console.log('Prenotazione non trovata');
            res.status(404).json({
                error: 'Prenotazione non trovata'
            });
        }
        else {
            Prenotazione
            .deleteOne({_id : id})
            .exec()
            .then(result => {
                console.log(result);
                res.status(200).json({
                    message: 'Prenotazione cancellata'
                });
            })
        }
    })
    .catch(err => {
        console.log(err);
        res.status(500).json({
            error: 'Errore nella cancellazione della prenotazione'
        });
    });
});

module.exports = router;
