const express = require('express');
const router = express.Router();
const knex = require('../database');

//  Get Endpoint

router.get('/', async (req, res) => {
  try {
    const reservations = await knex('Reservation').select('*');
    res.json(reservations);
  } catch (error) {
    throw error;
  }
});

// 	Returns a reservation by id

router.get('/:id', async (req, res) => {
  try {
    if (req.params.id) {
      const id = parseInt(req.params.id);
      if (!isNaN(id)) {
        const reservationsById = await knex('Reservation').where('id', id);
        res.json(reservationsById);
      } else {
        res.status(400).send('id is not integer');
      }
    }
  } catch (error) {
    throw error;
  }
});

// Put Endpoint
// Updates the reservation by id
//  update created_date by id not works   also in post part


router.put('/:id', async (req, res) => {
  try {
    if (req.params.id) {
      const id = parseInt(req.params.id);
      if (!isNaN(id)) {
        const updatedReservation = await knex('Reservation')
          .where('id', '=', id)
          .update(req.body);
        res.json(updatedReservation);
      } else {
        res.status(400).send('id is not integer');
      }
    }
  } catch (error) {
    throw error;
  }
});

// Delete Endpoint
// Delete a reservation by id
router.delete('/:id', async (req, res) => {
  try {
    if (req.params.id) {
      const id = parseInt(req.params.id);
      if (!isNaN(id)) {
        const checkIdExist = await knex('Reservation').select('').where('id', '=', id);
        if (checkIdExist.length != 0) {
          await knex('Reservation').where('id', '=', id).del();
          const ReservationsAfterDel = await knex('Reservation');
          res.json(ReservationsAfterDel);
        } else {
          res.status(400).send('id is not exist in Database');
        }
      } else {
        res.status(400).send('id is not integer');
      }
    }
  } catch (error) {
    throw error;
  }
});

// Post Endpoint
// Insert a new Reservation thought BODY X-WWW-form-urlencoded


//  inset created_date by id not works  

router.post('/', async (req, res) => {
  try {
    req.body.created_date = new Date();
    const newReservation = await knex('Reservation').insert(req.body);
    res.json(newReservation);
  } catch (error) {
    throw error;
  }
});

module.exports = router;
