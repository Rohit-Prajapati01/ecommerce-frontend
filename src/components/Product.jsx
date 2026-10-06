// import React, { useContext, useEffect, useState } from 'react'
// import Layout from './common/Layout'
// import { Link, useNavigate, useParams } from 'react-router-dom'
// import { Swiper, SwiperSlide } from 'swiper/react'
// import { Thumbs, FreeMode, Navigation } from 'swiper/modules';
// import 'swiper/css';
// import 'swiper/css/free-mode';
// import 'swiper/css/navigation';
// import 'swiper/css/thumbs';


// import ProductImg from '../assets/images/Mens/five.jpg'
// import ProductImgTwo from '../assets/images/Mens/six.jpg'
// import ProductImgThree from '../assets/images/Mens/seven.jpg'
// import { Rating } from 'react-simple-star-rating'

// import Tab from 'react-bootstrap/Tab';
// import Tabs from 'react-bootstrap/Tabs';

// import { apiUrl } from '../components/common/Http';
// import { CartContext } from './context/Cart';
// import { toast } from 'react-toastify';



// const Product = () => {
//     const [thumbsSwiper, setThumbsSwiper] = useState(null);
//     const [rating, setRating] = useState(4);
//     const [sizes, setSizes] = useState([]);
//     const [sizeSelected, setSizeSelected] = useState(null);
//     const [products, setProducts] = useState([]);
//     const [productImages, setProductImages] = useState([]);
//     const params = useParams();
//     const { addToCart } = useContext(CartContext);
//     const navigate = useNavigate();



//     const fetchProduct = () => {
//         fetch(`${apiUrl}/get-product/${params.id}`, {
//             method: "GET",
//             headers: {
//                 'Content-type': "application/json",
//                 'Accept': "application/json"
//             }
//         }).then(res => res.json()).then((result) => {
//             if (result.status === 200) {
//                 setProducts(result.data);
//                 setProductImages(result.data.product_images)
//                 setSizes(result.data.sizes)
//             } else {
//                 console.log('Something went wrong in categories');
//             }
//         })
//     }

//     const handleAddToCart = () => {

//         if (sizes.length > 0) {
//             if (sizeSelected == null) {
//                 toast.error('Please select a size')
//             } else {
//                 addToCart(products, sizeSelected)
//                 toast.success('Product Added To cart')

//             }
//         } else {
//             addToCart(product, null)
//             toast.success('Product Added To cart')

//         }

//         navigate('/cart');


//     }

//     useEffect(() => {
//         fetchProduct()
//     }, []);


//     return (
//         <Layout>
//             <div className="container product-detail">
//                 <div className="row">
//                     <div className="col-md-12">
//                         <nav aria-label="breadcrumb" className='py-4'>
//                             <ol className="breadcrumb">
//                                 <li className="breadcrumb-item"><Link to="/">Home</Link></li>
//                                 <li className="breadcrumb-item" aria-current="page">
//                                     <Link to="/shop">Shop</Link>
//                                 </li>
//                                 <li className="breadcrumb-item active" aria-current="page">
//                                     {products.title}
//                                 </li>
//                             </ol>
//                         </nav>
//                     </div>
//                 </div>
//                 <div className="row mb-5">
//                     <div className="col-md-5">
//                         <div className="row">
//                             <div className="col-2">
//                                 <Swiper
//                                     style={{
//                                         '--swiper-navigation-color': '#000',
//                                         '--swiper-pagination-color': '#000',
//                                     }}
//                                     onSwiper={setThumbsSwiper}
//                                     direction={`vertical`}
//                                     spaceBetween={10}
//                                     slidesPerView={3}
//                                     freeMode={true}
//                                     watchSlidesProgress={true}
//                                     modules={[FreeMode, Thumbs]}
//                                     className="mySwiper mt-2"
//                                 >
//                                     {
//                                         productImages && productImages.map((product_image) => {
//                                             return (
//                                                 <SwiperSlide key={`image-${product_image.id}`}>
//                                                     <div className='content'>
//                                                         <img
//                                                             src={product_image.image_url}
//                                                             alt=""
//                                                             height={65}
//                                                             className='w-100' />
//                                                     </div>
//                                                 </SwiperSlide>
//                                             );
//                                         })
//                                     }
//                                 </Swiper>
//                             </div>


//                             <div className="col-md-10">
//                                 <Swiper
//                                     style={{
//                                         '--swiper-navigation-color': '#000',
//                                         '--swiper-pagination-color': '#000',
//                                     }}

