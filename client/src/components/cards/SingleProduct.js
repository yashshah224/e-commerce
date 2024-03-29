import React, { useState } from 'react'
import { Card, Tabs, Tooltip } from 'antd'
import { useHistory } from 'react-router-dom'
import { HeartOutlined, ShoppingCartOutlined } from '@ant-design/icons'
import { Carousel } from 'react-responsive-carousel'
import "react-responsive-carousel/lib/styles/carousel.min.css";
import StarRating from 'react-star-ratings'
import _ from 'lodash'
import { useSelector, useDispatch } from 'react-redux'
import { toast } from 'react-toastify'

import Laptop from '../../images/computer/laptop.png'
import ProductListItems from './ProductListItems'
import RatingModal from '../modal/RatingModal'
import { showAverage } from '../../functions/rating'
import { addToWishlist } from '../../functions/user'


const { TabPane } = Tabs

const SingleProduct = ({ product, onStarClick, star }) => {

    const { title, images, description, _id } = product

    const [tooltip, setTooltip] = useState('Click To Add')

    const dispatch = useDispatch()
    const { user } = useSelector((state) => ({ ...state }))
    const history = useHistory()

    const handleAddToCart = () => {
        
        let cart = []
        if(typeof window !== "undefined") {
            if(localStorage.getItem("cart")) {
                cart = JSON.parse(localStorage.getItem("cart"))
            }
            cart.push({
                ...product,
                count: 1
            })

            let unique = _.uniqWith(cart, _.isEqual)

            localStorage.setItem('cart', JSON.stringify(unique))
            setTooltip("Added")

            dispatch({
                type: "ADD_TO_CART",
                payload: unique
            })

            dispatch({
                type: "SET_VISIBLE",
                payload: true
            })
        }
    }

    const handleAddToWishlist = (e) => {
        e.preventDefault()
        addToWishlist(product._id, user.token).then((res) =>{
            toast.success("Added to wishlist")
            history.push('/user/wishlist')
        })
    }

    return (
        <>
            <div className="col-md-7">
                {images && images.length ? <Carousel showArrows={true} autoPlay infiniteLoop>
                    {images && images.map((i) => <img src={i.url} alt="" key={i.public_id} />)}
                </Carousel> : 
                    (<Card
                        cover={
                            <img src={Laptop} alt="" className="mb-3 card-image" />
                        }
                    >
                    
                    </Card>)
                }
                <Tabs type="card">
                    <TabPane tab="Description" key="1">
                        {description && description}
                    </TabPane>
                    <TabPane tab="More" key="2">
                        Email us on xyz@gmail.com to know more about this product
                    </TabPane>
                </Tabs>
            </div>
            <div className="col-md-5">
                <h1 className="bg-info p-3">{title}</h1>
                { product && product.ratings && product.ratings.length > 0 
                    ? showAverage(product) 
                    : <div className="text-center pt-1 pb-3">No Ratings Yet</div> }
                <Card 
                    actions = {[
                        <Tooltip placement="top" title={tooltip}>
                            <a onClick={handleAddToCart} disabled={product.quantity < 1}>
                                <ShoppingCartOutlined className="text-danger" /><br /> 
                                {product.quantity < 1 ? "Out of Stock" : "Add To Cart"}
                            </a>
                        </Tooltip>,
                        <a onClick={handleAddToWishlist}>
                            <HeartOutlined className="text-info" /><br /> Add to Wishlist
                        </a>,
                        <RatingModal>
                            <StarRating 
                                name={_id} 
                                rating={star} 
                                numberOfStars={5}
                                changeRating={onStarClick}
                                isSelectable={true}
                                starRatedColor="red"
                            />
                        </RatingModal>
                    ]}
                >
                    <ProductListItems product={product} />   
                </Card>
            </div>
        </>
    )
}

export default SingleProduct