const { doesNotReject } = require('assert');
const express = require('express');
const router = express.Router();
const mongoose = require('mongoose');
const checkAuth = require('../MIDDLEWARE/check-auth');

const Infofilm = require('../MODELS/infofilm.js');
const Sala = require('../MODELS/sala.js');
const Film = require('../MODELS/film.js');

// gestore richieste GET
router.get('/', (req, res, next) => {
    Infofilm
    .find()
    .select('_id sala film data ora posti_liberi')
    .populate('sala', 'nome posti_tot')
    .populate('film', 'titolo descrizione anno durata')
    .exec()
    .then(result => {
        res.status(200).json({
            count: result.length,
            infofilms: result.map(doc => {
                return {
                    _id: doc._id,
                    sala: doc.sala,
                    film: doc.film,
                    data: doc.data,
                    ora: doc.ora,
                    posti_liberi: doc.posti_liberi,
                    request: {
                        type: 'GET',
                        url: '../infofilms/' + doc._id
                    }
                }
            }) 
        });
    })
    .catch(err => {
        res.status(500).json({
            error: 'Errore nella richiesta delle informazioni sui film'
        });
    });
});

// gestore richieste GET
router.get('/:infofilmProp', (req, res, next) => {
    const prop = req.params.infofilmProp;
    Infofilm
    .findById(prop)
    .select('_id sala film data ora posti_liberi')
    .populate('sala', 'nome posti_tot')
    .populate('film', 'titolo descrizione anno durata')
    .exec()
    .then(result => {
        if (result.length != 0) {
            res.status(200).json({
                infofilm: result
            });
        }
    })
    .catch(err => {
        Infofilm
        .find({film : prop})
        .select('_id sala film data ora posti_liberi')
        .populate('sala', 'nome posti_tot')
        .populate('film', 'titolo descrizione anno durata')
        .exec()
        .then(result => {
            if (result.length == 0){
                res.status(404).json({
                    message: 'Informazioni sul film non trovate'
                });
            }
            else {
                res.status(200).json({
                    infofilm: result
                });
            }
        })
        .catch(err =>{
            res.status(500).json({
                message: 'Errore nel trovare informazioni sul film'
            });
        })
    });
});

// gestore richieste POST
router.post('/', /*checkAuth,*/ (req, res, next) => {
    Sala.findById(req.body.salaId)
    .then(sala => {
        if (!sala){
            res.status(404).json({
                error: 'Impossibile creare informazioni su una sala inesistente'
            });
        }
    })
    Film.findById(req.body.filmId)
    .then(film => {
        if (!film){
            res.status(404).json({
                error: 'Impossibile creare informazioni su un film inesistente'
            });
        }
        const infofilm = new Infofilm({
            _id: new mongoose.Types.ObjectId(),
            sala: req.body.salaId,
            film: req.body.filmId,
            data: req.body.data,
            ora: req.body.ora,
            posti_liberi: req.body.posti_liberi
        });
        return infofilm
        .save()
    })
    .then(result => {
        res.status(201).json({
            infofilmRegistrato: {
                _id: result._id,
                sala: result.sala,
                film: result.film,
                data: result.data,
                ora: result.ora,
                posti_liberi: result.posti_liberi
            },
            message: 'Film registrato',
            request: {
                type: 'GET',
                url: '../infofilms/' + result._id
            }
        })    
    })    
    .catch(err => {
        console.log(err);
        res.status(500).json({
            error: 'Informazioni del film non create'
        });
    });
})

// gestore richieste DELETE
router.delete('/:infofilmId', checkAuth, (req, res, next) => {
    const id = req.params.infofilmId;
    Infofilm
    .findById(id)
    .exec()
    .then(result => {
        if (result == null){
            res.status(404).json({
                error: 'Informazioni sul film non trovate'
            });
        }
        else {
            Infofilm
            .deleteOne({_id : id})
            .exec()
            .then(result => {
                res.status(200).json({
                    message: 'Informazioni sul film cancellate'
                });
            })
        }
    })
    .catch(err => {
        res.status(500).json({
            error: 'Errore nella cancellazione delle informazioni del film'
        });
    });
});

// gestore richieste PATCH
router.patch('/:infofilmId', checkAuth, (req, res, next) => {
    const id = req.params.infofilmId;
    Infofilm
    .findById(id)
    .exec()
    .then(result => {
        if (result == null){
            res.status(404).json({
                error: 'Informazioni sul film non trovate'
            });
        }
        else {
            const updateOps = {};
            for(const ops of req.body) {
                updateOps[ops.propName] = ops.value;
            }
            Infofilm
            .updateOne({_id : id}, {$set: updateOps})
            .exec()
            .then(result => {
                res.status(200).json({
                    message: 'Informazioni sul film modificate correttamente'
                })
            })    
        }
        
    })
    .catch(err => {
        res.status(500).json({
            error: 'Errore nella modifica delle informazioni del film'
        });
    });
    
    
});

module.exports = router;
