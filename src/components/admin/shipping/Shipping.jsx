import React, { useState } from 'react'
import Layout from '../../common/Layout'
import SideBar from '../../common/SideBar'
import { Link } from 'react-router-dom'
import { useForm } from 'react-hook-form'
import { adminToken, apiUrl } from '../../common/Http'
import { toast } from 'react-toastify'


const Shipping = () => {

    const [disable, setDisable] = useState(false)
    const {
        register,
        handleSubmit,
        watch,
        reset,
        formState: { errors },
    } = useForm({
        defaultValues: async () => {
            await fetch(`${apiUrl}/shipping-charge`, {
                method: 'GET',
                headers: {
                    "Content-type": "application/json",
                    "Accept": "application/json",
                    "Authorization": `Bearer ${adminToken()}`
                }
            }).then(res => res.json()).then(result => {
                if (result.status == 200) {
                    reset({
                        shipping_charge: result.data.shipping_charge
                    })
                }
            });
            ;

        }
    });

    const saveShippingCharge = async (data) => {

        setDisable(true)
        const res = await fetch(`${apiUrl}/update-shipping-charge`, {
            method: 'POST',
            headers: {
                "Content-type": "application/json",
                "Accept": "application/json",
                "Authorization": `Bearer ${adminToken()}`
            },
            body: JSON.stringify(data)
        }).then(res => res.json()).then(result => {
            setDisable(false)
            if (result.status == 200) {
                toast.success(result.message)
                navigate('/admin/shipping')
            } else {
                console.log('Something went wrong...')
            }

        })
    }



    return (
        <Layout>
            <div className="container">
                <div className="row">
                    <div className="d-flex justify-content-between mt-5 pb-3">
                        <h4 className='h4 pb-0 mb-0'>Shipping</h4>

                    </div>
                    <div className="col-md-3">
                        <SideBar />
                    </div>
                    <div className="col-md-9 pb-3">
                        <form onSubmit={handleSubmit(saveShippingCharge)}>
                            <div className="card shadow">
                                <div className="card-body p-4">
                                    <div className="mb-3">
                                        <label className=' form-label'>Shipping Charge</label>
                                        <input
                                            {
                                            ...register("shipping_charge", {
                                                required: "The Shipping Charge Field is Required"
                                            })
                                            }
                                            type="text"
                                            className={`form-control ${errors.shipping_charge && 'is-invalid'}`}
                                            placeholder='Shipping Charge' />
                                        {
                                            errors.shipping_charge && <p className='invalid-feedback'>{errors.shipping_charge.message}</p>
                                        }
                                    </div>
                                </div>
                            </div>
                            <button disabled={disable} type='submit' className=' btn btn-primary mt-2'>Create</button>
                        </form>
                    </div>
                </div>
            </div>
        </Layout>
    )
}

export default Shipping