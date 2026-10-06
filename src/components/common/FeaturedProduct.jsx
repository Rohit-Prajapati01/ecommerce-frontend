import React, { useEffect, useState } from 'react'
import { apiUrl } from '../common/Http'
import { Link } from 'react-router-dom'
import Loader from '../common/Loader'

const FeaturedProduct = () => {

    const [featureds, setFeatureds] = useState([]);
    const [loading, setLoading] = useState(true);

    const featuredProducts = async () => {
        setLoading(true);

        try {
            const response = await fetch(apiUrl + '/get-featured-products', {
                method: "GET",
                headers: {
                    'Content-type': 'application/json',
                    'Accept': 'application/json',
                }
            });

            const result = await response.json();
            setFeatureds(result.data);
        } catch (error) {
            console.log(error);
        } finally {
            setLoading(false);
        }
    }

    useEffect(() => {
        featuredProducts();
    }, []);

    return (
        <section className='section-2 py-5'>
            <div className="container">
                <h2>Featured Products</h2>

                <div className="row mt-4">

                    {loading ? (
                        <div className="col-12 d-flex justify-content-center align-items-center">
                            <Loader />
                        </div>
                    ) : (
                        featureds?.map((featured) => (
                            <div
                                className="col-md-3 col-6"
                                key={`products-${featured.id}`}
                            >
                                <div className="card product border-0">
                                    <div className="card-img">
                                        <Link to={`/product/${featured.id}`}>
                                            <img
                                                src={featured.image_url}
                                                className="w-100"
                                                alt={featured.title}
                                            />
                                        </Link>
                                    </div>

                                    <div className="card-body pt-3">
                                        <Link to={`/product/${featured.id}`}>
                                            {featured.title}
                                        </Link>

                                        <div className="price">
                                            ${featured.price}
                                            <span className="text-decoration-line-through">
                                                ${featured.compare_price}
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

export default FeaturedProduct