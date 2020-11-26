const express = require('express');
const router = express.Router();
const mongoose = require('mongoose');
const bcrypt = require('bcrypt');
const jwt = require('jsonwebtoken');
const checkAuth = require('../MIDDLEWARE/check-auth');

const Utente = require('../MODELS/utente.js');

// handle POST requests (SIGN UP)
router.post('/signup', (req, res, next) => {
    // check if the mail already exists in the database
    Utente
    .find({ email: req.body.email })
    .exec()
    .then(user => {
        if (user.length >= 1) {
            return res.status(409).json({
                message: 'Email appartiene già ad un altro account'
            });
        } else {
            // password encryption
            bcrypt.hash(req.body.password, 10, (err, hash) => {
                if (err) {
                    return res.status(500).json({
                        error: err,
                        message: 'Password encryption failed'
                    });
                } else { // if encryption is succesful, save the hash as the password
                    const user = new Utente({
                        _id: new mongoose.Types.ObjectId(),
                        username: req.body.username,
                        email: req.body.email,
                        password: hash
                    })
                    user
                    .save()
                    .then(result => {
                        console.log(result);
                        res.status(201).json({
                            message: 'Utente creato'
                        });
                    })
                    .catch(err => {
                        console.log(err);
                        res.status(500).json({
                            error : 'Errore nella creazione dell\'utente'
                        });
                    });
                }
            })
        }
    })
}); 

// handle POST requests (SIGN IN)
router.post('/login', (req, res, next) => {
    Utente
    .find({ email: req.body.email })
    .exec()
    .then(utente => {
        if (utente.length < 1) {
            return res.status(401).json({
                message: 'Auth failed, email or password is wrong'
            });
        }
        bcrypt.compare(req.body.password, utente[0].password, (err, result) => {
            if (err) {
                return res.status(401).json({
                    message: 'Auth failed, email or password is wrong'
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
                    message: 'Auth successful',
                    email: utente[0].email,
                    username: utente[0].username,
                    _id: utente[0]._id,
                    token: token
                });
            }
            return res.status(401).json({
                message: 'Auth failed, email or password is wrong'
            });
        });
    })
    .catch(err => {
        console.log(err);
        res.status(500).json({
            error : 'Errore nel login'
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
            console.log("Utente non trovato");
            res.status(404).json({
                error : 'Utente non trovato'
            });
        }
        else {
            Utente
            .deleteOne({_id : id})
            .exec()
            .then(result => {
                console.log(result);
                res.status(200).json({
                    message: 'Utente cancellato'
                });
            })
        }
    })
    .catch(err => {
        console.log(err);
        res.status(500).json({
            error : 'Errore nella cancellazione utente'
        });
    });
});

router.get('/', (req, res, next) => {
    Utente
    .find()
    .select('_id username email password')
    .exec()
    .then(result => {
        console.log(result);
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
        console.log(err);
        res.status(500).json({
            error: 'Errore nella richiesta degli utenti'
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
            console.log(result)
            res.status(200).json({
                message: 'Utente trovato',
                utente: result,
                self: '/utenti/' + doc._id,
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
                console.log(err);
                res.status(404).json({
                    error: 'Utente non trovato'
                });
            }
            else {
                console.log(result);
                res.status(200).json({
                    message: 'Utente trovato',
                    utente: result,
                    url: '../utenti/' + result._id
                });
            }
        })
    });
});
module.exports = router;