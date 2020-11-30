const express = require('express');
const router = express.Router();
const mongoose = require('mongoose');

const Sala = require('../MODELS/sala.js');
const checkAuth = require('../MIDDLEWARE/check-auth');

// gestore richieste GET
router.get('/', (req, res, next) => {
    Sala
    .find()
    .select('_id nome posti_tot')
    .exec()
    .then(result => {
        res.status(200).json({
            count: result.length,
            sale: result.map(doc => {
                return {
                    _id: doc._id,
                    nome: doc.nome,
                    posti_tot: doc.posti_tot,
                    request: {
                        type: 'GET',
                        url: '../sale/' + doc._id
                    }
                }
            })       
        });
    })
    .catch(err => {
        res.status(500).json({
            error: 'Errore nella richiesta delle sale'
        });
    });
});

// gestore richieste GET
router.get('/:salaProp', (req, res, next) => {
    const prop = req.params.salaProp;
    Sala
    .findById(prop)
    .select('_id nome posti_tot')
    .exec()
    .then(result => {
        if (result.length != 0) {
            res.status(200).json({
                sala: result
            });
        }
    })
    .catch(err => {
        Sala
        .find({nome : prop})
        .select('_id nome posti_tot')
        .exec()
        .then(result => {
            if (result.length == 0){
                res.status(404).json({
                    error: 'Sala non trovata'
                });
            }
            else {
                res.status(200).json({
                    sala: result
                });
            }
        })
        .catch(err => {
            res.status(500).json({
                error: 'Errore nel trovare la sala'
            });
        })
    });
});

// gestore richieste POST
router.post('/', /*checkAuth,*/ (req, res, next) => {
    const sala = new Sala({
        _id: new mongoose.Types.ObjectId(),
        nome: req.body.nome,
        posti_tot: req.body.posti_tot
    });
    sala
    .save()
    .then(result => {
        res.status(201).json({
            salaRegistrata: {
                _id: result._id,
                nome: result.nome,
                posti_tot: result.posti_tot
            },
            message: 'Sala registrata',
            request: {
                type: 'GET',
                url: '../sale/' + result._id
            }
        });
    })
    .catch(err => {
        res.status(500).json({
            error: 'Operazione fallita'
        });
    }); 
});

// gestore richieste DELETE
router.delete('/:salaId', /*checkAuth,*/ (req, res, next) => {
    const id = req.params.salaId;
    Sala
    .findById(id)
    .exec()
    .then(result => {
        if (result == null){
            res.status(404).json({
                error: 'Sala non trovata'
            });
        }
        else {
            Sala
            .deleteOne({_id : id})
            .exec()
            .then(result => {
                res.status(200).json({
                    message: 'Sala cancellata'
                });
            })
        }
    })
    .catch(err => {
        res.status(500).json({
            error: 'Errore nella cancellazione della sala'
        });
    });
});

// gestore richieste PATCH
router.patch('/:salaId', /*checkAuth,*/ (req, res, next) => {
    const id = req.params.salaId;
    Sala
    .findById(id)
    .exec()
    .then(result => {
        if (result == null){
            res.status(404).json({
                error: 'Sala non trovata'
            });
        }
        else {
            const updateOps = {};
            for(const ops of req.body) {
                updateOps[ops.propName] = ops.value;
            }
            Sala
            .updateOne({_id : id}, {$set: updateOps})
            .exec()
            .then(result => {
                res.status(200).json({
                    message: 'Sala modificata correttamente'
                })
            })    
        }
        
    })
    .catch(err => {
        res.status(500).json({
            error: 'Errore nella modifica della sala'
        });
    });
    
    
});

module.exports = router;
