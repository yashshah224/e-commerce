import React from 'react'
import ModalImage from 'react-modal-image'
import { useDispatch } from 'react-redux'
import { toast } from 'react-toastify'
import { CheckCircleOutlined, ClockCircleOutlined, CloseOutlined } from '@ant-design/icons'

import laptop from '../../images/computer/laptop.png'

const ProductCardInCheckout = ({ p }) => {

    const colors = ['Black', 'Brown', 'Silver', 'White', 'Blue']
    const dispatch = useDispatch()

    const handleColorChange = (e) => {
        let cart = []
        if(typeof window !== 'undefined') {
            if(localStorage.getItem('cart')) {
                cart = JSON.parse(localStorage.getItem('cart'))
            }
            cart.map((product, i) => {
                if(product._id === p._id) {
                    cart[i].color = e.target.value
                }
            })
            localStorage.setItem('cart', JSON.stringify(cart))
            dispatch({
                type: "ADD_TO_CART",
                payload: cart
            })
        }
    }

    const handleQuantityChange = (e) => {
        let count = e.target.value < 1 ? 1 : e.target.value

        if(count > p.quantity) {
            toast.error(`Maximum Available Quantity: ${p.quantity}`)
            return
        }

        let cart = []
        if(typeof window !== 'undefined') {
            if(localStorage.getItem('cart')) {
                cart = JSON.parse(localStorage.getItem('cart'))
            }
            cart.map((product, i) => {
                if(product._id === p._id) {
                    cart[i].count = count
                }
            })
            localStorage.setItem('cart', JSON.stringify(cart))
            dispatch({
                type: "ADD_TO_CART",
                payload: cart
            })
        }
    }

    const handleRemove = () => {
        let cart = []
        if(typeof window !== 'undefined') {
            if(localStorage.getItem('cart')) {
                cart = JSON.parse(localStorage.getItem('cart'))
            }
            cart.map((product, i) => {
                if(product._id === p._id) {
                    cart.splice(i, 1)
                }
            })
            localStorage.setItem('cart', JSON.stringify(cart))
            dispatch({
                type: "ADD_TO_CART",
                payload: cart
            })
        }
    }

    return (
        <tbody>
            <tr>
                <td>
                    <div style={{ width: "100px", height: "auto" }}>
                        {p.images.length ? (
                            <ModalImage small={p.images[0].url} large={p.images[0].url} />
                        ) : (
                            <ModalImage small={laptop} large={laptop} />
                        )}
                    </div>
                </td>
                <td>{p.title}</td>
                <td>Rs. {p.price}</td>
                <td>{p.brand}</td>
                <td>
                    <select onChange={handleColorChange} name="color" className="form-control">
                        {p.color ? <option value={p.color}>{p.color}</option> : <option>Select</option>}
                        {colors.filter((c) => c !== p.color).map((c) => (
                            <option key={c} value={c}>
                                {c}
                            </option>
                        ))}
                    </select>
                </td>
                <td className="text-center">
                    <input type="number" className="form-control" value={p.count} onChange={handleQuantityChange} />
                </td>
                <td className="text-center">
                    {p.shipping === "Yes" ? (
                        <CheckCircleOutlined className="text-success" />
                    ) : (
                        <ClockCircleOutlined className="text-danger" />
                    )}
                </td>
                <td className="text-center">
                    <CloseOutlined onClick={handleRemove} className="text-danger pointer" />
                </td>
            </tr>
        </tbody>
    )
}

export default ProductCardInCheckout