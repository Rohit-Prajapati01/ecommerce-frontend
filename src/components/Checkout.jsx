import React from 'react'
import { CheckoutForm } from './CheckoutForm'
import Layout from './common/Layout'
import { loadStripe } from '@stripe/stripe-js';
import { Elements } from '@stripe/react-stripe-js';
import { STRIPE_PUBLIC_KEY } from './common/Http'
const stripePromise = loadStripe(STRIPE_PUBLIC_KEY);


const Checkout = () => {
    return (
        <Elements stripe={stripePromise}>
            <CheckoutForm />
        </Elements>
    )
}

export default Checkout