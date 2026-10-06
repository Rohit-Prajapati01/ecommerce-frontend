import React, { useContext } from 'react'
import Layout from '../common/Layout'
import { useForm } from 'react-hook-form'
import { apiUrl } from '../common/Http';
import { toast } from 'react-toastify'
import { useNavigate } from 'react-router-dom';
import { AdminAuthContext } from '../context/AdminAuth';

const Login = () => {
    
    const { login } = useContext(AdminAuthContext);

    const {
        register,
        handleSubmit,
        watch,
        formState: { errors },
    } = useForm();

    const navigate = useNavigate();

    const onSubmit = (data) => {

        const res = fetch(`${apiUrl}/admin/login`, {
            method: 'POST',
            headers: {
                'Content-type': 'application/json'
            },
            body: JSON.stringify(data)
        }).then(res => res.json()).then(result => {
            console.log(result)

            if (result.status == 200) {
                toast.success(result.message);

                const adminInfo = {
                    token: result.token,
                    id: result.id,
                    name: result.name
                };

                localStorage.setItem('adminInfo', JSON.stringify(adminInfo));
                login(adminInfo);

                navigate('/admin/dashboard');
            }
            else {
                toast.error(result.message)
            }
        })
    }

    return (
        <Layout>
            <div className="container d-flex justify-content-center py-5">
                <form onSubmit={handleSubmit(onSubmit)}>
                    <div className="card shadow border-0 login">
                        <div className="card-body">
                            <h3>Admin Login</h3>
                            <div className="mb-3">
                                <label htmlFor="" className=' form-label'>Email</label>
                                <input
                                    {
                                    ...register("email", {
                                        required: "The Email Field is Required",
                                        pattern: {
                                            value: /^\S+@\S+$/i,
                                            message: "Invalid Email Format"
                                        }
                                    })
                                    }
                                    type="text"
                                    className={`form-control ${errors.email && 'is-invalid'}`}
                                    placeholder='Email' />
                                {
                                    errors.email && <p className='invalid-feedback'>{errors.email.message}</p>
                                }
                            </div>
                            <div className="mb-3">
                                <label htmlFor="" className=' form-label'>Password</label>
                                <input
                                    {
                                    ...register("password", {
                                        required: "The Password Field is Required"
                                    })
                                    }
                                    type="password"
                                    className={`form-control ${errors.password && 'is-invalid'}`}
                                    placeholder='Password' />
                                {
                                    errors.password && <p className='invalid-feedback'>{errors.password.message}</p>
                                }
                            </div>

                            <button className=' btn btn-secondary'>Login</button>
                        </div>
                    </div>
                </form>
            </div>

        </Layout>
    )
}

export default Login