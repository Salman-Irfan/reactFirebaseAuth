import React from 'react'
import { Route, Routes } from 'react-router-dom'
import AddProduct from './pages/AddProduct'
import ReadAllProducts from './pages/ReadAllProducts'
import ProductDetails from './pages/ProductDetails'
import UpdateProduct from './pages/UpdateProduct'
import Signup from './pages/auth/Signup'
import Login from './pages/auth/Login'
import Navbar from './components/layouts/Navbar'
import AddCourse from './pages/course/AddCourse'
import AllCourses from './pages/course/AllCourses'

const App = () => {
  return (
    <>
      <Navbar/>
      <Routes>
        <Route exact path='/' element={<AddProduct />} />
        <Route exact path='/all-products' element={<ReadAllProducts />} />
        <Route exact path='/product/:id' element={<ProductDetails />} />
        <Route exact path='/update-product/:id' element={<UpdateProduct />} />
        {/* auth */}
        <Route exact path='/auth/signup' element={<Signup />} />
        <Route exact path='/auth/login' element={<Login />} />
        {/* course */}
        <Route exact path='/course/add-course' element={<AddCourse />} />
        <Route exact path='/course/all-courses' element={<AllCourses />} />
      </Routes>
    </>
  )
}

export default App