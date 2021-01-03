import React, { useState, useEffect } from 'react';

export function Home() {
  const [meals, setMeals] = useState([]);

  useEffect(() => {
    (async () => {
      try {
        const result = await fetch(`api/meals`);
        console.log('yes');
        if (result.status !== 200) {
          console.log(result.status);
          throw new Error('fail to connect api for ripos');
        }
        const mealsList = await result.json();
        setMeals(prev =>
          mealsList.map(meal => ({
            title: meal.title,
            description: meal.description,
            id: meal.id,
          }))
        );
        console.log(meals);
      } catch (error) {
        setErrorMessage(prev => error.message);
      }
    })();
  }, []);


  const meals1 = meals.map((item, index) => (
    <div key={index}>
      {item.title.toUpperCase()} : {item.description} , id :{' '}
      <a href={'api/meals/'+item.id}
      >{item.id}</a>
      <hr />
    </div>
  ));
  console.log(meals1);
  return (
    <div>
      <h2>Bon appetit</h2>
      <div>{meals1}</div>
    </div>
  );
}
