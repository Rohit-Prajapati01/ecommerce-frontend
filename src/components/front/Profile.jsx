import React, { useState } from 'react'
import Layout from '../common/Layout'
import SideBar from '../common/SideBar'
import { Link } from 'react-router-dom'
import UserSideBar from '../common/UserSideBar'
import { useForm } from 'react-hook-form'
import { apiUrl, userToken } from '../common/Http'
import { toast } from 'react-toastify'
import Loader from '../common/Loader'



const Profile = () => {



  const [loader, setLoader] = useState(true);

  const {
    register,
    handleSubmit,
    formState: { errors },
    reset,
    setError
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
          reset(result.data);
        }
      } catch (err) {
        console.error('Error fetching account details:', err);
      } finally {
        setLoader(false); // loader band hoga
      }
    }
  });

  // const updateAccount = async (data) => {
  //   await fetch(`${apiUrl}/update-profile`, {
  //     method: 'POST',
  //     headers: {
  //       'Content-Type': 'application/json',
  //       'Authorization': `Bearer ${userToken()}`
  //     },
  //     body: JSON.stringify(data)
  //   })
  //     .then(res => res.json())
  //     .then(result => {
  //       if (result.status === 200) {
  //         toast.success(result.message);
  //         setLoader(false);
  //       }
  //       else {
  //         const formErrors = result.errors;
  //         Object.keys(formErrors).forEach((field) => {
  //           setError(field, { message: formErrors[field][0] });
  //         });
  //       }
  //     })
  //     .catch(err => {
  //       console.error('Error updating profile:', err);
  //     });
  // }

  // const updateAccount = async (data) => {

  //   setLoader(true);

  //   await fetch(`${apiUrl}/update-profile`, {
  //     method: 'POST',
  //     headers: {
  //       'Content-Type': 'application/json',
  //       'Authorization': `Bearer ${userToken()}`
  //     },
  //     body: JSON.stringify(data)
  //   })
  //     .then(res => res.json())
  //     .then(result => {

  //       if (result.status === 200) {
  //         toast.success(result.message);
  //       } else {
  //         const formErrors = result.errors;

  //         Object.keys(formErrors).forEach((field) => {
  //           setError(field, { message: formErrors[field][0] });
  //         });
  //       }

  //       setLoader(false);
  //     })
  //     .catch(err => {
  //       console.error(err);
  //       setLoader(false);
  //     });
  // }

  const updateAccount = async (data) => {
    try {
      setLoader(true);

      const response = await fetch(`${apiUrl}/update-profile`, {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json',
          'Authorization': `Bearer ${userToken()}`
        },
        body: JSON.stringify(data)
      });

      const result = await response.json();

      if (result.status === 200) {
        console.log(result.data);
        toast.success(result.message);
      } else {
        Object.keys(result.errors).forEach((field) => {
          setError(field, {
            message: result.errors[field][0]
          });
        });
      }
    } catch (err) {
      console.error(err);
    } finally {
      setLoader(false);
    }

  };


  return (
    <Layout>
      <div className="container">
        <div className="row">
          <div className="d-flex justify-content-between mt-5 pb-3">
            <h4 className='h4 pb-0 mb-0'>My Account</h4>
            {/* <Link to="/admin/categories" className=' btn btn-primary'>Create</Link> */}
          </div>
          <div className="col-md-3">
            <UserSideBar />
          </div>
          <div className="col-md-9 pb-4">
            <form onSubmit={handleSubmit(updateAccount)}>
              {
                loader && <Loader />
              }
              {
                loader == false && <div className="card shadow">
                  <div className="card-body p-4">
                    <div className="row">
                      {/* Name */}
                      <div className="mb-3 col-md-6">
                        <label htmlFor="name" className="form-label">
                          Name
                        </label>
                        <input
                          type="text"
                          id="name"
                          className={`form-control ${errors.name ? "is-invalid" : ""}`}
                          placeholder="Enter Your Name"
                          {...register("name", {
                            required: "Name field is required",
                          })}
                        />
                        {errors.name && (
                          <div className="invalid-feedback">
                            {errors.name.message}
                          </div>
                        )}
                      </div>

                      {/* Email */}
                      <div className="mb-3 col-md-6">
                        <label htmlFor="email" className="form-label">
                          Email
                        </label>
                        <input
                          type="email"
                          id="email"
                          className={`form-control ${errors.email ? "is-invalid" : ""}`}
                          placeholder="Enter Your Email"
                          {...register("email", {
                            required: "Email field is required",
                            pattern: {
                              value: /^\S+@\S+\.\S+$/,
                              message: "Please enter a valid email address",
                            },
                          })}
                        />
                        {errors.email && (
                          <div className="invalid-feedback">
                            {errors.email.message}
                          </div>
                        )}
                      </div>
                    </div>

                    <div className="row">
                      {/* Address */}
                      <div className="mb-3">
                        <label htmlFor="address" className="form-label">
                          Address
                        </label>
                        <textarea
                          id="address"
                          rows={3}
                          className={`form-control ${errors.address ? "is-invalid" : ""}`}
                          placeholder="Enter Your Address"
                          {...register("address", {
                            required: "Address field is required",
                          })}
                        ></textarea>
                        {errors.address && (
                          <div className="invalid-feedback">
                            {errors.address.message}
                          </div>
                        )}
                      </div>
                    </div>

                    <div className="row">
                      {/* Mobile */}
                      <div className="mb-3 col-md-6">
                        <label htmlFor="mobile" className="form-label">
                          Phone
                        </label>
                        <input
                          type="text"
                          id="mobile"
                          className={`form-control ${errors.mobile ? "is-invalid" : ""}`}
                          placeholder="Enter Your Phone Number"
                          {...register("mobile", {
                            required: "Phone field is required",
                            pattern: {
                              value: /^[0-9]{10}$/,
                              message: "Phone number must be exactly 10 digits",
                            },
                          })}
                        />
                        {errors.mobile && (
                          <div className="invalid-feedback">
                            {errors.mobile.message}
                          </div>
                        )}
                      </div>

                      {/* City */}
                      <div className="mb-3 col-md-6">
                        <label htmlFor="city" className="form-label">
                          City
                        </label>
                        <input
                          type="text"
                          id="city"
                          className={`form-control ${errors.city ? "is-invalid" : ""}`}
                          placeholder="Enter Your City"
                          {...register("city", {
                            required: "City field is required",
                          })}
                        />
                        {errors.city && (
                          <div className="invalid-feedback">
                            {errors.city.message}
                          </div>
                        )}
                      </div>
                    </div>

                    <div className="row">
                      {/* State */}
                      <div className="mb-3 col-md-6">
                        <label htmlFor="state" className="form-label">
                          State
                        </label>
                        <input
                          type="text"
                          id="state"
                          className={`form-control ${errors.state ? "is-invalid" : ""}`}
                          placeholder="Enter Your State"
                          {...register("state", {
                            required: "State field is required",
                          })}
                        />
                        {errors.state && (
                          <div className="invalid-feedback">
                            {errors.state.message}
                          </div>
                        )}
                      </div>

                      {/* Zip */}
                      <div className="mb-3 col-md-6">
                        <label htmlFor="zip" className="form-label">
                          Zip Code
                        </label>
                        <input
                          type="text"
                          id="zip"
                          className={`form-control ${errors.zip ? "is-invalid" : ""}`}
                          placeholder="Enter Your Zip Code"
                          {...register("zip", {
                            required: "Zip Code field is required",
                          })}
                        />
                        {errors.zip && (
                          <div className="invalid-feedback">
                            {errors.zip.message}
                          </div>
                        )}
                      </div>
                    </div>
                    <button className='btn btn-primary my-2'>Update Profile</button>
                  </div>
                </div>
              }

            </form>
          </div>
        </div>
      </div>
    </Layout>
  )
}

export default Profile