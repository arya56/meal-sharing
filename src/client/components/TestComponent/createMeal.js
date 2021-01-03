import React,{useState} from 'react';

export function CreateMeal(){

const[title,setTitle] = useState('');

const onSubmit =()=>{
    (async () => {
        await fetch('api/meals',{
            method: 'POST',
            headers: { "Content-Type": "application/json" },
            body: JSON.stringify({
                title: title
            })
        })
    })()
}
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

   return(
       <>
        <input type="text" value={title} onChange={(e)=>setTitle(e.target.value)}/>
        <button onClick={onSubmit}>submit</button>
       </>
   )
}