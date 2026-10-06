import { createContext, useState } from "react";
import { useEffect } from "react";
import { apiUrl } from "../common/Http";



export const CartContext = createContext();

export const CartProvider = ({ children }) => {
    const [cartData, setCartData] = useState(JSON.parse(localStorage.getItem('cart')) || [])
    const [shippingCharge, setShippingCharge] = useState(0);

    const addToCart = (products, size = null) => {

        let updateCart = [...cartData];

        // Check product exist or not
        const isProductExist = updateCart.find(
            item => item.product_id === products.id && item.size === size
        );

        if (isProductExist) {

            // Increase qty
            updateCart = updateCart.map(item =>
                (item.product_id === products.id && item.size === size)
                    ? { ...item, qty: item.qty + 1 }
                    : item
            );

        } else {

            // Add new product
            updateCart.push({
                id: `${products.id}-${Math.floor(Math.random() * 10000000)}`,
                product_id: products.id,
                size: size,
                title: products.title,
                price: products.price,
                qty: 1,
                image_url: products.image_url
            });

        }

        setCartData(updateCart);
        localStorage.setItem('cart', JSON.stringify(updateCart));
    }

    const shipping = () => {
        let shippingAmount = 0;
        cartData.map(item => {
            shippingAmount += item.qty * shippingCharge;
        })
        return shippingAmount;
    }

    const subTotal = () => {
        let subTotal = 0;
        cartData.map(item => {
            subTotal += item.qty * item.price;
        })
        return subTotal;
    }

    const grandTotal = () => {
        return subTotal() + shipping()
    }

    const updateCartItem = (itemId, newQty) => {
        let updateCart = [...cartData];
        updateCart = updateCart.map(item => (item.id == itemId) ? { ...item, qty: newQty } : item)

        setCartData(updateCart);
        localStorage.setItem('cart', JSON.stringify(updateCart))
    }

    const deleteCartItem = (itemId) => {
        const newCardData = cartData.filter(item => item.id != itemId)
        setCartData(newCardData);
        localStorage.setItem('cart', JSON.stringify(newCardData))
    }

    const clearCart = () => {
        setCartData([]);
        localStorage.removeItem('cart');
    }

    const getQty = () => {
        let qty = 0;
        cartData.map(item => {
            qty += parseInt(item.qty)
        });

        return qty;
    }

    useEffect(() => {
        fetch(`${apiUrl}/get-shipping-charge`, {
            method: 'GET',
            headers: {
                "Content-type": "application/json",
                "Accept": "application/json",
            }
        }).then(res => res.json()).then(result => {
            if (result.status == 200) {
                setShippingCharge(result.data.shipping_charge);
            } else {
                setShippingCharge(0);
                console.error('Failed to fetch shipping charge:', result.message);
            }
        });
        ;
    }, []);

    return (
        <CartContext.Provider value={{ addToCart, cartData, grandTotal, shipping, subTotal, updateCartItem, deleteCartItem, clearCart, getQty }}>
            {children}
        </CartContext.Provider>
    );
}