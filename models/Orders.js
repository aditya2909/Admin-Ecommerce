const { Schema, model, models } = require("mongoose");


const OrderSchema = new Schema({
    line_items:Object,
    name:String,
    email:String,
    state:String,
    pinCode:String,
    streetAddress:String,
    city:String,
    country:String,
    paid:Boolean,
},
{
    timestamps: true,
});

export const Order = models?.Order || model('Order', OrderSchema);