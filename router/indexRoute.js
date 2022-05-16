const express = require("express");
const router = new express.Router();
const bcrypt = require('bcrypt');
// const mongoose = require('mongoose');
// const DB = process.env.DATABASE
require('../db/mongoose');

const User = require("../models/userSchema");
const Product = require("../models/productSchema");
const Admin = require("../models/adminSchema");
const Constant = require("../models/constantSchema");

const { requiredAuth, checkUser } = require("../auth/authMiddleware.js");
const { createToken } = require('../auth/jwttoken.js')

router.get('/', async (req, res) => {
    res.redirect('/home')
})

// admin routes
router.get('/admin', async (req, res) => {
    res.redirect('/admin/dashboard')
})

router.get('/admin/login', async (req, res) => {
    res.render('adminLogin', { message: req.flash('message') })
})

router.get('/admin/addProduct', requiredAuth, checkUser, async (req, res) => {
    const constant = await Constant.findOne({ });
    res.render('addProduct', { message: req.flash('message'), personCodeInitials: constant.personCodeInitials })
})

router.get('/admin/dashboard', requiredAuth, checkUser, async (req, res) => {
    const allUsers = await User.find({ });
    res.render('adminDashboard', { message: req.flash('message'), allUsers: allUsers })
})

router.get('/admin/logout', async (req, res) => {
    res.cookie('jwt', '', { maxAge: 1 });
    req.flash('message', 'Logged Out Successfully')
    res.redirect('/admin/login')
})

router.post('/adminLogin', async (req, res) => {
    try {
        const { username, password } = req.body;

        if (!username || !password ) {
            req.flash('message', 'Please fill all the fields')
            res.redirect('/admin/login')
            // return res.status(400).json({ error: "Please fill all the fields" })
        }

        const userLogin = await Admin.findOne({ username: username });

        if (userLogin) {
            const isMatch = await bcrypt.compare(password, userLogin.password);
            if (!isMatch) {
                req.flash('message', 'Invalid Credentials')
                res.redirect('/admin/login')
                // res.status(400).json({ error: "Invalid Credentials" })
            } else {
                // generating tokens 
                const token = createToken(userLogin._id);
                res.cookie('jwt', token, { httpOnly: true, maxAge: 2 * 24 * 60 * 60 * 1000 })
                req.flash('message', 'Logged In Successfully')
                res.redirect('/admin/dashboard/')
            }
        } else {
            req.flash('message', 'Invalid Credentials')
            res.redirect('/admin/login')
            // res.status(400).json({ error: "Invalid Credentials" })
        }

        // const admin = new Admin({ username, password })

        // const adminRegistered = await admin.save();

        // if (adminRegistered) {
        //     const token = createToken(admin._id);
        //     res.cookie('jwt', token, { httpOnly: true, maxAge: 2 * 24 * 60 * 60 * 1000 })
        //     req.flash('message', 'Admin Registered Successfully')
        //     res.redirect('/admin/dashboard')
        //     // res.status(201).json({ message: "User Registered Successfully" });
        // } else {
        //     req.flash('message', 'Failed to Add')
        //     res.redirect('/admin/login')
        //     // res.status(500).json({ error: "Failed to Register" })
        // }
        
    } catch (err) {
        console.log(err)
    }
})

router.post('/setPersonCode', async (req, res) => {
    try {
        const { personCodeInitials } = req.body;

        if (!personCodeInitials) {
            req.flash('message', 'Please fill all the fields')
            res.redirect('/admin/addProduct')
            // return res.status(400).json({ error: "Please fill all the fields" })
        }

        const constant = await Constant.findOne({ });
        constant.personCodeInitials = personCodeInitials;


        // const constant = new Constant({ personCodeInitials })

        const constantRegistered = await constant.save();

        if (constantRegistered) {
            req.flash('message', 'Constant Updated Successfully')
            res.redirect('/admin/addProduct')
            // res.status(201).json({ message: "User Registered Successfully" });
        } else {
            req.flash('message', 'Failed to Add')
            res.redirect('/admin/addProduct')
            // res.status(500).json({ error: "Failed to Register" })
        }
        
    } catch (err) {
        console.log(err)
    }
})

