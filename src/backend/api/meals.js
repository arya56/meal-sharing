const express = require('express');
const router = express.Router();
const knex = require('../database');
let errorTitle = '';
let q = '';
function mealsQueryBuilder(query) {
  try {
    errorTitle = '';
    if (query.hasOwnProperty('availableReservations')) {
      q = knex
        .select(
          'Meal.title',
          'Meal.id',
          // .column(knex.raw('ifnull(v1.total, 0) as upvotes, ifnull(v2.total, 0) as downvotes'));

          knex.raw('max_reservations - number_of_guest as ??', [
            'Available_reservation'
          ])
          //2  knex.raw('ifnull((max_reservations - number_of_guest),max_reservations) as ??',
          // ['Available_reservation'])
          //3   knex.raw('ifnull(??,max_reservations) as ??',
          //  ['max_reservations - number_of_guest','Available_reservation'])
        )
        .from('Meal')
        .join(
          knex('Reservation')
            .select(
              'meal_id',
              knex.raw('sum(number_of_guests) as ??', ['number_of_guest'])
            )
            .groupBy('meal_id')
            .as('guestNumber'),
          'id',
          '=',
          'guestNumber.meal_id'
        );
      // q = q.whereRaw(
      //   `max_reservations - number_of_guest ${
      //     JSON.parse(query.availableReservations) ? '>' : '<='
      //   } 0`
      // );
    }
    if (query.hasOwnProperty('maxPrice')) {
      const maxPrice = parseInt(query.maxPrice);
      if (isNaN(maxPrice)) {
        errorTitle = 'maxPrice';
      } else {
        const cheapMeals = knex('Meal').where('price', '<', maxPrice);
        q = cheapMeals;
      }
    }
    if (query.hasOwnProperty('title')) {
      const title = query.title;
      const mealWithTitle = knex('Meal').where('title', 'like', `%${title}%`);
      q = mealWithTitle;
    }
    if (query.hasOwnProperty('limit')) {
      let limit = parseInt(query.limit);
      if (isNaN(limit)) {
        errorTitle = 'limit';
      } else {
        const mealsLimit = knex('Meal').select('*');
        if (limit > mealsLimit.length) {
          limit = mealsLimit.length;
        }
        q = mealsLimit.slice(0, limit);
      }
    }
    if (query.hasOwnProperty('createdAfter')) {
      if (/^\d\d\d\d\-\d\d\-\d\d$/.test(query.createdAfter)) {
        const createdAfter = Date.parse(query.createdAfter);
        const mealsCreatedAfter = knex('Meal').where(
          'created_date',
          '>',
          query.createdAfter
        );
        q = mealsCreatedAfter;
      } else {
        errorTitle = 'createdAfter';
      }
    }
    return q;
  } catch (error) {
    throw error;
  }
}
// rest of the Get endpoint
// & all base of the query parameters on api/meals
//****************************************************** */

// router.get("/", async (request, response) => {
//   try {
//     // knex syntax for selecting things. Look up the documentation for knex for further info
//     const titles = await knex("Meal").select("title");
//     response.json(titles);
//   } catch (error) {
//     throw error;
//   }
// });

router.get('/', async (req, res) => {
  try {
    if (
      req.query.availableReservations ||
      req.query.maxPrice ||
      req.query.title ||
      req.query.limit ||
      req.query.createdAfter
    ) {
      const q1 = await mealsQueryBuilder(req.query);
      if (errorTitle === '') {
        res.json(q1);
      } else {
        res
          .status(400)
          .send(`Please write a valid number for the ${errorTitle}`);
      }
    }
    //  if the query is not added
    else if (Object.keys(req.query).length === 0) {
      const meals = await knex('Meal').select('');
      res.json(meals);
    } else {
      // if there is some undefined query
      res.status(400).send('Please write a valid query');
    }
  } catch (error) {
    throw error;
  }
});

// 	Returns a Meal by id

router.get('/:id', async (req, res) => {
  try {
    if (req.params.id) {
      const id = parseInt(req.params.id);
      if (!isNaN(id)) {
        const mealsById = await knex('Meal').where('id', id);
        res.json(mealsById);
      } else {
        res.status(400).send('id is not integer');
      }
    }
  } catch (error) {
    throw error;
  }
});

//  PUT Endpoint
//  update a meal by id

router.put('/:id', async (req, res) => {
  try {
    if (req.params.id) {
      const id = parseInt(req.params.id);
      if (!isNaN(id)) {
        const updatedMeals = await knex('Meal')
          .where('id', '=', id)
          .update(req.body);
        res.json(updatedMeals);
      } else {
        res.status(400).send('id is not integer');
      }
    }
  } catch (error) {
    throw error;
  }
});

// Delete Endpoint
// Delete a Meal by id

router.delete('/:id', async (req, res) => {
  try {
    if (req.params.id) {
      const id = parseInt(req.params.id);
      if (!isNaN(id)) {
        const checkIdExist = await knex('Meal').select('').where('id', '=', id);
        if (checkIdExist.length != 0) {
          await knex('Meal').where('id', '=', id).del();
          const mealsAfterDel = await knex('Meal');
          res.json(mealsAfterDel);
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
// Insert a new Meal thought BODY X-WWW-form-urlencoded

//  inset created_date by id not works

router.post('/', async (req, res) => {
  try {
    req.body.created_date = new Date();
    const newMeal = await knex('Meal').insert(req.body);
    res.json(newMeal);
  } catch (error) {
    throw error;
  }
});

// router.post("/", async (request, response) => {
//   try {
//     console.log(request.body);
//     const meal = await knex("Meal").insert({
//       "title":request.body.title,
//       "location": "cph",
//       "max_reservations" : 4,
//       "price": 30,
//       "description": "basjhbjh",
//       // "created_date": "2020-10-16"
//   });
//     response.json(meal)
//   } catch (error) {
//     throw error;
//   }
// });

module.exports = router;
