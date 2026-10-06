import React, { useEffect, useState } from 'react'
import Layout from '../components/common/Layout'
import { Link, useParams } from 'react-router-dom';
import { apiUrl, userToken } from '../components/common/Http';

const Confirmation = () => {

    const [order, setOrder] = useState(null);
    const [loading, setLoading] = useState(true);

    const params = useParams();

    const fetchOrder = () => {

        console.log("API Calling...");
        console.log("Order ID:", params.id);

        fetch(`${apiUrl}/get-order-details/${params.id}`, {
            method: 'GET',
            headers: {
                'Content-type': 'application/json',
                'Accept': 'application/json',
                'Authorization': `Bearer ${userToken()}`
            }
        })
            .then(res => {
                console.log("Response:", res);
                return res.json();
            })
            .then(result => {
                console.log("Result:", result);

                setLoading(false);

                if (result.status === 200) {
                    setOrder(result.data);
                } else {
                    setOrder(null);
                }
            })
            .catch(err => {
                console.log("Error:", err);
                setLoading(false);
                setOrder(null);
            });
    }

    useEffect(() => {
        fetchOrder();
    }, []);

    return (
        <Layout>
            <div className="container py-5">

                {/* Loader */}
                {loading && (
                    <div className="text-center py-5">
                        <div className="spinner-border">
                            <span className='visually-hidden'>Loading...</span>
                        </div>
                    </div>
                )}

                {/* Order Found */}
                {!loading && order && (
                    <div>
                        <div className="row">
                            <h1 className='text-center fw-bold text-success'>
                                Thank You...!
                            </h1>

                            <p className='text-muted text-center'>
                                Your order has been successfully placed..!!
                            </p>
                        </div>

                        <div className="card shadow">
                            <div className="card-body">

                                <h3 className='fw-bold'>Order Summary</h3>
                                <hr />

                                <div className="row">
                                    <div className="col-6">
                                        <p>
                                            <strong>Order ID :</strong> #{order.id}
                                        </p>

                                        <p>
                                            <strong>Date :</strong> {order.created_at}
                                        </p>

                                        <p>
                                            <strong>Status :</strong>{" "}

                                            {order.status === 'pending' &&
                                                <span className='badge bg-warning'>
                                                    Pending
                                                </span>
                                            }

                                            {order.status === 'delivered' &&
                                                <span className='badge bg-success'>
                                                    Delivered
                                                </span>
                                            }

                                            {order.status === 'shipped' &&
                                                <span className='badge bg-info'>
                                                    Shipped
                                                </span>
                                            }

                                            {order.status === 'cancelled' &&
                                                <span className='badge bg-danger'>
                                                    Cancelled
                                                </span>
                                            }
                                        </p>

                                        <p>
                                            <strong>Payment Method :</strong>
                                            {order.payment_method === 'cod' ? <span className='badge bg-primary'> Cash on Delivery </span> : <span className='badge bg-success'> Stripe </span>}
                                        </p>
                                    </div>

                                    <div className="col-6">
                                        <p>
                                            <strong>Customer :</strong> {order.name}
                                        </p>

                                        <p>
                                            <strong>Address :</strong> {order.address},{order.city}, {order.state}, {order.zip}
                                        </p>

                                        <p>
                                            <strong>Contact :</strong> +91 {order.mobile}
                                        </p>
                                    </div>
                                </div>

                                <div className="row">
                                    <div className="col-12">

                                        <table className="table table-bordered table-striped">
                                            <thead className='bg-light'>
                                                <tr>
                                                    <th>Item</th>
                                                    <th>Quantity</th>
                                                    <th width="150">Price</th>
                                                    <th width="150">Total</th>
                                                </tr>
                                            </thead>

                                            <tbody>
                                                {order.items.map((item) => (
                                                    <tr key={item.id}>
                                                        <td>
                                                            {item.name}
                                                            <br />
                                                            <small><b>Size</b>: {item.size}</small>
                                                        </td>

                                                        <td>{item.qty}</td>

                                                        <td>₹{item.price}</td>

                                                        <td>₹{item.qty * item.price}</td>
                                                    </tr>
                                                ))}
                                            </tbody>

                                            <tfoot>
                                                <tr>
                                                    <td colSpan={3} className='text-end fw-bold'>
                                                        Subtotal
                                                    </td>
                                                    <td>{order.subtotal}</td>
                                                </tr>

                                                <tr>
                                                    <td colSpan={3} className='text-end fw-bold'>
                                                        Shipping
                                                    </td>
                                                    <td>{order.shipping}</td>
                                                </tr>

                                                <tr>
                                                    <td colSpan={3} className='text-end fw-bold'>
                                                        Grand Total
                                                    </td>
                                                    <td>{order.grandtotal}</td>
                                                </tr>
                                            </tfoot>
                                        </table>

                                    </div>

                                    <div className="text-center">
                                        <button className="btn btn-primary me-3">
                                            Order Details
                                        </button>

                                        <Link to={"/"} className="btn btn-outline-secondary">
                                            Continue Shopping
                                        </Link>
                                    </div>
                                </div>

                            </div>
                        </div>
                    </div>
                )}

                {/* Order Not Found */}
                {!loading && !order && (
                    <div className="row">
                        <h3 className='text-center fw-bold text-muted'>
                            Order Not Found
                        </h3>
                    </div>
                )}

            </div>
        </Layout>
    )
}

export default Confirmation;