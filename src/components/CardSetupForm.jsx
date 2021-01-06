import React, { useState, useEffect } from 'react';
import { useStripe, useElements, CardElement } from '@stripe/react-stripe-js';
import axios from 'axios';
import SaveCard from './SaveCard';
import './CardSetupForm.css';

export default function CardSetupForm() {
  const stripe = useStripe();
  const elements = useElements();
  const [fetchedSecret, setFetchedSecret] = useState('');
  const [customerId, setCustomerId] = useState('');

  useEffect(() => {
    const fetchData = async () => {
      const secret = await fetchSetupIntent();
      setFetchedSecret(secret);
    };
    fetchData();
  }, []);

  const fetchSetupIntent = async () => {
    const {
      data: {
        data: { client_secret, customerId }
      }
    } = await axios.get(
      'http://localhost:3001/api/payments/create-setup-intent'
    );
    setCustomerId(customerId);
    return client_secret;
  };

  const handleSubmit = async (event) => {
    event.preventDefault();

    if (!stripe || !elements) {
      return;
    }

    const result = await stripe.confirmCardSetup(fetchedSecret, {
      payment_method: {
        card: elements.getElement(CardElement),
        billing_details: {
          name: 'Jenny Rosen' // add billing details for the client.
        }
      }
    });

    if (result.error) {
      console.log('error: ', result.error);
    } else {
      await axios.post('http://localhost:3001/api/payments/charge-card', {
        setupIntent: result.setupIntent,
        customerId: customerId,
        amount: 50
      });
    }
  };

  return (
    <form onSubmit={handleSubmit} className="form--wrapper">
      <SaveCard />
      <button className="charge--button" disabled={!stripe}>
        Charge Card
      </button>
    </form>
  );
}
