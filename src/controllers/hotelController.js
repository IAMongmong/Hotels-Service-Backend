const hotelService = require("../services/hotelService.js");
const Hotel = require("../models/hotel.js");

module.exports = class hotelController {
  constructor({ hotelService }) {
    this.hotelService = hotelService;
    console.log(typeof this.hotelService);
    this.getFilteredHotels = this.getFilteredHotels.bind(this);
    this.getHotelById = this.getHotelById.bind(this);
    this.createHotel = this.createHotel.bind(this);
    this.updateHotel = this.updateHotel.bind(this);
    this.deleteHotel = this.deleteHotel.bind(this);
  }

  async getFilteredHotels(req, res) {
    try {
      const { country, city, is_open } = req.query;

      const filter = {};

      if (country) filter.country = country;
      if (city) filter.city = city;
      if (is_open !== undefined) filter.is_open = is_open;

      const hotels = await this.hotelService.getFilteredHotels(filter);

      if (hotels.length === 0) {
        return res
          .status(404)
          .json({ error: "No hotels found with the specified filters" });
      }

      res.status(200).json(hotels);
    } catch (error) {
      console.error(error);
      res.status(500).json({ error: "Failed to fetch hotels with filters" });
    }
  }

  async getHotelById(req, res) {
    try {
      const hotelId = req.params.id;
      const hotel = await this.hotelService.getHotelById(hotelId);
      if (!hotel) {
        return res.status(404).json({ error: "Hotel not found" });
      }
      res.status(200).json(hotel);
    } catch (error) {
      console.error(error);
      res.status(500).json({ error: "Failed to fetch hotel by ID" });
    }
  }

  async createHotel(req, res) {
    try {
      if (req.is("multipart/form-data")) {
        if (!req.file) {
          return res.status(400).json({ error: "No file uploaded" });
        }

        const filePath = req.file.path;
        await this.hotelService.addHotelsFromCsv(filePath);
        return res
          .status(200)
          .json({ message: "Hotels data uploaded and saved successfully!" });
      } else if (req.is("application/json")) {
        const hotelsData = req.body;
        await this.hotelService.addHotelsFromJson(hotelsData);
        return res
          .status(200)
          .json({ message: "Hotel(s) added successfully!" });
      } else {
        return res.status(400).json({ error: "Invalid Content-Type" });
      }
    } catch (error) {
      console.error(error);
      res.status(500).json({ error: error.message || "Something went wrong" });
    }
  }

  async updateHotel(req, res) {
    try {
      const hotelId = req.params.id;
      const hotelData = req.body;
  
      const result = await this.hotelService.updateHotel(hotelId, hotelData);
  
      if (!result) {
        return res.status(404).json({ error: "Hotel not found" });
      }
  
      res.status(200).json({ message: "Hotel updated successfully" });
    } catch (error) {
      console.error(error);
      res.status(500).json({ error: "Failed to update hotel" });
    }
  }
  
  async deleteHotel(req, res) {
    try {
      const hotelId = req.params.id;

      const result = await this.hotelService.deleteHotel(hotelId);
  
      if (!result) {
        return res.status(404).json({ error: "Hotel not found" });
      }
  
      res.status(200).json({ message: "Hotel deleted successfully" });
    } catch (error) {
      console.error(error);
      res.status(500).json({ error: "Failed to delete hotel" });
    }
  }  
};
