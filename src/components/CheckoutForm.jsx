import React, { useContext, useState } from 'react'
import { Link, useNavigate } from 'react-router-dom'
import { useForm } from 'react-hook-form'
import { apiUrl, userToken } from '../components/common/Http'
import { toast } from 'react-toastify';
import Loader from './common/Loader'
import { CartContext } from './context/Cart'
import {
    CardElement,
    useStripe,
    useElements
} from "@stripe/react-stripe-js";


export const CheckoutForm = () => {

    const [paymentMethod, setPaymentMethod] = useState('cod');
    const { cartData, subTotal, shipping, grandTotal, clearCart } = useContext(CartContext);
    const navigate = useNavigate();
    const [loader, setLoader] = useState(true);

    //stripe
    const [loading, setLoading] = useState(false);
    const stripe = useStripe();
    const elements = useElements();
    const [paymentStatus, setPaymentStatus] = useState("");

    const {
        register,
        handleSubmit,
        reset,
        formState: { errors },
    } = useForm({
        defaultValues: async () => {
            try {
                const response = await fetch(`${apiUrl}/get-account-details`, {
                    method: 'GET',
                    headers: {
                        'Content-Type': 'application/json',
                        'Authorization': `Bearer ${userToken()}`
                    }
                });

                const result = await response.json();

                if (result.status === 200) {
                    setLoader(false);
                    reset(result.data);
                }
            } catch (err) {
                console.error('Error fetching account details:', err);
            } finally {
                setLoader(false); // loader band hoga
            }
        }
    });

    // const processOrder = async (data) => {
    //     console.log(data)
    //     if (paymentMethod == 'cod') {
    //         saveOrder(data, 'not paid')
    //     } else {
    //         // Fetch the client secret from the server
    //         const response = await fetch(`${apiUrl}/create-payment-intent`, {
    //             method: "POST",
    //             headers: {
    //                 'Content-type': 'application/json',
    //                 'Accept': 'application/json',
    //                 'Authorization': `Bearer ${userToken()}`
    //             },
    //             body: JSON.stringify({ amount: grandTotal() * 100 }),
    //         });

    //         const result = await response.json();

    //         if (!result.clientSecret) {
    //             setPaymentStatus("Unable to process payment. Please try again.");
    //             setLoading(false);
    //             return;
    //         }

    //         // Ensure Stripe and Elements are loaded
    //         if (!stripe || !elements) {
    //             setPaymentStatus("Stripe is not ready. Please try again later.");
    //             setLoading(false);
    //             return;
    //         }

    //         const clientSecret = result.clientSecret;
    //         const cardElement = elements.getElement(CardElement);

    //         const paymentResult = await stripe.confirmCardPayment(clientSecret, {
    //             payment_method: {
    //                 card: cardElement,
    //                 billing_details: {
    //                     name: data.name,
    //                     email: data.email,
    //                     address: {
    //                         line1: data.address,
    //                         city: data.city,
    //                         state: data.state,
    //                         postal_code: data.zip,
    //                     },
    //                 },
    //             },
    //         });

    //         if (paymentResult.error) {
    //             setPaymentStatus(`Payment failed: ${paymentResult.error.message}`);
    //         } else if (paymentResult.paymentIntent.status === "succeeded") {
    //             saveOrder(data, 'paid');
    //             setPaymentStatus("Payment successful!");
    //         }


    //     }
    // }

    // const saveOrder = (formData, paymentStatus) => {

    //     const newFormData = {
    //         ...formData,
    //         grand_total: grandTotal(),
    //         sub_total: subTotal(),
    //         shipping: shipping(),
    //         discount: 0,
    //         payment_status: paymentStatus,
    //         status: 'pending',
    //         cart: cartData
    //     }

    //     fetch(`${apiUrl}/save-order`, {
    //         method: "POST",
    //         headers: {
    //             'Content-type': 'application/json',
    //             'Accept': 'application/json',
    //             'Authorization': `Bearer ${userToken()}`
    //         },
    //         body: JSON.stringify(newFormData)
    //     }).then(res => res.json())
    //         .then(result => {
    //             if (result.status == 200) {
    //                 clearCart();
    //                 navigate(`/order/confirmation/${result.id}`);
    //             } else {
    //                 toast.error(result.message)
    //             }
    //         })
    // }

    const processOrder = async (data) => {
        setLoading(true);
        setPaymentStatus(""); // Reset payment status message
        try {

            if (paymentMethod === 'cod') {
                await saveOrder(data, 'not paid');
                return;
            }

            const response = await fetch(`${apiUrl}/create-payment-intent`, {
                method: "POST",
                headers: {
                    'Content-Type': 'application/json',
                    'Accept': 'application/json',
                    'Authorization': `Bearer ${userToken()}`
                },
                body: JSON.stringify({
                    amount: grandTotal() * 100
                }),
            });

            const result = await response.json();

            console.log("Payment Intent:", result);

            if (!result.clientSecret) {
                toast.error("Unable to create payment intent");
                return;
            }

            if (!stripe || !elements) {
                toast.error("Stripe is not loaded");
                return;
            }

            const cardElement = elements.getElement(CardElement);

            const paymentResult = await stripe.confirmCardPayment(
                result.clientSecret,
                {
                    payment_method: {
                        card: cardElement,
                        billing_details: {
                            name: data.name,
                            email: data.email,
                            address: {
                                line1: data.address,
                                city: data.city,
                                state: data.state,
                                postal_code: data.zip,
                            },
                        },
                    },
                }
            );

            console.log("Stripe Response:", paymentResult);

            if (paymentResult.error) {
                toast.error(paymentResult.error.message);
                return;
            }

            if (paymentResult.paymentIntent.status === "succeeded") {
                toast.success("Payment Successful");
                await saveOrder(data, 'paid');
            }

        } catch (error) {
            console.log(error);
            toast.error("Something went wrong");
        }
    };

    const saveOrder = async (formData, paymentStatus) => {

        try {

            const newFormData = {
                ...formData,
                grand_total: grandTotal(),
                sub_total: subTotal(),
                shipping: shipping(),
                discount: 0,
                payment_status: paymentStatus,
                payment_method: paymentMethod,
                status: 'pending',
                cart: cartData
            };
            console.log(newFormData);

            const response = await fetch(`${apiUrl}/save-order`, {
                method: "POST",
                headers: {
                    'Content-Type': 'application/json',
                    'Accept': 'application/json',
                    'Authorization': `Bearer ${userToken()}`
                },
                body: JSON.stringify(newFormData)
            });

            const result = await response.json();

            console.log("Save Order Response:", result);

            if (result.status === 200) {
                setLoading(false); // Stop loading after the request is complete
                clearCart();

                const orderId =
                    result.id ||
                    result.order_id ||
                    result.data?.id;

                if (!orderId) {
                    toast.error("Order saved but order ID not found");
                    return;
                }

                navigate(`/order/confirmation/${orderId}`);

            } else {
                toast.error(result.message || "Order save failed");
            }

        } catch (error) {
            console.log(error);
            toast.error("Failed to save order");
        }
    };

    const handlePaymentMethod = (e) => {
        setPaymentMethod(e.target.value);
    }

    return (
        <div className="container pb-5">
            <div className="row">
                <div className="col-md-12">
                    <nav aria-label="breadcrumb" className='py-4'>
                        <ol className="breadcrumb">
                            <li className="breadcrumb-item"><Link to="/">Home</Link></li>
                            <li className="breadcrumb-item active" aria-current="page">
                                Checkout
                            </li>
                        </ol>
                    </nav>
                </div>
            </div>
            {
                loader && <Loader />
            }
            {
                loader == false &&

                <form action="" onSubmit={handleSubmit(processOrder)}>
                    <div className="row">
                        <div className="col-md-7">
                            <h3 className=' border-bottom pb-3'><strong>Billing Details</strong></h3>
                            <div className="row pt-3">
                                <div className="col-md-6">
                                    <div className="mb-3">
                                        <input
                                            {...register('name', {
                                                required: 'The Name Field is Required'
                                            })}
                                            type="text"
                                            className={`form-control ${errors.name ? 'is-invalid' : ''}`}
                                            placeholder="Name"
                                        />
                                        {errors.name && (
                                            <p className="invalid-feedback">{errors.name.message}</p>
                                        )}
                                    </div>
                                </div>

                                <div className="col-md-6">
                                    <div className="mb-3">
                                        <input
                                            {...register('email', {
                                                required: 'The Email Field is Required',
                                                pattern: {
                                                    value: /^\S+@\S+$/i,
                                                    message: 'Invalid Email Format'
                                                }
                                            })}
                                            type="email"
                                            className={`form-control ${errors.email ? 'is-invalid' : ''}`}
                                            placeholder="Email"
                                        />
                                        {errors.email && (
                                            <p className="invalid-feedback">{errors.email.message}</p>
                                        )}
                                    </div>
                                </div>

                                <div className="mb-3">
                                    <textarea
                                        {...register('address', {
                                            required: 'The Address Field is Required'
                                        })}
                                        placeholder="Address"
                                        className={`form-control ${errors.address ? 'is-invalid' : ''}`}
                                        rows={3}
                                    />
                                    {errors.address && (
                                        <p className="invalid-feedback">{errors.address.message}</p>
                                    )}
                                </div>

                                <div className="col-md-6">
                                    <div className="mb-3">
                                        <input
                                            {...register('city', {
                                                required: 'The City Field is Required'
                                            })}
                                            type="text"
                                            className={`form-control ${errors.city ? 'is-invalid' : ''}`}
                                            placeholder="City"
                                        />
                                        {errors.city && (
                                            <p className="invalid-feedback">{errors.city.message}</p>
                                        )}
                                    </div>
                                </div>

                                <div className="col-md-6">
                                    <div className="mb-3">
                                        <input
                                            {...register('state', {
                                                required: 'The State Field is Required'
                                            })}
                                            type="text"
                                            className={`form-control ${errors.state ? 'is-invalid' : ''}`}
                                            placeholder="State"
                                        />
                                        {errors.state && (
                                            <p className="invalid-feedback">{errors.state.message}</p>
                                        )}
                                    </div>
                                </div>

                                <div className="col-md-6">
                                    <div className="mb-3">
                                        <input
                                            {...register('zip', {
                                                required: 'The ZIP Field is Required',
                                                pattern: {
                                                    value: /^[0-9]{6}$/,
                                                    message: 'ZIP must be 6 digits'
                                                }
                                            })}
                                            type="text"
                                            className={`form-control ${errors.zip ? 'is-invalid' : ''}`}
                                            placeholder="ZIP"
                                        />
                                        {errors.zip && (
                                            <p className="invalid-feedback">{errors.zip.message}</p>
                                        )}
                                    </div>
                                </div>

                                <div className="col-md-6">
                                    <div className="mb-3">
                                        <input
                                            {...register('mobile', {
                                                required: 'The Mobile Field is Required',
                                                pattern: {
                                                    value: /^[6-9]\d{9}$/,
                                                    message: 'Enter a valid 10 digit mobile number'
                                                }
                                            })}
                                            type="text"
                                            className={`form-control ${errors.mobile ? 'is-invalid' : ''}`}
                                            placeholder="Mobile"
                                        />
                                        {errors.mobile && (
                                            <p className="invalid-feedback">{errors.mobile.message}</p>
                                        )}
                                    </div>
                                </div>
                            </div>
                        </div>
                        <div className="col-md-5">
                            <h3 className=' border-bottom pb-3'><strong>Items</strong></h3>
                            <table className=' table'>
                                <tbody>
                                    {
                                        cartData && cartData.map(item => {
                                            return (
                                                <tr key={item.id}>
                                                    <td width={100}>
                                                        <img src={item.image_url} width={80} alt="" />
                                                    </td>
                                                    <td width={600}>
                                                        <h4>Dummy Product 1</h4>
                                                        <div className="d-flex align-items-center">
                                                            <span>${item.price}</span>
                                                            <div>
                                                                {
                                                                    item.size &&
                                                                    <button className=' btn btn-size ms-2'>{item.size}</button>

                                                                }
                                                            </div>
                                                            <div className="ps-5">QTY - {item.qty}</div>
                                                        </div>
                                                    </td>
                                                    <td valign='middle' width={100}>
                                                        <input type="number" value={item.qty} className=' form-control' readOnly />
                                                    </td>
                                                </tr>
                                            )
                                        }
                                        )
                                    }
                                </tbody>

                            </table>
                            <div className="row">
                                <div className="col-md-12">
                                    <div className="d-flex justify-content-between border-bottom pb-2">
                                        <div>
                                            Subtotal
                                        </div>
                                        <div>${subTotal()}</div>
                                    </div>
                                    <div className="d-flex justify-content-between border-bottom py-2">
                                        <div>
                                            Shipping
                                        </div>
                                        <div>${shipping()}</div>
                                    </div>
                                    <div className="d-flex justify-content-between border-bottom py-2">
                                        <div>
                                            <strong>Grand Total</strong>
                                        </div>
                                        <div>${grandTotal()}</div>
                                    </div>
                                </div>
                            </div>
                            <h3 className='border-bottom pt-4 pb-3'><strong>Payment Methods</strong></h3>
                            <div className='pt-1'>
                                <input
                                    onChange={handlePaymentMethod}
                                    type="radio"
                                    checked={paymentMethod == 'stripe'}
                                    value={'stripe'} />
                                <label htmlFor="" className='form-label ps-2'>Stripe</label>

                                <input
                                    onChange={handlePaymentMethod}
                                    type="radio"
                                    checked={paymentMethod == 'cod'}
                                    value={'cod'}
                                    className='ms-3' />
                                <label htmlFor="" className='form-label ps-2'>COD</label>
                            </div>

                            {
                                paymentMethod == "stripe" && <div className='border p-3'>
                                    <CardElement />
                                </div>
                            }
                            <div className="d-flex">
                                <button disabled={loading} className=' btn btn-primary my-2'>
                                    {
                                        loading ? 'Processing...' : 'Pay Now'
                                    }
                                </button>
                            </div>
                            {paymentStatus && <div className="alert alert-info mt-2">{paymentStatus}</div>}

                        </div>
                    </div>
                </form>
            }
        </div>
    )
}
