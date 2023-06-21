import Hotel from '../models/Hotel.js';
import Room from '../models/Room.js';

// Create a new hotel
export const createHotel = async (req, res, next) => {
  const newHotel = new Hotel(req.body);

  try {
    const savedHotel = await newHotel.save();
    res.status(200).json(savedHotel);
  } catch (err) {
    next(err);
  }
};

// Update a hotel
export const updateHotel = async (req, res, next) => {
  try {
    // Find the hotel by ID and update its data with the values from the request body
    const updatedHotel = await Hotel.findByIdAndUpdate(
      req.params.id, // Hotel ID to update
      { $set: req.body }, // Updated data for the hotel
      { new: true } // Return the updated hotel after the update is applied
    );

    res.status(200).json(updatedHotel); // Send the updated hotel as the response
  } catch (err) {
    next(err); // Pass any errors to the error-handling middleware
  }
};

// Delete a hotel
export const deleteHotel = async (req, res, next) => {
  try {
    await Hotel.findByIdAndDelete(req.params.id);
    res.status(200).json('Hotel has been deleted.');
  } catch (err) {
    next(err);
  }
};

// Get a hotel by ID
export const getHotel = async (req, res, next) => {
  try {
    const hotel = await Hotel.findById(req.params.id);
    res.status(200).json(hotel);
  } catch (err) {
    next(err);
  }
};

// Get hotels based on filters
export const getHotels = async (req, res, next) => {
  const { min, max, ...others } = req.query;
  try {
    const hotels = await Hotel.find({
      ...others,
      cheapestPrice: { $gt: min | 1, $lt: max || 999 },
    }).limit(req.query.limit);
    res.status(200).json(hotels);
  } catch (err) {
    next(err);
  }
};

// Count hotels by city
export const countByCity = async (req, res, next) => {
  const cities = req.query.cities.split(',');
  try {
    // Iterate through the cities array and count the number of hotels in each city
    const list = await Promise.all(
      cities.map((city) => {
        return Hotel.countDocuments({ city: city });
      })
    );
    res.status(200).json(list);
  } catch (err) {
    next(err);
  }
};

// Count hotels by type
export const countByType = async (req, res, next) => {
  try {
    // Count the number of hotels for each type
    const hotelCount = await Hotel.countDocuments({ type: 'hotel' });
    const apartmentCount = await Hotel.countDocuments({ type: 'apartment' });
    const resortCount = await Hotel.countDocuments({ type: 'resort' });
    const villaCount = await Hotel.countDocuments({ type: 'villa' });
    const cabinCount = await Hotel.countDocuments({ type: 'cabin' });

    // Create an array of objects with the type and count of hotels for each type
    res.status(200).json([
      { type: 'hotel', count: hotelCount },
      { type: 'apartments', count: apartmentCount },
      { type: 'resorts', count: resortCount },
      { type: 'villas', count: villaCount },
      { type: 'cabins', count: cabinCount },
    ]);
  } catch (err) {
    next(err);
  }
};

// Get rooms of a hotel
export const getHotelRooms = async (req, res, next) => {
  try {
    // Find the hotel by ID
    const hotel = await Hotel.findById(req.params.id);

    // Retrieve the rooms associated with the hotel
    const list = await Promise.all(
      hotel.rooms.map((room) => {
        return Room.findById(room);
      })
    );
    res.status(200).json(list);
  } catch (err) {
    next(err);
  }
};
