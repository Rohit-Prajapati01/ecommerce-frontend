import React, { useEffect, useState } from 'react'
import { Link } from 'react-router-dom'
import { apiUrl } from '../common/Http'
import Loader from '../common/Loader'

const LatestProduct = () => {

    const [products, setProducts] = useState([]);
    const [loading, setLoading] = useState(true);

    const latestProducts = async () => {
        setLoading(true);

        try {
            const response = await fetch(apiUrl + '/get-latest-products', {
                method: "GET",
                headers: {
                    'Content-type': 'application/json',
                    'Accept': 'application/json',
                }
            });

            const result = await response.json();
            setProducts(result.data);
        } catch (error) {
            console.log(error);
        } finally {
            setLoading(false);
        }
    }

    useEffect(() => {
        latestProducts();
    }, []);

    return (
        <section className='section-2 py-5'>
            <div className="container">
                <h2>New Arrivals</h2>

                <div className="row mt-4">

                    {loading ? (
                        <div className="col-12 text-center">
                            <Loader />
                        </div>
                    ) : (
                        products?.map((product) => (
                            <div
                                className="col-md-3 col-6"
                                key={`products-${product.id}`}
                            >
                                <div className="card product border-0">
                                    <div className="card-img">
                                        <Link to={`/product/${product.id}`}>
                                            <img
                                                src={product.image_url}
                                                className="w-100"
                                                alt={product.title}
                                            />
                                        </Link>
                                    </div>

                                    <div className="card-body pt-3">
                                        <Link to={`/product/${product.id}`}>
                                            {product.title}
                                        </Link>

                                        <div className="price">
                                            ${product.price}
                                            <span className="text-decoration-line-through">
                                                ${product.compare_price}
                                            </span>
                                        </div>
                                    </div>
                                </div>
                            </div>
                        ))
                    )}

                </div>
            </div>
        </section>
    )
}

export default LatestProduct;