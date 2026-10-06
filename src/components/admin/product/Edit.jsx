import React, { useEffect, useState, useRef, useMemo } from 'react'
import Layout from '../../common/Layout'
import SideBar from '../../common/SideBar'
import { Link, useNavigate, useParams } from 'react-router-dom'
import { useForm } from 'react-hook-form'
import { toast } from 'react-toastify'
import JoditEditor from 'jodit-react';
import { adminToken, apiUrl } from '../../common/Http'


const Edit = ({ placeholder }) => {
    const editor = useRef(null);
    const [content, setContent] = useState('');

    const [disable, setDisable] = useState(false);
    const [categories, setCategories] = useState([]);
    const [brands, setBrands] = useState([]);
    const [sizes, setSizes] = useState([]);
    const [sizesChecked, setSizesChecked] = useState([]);

    const [productImages, setProductImages] = useState([]);


    const Navigate = useNavigate();
    const params = useParams();



    const config = useMemo(
        () => ({
            readonly: false,
            placeholder: placeholder || ''
        }),
        [placeholder]
    );

    const navigate = useNavigate();

    const {
        register,
        handleSubmit,
        watch,
        setError,
        reset,
        formState: { errors },
    } = useForm({
        defaultValues: async () => {
            const res = await fetch(`${apiUrl}/products/${params.id}`, {
                method: 'GET',
                headers: {
                    "Content-type": "application/json",
                    "Accept": "application/json",
                    "Authorization": `Bearer ${adminToken()}`
                }
            }).then(res => res.json()).then(result => {
                setProductImages(result.data.product_images)
                setSizesChecked(result.data.sizes.map(size => size.id))
                reset({
                    title: result.data.title,
                    sku: result.data.sku,
                    barcode: result.data.barcode,
                    price: result.data.price,
                    compare_price: result.data.compare_price,
                    qty: result.data.qty,
                    description: result.data.description,
                    short_description: result.data.short_description,
                    category_id: result.data.category_id,
                    brands_id: result.data.brands_id,
                    status: result.data.status,
                    is_featured: result.data.is_featured,
                    image: result.data.image,
                    image_url: result.data.image_url,
                    id: result.data.id
                });
            })

        }
    });

    const saveProduct = async (data) => {

        delete data.image;
        const formData = { ...data, "description": content }
        setDisable(true)
        const res = await fetch(`${apiUrl}/products/${params.id}`, {
            method: 'PUT',
            headers: {
                "Content-type": "application/json",
                "Accept": "application/json",
                "Authorization": `Bearer ${adminToken()}`
            },
            body: JSON.stringify(formData)
        }).then(res => res.json()).then(result => {
            setDisable(false)
            if (result.status == 200) {
                toast.success(result.message)
                navigate('/admin/product')
            } else {
                const formErrors = result.errors;
                Object.keys(formErrors).forEach((field) => {
                    setError(field, { message: formErrors[field][0] });
                });
            }

        })
    }
    const fetchCategories = async () => {

        const res = await fetch(`${apiUrl}/categories`, {
            method: 'GET',
            headers: {
                "Content-type": "application/json",
                "Accept": "application/json",
                "Authorization": `Bearer ${adminToken()}`
            }
        }).then(res => res.json()).then(result => {
            if (result.status == 200) {
                setCategories(result.data)
            } else {
                console.log('Something went wrong...')
            }

        })
    }

    const fetchBrands = async () => {
        const res = await fetch(`${apiUrl}/brands`, {
            method: 'GET',
            headers: {
                "Content-type": "application/json",
                "Accept": "application/json",
                "Authorization": `Bearer ${adminToken()}`
            }
        }).then(res => res.json()).then(result => {
            if (result.status == 200) {
                setBrands(result.data)
            } else {
                console.log('Something went wrong...')
            }

        })
    }

    const fetchSizes = async () => {
        const res = await fetch(`${apiUrl}/sizes`, {
            method: 'GET',
            headers: {
                "Content-type": "application/json",
                "Accept": "application/json",
                "Authorization": `Bearer ${adminToken()}`
            }
        }).then(res => res.json()).then(result => {
            if (result.status == 200) {
                setSizes(result.data)
            } else {
                console.log('Something went wrong...')
            }
        })
    }

    const handleFile = async (e) => {
        const formData = new FormData();
        const file = e.target.files[0];
        formData.append("product_id", watch("id"));
        formData.append("image", file);
        setDisable(true);

        const res = await fetch(`${apiUrl}/save-product-image`, {
            method: 'POST',
            headers: {
                "Accept": "application/json",
                "Authorization": `Bearer ${adminToken()}`
            },
            body: formData
        }).then(res => res.json())
            .then(result => {
                if (result.status == 200) {
                    productImages.push(result.data)
                    setProductImages(productImages)
                } else {
                    toast.error(result.errors.image[0]);
                }
                setDisable(false)
                e.target.value = ""
            })
    }

    const changeImage = async (image) => {
        const res = await fetch(`${apiUrl}/change-product-image?product_id=${params.id}&image=${image}`, {
            method: 'GET',
            headers: {
                "Content-type": "application/json",
                "Accept": "application/json",
                "Authorization": `Bearer ${adminToken()}`
            }
        }).then(res => res.json()).then(result => {
            if (result.status == 200) {
                toast.success(result.message)
            } else {
                console.log('Something went wrong...')
            }

        })
    }

    const deleteImage = async (id) => {
        if (confirm('Are You Sure, You wanna delete it')) {

            const res = await fetch(`${apiUrl}/delete-product-image/${id}`, {
                method: 'DELETE',
                headers: {
                    "Content-type": "application/json",
                    "Accept": "application/json",
                    "Authorization": `Bearer ${adminToken()}`
                }
            })
                .then(res => res.json())
                .then(result => {

                    if (result.status == 200) {

                        toast.success(result.message)

                        setProductImages(
                            productImages.filter(productImage => productImage.id != id)
                        )

                    } else {
                        toast.error(result.message)
                    }

                })
        }
    }

    useEffect(() => {
        fetchCategories()
        fetchBrands()
        fetchSizes()
    }, []);

    return (
        <Layout>
            <div className="container">
                <div className="row">
                    <div className="d-flex justify-content-between mt-5 pb-3">
                        <h4 className='h4 pb-0 mb-0'>Product \ Edit</h4>
                        <Link to="/admin/product" className=' btn btn-primary'>Back</Link>
                    </div>
                    <div className="col-md-3">
                        <SideBar />
                    </div>
                    <div className="col-md-9">
                        <form onSubmit={handleSubmit(saveProduct)}>
                            <div className="card shadow">
                                <div className="card-body p-4">

                                    {/* Title */}
                                    <div className="mb-3">
                                        <label className=' form-label'>Title</label>

                                        <input
                                            {
                                            ...register("title", {
                                                required: "The Title Field is Required"
                                            })
                                            }
                                            type="text"
                                            className={`form-control ${errors.title && 'is-invalid'}`}
                                            placeholder='Title'
                                        />

                                        {
                                            errors.title &&
                                            <p className='invalid-feedback'>
                                                {errors.title.message}
                                            </p>
                                        }
                                    </div>

                                    <div className="row">

                                        {/* Category */}
                                        <div className="col-md-6">
                                            <div className="mb-3">

                                                <label htmlFor="" className='form-label'>
                                                    Category
                                                </label>

                                                <select
                                                    {
                                                    ...register("category_id", {
                                                        required: "Please select category"
                                                    })
                                                    }
                                                    className={`form-control ${errors.category_id && 'is-invalid'}`}
                                                >
                                                    <option value="" >
                                                        Select a Category
                                                    </option>

                                                    {
                                                        categories.map((category) =>
                                                            <option
                                                                key={category.id}
                                                                value={category.id}
                                                            >
                                                                {category.name}
                                                            </option>)
                                                    }
                                                </select>

                                                {
                                                    errors.category_id &&
                                                    <p className='invalid-feedback'>
                                                        {errors.category_id.message}
                                                    </p>
                                                }

                                            </div>
                                        </div>

                                        {/* Brand */}
                                        <div className="col-md-6">
                                            <div className="mb-3">

                                                <label htmlFor="" className='form-label'>
                                                    Brand
                                                </label>

                                                <select
                                                    {...register("brands_id")}
                                                    className='form-control'
                                                >
                                                    <option value="" >
                                                        Select a Brand
                                                    </option>

                                                    {
                                                        brands.map((brand) =>
                                                            <option
                                                                key={brand.id}
                                                                value={brand.id}
                                                            >
                                                                {brand.name}
                                                            </option>)
                                                    }
                                                </select>

                                            </div>
                                        </div>
                                    </div>

                                    {/* Short Description */}
                                    <div className="mb-3">

                                        <label className=' form-label'>
                                            Short Description
                                        </label>

                                        <textarea
                                            {...register("short_description")}
                                            className='form-control'
                                            placeholder='Short Description'
                                            rows={3}
                                        ></textarea>

                                    </div>

                                    {/* Description */}
                                    <div className="mb-3">
                                        <label className=' form-label'>Description</label>

                                        <JoditEditor
                                            ref={editor}
                                            value={content}
                                            config={config}
                                            tabIndex={1}
                                            onBlur={newContent => setContent(newContent)}
                                        />
                                    </div>

                                    <h3 className=' py-3 border-bottom mb-3'>Pricing</h3>

                                    <div className="row">

                                        {/* Price */}
                                        <div className="col-md-6">
                                            <div className="mb-3">

                                                <label className=' form-label'>
                                                    Price
                                                </label>

                                                <input
                                                    {
                                                    ...register("price", {
                                                        required: "Price field is required"
                                                    })
                                                    }
                                                    type="text"
                                                    placeholder='Price'
                                                    className={`form-control ${errors.price && 'is-invalid'}`}
                                                />

                                                {
                                                    errors.price &&
                                                    <p className='invalid-feedback'>
                                                        {errors.price.message}
                                                    </p>
                                                }

                                            </div>
                                        </div>

                                        {/* Discount Price */}
                                        <div className="col-md-6">
                                            <div className="mb-3">

                                                <label className=' form-label'>
                                                    Discounted Price
                                                </label>

                                                <input
                                                    {...register("compare_price")}
                                                    type="text"
                                                    placeholder='Discounted Price'
                                                    className='form-control'
                                                />

                                            </div>
                                        </div>
                                    </div>

                                    <h3 className=' py-3 border-bottom mb-3'>Inventory</h3>

                                    <div className="row">

                                        {/* SKU */}
                                        <div className="col-md-6">
                                            <div className="mb-3">

                                                <label className=' form-label'>
                                                    SKU
                                                </label>

                                                <input
                                                    {
                                                    ...register("sku", {
                                                        required: "SKU field is required"
                                                    })
                                                    }
                                                    type="text"
                                                    placeholder='Sku'
                                                    className={`form-control ${errors.sku && 'is-invalid'}`}
                                                />

                                                {
                                                    errors.sku &&
                                                    <p className='invalid-feedback'>
                                                        {errors.sku.message}
                                                    </p>
                                                }

                                            </div>
                                        </div>

                                        {/* Barcode */}
                                        <div className="col-md-6">
                                            <div className="mb-3">

                                                <label className=' form-label'>
                                                    Barcode
                                                </label>

                                                <input
                                                    {...register("barcode")}
                                                    type="text"
                                                    placeholder='Barcode'
                                                    className='form-control'
                                                />

                                            </div>
                                        </div>
                                    </div>

                                    <div className="row">

                                        {/* Qty */}
                                        <div className="col-md-6">
                                            <div className="mb-3">

                                                <label className=' form-label'>
                                                    Qty
                                                </label>

                                                <input
                                                    {...register("qty")}
                                                    type="text"
                                                    placeholder='Qty'
                                                    className='form-control'
                                                />

                                            </div>
                                        </div>

                                        {/* Status */}
                                        <div className="col-md-6">
                                            <div className="mb-3">

                                                <label className=' form-label'>
                                                    Status
                                                </label>

                                                <select
                                                    {
                                                    ...register("status", {
                                                        required: "Please select a status"
                                                    })
                                                    }
                                                    className={`form-control ${errors.status && 'is-invalid'}`}
                                                >
                                                    <option value="">
                                                        Select a status
                                                    </option>

                                                    <option value="1">
                                                        Active
                                                    </option>

                                                    <option value="0">
                                                        Block
                                                    </option>
                                                </select>

                                                {
                                                    errors.status &&
                                                    <p className='invalid-feedback'>
                                                        {errors.status.message}
                                                    </p>
                                                }

                                            </div>
                                        </div>
                                    </div>

                                    <div className="mb-3">

                                        <label className=' form-label'>
                                            Featured
                                        </label>

                                        <select
                                            {...register("is_featured")}
                                            className='form-control'
                                        >

                                            <option value="Yes">
                                                Yes
                                            </option>

                                            <option value="No">
                                                No
                                            </option>
                                        </select>

                                    </div>
                                    <div className="mb-3">
                                        <label className=' form-label'>
                                            Sizes
                                        </label>
                                        {
                                            sizes && sizes.map((size) => {
                                                return (
                                                    <div className="form-check-inline ps-2" key={`psize-${size.id}`}>
                                                        <input

                                                            {
                                                            ...register("sizes")
                                                            }
                                                            onChange={(e) => {
                                                                if (e.target.checked) {
                                                                    setSizesChecked([...sizesChecked, size.id])
                                                                } else {
                                                                    setSizesChecked(sizesChecked.filter(sid => size.id != sid))
                                                                }
                                                            }}
                                                            checked={sizesChecked.includes(size.id)}
                                                            class="form-check-input"
                                                            type="checkbox" value={size.id}
                                                            id={`size-${size.id}`}
                                                        />
                                                        <label className="form-check-label ps-2" htmlFor="{`size-${size.id}`}">
                                                            {size.name}
                                                        </label>
                                                    </div>
                                                );
                                            })
                                        }
                                    </div>

                                    <h3 className=' py-3 border-bottom mb-3'>Gallery</h3>

                                    {/* Image */}
                                    <div className="mb-3">

                                        <label className=' form-label'>
                                            Image
                                        </label>

                                        <input
                                            {...register("image")}
                                            type="file"
                                            className='form-control'
                                            onChange={handleFile}
                                        />

                                    </div>

                                    <div className="mb-3">
                                        <div className="row">
                                            {
                                                productImages && productImages.map((productImage, index) => {
                                                    return (
                                                        <div className="col-md-3" key={index}>
                                                            <div className="card shadow">
                                                                <img src={productImage.image_url} alt="" />
                                                            </div>
                                                            <button
                                                                type='button'
                                                                className=' btn btn-danger mt-2 w-100' onClick={() => deleteImage(productImage.id)}>Delete</button>
                                                            <button className=' btn btn-success mt-2 w-100' onClick={() => changeImage(productImage.image)}>Set as Default</button>

                                                        </div>
                                                    );
                                                })
                                            }
                                        </div>
                                    </div>

                                </div>
                            </div>

                            <button
                                disabled={disable}
                                type='submit'
                                className=' btn btn-primary mt-2 mb-3'
                            >
                                Update
                            </button>

                        </form>
                    </div>
                </div>
            </div>
        </Layout>
    )
}

export default Edit