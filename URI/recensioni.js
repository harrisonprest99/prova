const express = require('express');
const router = express.Router();
const mongoose = require('mongoose');

const Recensione = require('../MODELS/recensione.js');
const Film = require('../MODELS/film');
const Utente = require('../MODELS/utente');
const checkAuth = require('../MIDDLEWARE/check-auth');

// gestore richieste GET
router.get('/', (req, res, next) => {
    Recensione
    .find()
    .select('_id utente film titolo valutazione commento')
    .populate('utente', 'username email')
    .populate('film', 'titolo descrizione anno durata')
    .exec()
    .then(result => {
        console.log(result);
        res.status(200).json({
            count: result.length,
            recensioni: result.map(doc => {
                return {
                    _id: doc._id,
                    utente: doc.utente,
                    film: doc.film,
                    titolo: doc.titolo,
                    valutazione: doc.valutazione,
                    commento: doc.commento,
                    request: {
                        type: 'GET',
                        url: '../recensioni/' + doc._id
                    }
                }
            })
            
        });
    })
    .catch(err => {
        console.log(err);
        res.status(500).json({
            error : 'Errore nella richiesta delle recensioni'
        });
    });
});

// gestore richieste GET
router.get('/:recensioneProp', (req, res, next) => {
    const prop = req.params.recensioneProp;
    Recensione
    .findById(prop)
    .select('_id utente film titolo valutazione commento')
    .populate('utente', 'username email')
    .populate('film', 'titolo descrizione anno durata')
    .exec()
    .then(result => {
        if (result.length != 0) {
            console.log(result);
            res.status(200).json({
                message : 'Recensione trovata',
                recensione : result
            });
        }
    })
    .catch(err => {
        Recensione
        .find({film : prop})
        .select('_id utente film titolo valutazione commento')
        .populate('utente', 'username email')
        .populate('film', 'titolo descrizione anno durata')
        .exec()
        .then(result => {
            if (result.length != 0){
                console.log(result);
                res.status(200).json({
                    message : "Recensione trovata",
                    recensione : result
                });
            }
            else {
                Recensione
                .find({utente : prop})
                .select('_id utente film titolo valutazione commento')
                .populate('utente', 'username email')
                .populate('film', 'titolo descrizione anno durata')
                .exec()
                .then(result => {
                    if (result.length != 0){
                        console.log(result);
                        res.status(200).json({
                            message : "Recensione trovata",
                            recensione : result
                        });
                    }
                    else {
                        console.log(result);
                        res.status(404).json({
                            message : "Recensione non trovata"
                        });
                    }
                })
            }
        })
        .catch(err => {
            console.log(err);
            res.status(500).json({
                message : 'Errore nel trovare la recensione'
            });
        });
    });
});

// gestore richieste POST
router.post('/', /*checkAuth,*/ (req, res, next) => {
    Film.findById(req.body.filmId)
    .then(film => {
        if (!film){
            console.log("Impossibile creare recensioni su film inesistente")
            res.status(404).json({
                error: 'Impossibile creare recensioni su film inesistente'
            });
        }
    })
    Utente.findById(req.body.utenteId)
    .then(utente => {
        if (!utente){
            console.log("Impossibile creare recensioni di un utente inesistente")
            res.status(404).json({
                error: 'Impossibile creare recensioni di un utente inesistente'
            });
        }
        const recensione = new Recensione({
            _id: new mongoose.Types.ObjectId(),
            utente: req.body.utenteId,
            film: req.body.filmId,
            titolo: req.body.titolo,
            valutazione: req.body.valutazione,
            commento:req.body.commento
        });
        return recensione
        .save()
    })
    
    .then(result => {
        console.log(result);
        res.status(201).json({
            recensioneRegistrata: {
                _id: result._id,
                utente: result.utente,
                film: result.film,
                titolo: result.titolo,
                valutazione: result.valutazione,
                commento: result.commento
            },
            message: 'Recensione registrata',
            request: {
                type: 'GET',
                url: '../recensioni/' + result._id
            }
        });
    })
    .catch(err => {
        console.log(err)
        res.status(400).json({
            error : "Operazione fallita"
        });
    }); 
});

// gestore richieste DELETE
router.delete('/:recensioneId', /*checkAuth,*/ (req, res, next) => {
    const id = req.params.recensioneId;
    Recensione
    .findById(id)
    .exec()
    .then(result => {
        if (result == null){
            console.log("Recensione non trovata");
            res.status(404).json({
                error : 'Recensione non trovata'
            });
        }
        else {
            Recensione
            .deleteOne({_id : id})
            .exec()
            .then(result => {
                console.log(result);
                res.status(200).json({
                    message: 'Recensione cancellata'
                });
            })
        }
    })
    .catch(err => {
        console.log(err);
        res.status(500).json({
            error : 'Errore nella cancellazione della recensione'
        });
    });
});

// gestore richieste PATCH
router.patch('/:recensioneId', checkAuth, (req, res, next) => {
    const id = req.params.recensioneId;
    Recensione
    .findById(id)
    .exec()
    .then(result => {
        if (result == null){
            console.log("Recensione non trovata");
            res.status(404).json({
                error : 'Recensione non trovata'
            });
        }
        else {
            console.log(result);
            const updateOps = {};
            for(const ops of req.body) {
                updateOps[ops.propName] = ops.value;
            }
            Recensione
            .updateOne({_id : id}, {$set: updateOps})
            .exec()
            .then(result => {
                console.log(result);
                res.status(200).json({
                    message: 'Recensione modificata correttamente'
                })
            })    
        }
        
    })
    .catch(err => {
        console.log(err);
        res.status(500).json({
            error : 'Errore nella modifica della recensione'
        });
    });
    
    
});

module.exports = router;