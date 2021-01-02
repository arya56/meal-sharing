import React from 'react';
import { BrowserRouter as Router, Route, Switch } from 'react-router-dom';
import TestComponent from './components/TestComponent/TestComponent';
import { CreateMeal } from './components/TestComponent/createMeal';
import { Meals } from './components/TestComponent/meals';
import { Home } from './components/TestComponent/home';
import { MealById } from './components/TestComponent/mealbyid';
import Header from './components/TestComponent/header';
import Footer from './components/TestComponent/footer';

function App() {
  return (
    <div>
      <Header />
      <Router>
        <Route exact path="/">
          <h1>Meal application</h1>
          <Home></Home>
        </Route>
       
        <Route exact path="/lol">
          <p>lol</p>
        </Route>
        <Route exact path="/meal">
          <CreateMeal></CreateMeal>
        </Route>
        <Route exact path="/test-component">
          <TestComponent></TestComponent>
        </Route>
      </Router>
       <Route exact path="/meals">
          <h1>Meals</h1>
          <Meals></Meals>
          {/* <CreateMeal></CreateMeal> */}
         </Route>  
        <Route exact path="/meals/:id">
          <h1>Meal application</h1>
          <MealById></MealById>
        </Route>
        
      <Footer />
    </div>
  );
}

export default App;
