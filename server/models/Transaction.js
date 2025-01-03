import mongoose from 'mongoose'

const TransactionSchema = new mongoose.Schema({
    userId:String,
    cost:String,
    products:{
        type:[mongoose.Types.ObjectId],
        ref:'Products'
    },
},{timestamps:true})

const Transaction = mongoose.model("transaction",TransactionSchema)
export default Transaction