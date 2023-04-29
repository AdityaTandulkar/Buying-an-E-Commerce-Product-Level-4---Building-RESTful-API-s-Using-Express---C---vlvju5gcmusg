const fs = require('fs');
const express = require('express');
const app = express();


// Importing products from products.json file
let products = JSON.parse(
    fs.readFileSync(`${__dirname}/data/product.json`)
);


// Middlewares
app.use(express.json());

// Write PATCH endpoint to buy a product for the client here
// Endpoint /api/v1/products/:id


app.patch("/api/v1/products/:id", (req, res)=>{
    const {id} = req.params;

    let item = products.find((item)=>(item.id === Number(id)))

    if(item){
        const quantity = item.quantity;
        item = {...item, ["quantity"] : quantity-1};

        if(quantity === 0){
            res.status(404).json({
                "status": "success",
                "message": `${item.name}, Out of stock!`,
            })
        }
        else{
            products.forEach((elem, idx)=>{
                if(elem.id === item.id){
                    products[idx] = {...item};

                    fs.writeFileSync(`${__dirname}/data/product.json`, JSON.stringify(products));

                    res.status(200).json({
                        "status": "success",
                        "message": "Thank you for purchasing "+item.name,
                        "product": item
                    });

                    return;
                }
            })
        }
    }
    else{
        res.status(404).json({
            "status": "failed",
            "message": "Product not found!"
        })
    }
})




module.exports = app;
