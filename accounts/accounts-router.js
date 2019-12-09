const express = require('express');

const knex = require('../data/dbConfig');

const router = express.Router();

router.get('/', (req, res) => {
    knex.select('*').from('accounts')
    .then(accounts => {
        res.status(200)
            .json(accounts)
    })
    .catch(err => {
        console.log(err)
        res.status(500)
            .json({ message: 'Error getting the accounts' })
    })
});

router.get('/:id', (req, res) => {
    knex.select('*')
    .from('accounts')
    .where({ id: req.params.id })
    .first()
    .then(post => {
        res.status(200)
            .json(post)
    })
    .catch(err => {
        console.log(err)
        res.status(500)
            .json({ message: 'Error getting the account' })
    })
});

router.post('/', (req, res) => {
    const accountData = req.body

    knex('accounts')
    .insert(accountData, 'id')
    .then(ids => {
        const id = ids[0]

        return knex('accounts')
            .select('id', 'name', 'budget')
            .where({ id })
            .first()
            .then(account => {
                res.status(201)
                    .json(account)
        })
    })
    .catch(err => {
        console.log(err)
        res.status(500)
            .json({ message: 'Error adding the accounts' })
    })
});

router.put('/:id', (req, res) => {
    const { id } = req.params
    const changes = req.body

    knex('accounts')
        .where({ id })
        .update(changes)
        .then(count => {
            if (count > 0) {
                res.status(200)
                    .json({ message: `${count} record(s) updated` })
            } else {
                res.status(404)
                    .json({ message: 'Post not found' })
            }
        })
        .catch(err => {
            console.log(err)
            res.status(500)
                .json({ message: 'Error updating the accounts' })
        })
});

router.delete('/:id', (req, res) => {
    knex('accounts')
        .where({ id: req.params.id })
        .del()
        .then(count => {
            res.status(200)
                .json({ message: `${count} record(s) removed` })
        })
        .catch(err => {
            console.log(err)
            res.status(500)
                .json({ message: 'Error deleting the accounts' })
        })
});

module.exports = router;