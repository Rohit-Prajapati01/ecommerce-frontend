import React, { useEffect, useState } from 'react'
import Layout from './common/Layout'
import { apiUrl } from '../components/common/Http'
import { Link, useSearchParams } from 'react-router-dom';
import Loader from './common/Loader';


const Shop = () => {

    const [categories, setCategories] = useState([]);
    const [brands, setBrands] = useState([]);
    const [products, setProducts] = useState([]);
    const [catChecked, setCatChecked] = useState([]);
    const [brandChecked, setBrandChecked] = useState([]);
    const [searchParam, setSearchParam] = useSearchParams()
    const [loading, setLoading] = useState(false);


    const fetchProducts = () => {

        let params = new URLSearchParams();

        if (catChecked.length > 0) {
            params.append('category_id', catChecked.join(','));
        }

        if (brandChecked.length > 0) {
            params.append('brand_id', brandChecked.join(','));
        }

        setSearchParam(params);

        fetch(`${apiUrl}/get-products?${params.toString()}`, {
            method: "GET",
            headers: {
                'Content-type': "application/json",
                'Accept': "application/json"
            }
        })
            .then(res => res.json())
            .then((result) => {

                if (result.status === 200) {
                    setLoading(false);
                    setProducts(result.data);
                }

            });
    }

    const fetchCategories = () => {
        fetch(`${apiUrl}/get-categories`, {
            method: "GET",
            headers: {
                'Content-type': "application/json",
                'Accept': "application/json"
            }
        }).then(res => res.json()).then((result) => {
            if (result.status === 200) {
                setCategories(result.data);
            } else {
                console.log('Something went wrong in categories');
            }
        })
    }

    const fetchBrands = () => {
        fetch(`${apiUrl}/get-brands`, {
            method: "GET",
            headers: {
                'Content-type': "application/json",
                'Accept': "application/json"
            }
        }).then(res => res.json()).then((result) => {
            if (result.status === 200) {
                setBrands(result.data);
            } else {
                console.log('Something went wrong in brands');
            }
        })
    }

    const handleCategory = (e) => {
        const { checked, value } = e.target;
        if (checked) {
            setCatChecked(pre => [...pre, value]);
        } else {
            setCatChecked(catChecked.filter(id => id != value))
        }

    }

    const handleBrand = (e) => {
        const { checked, value } = e.target;

        if (checked) {
            setBrandChecked(prev => [...prev, value]);
        } else {
            setBrandChecked(brandChecked.filter(id => id != value));
        }
    }


    useEffect(() => {
        fetchProducts();
        setLoading(true);
    }, [catChecked, brandChecked]);

    useEffect(() => {
        fetchCategories();
        fetchBrands();
    }, []);




    return (
        <Layout>
            <div className="container">
                <nav aria-label="breadcrumb" className='py-4'>
                    <ol className="breadcrumb">
                        <li className="breadcrumb-item"><a href="/">Home</a></li>
                        <li className="breadcrumb-item active" aria-current="page">Shop</li>
                    </ol>
                </nav>
                <div className="row">
                    <div className="col-md-3">
                        <div className="card shadow border-0 mb-3">
                            <div className="card-body p-4">
                                <h3 className='mb-3'>Categories</h3>
                                <ul>
                                    {
                                        categories && categories.map((category) => {
                                            return (
                                                <li className='mb-2' key={category.id}>
                                                    <input
                                                        checked={
                                                            searchParam.get('category_id')
                                                                ? searchParam.get('category_id').includes(category.id.toString())
                                                                : false
                                                        }
                                                        type="checkbox" name="" value={category.id} onChange={handleCategory} id="" />
                                                    <label htmlFor="" className='ps-2'>{category.name}</label>
                                                </li>
                                            );
                                        })
                                    }
                                </ul>
                            </div>
                        </div>
                        <div className="card shadow border-0 mb-3">
                            <div className="card-body p-4">
                                <h3 className='mb-3'>Brands</h3>
                                <ul>
                                    {
                                        brands && brands.map((brand) => {
                                            return (
                                                <li className='mb-2' key={brand.id}>
                                                    <input
                                                        checked={
                                                            searchParam.get('brands_id')
                                                                ? searchParam.get('brands_id').includes(brand.id.toString())
                                                                : false
                                                        } type="checkbox" onChange={handleBrand} value={brand.id} name="" id="" />
                                                    <label htmlFor="" className='ps-2'>{brand.name}</label>
                                                </li>
                                            );
                                        })
                                    }
                                </ul>
                            </div>
                        </div>
                    </div>
                    <div className="col-md-9">
                        <div className="row pb-5">
                            {
                                loading && <Loader />
                            }

                            {

                                loading == false && products && products.map((product) => {
                                    return (
                                        <div className="col-md-3 col-6" key={product.id}>
                                            <div className="card product border-0">
                                                <div className="card-img">
                                                    <Link to={`/product/${product.id}`}>
                                                        <img src={product.image_url} className=' w-100' alt="" />
                                                    </Link>
                                                </div>
                                                <div className="card-body pt-3">
                                                    <Link to={`/get-product/${product.id}`}>{product.title}</Link>
                                                    <div className="price">
                                                        ${product.price} <span className=' text-decoration-line-through'>${product.compare_price}</span>
                                                    </div>
                                                </div>
                                            </div>
                                        </div>
                                    );
                                })
                            }

                        </div>
                    </div>
                </div>


            </div>
        </Layout>
    )
}

export default Shop