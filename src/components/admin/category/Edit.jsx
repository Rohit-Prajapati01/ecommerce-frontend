import React, { useEffect, useState } from 'react'
import Layout from '../../common/Layout'
import { Link, useNavigate, useParams } from 'react-router-dom'
import SideBar from '../../common/SideBar'
import { adminToken, apiUrl } from '../../common/Http'
import { toast } from 'react-toastify'
import { useForm } from 'react-hook-form'




const Edit = () => {
  const [category, setCategory] = useState([]);
  const [disable, setDisable] = useState(false)
  const params = useParams();
  const navigate = useNavigate();
  const param = useParams();

  const {
    register,
    handleSubmit,
    watch,
    reset,
    formState: { errors },
  } = useForm({
    defaultValues: async () => {
      const res = await fetch(`${apiUrl}/categories/${params.id}`, {
        method: 'GET',
        headers: {
          "Content-type": "application/json",
          "Accept": "application/json",
          "Authorization": `Bearer ${adminToken()}`
        }
      }).then(res => res.json()).then(result => {
        console.log(result);
        if (result.status == 200) {
          setCategory(result.data)
          reset({
            name: result.data.name,
            status: result.data.status
          })
        } else {
          console.log('Something went wrong...')
        }

      })


    }
  });

  const saveCategory = async (data) => {

    setDisable(true)
    const res = await fetch(`${apiUrl}/categories/${params.id}`, {
      method: 'PUT',
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
        navigate('/admin/categories')
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
            <h4 className='h4 pb-0 mb-0'>Categories / Edit</h4>
            <Link to="/admin/categories" className=' btn btn-primary'>Back</Link>
          </div>
          <div className="col-md-3">
            <SideBar />
          </div>
          <div className="col-md-9 mb-4">
            <div className="card shadow">
              <div className="card-body p-4">
                <form onSubmit={handleSubmit(saveCategory)}>
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

                  <button disabled={disable} type='submit' className=' btn btn-primary mt-2'>Update</button>
                </form>
              </div>
            </div>
          </div>
        </div>
      </div>
    </Layout>
  )
}

export default Edit