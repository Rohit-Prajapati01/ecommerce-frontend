import React, { useContext } from 'react'
import { AdminAuthContext } from '../context/AdminAuth'
import { Link } from 'react-router-dom';



const SideBar = () => {
    const { logout } = useContext(AdminAuthContext);
    return (
        <div className="card shadow mb-5 sidebar">
            <div className="card-body p-4">
                <ul>
                    <li><Link to="/admin/dashboard">Dashboard</Link></li>
                    <li><Link to="/admin/categories">Categories</Link></li>
                    <li><Link to="/admin/brands">Brands</Link></li>
                    <li><Link to="/admin/product">Product</Link></li>
                    <li><Link to="/admin/orders">Orders</Link></li>
                    <li><Link to="/admin/shipping">Shipping</Link></li>
                    <li><Link to="">Change Password</Link></li>
                    <li><Link to="#" onClick={logout}>Logout</Link></li>
                </ul>
            </div>
        </div>
    )
}

export default SideBar