const express = require("express");
const multer = require("multer");
const HotelControllerClass = require("../controllers/hotelController.js");
const HotelServiceClass = require("../services/hotelService.js");
const HotelRepositoryClasss = require("../repositories/hotelRepository.js");

const upload = multer({ dest: "uploads/" }); // specify a temporary folder to store the uploaded files
const router = express.Router();

const hotelRepository = new HotelRepositoryClasss();
const hotelService= new HotelServiceClass({ hotelRepository });
const hotelController = new HotelControllerClass({ hotelService });

router.get("/", (req, res) => hotelController.getFilteredHotels(req, res)); // 根據過濾條件獲取酒店
router.get("/:id", (req, res) => hotelController.getHotelById(req, res)); 

// 上傳文件（支持 JSON 和 CSV）並創建酒店記錄
router.post("/upload", upload.single("file"), (req, res) => hotelController.createHotel(req, res));

// 更新指定 ID 的酒店
router.put("/:id", (req, res) => hotelController.updateHotel(req, res));

// 刪除指定 ID 的酒店
router.delete("/:id", (req, res) => hotelController.deleteHotel(req, res));

module.exports = router;