//                                     spaceBetween={0}
//                                     navigation={true}
//                                     // thumbs={thumbsSwiper ? { swiper: thumbsSwiper } : undefined}
//                                     thumbs={{ swiper: thumbsSwiper }}
//                                     modules={[FreeMode, Navigation, Thumbs]}
//                                     className="mySwiper2"
//                                 >
//                                     {
//                                         productImages && productImages.map((product_image) => {
//                                             return (
//                                                 <SwiperSlide key={`image-${product_image.id}`} >
//                                                     <div className='content'>
//                                                         <img
//                                                             src={product_image.image_url}
//                                                             alt=""
//                                                             className='w-100' />
//                                                     </div>
//                                                 </SwiperSlide>
//                                             );
//                                         })
//                                     }



//                                 </Swiper>
//                             </div>
//                         </div>
//                     </div>
//                     <div className="col-md-7">
//                         <h2 className='p-title'>{products.title}</h2>
//                         <div className=' d-flex'>
//                             <Rating
//                                 readonly
//                                 initialValue={rating}
//                                 size={20}
//                             />
//                             <span className='pt-1 ps-2'>10 Reviews</span>
//                         </div>
//                         <div className="price h3 py-2">
//                             ${products.price} <span className=' text-decoration-line-through'>  ${products.compare_price}</span>
//                         </div>
//                         <div>
//                             {products.short_description}
//                         </div>
//                         <div className="pt-3">
//                             <strong>Select Sizes</strong>
//                             <div className="sizes py-3">
//                                 {
//                                     sizes && sizes.map((size) => {
//                                         return (
//                                             <button
//                                                 className={`btn btn-size me-2 ${sizeSelected == size.name ? 'active' : " "}`}
//                                                 onClick={() => setSizeSelected(size.name)}
//                                                 key={size.id}>{size.name}
//                                             </button>
//                                         );
//                                     })
//                                 }
//                             </div>
//                         </div>
//                         <div className="add-to-cart">
//                             <button className=' btn btn-primary' onClick={() => handleAddToCart()}>ADD TO CART</button>
//                         </div>

//                         <hr />

//                         <div>
//                             <strong>SKU: </strong>
//                             {products.sku}
//                         </div>
//                     </div>
//                 </div>

//                 <div className="row pb-5">
//                     <div className="col-md-12">
//                         <Tabs
//                             defaultActiveKey="description"
//                             id="uncontrolled-tab-example"
//                             className="mb-3"
//                         >
//                             <Tab eventKey="description" title="Description">
//                                 <div dangerouslySetInnerHTML={{ __html: products.description }}></div>
//                             </Tab>
//                             <Tab eventKey="review" title="Reviews (10)">
//                                 Review Area
//                             </Tab>
//                         </Tabs>
//                     </div>
//                 </div>
//             </div>
//         </Layout>
//     )
// }

// export default Product

import React, { useContext, useEffect, useState } from 'react'
import Layout from './common/Layout'
import { Link, useNavigate, useParams } from 'react-router-dom'
import { Swiper, SwiperSlide } from 'swiper/react'
import { Thumbs, FreeMode, Navigation } from 'swiper/modules';
import 'swiper/css';
import 'swiper/css/free-mode';
import 'swiper/css/navigation';
import 'swiper/css/thumbs';

import { Rating } from 'react-simple-star-rating'
import Tab from 'react-bootstrap/Tab';
import Tabs from 'react-bootstrap/Tabs';

import { apiUrl } from '../components/common/Http';
import { CartContext } from './context/Cart';
import { toast } from 'react-toastify';
import Loader from './common/Loader';

