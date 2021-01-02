import React, { useState, useEffect } from 'react';
import { useParams } from 'react-router-dom';
export function MealById() {
  const [mealById, setMealById] = useState([]);
  const [errorMessage, setErrorMessage] = useState('');
  const [errorForMessage, setErrorForMessage] = useState('');
  const [idFound, setIdFound] = useState(false);
  const [phone, setPhone] = useState('');
  const [name, setName] = useState('');
  const [email, setEmail] = useState('');
  const [searchId, setSearchId] = useState('');
  const { id } = useParams();
  let founded = false;
  console.log('run');
  // const availableList= useRef(null)

  useEffect(() => {
    (async () => {
      try {
        const result = await fetch(
          `http://localhost:3000/api/meals?availableReservations=true`
        );
        if (result.status !== 200) {
          throw new Error('fail to connect to the Api');
        }
        const availableList = await result.json();
        console.log(' result', result);
        console.log('avail', availableList);
        setSearchId(prev => availableList.map(list => list.id));
        console.log('searchId', searchId);
        if (searchId.includes(parseInt(id))) {
          setIdFound(prev => true);
        }
      } catch (error) {
        setErrorForMessage(prev => error.message);
      }
    })();
  }, [idFound]);

  useEffect(() => {
    (async () => {
      try {
        const result = await fetch(
          `http://localhost:5000/api/meals/${parseInt(id)}`
        );
        if (result.status !== 200) {
          throw new Error('fail to connect to the Api');
        }
        const mealsList = await result.json();
        // setSearchId(prev=>availableList.map(list=>list.title))
        console.log(mealsList);
        setMealById(prev =>
          mealsList.map(meal => ({
            title: meal.title,
            description: meal.description,
            id: meal.id,
            max_reservations: meal.max_reservations,
            price: meal.price,
          }))
        );
        console.log('mealo', mealById);
      } catch (error) {
        setErrorMessage(prev => error.message);
      }
    })();
  }, []);

  console.log('idFound', idFound);
  const meal = mealById.map((item, index) => (
    <div key={index}>
      {item.title} : {item.description}
      <br />
      Price : {item.price} <br />
      Available : {item.max_reservations}
    </div>
  ));
  //   console.log('into MealById', mealById);
  //   console.log('searchId', searchId);
  //   console.log(searchId.includes(parseInt(id)));
  if (searchId.includes(parseInt(id))) {
    founded = true;
    // setIdFound(prev=>true)
  }
  return (
    <div>
      {meal}
      <br />
      <br />
      <br />
      {idFound && (
        <form>
          Reservation form
          <br />
          <label>Phone </label>
          <input type="text" value={phone} />
          <br />
          <label>Name </label>
          <input type="text" value={name} />
          <br />
          <label>Email </label>
          <input type="text" value={email} />
          <br />
          <button>Reserve</button>
        </form>
      )}
    </div>
  );
}
