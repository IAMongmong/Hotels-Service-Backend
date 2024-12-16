const hotelService = require('../src/services/hotelService');

jest.mock('../src/repositories/hotelRepository', () => {
    return {
        getHotelsByFilter: jest.fn(),
        getHotelById: jest.fn(),
        addHotelsFromCsv: jest.fn(),
        addHotelsFromJson: jest.fn(),
        updateHotel: jest.fn(),
        deleteHotel: jest.fn(),
    };
});

describe('hotelService', () => {
    let service;
    let mockHotelRepository;

    beforeEach(() => {
        mockHotelRepository = require('../src/repositories/hotelRepository');

        service = new hotelService({ hotelRepository: mockHotelRepository });
    });

    describe('getFilteredHotels', () => {
        it('should return filtered hotels successfully', async () => {
            // Arrange
            const filter = { city: 'New York' };
            const hotels = [{ id: 1, name: 'Hotel One' }];
            mockHotelRepository.getHotelsByFilter.mockResolvedValue(hotels);

            // Act
            const result = await service.getFilteredHotels(filter);

            // Assert
            expect(mockHotelRepository.getHotelsByFilter).toHaveBeenCalledWith(filter);
            expect(result).toEqual(hotels);
        });
    });

    describe('getHotelById', () => {
        it('should return hotel by id successfully', async () => {
            // Arrange
            const hotelId = 1;
            const hotel = { id: 1, name: 'Hotel One' };
            mockHotelRepository.getHotelById.mockResolvedValue(hotel);

            // Act
            const result = await service.getHotelById(hotelId);

            // Assert
            expect(mockHotelRepository.getHotelById).toHaveBeenCalledWith(hotelId);
            expect(result).toEqual(hotel);
        });
    });

    describe('addHotelsFromCsv', () => {
        it('should add hotels from CSV file successfully', async () => {
            // Arrange
            const file = 'hotels.csv';
            mockHotelRepository.addHotelsFromCsv.mockResolvedValue(true);

            // Act
            const result = await service.addHotelsFromCsv(file);

            // Assert
            expect(mockHotelRepository.addHotelsFromCsv).toHaveBeenCalledWith(file);
            expect(result).toBe(true);
        });
    });

    describe('addHotelsFromJson', () => {
        it('should add hotels from JSON data successfully', async () => {
            // Arrange
            const hotelsData = [{ id: 1, name: 'Hotel One' }];
            mockHotelRepository.addHotelsFromJson.mockResolvedValue(true);

            // Act
            const result = await service.addHotelsFromJson(hotelsData);

            // Assert
            expect(mockHotelRepository.addHotelsFromJson).toHaveBeenCalledWith(hotelsData);
            expect(result).toBe(true);
        });
    });

    describe('updateHotel', () => {
        it('should update hotel data successfully', async () => {
            // Arrange
            const hotelId = 1;
            const hotelData = { name: 'Updated Hotel' };
            mockHotelRepository.updateHotel.mockResolvedValue(true);

            // Act
            const result = await service.updateHotel(hotelId, hotelData);

            // Assert
            expect(mockHotelRepository.updateHotel).toHaveBeenCalledWith(hotelId, hotelData);
            expect(result).toBe(true);
        });
    });

    describe('deleteHotel', () => {
        it('should delete hotel by id successfully', async () => {
            // Arrange
            const hotelId = 1;
            mockHotelRepository.deleteHotel.mockResolvedValue(true);

            // Act
            const result = await service.deleteHotel(hotelId);

            // Assert
            expect(mockHotelRepository.deleteHotel).toHaveBeenCalledWith(hotelId);
            expect(result).toBe(true);
        });
    });
});
