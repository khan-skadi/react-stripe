import React from 'react';
import { loadStripe } from '@stripe/stripe-js';
import { Elements } from '@stripe/react-stripe-js';
import CardSetupForm from './components/CardSetupForm';
import './App.css';
import 'bootstrap/dist/css/bootstrap.min.css';
import Login from './components/Auth/Login';

const stripePromise = loadStripe(
  'pk_test_51Hn4kXJbKhjF9mBLMk7eGbSMXNcxyIyEURgIDSgL3RDCkkr969Sifm8OSRzNnwsXiNI5H5AYAHQNdsuxqMblrYHE00zU6eghjV'
);

const App = () => {
  return (
    <div className="container">
      <div className="row">
        <div className="col-6">
          <Elements stripe={stripePromise}>
            <CardSetupForm />
          </Elements>
        </div>
        <div className="col-6">
          <Login />
        </div>
      </div>
    </div>
  );
};

export default App;
