const express = require('express');
const router = express.Router();
const knex = require('../database');

//  Get Endpoint

//      temp comment out to check the next knex

router.get('/', async (req, res) => {
  try {
    const reviews = await knex('Review').select('*');
    res.json(reviews);
  } catch (error) {
    throw error;
  }
});


//          test knex

// router.get('/', async (req, res) => {
//     try {
//         //       knex.raw('?-? as ?',['max_reservations','number_of_guests','Available_reservation']))
// //                  'R.number_of_guests','Meal.id'
//         const nextJoin = await knex
//         .select(knex.raw('?,? as ?',['R.number_of_guests','Meal.id','Available_reservation']))
//         .from('Meal')
//         .join('Reservation as R','Meal.id','R.meal_id');
//         //.whereRaw('R.number_of_guests-Meal.id > 0');
//               res.json(nextJoin);
//     } catch (error) {
//       throw error;
//     }
//   });
  
//sample join to check

// 	Returns Review by id
router.get('/:id', async (req, res) => {
  try {
    if (req.params.id) {
      const id = parseInt(req.params.id);
      if (!isNaN(id)) {
        const reviewsById = await knex('Review').where('id', id);
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

//  update created_date by id not works   also in post part


router.put('/:id', async (req, res) => {
  try {
    if (req.params.id) {
      const id = parseInt(req.params.id);
      if (!isNaN(id)) {
        //   if (req.body.created_date){
        //       console.log(Date.parse(req.body.created_date));
        //       req.body.created_date=Date.parse(req.body.created_date)
        //   }
        const updatedReview = await knex('Review')
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
        const checkIdExist = await knex('Review')
          .select('')
          .where('id', '=', id);
        if (checkIdExist.length != 0) {
          await knex('Review').where('id', '=', id).del();
          const ReviewsAfterDel = await knex('Review');
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

//  inset created_date by id not works  


// Insert a new review thought BODY X-WWW-form-urlencoded
router.post('/', async (req, res) => {
  try {
      if(!req.body.created_date){
    req.body.created_date = new Date();}
    const newReview = await knex('Review').insert(req.body);
    res.json(newReview);
  } catch (error) {
    throw error;
  }
});

module.exports = router;
