const express = require('express');
const router = express.Router();
const knex = require('../database');

//  Get Endpoint

router.get('/', async (req, res) => {
  try {
    const reviews = await knex('reviews').select('*');
    res.json(reviews);
  } catch (error) {
    throw error;
  }
});

// 	Returns Review by id
router.get('/:id', async (req, res) => {
  try {
    if (req.params.id) {
      const id = parseInt(req.params.id);
      if (!isNaN(id)) {
        const reviewsById = await knex('reviews').where('id', id);
        res.json(reviewsById);
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

router.put('/:id', async (req, res) => {
  try {
    if (req.params.id) {
      const id = parseInt(req.params.id);
      if (!isNaN(id)) {
        const updatedReview = await knex('reviews')
          .where('id', '=', id)
          .update(req.body);
        res.json(updatedReview);
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
        const checkIdExist = await knex('reviews')
          .select('')
          .where('id', '=', id);
        if (checkIdExist.length != 0) {
          await knex('reviews').where('id', '=', id).del();
          const ReviewsAfterDel = await knex('reviews');
          res.json(ReviewsAfterDel);
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

// // Post Endpoint
// Insert a new review thought BODY X-WWW-form-urlencoded
router.post('/', async (req, res) => {
  try {
    if (!req.body.created_date) {
      req.body.created_date = new Date();
    }
    const newReview = await knex('reviews').insert(req.body);
    res.json(newReview);
  } catch (error) {
    throw error;
  }
});

module.exports = router;
