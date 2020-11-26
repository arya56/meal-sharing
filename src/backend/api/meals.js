const express = require('express');
const router = express.Router();
const knex = require('../database');

// ////////////////      availableReservations     Endpoints
router.get('/', async (req, res) => {
  try {
    if (req.query.availableReservations) {
      ///        this is the subquery
      const nextQuery = await knex
          .select('meal_id')
          .sum({ number_of_guests: 'number_of_guests' })
          .from('Reservation')
          .groupBy('meal_id') ;

      const Myknex = await knex
         .select ('title',
            knex.raw('? - ? as ?', [
              'max_reservations',
              'number_of_guests',
              'Available_reservation',
            ]),
                //{Available_reservation: 'max_reservations' - 'number_of_guest'}) 
         )


        .from ('Meal')
        .join(nextQuery, 'Meal.id', 'meal_id')
        res.json(Myknex);


       

        //   const nextQuery = await knex
        //   .select(
        //     'title'
        //     // ,
        //     // knex.raw('? - ? as ?', [
        //     //   'max_reservations',
        //     //   'number_of_guests',
        //     //   'Available_reservation',
        //     // ])
        //   )
        //   .from('Meal')
        //   .join(Myknex, 'Meal.id', 'meal_id')
        //   ///   here added to test
        //   .where('Meal.id','>','1')
        //   //    here is the original
        //   // .whereRaw('max_reservations - number_of_guests  > 0');
        // res.json(nextQuery);
      }
    } catch (error) {
      throw error;
    }
  });
      //console.log(Myknex);

      // Here is where I want to use the guestNumber query

//     select title,max_reservations- number_of_guest AS Available_reservation
//    from Meal
//    join (
//      select sum(number_of_guests) AS number_of_guest,meal_id
//    from Reservation
//       group by meal_id
//            ) AS guestNumber ON id = guestNumber.meal_id
//     WHERE (max_reservations- number_of_guest ) > 0;
  //  Error: select `title`, 'max_reservations' - 'number_of_guests' as 'Available_reservation' 
  //     from `Meal` inner join 1 as `meal_id`, `2` as `number_of_guests` as `0`, 2 as `meal_id`, `6`
  //     as `number_of_guests` as `1`, 3 as `meal_id`, `10` as `number_of_guests` as `2`, 4 as `meal_id`,
  //     `4` as `number_of_guests` as `3`, 5 as `meal_id`, `5` as `number_of_guests` as `4` on 
  //      `Meal`.`id` = `meal_id` 
  //     where max_reservations - number_of_guests  > 0 
  //     - You have an error in your SQL syntax; check 
  //     the manual that corresponds to your MySQL server
  //  version for the right syntax to use near 
  //  '1 as `meal_id`, `2` as `number_of_guests` as `0`, 2 as `meal_id`, `6` as `number' at line 1
     

// rest of the Get endpoint
// & all base of the query parameters on api/meals
//****************************************************** */
// router.get('/', async (req, res) => {
//   try {
//     if (req.query.maxPrice) {
//       const maxPrice = parseInt(req.query.maxPrice);
//       console.log(maxPrice);
//       if (!isNaN(maxPrice)) {
//         const cheapMeals = await knex('Meal').where('price', '<', maxPrice);
//         res.send(cheapMeals);
//       } else {
//         res.status(400).send('Please write a number as maxPrice');
//       } // availableReservations
//     }
//     // else if (req.query.availableReservations) {
//     //   //const availableReservation = await knex('Meal').where()
//     // } else if (!req.query.availableReservations) {
//     //   // return there is no available reservations
//     // }
//     else if (req.query.title) {
//       //  if the query includes title
//       const title = req.query.title;
//         console.log(title);
//       const mealWithTitle = await knex('Meal').where(
//         'title',
//         'like',
//         `%${title}%`
//       );
//       res.json(mealWithTitle);
//     }
//     else if (req.query.createdAfter) {
//       //  if the query includes createdAfter
//       //   to check if the format date is like 01-10-2020
//       if (/^\d\d\d\d\-\d\d\-\d\d$/.test(req.query.createdAfter)) {
//         // const createdAfter = Date.parse(req.query.createdAfter);
//          //console.log(req.query.createdAfter);
//         const mealsCreatedAfter = await knex('Meal').where(
//           'created_date',
//           '>',
//           req.query.createdAfter
//         );
//         res.json(mealsCreatedAfter);
//         //  if createdAfter is not in a right date format
//       } else {
//         res.status(400).send('date not parseable');
//       } //  if the query includes limit
//     }
//     else if (req.query.limit) {
//       let limit = parseInt(req.query.limit);
//       if (!isNaN(limit)) {
//         const mealsLimit= await knex('Meal').select('*')
//         if (limit > mealsLimit.length) {
//           limit = mealsLimit.length;
//         }
//         res.send(mealsLimit.slice(0, limit));
//       } else {
//         res.status(400).send('limit is not an integer');
//       }
//     }
//     //  if the query is not added
//     else if (Object.keys(req.query).length === 0) {
//       const meals = await knex('Meal').select('');
//       res.json(meals);

//     } else {
//       // if there the query is not added/valid
//       res.status(400).send('Please write a valid query');
//     }
//   } catch (error) {
//     throw error;
//   }
// });
//************************************************************ */

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

//  update created_date by id not works   also in post part

router.put('/:id', async (req, res) => {
  try {
    if (req.params.id) {
      const id = parseInt(req.params.id);
      if (!isNaN(id)) {
        //req.body.created_date = new Date();               here question
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
        //req.body.created_date = new Date();               here question

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

module.exports = router;

//    Get Endpoints
//    test querry   (test here)
// router.get('/', async (req, res) => {
//   try {
//                                                     // if (req.query.availableReservations) {
//                                                     //   //const mealsById =
//                                                     //   const mealsById = await knex('Reservation')
//                                                     //     .select( 'meal_id')
//                                                     //     .sum('number_of_guests')
//                                                     //     .groupBy('meal_id');
//                                                     //   res.json(mealsById);
//                                                     // }   knex({guestNumber:

//                                                     // knex('users').join('users', function () { this.as('referrer'); })
//                                                     //knex('mealsById').join('mealsById', function () {
//                                                     //this.as(referrer);});

//                                                 //  this subquery works
//                                                     // await knex('Reservation')
//                                                     //   .select('meal_id')
//                                                     //   .sum({ number_of_guests: 'number_of_guests' })
//                                                     //   .groupBy('meal_id')

//     const guestNumber =
//      await knex({guestNumber:
//        await knex
//       .select('meal_id')
//       .sum({ number_of_guests: 'number_of_guests' })
//       .from('Reservation')
//       .groupBy('meal_id')})
//       //.as('guestNumber');
//       //.as('guestNumber');

//             // Here is where I want to use the guestNumber query

//     const nextQuery = await knex.select(
//       'title',
//       knex.raw('?-? as ?',['max_reservations','number_of_guests','Available_reservation']))
//       .from('Meal')
//       .join('guestNumber','Meal.id','guestNumber.meal_id')
//       .whereRaw('max_reservations - number_of_guests  > 0');
//                                           // sample join to check
//                                             //  const nextJoin = await knex('Meal')
//                                             //  .select('R.number_of_guests','Meal.id')
//                                             //  .join('Reservation as R','Meal.id','R.meal_id');

//                                           // .join(await knex('Reservation')
//                                           // .select('meal_id')
//                                           // .sum({ number_of_guests: 'number_of_guests' })
//                                           // .groupBy('meal_id')).as('alias1').on()
//     res.json(guestNumber);
//     } catch (error) {
//       throw error;
//     }
//   });
