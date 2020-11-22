const express = require('express');
const router = express.Router();
const mongoose = require('mongoose');
const checkAuth = require('../MIDDLEWARE/check-auth');

const Film = require('../MODELS/film.js');

// gestore richieste GET
router.get('/', (req, res, next) => {
    Film
    .find()
    .select('_id titolo descrizione anno durata')
    .exec()
    .then(result => {
        console.log(result);
        res.status(200).json({
            count: result.length,
            films: result.map(doc => {
                return {
                    _id: doc._id,
                    titolo: doc.titolo,
                    descrizione: doc.descrizione,
                    anno: doc.anno,
                    durata: doc.durata,
                    self: '/films/' + doc.titolo,
                    request: {
                        type: 'GET',
                        url: 'http://localhost:3000/films/' + doc._id
                    }
                }
            })    
        });
    })
    .catch(err => {
        console.log(err);
        res.status(500).json({
            error: 'Errore nella richiesta dei film'
        });
    });
});

// gestore richieste GET specifiche
router.get('/:filmProp', (req, res, next) => {
    const prop = req.params.filmProp;
    Film
    .findById(prop)
    .select('_id titolo descrizione anno durata')
    .exec()
    .then(result => {
        if (result.length != 0) {
            console.log(result)
            res.status(200).json({
                message: 'Film trovato',
                film: result,
                self: '/films/' + result.titolo,
                url: 'http://localhost:3000/recensioni/' + result._id
            });
        }
    })
    .catch(err => {
        Film
        .find({titolo : prop})
        .select('_id titolo descrizione anno durata')
        .exec()
        .then(result => {
            if (result.length == 0){
                console.log(err);
                res.status(404).json({
                    error: 'Film non trovato'
                });
            }
            else {
                console.log(result);
                res.status(200).json({
                    message: 'Film trovato',
                    film: result,
                    url: 'http://localhost:3000/recensioni/' + result._id
                });
            }
        })
    });
});

// gestore richieste POST
router.post('/',/* checkAuth, */(req, res, next) => {
    const film = new Film({
        _id: new mongoose.Types.ObjectId(),
        titolo: req.body.titolo,
        descrizione: req.body.descrizione,
        anno: req.body.anno,
        durata: req.body.durata
    });
    film
    .save()
    .then(result => {
        console.log(result);
        res.status(201).json({
            filmRegistrato: {
                _id: result._id,
                titolo: result.titolo,
                descrizione: result.descrizione,
                anno: result.anno,
                durata:result.durata
            },
            message: 'Film registrato',
            request: {
                type: 'GET',
                url: 'http://localhost:3000/films/' + result.titolo
            }
        });
    })
    .catch(err => {
        console.log(err)
        res.status(500).json({
            error: 'Operazione fallita'
        });
    }); 
});

// gestore richieste DELETE
router.delete('/:filmId', /*checkAuth, */(req, res, next) => {
    const id = req.params.filmId;
    Film
    .findById(id)
    .exec()
    .then(result => {
        if (result == null){
            console.log("Film non trovato");
            res.status(404).json({
                error: 'Film non trovato'
            });
        }
        else {
            Film
            .deleteOne({_id : id})
            .exec()
            .then(result => {
                console.log(result);
                res.status(200).json({
                    message: 'Film cancellato'
                });
            })
        }
    })
    .catch(err => {
        console.log(err);
        res.status(500).json({
            error : 'Errore nella cancellazione del film'
        });
    });
});

// gestore richieste PATCH
router.patch('/:filmId', /*checkAuth,*/ (req, res, next) => {
    const id = req.params.filmId;
    Film
    .findById(id)
    .exec()
    .then(result => {
        if (result == null){
            console.log("Film non trovato");
            res.status(404).json({
                error: 'Film non trovato'
            });
        }
        else {
            console.log(result);
            const updateOps = {};
            for(const ops of req.body) {
                updateOps[ops.propName] = ops.value;
            }
            Film
            .updateOne({_id : id}, {$set: updateOps})
            .exec()
            .then(result => {
                console.log(result);
                res.status(200).json({
                    message: 'Film modificato correttamente'
                })
            })    
        }
        
    })
    .catch(err => {
        console.log(err);
        res.status(500).json({
            error: 'Errore nella modifica del film'
        });
    });
    
    
});

module.exports = router;
