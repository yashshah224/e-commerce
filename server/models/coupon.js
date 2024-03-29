const mongoose = require('mongoose')
const { ObjectId } = mongoose.Schema

const couponSchema = new mongoose.Schema(
    {
        name: {
            type: String,
            trim: true,
            unique: true,
            uppercase: true,
            required: 'Name is Required',
            minlength: [6, 'Too Short'],
            maxlength: [12, 'Too long']
        },
        expiry: {
            type: Date,
            required: true
        },
        discount: {
            type: Number,
            required: true
        }
    },
    { timestamps: true }
)

module.exports = mongoose.model('Coupon', couponSchema)