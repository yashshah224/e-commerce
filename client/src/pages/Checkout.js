import React, { useState, useEffect } from 'react'
import { useSelector, useDispatch } from 'react-redux'
import { toast } from 'react-toastify'
import ReactQuill from 'react-quill'
import 'react-quill/dist/quill.snow.css'

import { 
    getUserCart, 
    emptyUserCart, 
    saveUserAddress, 
    applyCoupon,
    createCashOrderForUser 
} from '../functions/user'

const Checkout = ({ history }) => {

    const [products, setProducts] = useState([])
    const [total, setTotal] = useState(0)
    const [address, setAddress] = useState('')
    const [addressSaved, setAddressSaved] = useState(false)
    const [coupon, setCoupon] = useState('')
    const [totalAfterDiscount, setTotalAfterDiscount] = useState(0)
    const [discountError, setDiscountError] = useState('')

    const dispatch = useDispatch()
    const { user, COD } = useSelector((state) => ({ ...state}))
    const couponTrueOrFalse = useSelector((state) => state.coupon)

    useEffect(() => {
        getUserCart(user.token).then((res) => {
            setProducts(res.data.products)
            setTotal(res.data.cartTotal)
        })
    }, [])

    const saveAddressToDb = () => {
        saveUserAddress(user.token, address).then((res) => {
            if(res.data.ok) {
                setAddressSaved(true)
                toast.success('Address Saved')
            }
        })
    }

    const emptyCart = () => {
        if(typeof window !== 'undefined') {
            localStorage.removeItem('cart')
        }

        dispatch({
            type: 'ADD_TO_CART',
            payload: []
        })

        emptyUserCart(user.token).then((res) => {
            setProducts([])
            setTotal(0)
            setTotalAfterDiscount(0)
            setCoupon('')
            toast.success('Cart is empty. Continue Shopping')
        })
    }

    const showAddress = () => (
        <>
            <ReactQuill theme="snow" value={address} onChange={setAddress} />
            <button 
                className="btn btn-primary mt-2" 
                onClick={saveAddressToDb}
            >
                Save
            </button>
        </>
    )

    const showProductSummary = () => {
        return products.map((p, i) => (
            <div key={i}>
                <p>{p.product.title} ({p.color}) x {p.count} = {p.product.price * p.count}</p>
            </div>
        ))
    }

    const applyDiscountCoupon = () => {
        console.log(coupon)
        applyCoupon(user.token, coupon).then((res) => {
            if(res.data) {
                setTotalAfterDiscount(res.data)
                dispatch({
                    type: "COUPON_APPLIED",
                    payload: true
                })
            }
            if(res.data.err) {
                setDiscountError(res.data.err)
                dispatch({
                    type: "COUPON_APPLIED",
                    payload: false
                })
            }
        })
    }

    const showApplyCoupon = () => (
        <>
            <input 
                type="text" 
                value={coupon} 
                className="form-control"
                onChange={(e) => {
                    setCoupon(e.target.value)
                    setDiscountError('')
                }}
            />
            <button 
                onClick={applyDiscountCoupon} 
                className="btn btn-primary mt-2"
            >
                Apply
            </button>
        </>
    )

    const createCashOrder = () => {
        createCashOrderForUser(user.token, COD, couponTrueOrFalse).then((res) => {
            console.log(res)
            if (res.data.ok) {

                if (typeof window !== "undefined") localStorage.removeItem("cart");

                dispatch({
                  type: "ADD_TO_CART",
                  payload: [],
                });

                dispatch({
                  type: "COUPON_APPLIED",
                  payload: false,
                });

                dispatch({
                  type: "COD",
                  payload: false,
                });

                emptyUserCart(user.token);

                setTimeout(() => {
                  history.push("/user/history");
                }, 1000);
            }
        })
    }

    return (
        <div className="row">
            <div className="col-md-6">
                <h4>Delivery Address</h4>
                <br />
                <br />
                {showAddress()}
                <hr />
                <h4>Got Coupon?</h4>
                <br />
                {showApplyCoupon()}
                <br />
                {discountError && <p className="bg-danger p-2">{discountError}</p>}
            </div>
            <div className="col-md-6">
                <h4>Order Summary</h4>
                <hr />
                <p>Products {products.length}</p>
                <hr />
                {showProductSummary()}
                <hr />
                <p>Cart Total: Rs. {total}</p>

                {totalAfterDiscount > 0 && (
                    <p className="bg-success p-2">
                        Discount Applied: Total Payable Amount: Rs.{totalAfterDiscount}
                    </p>
                )}

                <div className="row"> 
                    <div className="col-md-6">
                        {COD ? (
                            <button 
                                className="btn btn-primary" 
                                disabled={!addressSaved || !products.length}
                                onClick={createCashOrder}
                            >
                                Place Order
                            </button>
                        ) : (
                            <button 
                                className="btn btn-primary" 
                                disabled={!addressSaved || !products.length}
                                onClick={() => history.push('/payment')}
                            >
                                Place Order
                            </button>
                        )}
                    </div>
                    <div className="col-md-6">
                        <button 
                            onClick={emptyCart} 
                            disabled={!products.length} 
                            className="btn btn-primary"
                        >
                            Empty Cart
                        </button>
                    </div>
                </div>
            </div>
        </div>
    )
}

export default Checkout