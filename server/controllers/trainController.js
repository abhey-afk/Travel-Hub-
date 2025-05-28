import axios from 'axios';

const searchTrains = async (req, res) => {
  try {
    const { fromStation, toStation, date } = req.body;

    // Convert date to required format (YYYY-MM-DD)
    const dateObj = new Date(date);
    const dateOfJourney = dateObj.toISOString().split('T')[0];

    const options = {
      method: 'GET',
      url: 'https://irctc1.p.rapidapi.com/api/v3/trainBetweenStations',
      params: {
        fromStationCode: fromStation,
        toStationCode: toStation,
        dateOfJourney: dateOfJourney
      },
      headers: {
        'X-RapidAPI-Key': process.env.RAPID_API_KEY,
        'X-RapidAPI-Host': 'irctc1.p.rapidapi.com'
      }
    };

    const response = await axios.request(options);
    
    if (!response.data.status) {
      return res.status(400).json({
        message: response.data.message || 'No trains found'
      });
    }

    // Transform the API response to match our frontend expectations
    const transformedTrains = response.data.data.map(train => ({
      trainNumber: train.train_number,
      trainName: train.train_name,
      departureTime: train.from_std,
      arrivalTime: train.to_sta,
      duration: train.duration,
      fromStation: train.from_station_name,
      toStation: train.to_station_name,
      classes: train.class_type || [],
      runDays: train.run_days || [],
      fromDay: train.from_day,
      toDay: train.to_day,
      hasPantry: train.has_pantry,
      distance: train.distance,
      trainType: train.train_type
    }));

    res.json(transformedTrains);
  } catch (error) {
    console.error('Error searching trains:', error);
    res.status(500).json({ 
      message: 'Failed to fetch train information',
      error: error.response?.data?.message || error.message 
    });
  }
};

export { searchTrains }; 