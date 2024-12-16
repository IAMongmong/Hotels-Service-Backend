const hotelRepository = require("../repositories/hotelRepository.js");

module.exports = class hotelService {
  constructor({ hotelRepository }) {
    this.hotelRepository = hotelRepository;
  }

  async getFilteredHotels(filter) {
    try {
      console.log("Filter used for hotels:", filter);
      return await this.hotelRepository.getHotelsByFilter(filter);
    } catch (error) {
      console.log(error); // Fixed the missing console.log argument
      throw new Error("Failed to fetch hotels by filter");
    }
  }

  async getHotelById(hotelId) {
    return await this.hotelRepository.getHotelById(hotelId);
  }

  async addHotelsFromCsv(file) {
    return await this.hotelRepository.addHotelsFromCsv(file);
  }

  async addHotelsFromJson(hotelsData) {
    return await this.hotelRepository.addHotelsFromJson(hotelsData);
  }

  async updateHotel(hotelId, hotelData) {
    return await this.hotelRepository.updateHotel(hotelId, hotelData);
  }

  async deleteHotel(hotelId) {
    return await this.hotelRepository.deleteHotel(hotelId);
  }
};
