import React, { useState, useEffect } from 'react';
export function Meals() {
  const [meals, setMeals] = useState([]);
  const [errorMessage,setErrorMessage] = useState('')

   useEffect(() => {
    (async () => {
      try {
        //   http
        const result = await fetch(`api/meals`);
        if (result.status !== 200) {
          console.log(result.status);
          throw new Error('fail to connect to the Api');
        }
        const mealsList = await result.json();
        setMeals(prev =>
          mealsList.map(meal => ({
            title: meal.title,
            description: meal.description,
            id: meal.id,
          }))
        );      } catch (error) {
        setErrorMessage(prev => error.message);
      }
    })();
  },[]);
  const meals1 = meals.map((item, index) => (
    <div key={index}>
      {item.title.toUpperCase()} : {item.description} , id : {item.id}
      <hr />
      </div>

));
  return (
    <>
      <h2>This is meals list</h2>
      <div>{meals1}</div>
    </>
  );
}
