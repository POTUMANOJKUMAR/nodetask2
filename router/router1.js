const express = require("express");
const router = express.Router();

const mainF = require("../Controller/createorder");//mainF(class)
const mainF1=require("../Controller/excell_pdf")//mainF1(class)


//validation schemas
const createorderValidation = require("../validation/create");
const updatesValidation = require("../validation/update");
//multer 
const upload = require('../multermiddleware/multermiddle'); 

// mainF(class)
router.post("/postproducts", mainF.postproduct);
router.post("/cus", mainF.customers);
router.post("/create", createorderValidation,mainF.createorder);
router.get("/fetching", mainF.fetching);
router.put("/update", updatesValidation, mainF.update);
//mainF1(class)
router.get("/getAll",mainF1.excell);
router.get("/invoice",mainF1.invoice);
router.post('/upload', upload.single('excell'), mainF1.multer)


module.exports = router;
