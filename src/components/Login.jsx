import React, { useContext } from 'react'
import Layout from '../components/common/Layout'
import { useForm } from 'react-hook-form';
import { Link, useNavigate } from 'react-router-dom';
import { apiUrl } from './common/Http';
import { AuthContext } from './context/Auth';
import { toast } from 'react-toastify';


const Login = () => {

    const {
        register,
        handleSubmit,
        watch,
        formState: { errors },
    } = useForm();

    const { login } = useContext(AuthContext);

    const navigate = useNavigate();
    const onSubmit = (data) => {

        const res = fetch(`${apiUrl}/login`, {
            method: 'POST',
            headers: {
                'Content-type': 'application/json'
            },
            body: JSON.stringify(data)
        }).then(res => res.json()).then(result => {
            console.log(result)

            if (result.status == 200) {
                toast.success(result.message);

                const userInfo = {
                    token: result.token,
                    id: result.id,
                    name: result.name
                };

                console.log(userInfo)

                localStorage.setItem('userInfo', JSON.stringify(userInfo));
                login(userInfo);

                navigate('/account');
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
                            <h3 className=' border-bottom pb-2 mb-3'>Login</h3>
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

                            <button className=' btn btn-secondary w-100'>Login</button>

                            <div className="d-flex justify-content-center py-4 pt-4">
                                Don't have any account? &nbsp; <Link to={'/account/register'} className=' text-primary text-decoration-underline'>Register</Link>
                            </div>
                        </div>
                    </div>
                </form>
            </div>
        </Layout>
    )
}

export default Login