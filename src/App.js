import React from 'react';
import { loadStripe } from '@stripe/stripe-js';
import { Elements } from '@stripe/react-stripe-js';
import CardSetupForm from './components/CardSetupForm';

const stripePromise = loadStripe(
  'pk_test_51Hn4kXJbKhjF9mBLMk7eGbSMXNcxyIyEURgIDSgL3RDCkkr969Sifm8OSRzNnwsXiNI5H5AYAHQNdsuxqMblrYHE00zU6eghjV'
);

// pass client secret to client
// collect payment details on client
// submit the card details to stripe from the client

const App = () => {
  return (
    <div className="wrapper">
      <Elements stripe={stripePromise}>
        <CardSetupForm />
      </Elements>
    </div>
  );
};

export default App;
