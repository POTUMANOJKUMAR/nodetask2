const express = require("express");
const router = express.Router();

const functi = require("../Controller/controller");
const functi1 = require("../Controller/customer");
const functi2 = require("../Controller/createorder");
const functi3 = require("../Controller/fetching");
const ValidationMiddleware = require("../validation/validate"); 

router.post("/postproducts", functi.postproduct);
router.post("/cus", functi1.customers);

router.post("/create", ValidationMiddleware, functi2.createorder); 
router.get("/fetching", functi3.fetching);

module.exports = router;
