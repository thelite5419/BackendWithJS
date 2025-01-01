import mongoose from "mongoose";


const orderItemsSchema = new mongoose.Schema(
    {
        productId: {
            type: mongoose.Schema.Types.ObjectId,
            ref: "Product",
        },
        qunatity: {
            type: Number,
            required: true,
        },
    }
, {timestamps: true})

export const orderItems = mongoose.model("orderItem", orderItemsSchema)

const orderSchema = new mongoose.Schema(
    {
        orderPrice: {
            type: Number, 
            required: true,
        },
        customer: {
            type: mongoose.Schema.Types.ObjectId, 
            ref: "User"
        },
        orderItems: {
            type: [orderItemsSchema]
        },
        address: {
            type: String, 
            required: true
        },
        status:{
            type: String, 
            enum: ["PENDING", "CANCELLED", "DELIVERED"],
            default: "PENDING"
        },
    }
, {timestamps: true})

export const Order = mongoose.model("Order", orderSchema)