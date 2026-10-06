import React, { useState } from 'react'
import Layout from '../../common/Layout'
import SideBar from '../../common/SideBar'
import { Link, useNavigate } from 'react-router-dom'
import { useForm } from 'react-hook-form'
import { adminToken, apiUrl } from '../../common/Http'
import { toast } from 'react-toastify'


const Create = () => {

    const [disable, setDisable] = useState(false)

    const navigate = useNavigate();

    const {
        register,
        handleSubmit,
        watch,
        formState: { errors },
    } = useForm();

    const saveBrand = async (data) => {

        setDisable(true)
        const res = await fetch(`${apiUrl}/brands`, {
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
                navigate('/admin/brands')
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
                        <h4 className='h4 pb-0 mb-0'>Brands / Create</h4>
                        <Link to="/admin/brands" className=' btn btn-primary'>Back</Link>
                    </div>
                    <div className="col-md-3">
                        <SideBar />
                    </div>
                    <div className="col-md-9">
                        <form onSubmit={handleSubmit(saveBrand)}>
                            <div className="card shadow">
                                <div className="card-body p-4">
                                    <div className="mb-3">
                                        <label className=' form-label'>Name</label>
                                        <input
                                            {
                                            ...register("name", {
                                                required: "The Name Field is Required"
                                            })
                                            }
                                            type="text"
                                            className={`form-control ${errors.name && 'is-invalid'}`}
                                            placeholder='Name' />
                                        {
                                            errors.name && <p className='invalid-feedback'>{errors.name.message}</p>
                                        }
                                    </div>
                                    <div className="mb-3">
                                        <label className=' form-label'>Status</label>
                                        <select
                                            {
                                            ...register("status", {
                                                required: "Please select a status"
                                            })
                                            }
                                            className={`form-control ${errors.status && 'is-invalid'}`}>
                                            <option value="">Select a status</option>
                                            <option value="1">Active</option>
                                            <option value="0">Block</option>
                                        </select>
                                        {
                                            errors.status && <p className='invalid-feedback'>{errors.status.message}</p>
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

export default Create