const Product = () => {

    const [thumbsSwiper, setThumbsSwiper] = useState(null);
    const [rating] = useState(4);
    const [sizes, setSizes] = useState([]);
    const [sizeSelected, setSizeSelected] = useState(null);
    const [products, setProducts] = useState([]);
    const [productImages, setProductImages] = useState([]);
    const [loading, setLoading] = useState(true);

    const params = useParams();
    const { addToCart } = useContext(CartContext);
    const navigate = useNavigate();

    const fetchProduct = async () => {

        setLoading(true);

        try {
            const response = await fetch(`${apiUrl}/get-product/${params.id}`, {
                method: "GET",
                headers: {
                    'Content-type': "application/json",
                    'Accept': "application/json"
                }
            });

            const result = await response.json();

            if (result.status === 200) {
                setProducts(result.data);
                setProductImages(result.data.product_images);
                setSizes(result.data.sizes);
            } else {
                console.log('Something went wrong');
            }
        } catch (error) {
            console.log(error);
        } finally {
            setLoading(false);
        }
    }

    const handleAddToCart = () => {

        if (sizes.length > 0) {

            if (sizeSelected == null) {
                toast.error('Please select a size');
                return;
            }

            addToCart(products, sizeSelected);
            toast.success('Product Added To Cart');

        } else {

            addToCart(products, null);
            toast.success('Product Added To Cart');
        }

        navigate('/cart');
    }

    useEffect(() => {
        fetchProduct();
    }, []);

    return (
        <Layout>
            <div className="container product-detail">

                <div className="row">
                    <div className="col-md-12">
                        <nav aria-label="breadcrumb" className='py-4'>
                            <ol className="breadcrumb">
                                <li className="breadcrumb-item">
                                    <Link to="/">Home</Link>
                                </li>

                                <li className="breadcrumb-item">
                                    <Link to="/shop">Shop</Link>
                                </li>

                                {!loading && (
                                    <li className="breadcrumb-item active">
                                        {products.title}
                                    </li>
                                )}
                            </ol>
                        </nav>
                    </div>
                </div>

                <div className="row mb-5">

                    {loading ? (

                        <div className="col-12 d-flex justify-content-center align-items-center py-5">
                            <Loader />
                        </div>

                    ) : (

                        <>
                            <div className="col-md-5">

                                <div className="row">
                                    <div className="col-2">

                                        <Swiper
                                            style={{
                                                '--swiper-navigation-color': '#000',
                                                '--swiper-pagination-color': '#000',
                                            }}
                                            onSwiper={setThumbsSwiper}
                                            direction="vertical"
                                            spaceBetween={10}
                                            slidesPerView={3}
                                            freeMode={true}
                                            watchSlidesProgress={true}
                                            modules={[FreeMode, Thumbs]}
                                            className="mySwiper mt-2"
                                        >
                                            {productImages?.map((product_image) => (
                                                <SwiperSlide key={product_image.id}>
                                                    <div className='content'>
                                                        <img
                                                            src={product_image.image_url}
                                                            alt=""
                                                            height={65}
                                                            className='w-100'
                                                        />
                                                    </div>
                                                </SwiperSlide>
                                            ))}
                                        </Swiper>

                                    </div>

                                    <div className="col-md-10">

                                        <Swiper
                                            style={{
                                                '--swiper-navigation-color': '#000',
                                                '--swiper-pagination-color': '#000',
                                            }}
                                            spaceBetween={0}
                                            navigation={true}
                                            thumbs={{ swiper: thumbsSwiper }}
                                            modules={[FreeMode, Navigation, Thumbs]}
                                            className="mySwiper2"
                                        >
                                            {productImages?.map((product_image) => (
                                                <SwiperSlide key={product_image.id}>
                                                    <div className='content'>
                                                        <img
                                                            src={product_image.image_url}
                                                            alt=""
                                                            className='w-100'
                                                        />
                                                    </div>
                                                </SwiperSlide>
                                            ))}
                                        </Swiper>

                                    </div>
                                </div>

                            </div>

                            <div className="col-md-7">

                                <h2 className='p-title'>{products.title}</h2>

                                <div className='d-flex'>
                                    <Rating
                                        readonly
                                        initialValue={rating}
                                        size={20}
                                    />
                                    <span className='pt-1 ps-2'>10 Reviews</span>
                                </div>

                                <div className="price h3 py-2">
                                    ${products.price}
                                    <span className='text-decoration-line-through'>
                                        {' '} ${products.compare_price}
                                    </span>
                                </div>

                                <div>
                                    {products.short_description}
                                </div>

                                <div className="pt-3">
                                    <strong>Select Sizes</strong>

                                    <div className="sizes py-3">

                                        {sizes?.map((size) => (
                                            <button
                                                key={size.id}
                                                className={`btn btn-size me-2 ${sizeSelected === size.name ? 'active' : ''}`}
                                                onClick={() => setSizeSelected(size.name)}
                                            >
                                                {size.name}
                                            </button>
                                        ))}

                                    </div>
                                </div>

                                <div className="add-to-cart">
                                    <button
                                        className='btn btn-primary'
                                        onClick={handleAddToCart}
                                    >
                                        ADD TO CART
                                    </button>
                                </div>

                                <hr />

                                <div>
                                    <strong>SKU: </strong>
                                    {products.sku}
                                </div>

                            </div>
                        </>
                    )}

                </div>

                {!loading && (
                    <div className="row pb-5">
                        <div className="col-md-12">

                            <Tabs
                                defaultActiveKey="description"
                                id="uncontrolled-tab-example"
                                className="mb-3"
                            >
                                <Tab eventKey="description" title="Description">
                                    <div
                                        dangerouslySetInnerHTML={{
                                            __html: products.description
                                        }}
                                    />
                                </Tab>

                                <Tab eventKey="review" title="Reviews (10)">
                                    Review Area
                                </Tab>
                            </Tabs>

                        </div>
                    </div>
                )}

            </div>
        </Layout>
    )
}

export default Product;

