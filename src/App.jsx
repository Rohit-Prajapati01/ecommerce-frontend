import { BrowserRouter, Route, Routes } from 'react-router-dom'
import Home from './components/Home'
import Shop from './components/Shop'
import Product from './components/Product'
import Cart from './components/Cart'
import Checkout from './components/Checkout'
import Login from './components/admin/Login'
import { ToastContainer, toast } from 'react-toastify'
import Dashboard from './components/admin/Dashboard'
import { AdminRequireAuth } from './components/admin/AdminRequireAuth'

// Category
import { default as ShowCategory } from './components/admin/category/Show'
import { default as CreateCategory } from './components/admin/category/Create'
import { default as EditCategory } from './components/admin/category/Edit'

// Brands
import { default as ShowBrands } from './components/admin/brands/Show'
import { default as CreateBrands } from './components/admin/brands/Create'
import { default as EditBrands } from './components/admin/brands/Edit'

// Products
import { default as ShowProduct } from './components/admin/product/Show'
import { default as CreateProduct } from './components/admin/product/Create'
import { default as EditProduct } from './components/admin/product/Edit'
import Register from './components/Register'
import { default as UserLogin } from './components/Login'
import Profile from './components/front/Profile'
import { RequireAuth } from './components/RequireAuth'
import Confirmation from './components/Confirmation'
import ShowOrder from './components/admin/order/ShowOrder'
import OrderDetails from './components/admin/order/OrderDetails'
import { default as UserOrderDetails } from './components/front/OrderDetails'
import MyOrders from './components/front/MyOrders'
import Shipping from './components/admin/shipping/Shipping'



function App() {

  return (
    <>
      <BrowserRouter>

        <Routes>

          {/* User Routes */}
          <Route path='/' element={<Home />} />
          <Route path='/shop' element={<Shop />} />
          <Route path='/product/:id' element={<Product />} />
          <Route path='/cart' element={<Cart />} />
          <Route path='/admin/login' element={<Login />} />
          <Route path='/account/register' element={<Register />} />
          <Route path='/account/login' element={<UserLogin />} />


          <Route path='/account' element={
            <RequireAuth>
              <Profile />
            </RequireAuth>
          } />

          <Route path='/checkout' element={
            <RequireAuth>
              <Checkout />
            </RequireAuth>
          } />

          <Route path='/order/confirmation/:id' element={
            <RequireAuth>
              <Confirmation />
            </RequireAuth>
          } />

          <Route path='/account/orders/details/:id' element={
            <RequireAuth>
              <UserOrderDetails />
            </RequireAuth>
          } />

          <Route path='/account/orders' element={
            <RequireAuth>
              <MyOrders />
            </RequireAuth>
          } />














          {/* Admin Routes */}
          <Route path='/admin/dashboard' element={
            <AdminRequireAuth>
              <Dashboard />
            </AdminRequireAuth>
          } />


          <Route path='/admin/categories' element={
            <AdminRequireAuth>
              <ShowCategory />
            </AdminRequireAuth>
          } />


          <Route path='/admin/categories/create' element={
            <AdminRequireAuth>
              <CreateCategory />
            </AdminRequireAuth>
          } />

          <Route path='/admin/categories/edit/:id' element={
            <AdminRequireAuth>
              <EditCategory />
            </AdminRequireAuth>
          } />


          <Route path='/admin/brands' element={
            <AdminRequireAuth>
              <ShowBrands />
            </AdminRequireAuth>
          } />


          <Route path='/admin/brands/create' element={
            <AdminRequireAuth>
              <CreateBrands />
            </AdminRequireAuth>
          } />

          <Route path='/admin/brands/edit/:id' element={
            <AdminRequireAuth>
              <EditBrands />
            </AdminRequireAuth>
          } />


          <Route path='/admin/product' element={
            <AdminRequireAuth>
              <ShowProduct />
            </AdminRequireAuth>
          } />


          <Route path='/admin/product/create' element={
            <AdminRequireAuth>
              <CreateProduct />
            </AdminRequireAuth>
          } />

          <Route path='/admin/product/edit/:id' element={
            <AdminRequireAuth>
              <EditProduct />
            </AdminRequireAuth>
          } />

          <Route path='/admin/orders' element={
            <AdminRequireAuth>
              <ShowOrder />
            </AdminRequireAuth>
          } />

          <Route path='/admin/orders/:id' element={
            <AdminRequireAuth>
              <OrderDetails />
            </AdminRequireAuth>
          } />

          <Route path='/admin/shipping' element={
            <AdminRequireAuth>
              <Shipping />
            </AdminRequireAuth>
          } />

        </Routes>

      </BrowserRouter>
      <ToastContainer />
    </>
  )
}

export default App