router.post('/addProduct', async (req, res) => {
    try {
        const { productNo, skuCode } = req.body;

        if (!productNo || !skuCode) {
            req.flash('message', 'Please fill all the fields')
            res.redirect('/admin/addProduct')
            // return res.status(400).json({ error: "Please fill all the fields" })
        }

        const productNoCheck = await Product.findOne({ productNo: productNo })

        if(productNoCheck != null) {
            req.flash('message', 'This Product No. already exist. Choose a different one.')
            return res.redirect('/admin/addProduct')
        }
        const productSKUCheck = await Product.findOne({ skuCode: skuCode })
        if(productSKUCheck != null) {
            req.flash('message', 'This SKU Code already exists. Choose a different one.')
            return res.redirect('/admin/addProduct')
        }

        const product = new Product({ productNo, skuCode, price })

        const productRegistered = await product.save();

        if (productRegistered) {
            req.flash('message', 'Product Registered Successfully')
            res.redirect('/admin/addProduct')
            // res.status(201).json({ message: "User Registered Successfully" });
        } else {
            req.flash('message', 'Failed to Add')
            res.redirect('/admin/addProduct')
            // res.status(500).json({ error: "Failed to Register" })
        }
        
    } catch (err) {
        console.log(err)
    }
})

// public routes
router.get('/home', async (req, res) => {
    const allProducts = await Product.find({})

    res.render('home', { allProducts: allProducts, message: req.flash('message') })
})

router.post('/submit', async (req, res) => {
    try {
        const { name, email, phoneNo, products } = req.body;

        if (!name || !email || !phoneNo || !products) {
            req.flash('message', 'Please fill all the fields')
            res.redirect('/home')
            // return res.status(400).json({ error: "Please fill all the fields" })
        }

        // const userExist = await User.findOne({ email: email });

        // if (userExist) {
        //     const user = await User.findOne({ email: email });

        //     const arr = products.split(' , ');
        //     for(let i=0; i<arr.length; i++) {
        //         var item = arr[i].split(' x ');
        //         var productNo = item[1].trim();
        //         const product = await Product.findOne({ productNo: productNo })

        //         var productCode = user.user_code + "_";
        //         if(user.allProducts.length < 10) {
        //             productCode += '0'
        //             productCode += user.allProducts.length + 1;
        //         } else {
        //             productCode +=  user.allProducts.length + 1;
        //         }
                
        //         user.allProducts.push({
        //             skuCode: product.skuCode,
        //             productNo: product.productNo,
        //             productCode: productCode,
        //             quantity: parseInt(item[0].trim()),
        //             price: product.price
        //         })
        //     }
        //     const userUpdated = await user.save();

        //     if (userUpdated) {
        //         req.flash('message', 'Product Saved')
        //         res.redirect('/home')
        //         // res.status(201).json({ message: "User Registered Successfully" });
        //     } else {
        //         req.flash('message', 'Failed to Add')
        //         res.redirect('/home')
        //         // res.status(500).json({ error: "Failed to Register" })
        //     }
        // } 
        // else {
            const arr = products.split(' , ');
            const allProducts = []

            const allUsers = await User.find({ });
            const constant = await Constant.findOne({ });
            var user_code = constant.personCodeInitials;
            if(allUsers.length < 9) {
                user_code += '00'
                user_code += allUsers.length + 1;
            } else if(allUsers.length < 100) {
                user_code += '0'
                user_code += allUsers.length + 1;
            } else {
                user_code += allUsers.length + 1;
            }
            for(let i=0; i<arr.length; i++) {
                var item = arr[i].split(/['x(]/);
                var quantity = parseInt(item[0].trim())
                var productNo = item[1].trim();
                var price = parseInt(item[2].trim().slice(0, -1));
                const product = await Product.findOne({ productNo: productNo })

                var productCode = user_code + "_";
                if(i < 9) {
                    productCode += '0'
                    productCode += i +1;
                } else {
                    productCode += i +1;
                }
                
                allProducts.push({
                    skuCode: product.skuCode,
                    productNo: product.productNo,
                    productCode: productCode,
                    quantity: quantity,
                    price: price
                })
            }
            var date = new Date()

            const user = new User({ name, email, phoneNo, user_code, date, allProducts })
            const userRegistered = await user.save();

            if (userRegistered) {
                req.flash('message', 'Entry made Successfully!')
                res.redirect('/home')
                // res.status(201).json({ message: "User Registered Successfully" });
            } else {
                req.flash('message', 'Failed to Add the Entry!')
                res.redirect('/home')
                // res.status(500).json({ error: "Failed to Register" })
            }
        // }
    } catch (err) {
        console.log(err)
    }
})

module.exports = router