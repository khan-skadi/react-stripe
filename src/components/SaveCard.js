import React from 'react';
import { CardElement } from '@stripe/react-stripe-js';
import './SaveCard.css';

const CARD_ELEMENT_OPTIONS = {
  style: {
    base: {
      color: '#32325d',
      fontFamily: '"Helvetica Neue", Helvetica, sans-serif',
      fontSmoothing: 'antialiased',
      fontSize: '16px',
      '::placeholder': {
        color: '#aab7c4'
      }
    },
    invalid: {
      color: '#fa755a',
      iconColor: '#fa755a'
    }
  }
};

const SaveCard = () => {
  return (
    <div className="wrapper">
      <h1>Save Card Details</h1>
      <div className="card--wrapper">
        <CardElement options={CARD_ELEMENT_OPTIONS} />
      </div>
    </div>
  );
};

export default SaveCard;
