import Product from '../models/Product.js'
import ProductStat from '../models/ProductStat.js'
import User from '../models/User.js'
import Transaction from '../models/Transaction.js'
import getCountryIso3 from "country-iso-2-to-3"


// ==========================
// Funciones de Productos
// ==========================

// Crear producto
export const createProduct = async (req, res) => {
    try {
        const { name, price, description, rating, supply } = req.body;
        const newProduct = new Product({
            name, price, description, rating, supply
        });
        const savedProduct = await newProduct.save();
        res.status(201).json(savedProduct);
    } catch (error) {
        res.status(409).json({ message: error.message });
    }
};

// Obtener productos
export const getProductsSHORT = async (req, res) => {
    try {
        const products = await Product.find();
        res.status(200).json(products);
    } catch (error) {
        res.status(404).json({ message: error.message });
    }
};

// Eliminar producto por ID
export const deleteProduct = async (req, res) => {
    try {
        const { id } = req.params;
        await Product.findByIdAndDelete(id);
        res.status(200).json({ message: "Product deleted successfully" });
    } catch (error) {
        res.status(404).json({ message: error.message });
    }
};

//product stats
export const getProducts = async(req,res) =>{
    try{
        const products = await Product.find()
        const productsWithStats = await Promise.all(
            products.map(async(product) =>{
                const stat = await ProductStat.find({
                    productId:product._id
                })
                return{
                    ...product._doc,
                    stat
                }
            })
        )
        return res.status(200).json(productsWithStats)
    }
    catch(error){
        return res.status(404).json({message: error.message})
    }
}

// ==========================
// Funciones de Usuarios
// ==========================

// Crear usuario
export const createUser = async (req, res) => {
    try {
        const { name, email, password, city, state, country, occupation, phoneNumber, role } = req.body;
        const newUser = new User({
            name, email, password, city, state, country, occupation, phoneNumber, role
        });
        const savedUser = await newUser.save();
        res.status(201).json(savedUser);
    } catch (error) {
        res.status(409).json({ message: error.message });
    }
};

// Obtener usuarios (solo con rol "user")
export const getCustomersSHORT = async (req, res) => {
    try {
        const customers = await User.find({ role: "user" }).select("-password");
        return res.status(200).json(customers);
    } catch (error) {
        return res.status(404).json({ message: error.message });
    }
};

// Eliminar usuario por ID
export const deleteUser = async (req, res) => {
    try {
        const { id } = req.params;
        await User.findByIdAndDelete(id);
        res.status(200).json({ message: "User deleted successfully" });
    } catch (error) {
        res.status(404).json({ message: error.message });
    }
};
export const getCustomers = async(req,res) =>{
    try{
        const customers = await User.find({ role:"user" }).select("-password")
        return res.status(200).json(customers)
    }
    catch(error){
        return res.status(404).json({message: error.message})
    }
}

// ==========================
// Funciones de Transacciones
// ==========================

// Crear transacción
export const createTransaction = async (req, res) => {
    try {
        const { userId, cost, products } = req.body;
        const newTransaction = new Transaction({
            userId, cost, products
        });
        const savedTransaction = await newTransaction.save();
        res.status(201).json(savedTransaction);
    } catch (error) {
        res.status(409).json({ message: error.message });
    }
};

// Obtener transacciones
export const getTransactionsSHORT = async (req, res) => {
    try {
        const { page = 1, pageSize = 20, sort = null, search = "" } = req.query;

        // Generar sort
        const generateSort = () => {
            const sortParsed = JSON.parse(sort);
            const sortFormatted = {
                [sortParsed.field]: sortParsed.sort === "asc" ? 1 : -1
            };
            return sortFormatted;
        };

        const sortFormatted = Boolean(sort) ? generateSort() : {};

        const transactions = await Transaction.find({
            $or: [
                { cost: { $regex: new RegExp(search, "i") } },
                { userId: { $regex: new RegExp(search, "i") } }
            ],
        })
            .sort(sortFormatted)
            .skip(page * pageSize)
            .limit(pageSize);

        const total = await Transaction.countDocuments({
            cost: { $regex: search, $options: "i" }
        });

        res.status(200).json({ transactions, total });
    } catch (error) {
        res.status(404).json({ message: error.message });
    }
};

// Eliminar transacción por ID
export const deleteTransaction = async (req, res) => {
    try {
        const { id } = req.params;
        await Transaction.findByIdAndDelete(id);
        res.status(200).json({ message: "Transaction deleted successfully" });
    } catch (error) {
        res.status(404).json({ message: error.message });
    }
};
export const getTransactions = async(req,res) =>{
    try{
        //sort data - server side
        const { page = 1, pageSize = 20, sort = null,search = "" } = req.query

        // format sort
        const generateSort = () =>{
            const sortParsed = JSON.parse(sort)
            const sortFormatted = {
                [sortParsed.field]:sortParsed.sort ="asc" ? 1 : -1
            };

            return sortFormatted
        }
        const sortFormatted = Boolean(sort) ? generateSort() : {}

        const transactions = await Transaction.find({
            $or:[
                { cost: {$regex: new RegExp(search,"i")} },
                { userId: {$regex: new RegExp(search,"i")} }
            ],
        })
        .sort(sortFormatted)
        .skip(page * pageSize)
        .limit(pageSize)

        const total = await Transaction.countDocuments({
            name:{ $regex: search, $options: "i" }
        })
        
        res.status(200).json({
            transactions,
            total
        })
    }
    catch(error){
        return res.status(404).json({message: error.message})
    }
}

export const getGeography = async(req,res) =>{
    try{
        const users = await User.find()
        const mappedLocations = users.reduce((acc,{country}) =>{
            const countryISO3 = getCountryIso3(country)
            if(!acc[countryISO3]){
                acc[countryISO3] = 0
            }
            acc[countryISO3]++        
            return acc
        },{})

        const formattedLocations = Object.entries(mappedLocations).map(
            ([country,count]) => {
                return { id:country, value:count }
            }
        )

        res.status(200).json(formattedLocations)
    }
    catch(error){
        return res.status(404).json({message: error.message})
    }
}

