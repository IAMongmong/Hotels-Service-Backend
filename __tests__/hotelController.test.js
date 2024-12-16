const hotelController = require("../src/controllers/hotelController");
const hotelService = require("../src/services/hotelService.js");

jest.mock("../src/services/hotelService.js", () => {
  return {
    getFilteredHotels: jest.fn(),
    getHotelById: jest.fn(),
    addHotelsFromJson: jest.fn().mockResolvedValue(),
    updateHotel: jest.fn(),
    deleteHotel: jest.fn(),
  };
});
jest.mock("../src/models/hotel.js"); // Mock Hotel model

describe("hotelController", () => {
  let controller;
  let mockRequest;
  let mockResponse;
  let mockNext;

  beforeEach(() => {
    // Reset mocks before each test
    mockRequest = {};
    mockResponse = {
      status: jest.fn().mockReturnThis(),
      json: jest.fn().mockReturnThis(),
    };
    mockNext = jest.fn();

    // Instantiate controller
    controller = new hotelController({ hotelService });
  });

  describe("getFilteredHotels", () => {
    it("should return filtered hotels successfully", async () => {
      // Arrange
      mockRequest.query = { country: "USA", city: "New York" };
      const mockHotels = [{ id: 1, name: "Hotel A", city: "New York" }];
      hotelService.getFilteredHotels.mockResolvedValue(mockHotels);

      // Act
      await controller.getFilteredHotels(mockRequest, mockResponse, mockNext);

      // Assert
      expect(hotelService.getFilteredHotels).toHaveBeenCalledWith({
        country: "USA",
        city: "New York",
      });
      expect(mockResponse.status).toHaveBeenCalledWith(200);
      expect(mockResponse.json).toHaveBeenCalledWith(mockHotels);
    });

    it("should return 404 if no hotels are found", async () => {
      // Arrange
      mockRequest.query = { country: "Unknown" };
      hotelService.getFilteredHotels.mockResolvedValue([]);

      // Act
      await controller.getFilteredHotels(mockRequest, mockResponse, mockNext);

      // Assert
      expect(mockResponse.status).toHaveBeenCalledWith(404);
      expect(mockResponse.json).toHaveBeenCalledWith({
        error: "No hotels found with the specified filters",
      });
    });
  });

  describe("getHotelById", () => {
    it("should return a hotel by ID", async () => {
      // Arrange
      mockRequest.params = { id: 1 };
      const mockHotel = { id: 1, name: "Hotel A" };
      hotelService.getHotelById.mockResolvedValue(mockHotel);

      // Act
      await controller.getHotelById(mockRequest, mockResponse, mockNext);

      // Assert
      expect(hotelService.getHotelById).toHaveBeenCalledWith(1);
      expect(mockResponse.status).toHaveBeenCalledWith(200);
      expect(mockResponse.json).toHaveBeenCalledWith(mockHotel);
    });

    it("should return 404 if hotel is not found", async () => {
      // Arrange
      mockRequest.params = { id: 999 };
      hotelService.getHotelById.mockResolvedValue(null);

      // Act
      await controller.getHotelById(mockRequest, mockResponse, mockNext);

      // Assert
      expect(mockResponse.status).toHaveBeenCalledWith(404);
      expect(mockResponse.json).toHaveBeenCalledWith({ error: "Hotel not found" });
    });
  });

  describe("createHotel", () => {
    it("should add hotels from JSON successfully", async () => {
      // Arrange
      mockRequest.is = jest.fn((type) => type === "application/json");
      mockRequest.body = [{"id":4,"name":"hello","address":"TFG","email":"4D@gmail","webLink":"google.com","country":"Taiwan","city":"Taipei","longitude":"4H","latitude":"4I","is_open":1}];
      hotelService.addHotelsFromJson = jest.fn().mockResolvedValue();

      // Act
      await controller.createHotel(mockRequest, mockResponse, mockNext);

      // Assert
      expect(hotelService.addHotelsFromJson).toHaveBeenCalledWith(mockRequest.body);
      expect(mockResponse.status).toHaveBeenCalledWith(200);
      expect(mockResponse.json).toHaveBeenCalledWith({
        message: "Hotel(s) added successfully!",
      });
    });

    it("should return 400 if no file is uploaded for CSV", async () => {
      // Arrange
      mockRequest.is = jest.fn().mockReturnValue("multipart/form-data");
      mockRequest.file = null;

      // Act
      await controller.createHotel(mockRequest, mockResponse, mockNext);

      // Assert
      expect(mockResponse.status).toHaveBeenCalledWith(400);
      expect(mockResponse.json).toHaveBeenCalledWith({ error: "No file uploaded" });
    });
  });

  describe("updateHotel", () => {
    it("should update a hotel successfully", async () => {
      // Arrange
      mockRequest.params = { id: 1 };
      mockRequest.body = { name: "Updated Hotel" };
      jest.spyOn(hotelService, "updateHotel").mockResolvedValue(true);
  
      // Act
      await controller.updateHotel(mockRequest, mockResponse, mockNext);
  
      // Assert
      expect(hotelService.updateHotel).toHaveBeenCalledWith(1, { name: "Updated Hotel" });
      expect(mockResponse.status).toHaveBeenCalledWith(200);
      expect(mockResponse.json).toHaveBeenCalledWith({
        message: "Hotel updated successfully",
      });
    });
  
    it("should return 404 if hotel is not found", async () => {
      // Arrange
      mockRequest.params = { id: 999 };
      mockRequest.body = {};
      jest.spyOn(hotelService, "updateHotel").mockResolvedValue(null);
  
      // Act
      await controller.updateHotel(mockRequest, mockResponse, mockNext);
  
      // Assert
      expect(hotelService.updateHotel).toHaveBeenCalledWith(999, {});
      expect(mockResponse.status).toHaveBeenCalledWith(404);
      expect(mockResponse.json).toHaveBeenCalledWith({ error: "Hotel not found" });
    });
  });
  
  describe("deleteHotel", () => {
    it("should delete a hotel successfully", async () => {
      // Arrange
      mockRequest.params = { id: 1 };
      jest.spyOn(hotelService, "deleteHotel").mockResolvedValue(true);
  
      // Act
      await controller.deleteHotel(mockRequest, mockResponse, mockNext);
  
      // Assert
      expect(hotelService.deleteHotel).toHaveBeenCalledWith(1);
      expect(mockResponse.status).toHaveBeenCalledWith(200);
      expect(mockResponse.json).toHaveBeenCalledWith({
        message: "Hotel deleted successfully",
      });
    });
  
    it("should return 404 if hotel is not found", async () => {
      // Arrange
      mockRequest.params = { id: 999 };
      jest.spyOn(hotelService, "deleteHotel").mockResolvedValue(null);
  
      // Act
      await controller.deleteHotel(mockRequest, mockResponse, mockNext);
  
      // Assert
      expect(hotelService.deleteHotel).toHaveBeenCalledWith(999);
      expect(mockResponse.status).toHaveBeenCalledWith(404);
      expect(mockResponse.json).toHaveBeenCalledWith({ error: "Hotel not found" });
    });
  });
  
});
