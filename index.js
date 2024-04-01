const connectToDb = require("./db")
connectToDb();
const express = require('express')
const app = express()
const port = 5000
app.use(express.json())
//Available routes
app.use('/auth', require('./routes/userauth'));
app.use('/product', require('./routes/product'));
app.use('/orders', require('./routes/orders'));
app.use('/cart', require('./routes/cart'));
app.use('/checkout', require('./routes/checkout'));
app.use('/images', express.static("./assets/images"));
app.listen(port, () => {
    console.log(`Example app listening on port ${port}`)
})

