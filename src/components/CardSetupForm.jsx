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
  const [paymentIntent, setPaymentIntent] = useState(null);
  const [account, setAccount] = useState(null);
  const [verificationLink, setVerificationLink] = useState(null);
  const [paymentIntentId, setPaymentIntentId] = useState('');

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
    setCustomerId(customerId); // user's customer id

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

    console.log('result: ', result);
    if (result.error) {
      console.log('error: ', result.error);
    } else {
      const paymentIntentRequest = {
        customerId: customerId,
        amount: 50,
        couponValue: 10,
        couponIsPercentage: true,
        receiptEmail: account.email
      };

      const {
        data: { data }
      } = await axios.post(
        'http://localhost:3001/api/payments/create-payment-intent',
        {
          ...paymentIntentRequest
        }
      );
      console.log('CREATE PAYMENT AND HOLD FUNDS: ', data);
      setPaymentIntent(data.paymentIntent);
      setPaymentIntentId(data.returnData.id);
    }
  };

  const handleCapturePayment = async () => {
    console.log('connectedAccountId: ', account.id);
    console.log('paymentIntentId: ', paymentIntentId);
    const {
      data: { data }
    } = await axios.post('http://localhost:3001/api/payments/capture-payment', {
      connectedAccountId: account.id,
      paymentIntentId: paymentIntentId,
      amount: 60
    });

    console.log('handleCapturePayment: ', data);
  };

  const handleCreateIndividualAccount = async () => {
    // take the params from the user
    const individualAccountParams = {
      first_name: 'Hans',
      last_name: 'Landa',
      address: {
        line1: '8mi Septemvri br.26',
        line2: '',
        city: 'Radovis',
        postal_code: '2420',
        country: 'GB'
      },
      dob: {
        day: 5,
        month: 3,
        year: 1993
      },
      email: 'hans@landa.ss',
      phone: '+38972544622'
    };

    const {
      data: { data }
    } = await axios.post(
      'http://localhost:3001/api/payments/create-individual-account',
      {
        email: individualAccountParams.email,
        individual: individualAccountParams
      }
    );
    setAccount(data.account);
  };

  const handleCreateAccountLinks = async () => {
    const {
      data: { data }
    } = await axios.get(
      'http://localhost:3001/api/payments/create-account-links',
      {
        params: {
          accountId: account.id
        }
      }
    );
    setVerificationLink(data.accountLinks.url);
    // if (data.verificationLink.url !== '') window.location.href = data.verificationLink.url;
  };

  const handleRetrieveAccount = async () => {
    const {
      data: { data }
    } = await axios.get('http://localhost:3001/api/payments/retrieve-account', {
      params: {
        accountId: account.id
      }
    });
    setAccount(data);
  };

  console.log('Account: ', account);
  console.log('Links: ', verificationLink);
  return (
    <>
      <button
        onClick={handleCreateIndividualAccount}
        className="connect--button"
        disabled={!stripe}
      >
        Create Individual Account
      </button>
      <button
        onClick={handleCreateAccountLinks}
        className="connect--button"
        disabled={!stripe}
      >
        Create Account Links
      </button>
      <button
        onClick={handleRetrieveAccount}
        className="connect--button"
        disabled={!stripe}
      >
        Retrieve Account
      </button>

      <form onSubmit={handleSubmit} className="form--wrapper">
        <SaveCard />

        <button type="submit" className="charge--button" disabled={!stripe}>
          II - Create payment intent and hold funds
        </button>
      </form>

      <button
        onClick={handleCapturePayment}
        className="capture--button"
        disabled={!stripe}
      >
        Capture Payment
      </button>
    </>
  );
}
