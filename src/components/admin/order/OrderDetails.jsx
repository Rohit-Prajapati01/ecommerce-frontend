import React, { useEffect, useState } from 'react'
import Layout from '../../common/Layout'
import SideBar from '../../common/SideBar'
import { Link, useParams } from 'react-router-dom'
import { adminToken, apiUrl } from '../../common/Http'
import Loader from '../../common/Loader'
import { useForm } from 'react-hook-form'
import { toast } from 'react-toastify'

const OrderDetails = () => {
    const [order, setOrder] = useState([]);
    const [items, setItems] = useState([]);
    const [loader, setLoader] = useState(false);
    const params = useParams();
    const {
        register,
        handleSubmit,
        reset,
        formState: { errors }
    } = useForm();




    const fetchOrder = async () => {
        setLoader(true)
        const res = await fetch(`${apiUrl}/orders/${params.id}`, {
            method: 'GET',
            headers: {
                "Content-type": "application/json",
                "Accept": "application/json",
                "Authorization": `Bearer ${adminToken()}`
            }
        }).then(res => res.json()).then(result => {
            setLoader(false)
            console.log(result)
            if (result.status == 200) {
                console.log(result)
                setOrder(result.data)
                setItems(result.data.items)
                reset({
                    status: result.data.status,
                    payment_status: result.data.payment_status
                })
            } else {
                console.log('Something went wrong...')
            }

        })
    }

    const updateOrder = async (data) => {
        setLoader(true)
        const res = await fetch(`${apiUrl}/update-order/${params.id}`, {
            method: 'POST',
            headers: {
                "Content-type": "application/json",
                "Accept": "application/json",
                "Authorization": `Bearer ${adminToken()}`
            },
            body: JSON.stringify(data)
        }).then(res => res.json()).then(result => {
            setLoader(false)
            if (result.status == 200) {
                toast.success(result.message)
                reset({
                    status: result.data.status,
                    payment_status: result.data.payment_status
                })
                fetchOrder()
            } else {
                console.log('Something went wrong...')
            }

        })
    }

    useEffect(() => {
        fetchOrder()
    }, []);


    return (
        <Layout>
            <div className="container">
                <div className="row">
                    <div className="d-flex justify-content-between mt-5 pb-3">
                        <h4 className='h4 pb-0 mb-0'>Orders</h4>
                        <Link to="/admin/orders" className=' btn btn-primary'>Back</Link>
                    </div>
                    <div className="col-md-3">
                        <SideBar />
                    </div>
                    <div className="col-md-9">
                        <div className="row">
                            <div className="col-md-9">
                                <div className="card shadow mb-5">
                                    <div className="card-body p-4">
                                        {
                                            loader == true && <Loader />
                                        }
                                        {
                                            loader == false &&
                                            <div>
                                                <div className="row">
                                                    <div className="col-md-4">
                                                        <h3>Order ID : #4</h3>
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
                                                    </div>
                                                    <div className="col-md-4">
                                                        <div className="text-secondary">Date</div>
                                                        <h4>{order.created_at}</h4>
                                                    </div>
                                                    <div className="col-md-4">
                                                        <div className="text-secondary">Payment Status</div>
                                                        {
                                                            order.payment_status == 'paid' ? <span className=' badge bg-success'>Paid</span> : <span className=' badge bg-danger'>Not Paid</span>
                                                        }
                                                    </div>
                                                </div>
                                                <div className="row">
                                                    <div className="col-md-4">
                                                        <div className="py-5">
                                                            <strong>{order.name}</strong>
                                                            <div>{order.email}</div>
                                                            <div>{order.mobile}</div>
                                                            <div>{order.address} {order.city} {order.state} {order.zip}</div>
                                                        </div>
                                                    </div>
                                                    <div className="col-md-4">
                                                        <div className="text-secondary pt-5">Payment Status</div>
                                                        <p>
                                                            {order.payment_method === 'cod' ? <span className='badge bg-primary'> Cash on Delivery </span> : <span className='badge bg-success'> Stripe </span>}
                                                        </p>
                                                    </div>
                                                    <div className="col-md-4"></div>
                                                </div>
                                                <div className="row">
                                                    <h3 className="pb-2 "><strong>Items</strong></h3>
                                                    {
                                                        items.map((item) => {
                                                            return (
                                                                <div className="row justify-content-end" key={item.id}>
                                                                    <div className="col-lg-12">
                                                                        <div className="d-flex justify-content-between border-bottom pb-2 mb-2">
                                                                            <div className="d-flex">
                                                                                <img width="70" className="me-3" src={item.product.image_url} alt="" />
                                                                                <div className="d-flex flex-column">
                                                                                    <div className="mb-2"><span>{item.name}</span></div>
                                                                                    <div><button className="btn btn-size">{item.size}</button></div>
                                                                                </div>
                                                                            </div>
                                                                            <div className="d-flex">
                                                                                <div>Qty - {item.qty}</div>
                                                                                <div className="ps-3">${item.price}</div>
                                                                            </div>
                                                                        </div>
                                                                    </div>
                                                                </div>
                                                            );
                                                        })
                                                    }
                                                    <div className="row justify-content-end">
                                                        <div className="col-lg-12">
                                                            <div className="d-flex  justify-content-between border-bottom pb-2 mb-2">
                                                                <div>Subtotal</div>
                                                                <div>{order.subtotal}</div>
                                                            </div>
                                                            <div className="d-flex  justify-content-between border-bottom pb-2 mb-2">
                                                                <div>Shipping</div>
                                                                <div>{order.shipping}</div>
                                                            </div>
                                                            <div className="d-flex  justify-content-between border-bottom pb-2 mb-2">
                                                                <div><strong>Grand Total</strong></div>
                                                                <div><strong>${order.grandtotal}</strong></div>
                                                            </div>
                                                        </div>
                                                    </div>
                                                </div>
                                            </div>
                                        }
                                    </div>
                                </div>
                            </div>
                            <div className="col-md-3 pb-3">
                                <div className="card shadow">
                                    <div className="card-body p-4">
                                        <form onSubmit={handleSubmit(updateOrder)}>
                                            <div className="mb-3">
                                                <label className=' form-label'>Status</label>
                                                <select
                                                    {
                                                    ...register('status', {
                                                        required: true
                                                    })
                                                    }
                                                    id="status" className=' form-select'>
                                                    <option value="pending">Pending</option>
                                                    <option value="shipped">Shipped</option>
                                                    <option value="delivered">Delivered</option>
                                                </select>
                                            </div>
                                            <div className="mb-3">
                                                <label className=' form-label'>Payment Status</label>
                                                <select
                                                    {
                                                    ...register('payment_status', {
                                                        required: true
                                                    })
                                                    }
                                                    id="payment_status" className=' form-select'>
                                                    <option value="paid">Paid</option>
                                                    <option value="not paid">Not Paid</option>
                                                </select>
                                            </div>
                                            <button type='submit' className=' btn btn-primary'>Update</button>
                                        </form>
                                    </div>
                                </div>
                            </div>
                        </div>
                    </div>
                </div>
            </div>
        </Layout>
    )
}

export default OrderDetails