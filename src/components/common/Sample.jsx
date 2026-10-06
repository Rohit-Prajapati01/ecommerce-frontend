import React from 'react'
import Layout from '../common/Layout'
import SideBar from '../common/SideBar'

const Sample = () => {
    return (
        <Layout>
            <div className="container">
                <div className="row">
                    <div className="d-flex justify-content-between mt-5 pb-3">
                        <h4 className='h4 pb-0 mb-0'>Categories</h4>
                        <Link to="/admin/categories" className=' btn btn-primary'>Create</Link>
                    </div>
                    <div className="col-md-3">
                        <SideBar />
                    </div>
                    <div className="col-md-9">
                        <div className="card shadow">
                            <div className="card-body p-4">

                            </div>
                        </div>
                    </div>
                </div>
            </div>
        </Layout>
    )
}

export default Sample