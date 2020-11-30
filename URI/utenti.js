const express = require('express');
const router = express.Router();
const mongoose = require('mongoose');
const bcrypt = require('bcrypt');
const jwt = require('jsonwebtoken');
const checkAuth = require('../MIDDLEWARE/check-auth');

const Utente = require('../MODELS/utente.js');

// gestore richieste POST (SIGN UP)
router.post('/signup', (req, res, next) => {
    Utente
    .find({ email: req.body.email })
    .exec()
    .then(user => {
        if (req.body.password == null) {
            return res.status(400).json({
                error: 'Password obbligatoria'
            });
        }
        if (!(/^[a-zA-Z0-9.!#$%&'*+/=?^_`{|}~-]+@[a-zA-Z0-9-]+(?:\.[a-zA-Z0-9-]+)*$/.test(req.body.email))) {
            return res.status(400).json({
                error: 'L\'email inserita non è valida'
            });
        }
        if (user.length >= 1) {
            return res.status(409).json({
                error: 'L\'Email appartiene già ad un altro account'
            });
        } 
        else {
            if (req.body.email)
            bcrypt.hash(req.body.password, 10, (err, hash) => {
                if (err) {
                    return res.status(500).json({
                        error: 'Criptazione della password fallita'
                    });
                } 
                else { 
                    const user = new Utente({
                        _id: new mongoose.Types.ObjectId(),
                        username: req.body.username,
                        email: req.body.email,
                        password: hash
                    })
                    user
                    .save()
                    .then(result => {
                        res.status(201).json({
                            message: 'Utente creato'
                        });
                    })
                    .catch(err => {
                        res.status(500).json({
                            error: 'Errore nella creazione dell\'utente'
                        });
                    });
                }
            })
        }
    })
}); 

// gestore richieste POST (LOGIN)
router.post('/login', (req, res, next) => {
    Utente
    .find({ email: req.body.email })
    .exec()
    .then(utente => {
        if (utente.length < 1) {
            return res.status(401).json({
                error: 'Autorizzazione fallita, email o password errati'
            });
        }
        bcrypt.compare(req.body.password, utente[0].password, (err, result) => {
            if (err) {
                return res.status(401).json({
                    error: 'Autorizzazione fallita, email o password errati'
                });
            }
            if (result) {
                const token = jwt.sign(
                    {
                        email: utente[0].email,
                        utenteId: utente[0]._id,
                        username: utente[0].username
                    }, 
                    "" + process.env.JWT_KEY,
                    {
                        expiresIn: "1h"
                    }
                );
                return res.status(200).json({
                    message: 'Autorizzazione avvenuta con successo',
                    token: token,
                    email: utente[0].email,
                    _id: utente[0]._id,
                    username: utente[0].username
                });
            }
            return res.status(401).json({
                error: 'Autorizzazione fallita, email o password errati'
            });
        });
    })
    .catch(err => {
        res.status(500).json({
            error: 'Errore nel login'
        });
    });
});

//gestore richieste DELETE
router.delete('/:utenteId', (req, res, next) => {
    const id = req.params.utenteId;
    Utente
    .findById(id)
    .exec()
    .then(result => {
        if (result == null){
            res.status(404).json({
                error: 'Utente non trovato'
            });
        }
        else {
            Utente
            .deleteOne({_id : id})
            .exec()
            .then(result => {
                res.status(200).json({
                    message: 'Utente cancellato'
                });
            })
        }
    })
    .catch(err => {
        res.status(500).json({
            error: 'Errore nella cancellazione utente'
        });
    });
});

router.get('/', (req, res, next) => {
    Utente
    .find()
    .select('_id username email password')
    .exec()
    .then(result => {
        res.status(200).json({
            count: result.length,
            utenti: result.map(doc => {
                return {
                    _id: doc._id,
                    username: doc.username,
                    email: doc.email,
                    password: doc.password,
                    self: '/utenti/' + doc._id,
                    request: {
                        type: 'GET',
                        url: '../utenti/' + doc._id
                    }
                }
            })    
        });
    })
    .catch(err => {
        res.status(500).json({
            error: 'Operazione fallita'
        });
    });
});

// gestore richieste GET specifiche
router.get('/:utenteProp', (req, res, next) => {
    const prop = req.params.utenteProp;
    Utente
    .findById(prop)
    .select('_id username email password')
    .exec()
    .then(result => {
        if (result.length != 0) {
            res.status(200).json({
                message: 'Utente trovato',
                utente: result,
                self: '/utenti/' + result._id,
                url: '../recensioni/' + result._id
            });
        }
    })
    .catch(err => {
        Utente
        .find({email : prop})
        .select('_id username email password')
        .exec()
        .then(result => {
            if (result.length == 0){
                res.status(404).json({
                    error: 'Utente non trovato'
                });
            }
            else {
                res.status(200).json({
                    message: 'Utente trovato',
                    utente: result,
                    self: '/utenti/' + result._id,
                    url: '../recensioni/' + result._id
                });
            }
        })
        .catch(err => {
            res.status(500).json({
                error: 'Operazione fallita'
            })
        })
    });
});

module.exports = router;