const HotelRepository = require("../src/repositories/hotelRepository");
const Hotel = require("../src/models/hotel");
const fs = require("fs");
const path = require("path");

jest.mock("../src/models/hotel");
jest.mock("fs");
jest.mock("csv-parser");

describe("HotelRepository", () => {
    let hotelRepository;

    beforeEach(() => {
        hotelRepository = new HotelRepository();
    });

    describe("getHotelsByFilter", () => {
        it("should return hotels based on filter", async () => {
            const filter = { city: "New York" };
            const hotels = [{ id: 1, name: "Hotel One" }];
            Hotel.findAll.mockResolvedValue(hotels);

            const result = await hotelRepository.getHotelsByFilter(filter);

            expect(result).toEqual(hotels);
            expect(Hotel.findAll).toHaveBeenCalledWith({ where: filter });
        });

        it("should throw an error if database query fails", async () => {
            const filter = { city: "New York" };
            Hotel.findAll.mockRejectedValue(new Error("Database error"));

            await expect(hotelRepository.getHotelsByFilter(filter)).rejects.toThrow("Error fetching hotels from the database");
        });
    });

    describe("getHotelById", () => {
        it("should return a hotel by ID", async () => {
            const hotel = { id: 1, name: "Hotel One" };
            Hotel.findByPk.mockResolvedValue(hotel);

            const result = await hotelRepository.getHotelById(1);

            expect(result).toEqual(hotel);
            expect(Hotel.findByPk).toHaveBeenCalledWith(1);
        });

        it("should throw an error if database query fails", async () => {
            Hotel.findByPk.mockRejectedValue(new Error("Database error"));

            await expect(hotelRepository.getHotelById(1)).rejects.toThrow("Database query failed");
        });
    });

    describe("addHotelsFromCsv", () => {
        it("should add hotels from CSV file", async () => {
            const filePath = path.resolve(__dirname, "hotels.csv");
            const hotelsData = [
                { name: "Hotel One", address: "Address One", email: "email1@example.com", webLink: "http://example.com", country: "Country One", city: "City One", longitude: "0.0", latitude: "0.0", is_open: true },
            ];

            fs.createReadStream.mockReturnValue({
                pipe: jest.fn().mockReturnThis(),
                on: jest.fn((event, callback) => {
                    if (event === "data") {
                        hotelsData.forEach(callback);
                    } else if (event === "end") {
                        callback();
                    }
                    return this;
                }),
            });

            Hotel.bulkCreate.mockResolvedValue();

            await hotelRepository.addHotelsFromCsv(filePath);

            expect(fs.createReadStream).toHaveBeenCalledWith(filePath);
            expect(Hotel.bulkCreate).toHaveBeenCalledWith(hotelsData);
        });

        it("should throw an error if CSV parsing fails", async () => {
            const filePath = path.resolve(__dirname, "hotels.csv");

            fs.createReadStream.mockReturnValue({
                pipe: jest.fn().mockReturnThis(),
                on: jest.fn((event, callback) => {
                    if (event === "error") {
                        callback(new Error("CSV parsing error"));
                    }
                    return this;
                }),
            });

            await expect(hotelRepository.addHotelsFromCsv(filePath)).rejects.toThrow("Failed to parse CSV data");
        });

        it("should throw an error if saving to database fails", async () => {
            const filePath = path.resolve(__dirname, "hotels.csv");
            const hotelsData = [
                { name: "Hotel One", address: "Address One", email: "email1@example.com", webLink: "http://example.com", country: "Country One", city: "City One", longitude: "0.0", latitude: "0.0", is_open: true },
            ];

            fs.createReadStream.mockReturnValue({
                pipe: jest.fn().mockReturnThis(),
                on: jest.fn((event, callback) => {
                    if (event === "data") {
                        hotelsData.forEach(callback);
                    } else if (event === "end") {
                        callback();
                    }
                    return this;
                }),
            });

            Hotel.bulkCreate.mockRejectedValue(new Error("Database error"));

            await expect(hotelRepository.addHotelsFromCsv(filePath)).rejects.toThrow("Failed to save hotel data to database");
        });
    });

    describe("addHotelsFromJson", () => {
        it("should add hotels from JSON data", async () => {
            const hotelsData = [
                { name: "Hotel One", address: "Address One", email: "email1@example.com", webLink: "http://example.com", country: "Country One", city: "City One", longitude: "0.0", latitude: "0.0", is_open: true },
            ];

            Hotel.bulkCreate.mockResolvedValue();

            await hotelRepository.addHotelsFromJson(hotelsData);

            expect(Hotel.bulkCreate).toHaveBeenCalledWith(hotelsData);
        });

        it("should throw an error if saving to database fails", async () => {
            const hotelsData = [
                { name: "Hotel One", address: "Address One", email: "email1@example.com", webLink: "http://example.com", country: "Country One", city: "City One", longitude: "0.0", latitude: "0.0", is_open: true },
            ];

            Hotel.bulkCreate.mockRejectedValue(new Error("Database error"));

            await expect(hotelRepository.addHotelsFromJson(hotelsData)).rejects.toThrow("Failed to save hotel data from JSON");
        });
    });

    describe("updateHotel", () => {
        it("should update a hotel by ID", async () => {
            const hotelId = 1;
            const hotelData = { name: "Updated Hotel" };

            Hotel.update.mockResolvedValue();

            await hotelRepository.updateHotel(hotelId, hotelData);

            expect(Hotel.update).toHaveBeenCalledWith(hotelData, { where: { id: hotelId } });
        });

        it("should throw an error if updating hotel fails", async () => {
            const hotelId = 1;
            const hotelData = { name: "Updated Hotel" };

            Hotel.update.mockRejectedValue(new Error("Database error"));

            await expect(hotelRepository.updateHotel(hotelId, hotelData)).rejects.toThrow("Failed to update hotel");
        });
    });

    describe("deleteHotel", () => {
        it("should delete a hotel by ID", async () => {
            const hotelId = 1;

            Hotel.destroy.mockResolvedValue();

            await hotelRepository.deleteHotel(hotelId);

            expect(Hotel.destroy).toHaveBeenCalledWith({ where: { id: hotelId } });
        });

        it("should throw an error if deleting hotel fails", async () => {
            const hotelId = 1;

            Hotel.destroy.mockRejectedValue(new Error("Database error"));

            await expect(hotelRepository.deleteHotel(hotelId)).rejects.toThrow("Failed to delete hotel");
        });
    });
});
