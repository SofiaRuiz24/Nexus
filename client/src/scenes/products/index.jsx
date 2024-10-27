import React, { useState, useEffect } from 'react';
import { useGetProductsQuery } from 'state/api';
import {
    Box,
    Card,
    CardActions,
    CardContent,
    Collapse,
    Button,
    Typography,
    Rating,
    TextField,
    IconButton,
    useTheme,
    useMediaQuery
} from '@mui/material';
import DeleteIcon from '@mui/icons-material/Delete';
import Header from 'components/Header';
import Loader from 'loader/Loader';
import { deleteProduct, postProduct } from "../../lib/apiRequests"

const Product = ({
    _id,
    name,
    description,
    price,
    rating,
    category,
    supply,
    stat,
    onDelete
}) => {
    const theme = useTheme();
    const [isExpanded, setIsExpanded] = useState(false);

    return (
        <Card
            sx={{
                backgroundImage: 'none',
                backgroundColor: theme.palette.background.alt,
                borderRadius: '0.55rem'
            }}
        >
            <CardContent>
                <Typography sx={{ fontSize: '14px', color: theme.palette.secondary[700] }} gutterBottom>
                    {category}
                </Typography>
                <Typography variant="h5" component="div">{name}</Typography>
                <Typography sx={{ mb: '1.5rem', color: theme.palette.secondary[400] }}>
                    ${Number(price).toFixed(2)}
                </Typography>
                <Rating value={rating} readOnly />
                <Typography variant="body2">{description}</Typography>
            </CardContent>
            <CardActions>
                <Button variant="primary" size="small" onClick={() => setIsExpanded(!isExpanded)}>
                    Ver más
                </Button>
                {/* Botón de eliminar */}
                <IconButton onClick={() => onDelete(_id)} color="error">
                    <DeleteIcon />
                </IconButton>
            </CardActions>
            <Collapse
                in={isExpanded}
                timeout="auto"
                unmountOnExit
                sx={{ color: theme.palette.neutral[300] }}
            >
                <CardContent>
                    <Typography>id: {_id}</Typography>
                    <Typography>Supply Left: {supply}</Typography>
                    <Typography>Yearly Sales This Year: {stat.yearlySalesTotal}</Typography>
                    <Typography>Yearly Units Sold This Year: {stat.yearlyTotalSoldUnits}</Typography>
                </CardContent>
            </Collapse>
        </Card>
    );
};

const Products = () => {
    const { data, isLoading, error, refetch } = useGetProductsQuery();
    const isNonMobile = useMediaQuery('(min-width:1000px)');
    const [products, setProducts] = useState(data || []);
    const [newProduct, setNewProduct] = useState({
        name: '',
        price: '',
        description: '',
        rating: '',
        supply: ''
    });

    useEffect(() => {
        refetch();
    }, [refetch])

    const handleChange = (e) => {
        const { name, value } = e.target;
        setNewProduct({ ...newProduct, [name]: value });
    };

    const handleAddProduct = async () => {
        const productToAdd = {
            ...newProduct,
            _id: products.length + 1,
            price: parseFloat(newProduct.price),
            rating: parseFloat(newProduct.rating),
            supply: parseInt(newProduct.supply, 10),
            category: 'New',
            stat: {
                yearlySalesTotal: 0,
                yearlyTotalSoldUnits: 0
            }
        };
        setNewProduct({ name: '', price: '', description: '', rating: '', supply: '' });
        const response = await postProduct(newProduct)
        if(response.status === 201){
            setProducts([...products, productToAdd]);
            refetch();
        } else {
            throw new Error("Error creando nuevo producto")
        }
    };

    const handleDeleteProduct = async(id) => {
        const response = await deleteProduct(id);
        if(response.status === 200){
            setProducts(products.filter((product) => product._id !== id));
            refetch();
        } else {
            throw new Error("Error borrando producto")
        }
    };

    return (
        <Box m="1.5rem 2.5rem">
            <Header title="PRODUCTOS" subtitle="Lista de todos los productos" />

            {/* Formulario para añadir productos */}
            <Box mb="2rem" mt="2rem">
                <Typography variant="h6">Agregar Nuevo Producto</Typography>
                <Box display="grid" gridTemplateColumns="repeat(2, 1fr)" gap="1rem" mt="1rem">
                    <TextField
                        label="Nombre"
                        name="name"
                        value={newProduct.name}
                        onChange={handleChange}
                    />
                    <TextField
                        label="Precio"
                        name="price"
                        type="number"
                        value={newProduct.price}
                        onChange={handleChange}
                    />
                    <TextField
                        label="Descripción"
                        name="description"
                        value={newProduct.description}
                        onChange={handleChange}
                    />
                    <TextField
                        label="Rating"
                        name="rating"
                        type="number"
                        value={newProduct.rating}
                        onChange={handleChange}
                    />
                    <TextField
                        label="Stock"
                        name="supply"
                        type="number"
                        value={newProduct.supply}
                        onChange={handleChange}
                    />
                </Box>
                <Button variant="contained" onClick={handleAddProduct} sx={{ mt: '1rem' }}>
                    Agregar Producto
                </Button>
            </Box>

            {isLoading ? (
                <Loader />
            ) : error ? (
                <Typography color="error">Algo salió mal</Typography>
            ) : (
                <Box
                    mt="20px"
                    display="grid"
                    gridTemplateColumns="repeat(4, minmax(0, 1fr))"
                    justifyContent="space-between"
                    rowGap="20px"
                    columnGap="1.33%"
                    sx={{
                        '& > div': { gridColumn: isNonMobile ? undefined : 'span 4' }
                    }}
                >
                    {products.map((product) => (
                        <Product key={product._id} {...product} onDelete={() => {handleDeleteProduct(product._id)}} />
                    ))}
                </Box>
            )}
        </Box>
    );
};

export default Products;
