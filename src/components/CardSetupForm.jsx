import React, { useState, useEffect } from 'react';
import { useStripe, useElements, CardElement } from '@stripe/react-stripe-js';
import axios from 'axios';
import SaveCard from './SaveCard';
import './CardSetupForm.css';
import Login from './Auth/Login';
import UploadImage from './UploadImage';

export const url =
  'http://localhost:5001/justdelvr-mobile-application-1/us-central1/api';

export default function CardSetupForm() {
  const stripe = useStripe();
  const elements = useElements();
  const [fetchedSecret, setFetchedSecret] = useState('');
  const [customerId, setCustomerId] = useState('');
  const [paymentIntent, setPaymentIntent] = useState(null); //eslint-disable-line
  const [account, setAccount] = useState(null);
  const [verificationLink, setVerificationLink] = useState(null);
  const [paymentIntentId, setPaymentIntentId] = useState('');
  const [currentUser, setCurrentUser] = useState(null);
  const [authenticated, setAuthenticated] = useState(false);
  const [docRef, setDocRef] = useState(null);
  const [uploadedImage, setUploadedImage] = useState('');

  useEffect(() => {
    const fetchData = async () => {
      const secret = await fetchSetupIntent();
      setFetchedSecret(secret);
    };
    if (authenticated) fetchData();
  }, [authenticated]);

  useEffect(() => {
    if (authenticated) {
      axios
        .get(`${url}/auth`)
        .then(
          ({
            data: {
              data: { credentials }
            }
          }) => {
            setCurrentUser(credentials);
          }
        )
        .catch((err) => console.log(err));
    }
  }, [authenticated]);
  console.log('currentUser: ', currentUser);

  const fetchSetupIntent = async () => {
    const {
      data: {
        data: { client_secret, customerId }
      }
    } = await axios.get(`${url}/payments/create-setup-intent`);
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
        receiptEmail: account.email,
        userId: currentUser.uid
      };

      const {
        data: { data }
      } = await axios.post(`${url}/payments/create-payment-intent`, {
        ...paymentIntentRequest
      });
      console.log('CREATE PAYMENT AND HOLD FUNDS: ', data);

      setPaymentIntent(data.paymentIntent);
      setPaymentIntentId(data.returnData.id);
    }
  };

  const handleCapturePayment = async () => {
    const {
      data: { data }
    } = await axios.post(`${url}/payments/capture-payment`, {
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
    } = await axios.post(`${url}/payments/create-individual-account`, {
      email: individualAccountParams.email,
      individual: individualAccountParams
    });
    setAccount(data.account);
  };

  const handleCreateAccountLinks = async () => {
    const {
      data: { data }
    } = await axios.get(`${url}/payments/create-account-links`, {
      params: {
        accountId: account.id
      }
    });
    setVerificationLink(data.accountLinks.url);

    // if (data.accountLinks.url !== '')
    //   window.location.href = data.accountLinks.url;
  };

  const handleRetrieveAccount = async () => {
    const {
      data: { data }
    } = await axios.get(`${url}/payments/retrieve-account`, {
      params: {
        accountId: 'acct_1I5wcCR5SnTQ4Q7i'
      }
    });
    setAccount(data);
  };

  const handleOrderSubmit = async (e) => {
    e.preventDefault();
    const payload = {
      items: [
        {
          description: 'item description',
          image: uploadedImage,
          size: 'Medium'
        }
      ],
      imagesList: [uploadedImage],
      userName: 'Hans Landa SS',
      contactNumber: '+38972544622',
      describe: 'Beautiful description',
      collectionAddress: '5 Ginesi Ct, Edison, NJ, USA',
      deliveryAddress: '123 Main St, Edison, NJ, USA',
      transportMode: 1,
      orderType: 1,
      firstName: 'hans',
      lastName: 'landa',
      docId: docRef
    };

    const data = await axios.post(`${url}/quote/create`, payload);
    console.log('submit order res: ', data);
  };

  console.log('docRef: ', docRef);
  console.log('uploadedImage: ', uploadedImage);
  return (
    <div className="row">
      <div className="col-6">
        <div
          style={{
            display: 'flex',
            justifyContent: 'center',
            alignItems: 'center',
            flexWrap: 'wrap',
            flexDirection: 'column'
          }}
        >
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
              Create payment intent and hold funds
            </button>
          </form>

          <button
            onClick={handleCapturePayment}
            className="capture--button"
            disabled={!stripe}
          >
            Capture Payment
          </button>
        </div>
      </div>
      <div className="col-6">
        <Login
          authenticated={authenticated}
          setAuthenticated={setAuthenticated}
        />
      </div>
      <div className="col-12">
        <button
          onClick={handleOrderSubmit}
          className="btn btn-secondary btn-lg"
          type="submit"
        >
          Submit Form
        </button>
        <UploadImage
          setDocRef={setDocRef}
          setUploadedImage={setUploadedImage}
        />
      </div>
    </div>
  );
}
