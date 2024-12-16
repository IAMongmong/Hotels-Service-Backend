const Hotel = require("../models/hotel.js");
const fs = require("fs");
const csvParser = require("csv-parser");

module.exports = class hotelRepository {
  async getHotelsByFilter(filter) {
    try {
      const hotels = await Hotel.findAll({
        where: filter,
      });
      return hotels;
    } catch (error) {
      console.log(error);
      throw new Error("Error fetching hotels from the database");
      // console.log(filter);
    }
  }

  async getHotelById(hotelId) {
    try {
      const hotel = await Hotel.findByPk(hotelId);
      return hotel;
    } catch (error) {
      console.error("Error fetching hotel by ID:", error);
      throw new Error("Database query failed");
    }
  }

  async addHotelsFromCsv(filePath) {
    const hotelsData = [];
    return new Promise((resolve, reject) => {
      fs.createReadStream(filePath)
        .pipe(csvParser())
        .on("data", (row) => {
          hotelsData.push({
            name: row.name,
            address: row.address,
            email: row.email,
            webLink: row.webLink,
            country: row.country,
            city: row.city,
            longitude: row.longitude,
            latitude: row.latitude,
            is_open: row.is_open,
          });
        })
        .on("end", async () => {
          try {
            await Hotel.bulkCreate(hotelsData);
            resolve();
          } catch (error) {
            console.error("Error saving hotel data to database:", error);
            reject(new Error("Failed to save hotel data to database"));
          }
        })
        .on("error", (error) => {
          console.error("Error parsing CSV data:", error);
          reject(new Error("Failed to parse CSV data"));
        });
    });
  }

  async addHotelsFromJson(hotelsData) {
    try {
      const parsedData = hotelsData.map((row) => ({
        name: row.name,
        address: row.address,
        email: row.email,
        webLink: row.webLink,
        country: row.country,
        city: row.city,
        longitude: row.longitude,
        latitude: row.latitude,
        is_open: row.is_open,
      }));
      await Hotel.bulkCreate(parsedData);
    } catch (error) {
      console.error("Error saving hotel data from JSON:", error);
      throw new Error("Failed to save hotel data from JSON");
    }
  }

  async updateHotel(hotelId, hotelData) {
    try {
      await Hotel.update(hotelData, {
        where: {
          id: hotelId,
        },
      });
    } catch (error) {
      console.error("Error updating hotel:", error);
      throw new Error("Failed to update hotel");
    }
  }

  async deleteHotel(hotelId) {
    try {
      await Hotel.destroy({
        where: {
          id: hotelId,
        },
      });
    } catch (error) {
      console.error("Error deleting hotel:", error);
      throw new Error("Failed to delete hotel");
    }
  }
};
