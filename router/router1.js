const express = require("express");
const router = express.Router();

const functi = require("../Controller/productinfo");
const functi1 = require("../Controller/customer");
const functi2 = require("../Controller/createorder");
const functi3 = require("../Controller/fetching");
const functi4 = require("../Controller/uptate");
const functi5=require("../Controller/getAll")
const createorderValidation = require("../validation/create");
const updatesValidation = require("../validation/update");

router.post("/postproducts", functi.postproduct);
router.post("/cus", functi1.customers);

router.post("/create", createorderValidation, functi2.createorder);
router.get("/fetching", functi3.fetching);
router.put("/update", updatesValidation, functi4.update);
router.get("/getAll",functi5.getAll)
module.exports = router;
