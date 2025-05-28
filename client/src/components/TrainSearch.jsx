import React, { useState, useMemo } from 'react';
import axios from 'axios';
import { 
  Box, 
  TextField, 
  Button, 
  Typography, 
  Paper, 
  Container, 
  Grid, 
  CircularProgress,
  Autocomplete,
  Chip
} from '@mui/material';
import { AdapterDayjs } from '@mui/x-date-pickers/AdapterDayjs';
import { LocalizationProvider } from '@mui/x-date-pickers/LocalizationProvider';
import { DatePicker } from '@mui/x-date-pickers/DatePicker';
import dayjs from 'dayjs';

// Common Indian railway stations
const STATIONS = [
  { code: 'NDLS', name: 'New Delhi', state: 'Delhi' },
  { code: 'BCT', name: 'Mumbai Central', state: 'Maharashtra' },
  { code: 'CSMT', name: 'Chhatrapati Shivaji Maharaj Terminus', state: 'Maharashtra' },
  { code: 'HWH', name: 'Howrah Junction', state: 'West Bengal' },
  { code: 'PNBE', name: 'Patna Junction', state: 'Bihar' },
  { code: 'CNB', name: 'Kanpur Central', state: 'Uttar Pradesh' },
  { code: 'PUNE', name: 'Pune Junction', state: 'Maharashtra' },
  { code: 'MAS', name: 'Chennai Central', state: 'Tamil Nadu' },
  { code: 'SBC', name: 'Bengaluru City', state: 'Karnataka' },
  { code: 'SC', name: 'Secunderabad Junction', state: 'Telangana' },
  { code: 'JP', name: 'Jaipur Junction', state: 'Rajasthan' },
  { code: 'ADI', name: 'Ahmedabad Junction', state: 'Gujarat' },
  { code: 'BPL', name: 'Bhopal Junction', state: 'Madhya Pradesh' },
  { code: 'NGP', name: 'Nagpur Junction', state: 'Maharashtra' },
  { code: 'LKO', name: 'Lucknow Junction', state: 'Uttar Pradesh' },
  // Add more stations as needed
];

const TrainSearch = () => {
  const [fromStation, setFromStation] = useState(null);
  const [toStation, setToStation] = useState(null);
  const [date, setDate] = useState(dayjs());
  const [loading, setLoading] = useState(false);
  const [trains, setTrains] = useState([]);
  const [error, setError] = useState('');
  const [searchQuery, setSearchQuery] = useState('');

  // Filter stations based on search query
  const filterStations = (stations, query) => {
    const searchText = query.toLowerCase();
    return stations.filter(station => 
      station.name.toLowerCase().includes(searchText) ||
      station.code.toLowerCase().includes(searchText) ||
      station.state.toLowerCase().includes(searchText)
    );
  };

  const handleSearch = async (e) => {
    e.preventDefault();
    if (!fromStation || !toStation) {
      setError('Please select both stations');
      return;
    }

    setLoading(true);
    setError('');
    try {
      const response = await axios.post('/api/trains/search', {
        fromStation: fromStation.code,
        toStation: toStation.code,
        date: date.format('YYYY-MM-DD')
      });
      
      if (Array.isArray(response.data)) {
        setTrains(response.data);
        if (response.data.length === 0) {
          setError('No trains found for this route');
        }
      } else {
        setError('Invalid response format from server');
        setTrains([]);
      }
    } catch (err) {
      setError(err.response?.data?.message || 'Failed to fetch trains');
      setTrains([]);
    } finally {
      setLoading(false);
    }
  };

  const getTrainTypeColor = (type) => {
    switch (type) {
      case 'RAJ': return 'error';
      case 'DRNT': return 'warning';
      case 'SUF': return 'success';
      case 'MAIL EXPRESS': return 'info';
      default: return 'default';
    }
  };

  return (
    <Container maxWidth="md">
      <Paper elevation={3} sx={{ p: 3 }}>
        <Box component="form" onSubmit={handleSearch} sx={{ mt: 2 }}>
          <Grid container spacing={3}>
            <Grid item xs={12} sm={6}>
              <Autocomplete
                fullWidth
                options={STATIONS}
                value={fromStation}
                onChange={(event, newValue) => {
                  setFromStation(newValue);
                }}
                getOptionLabel={(option) => `${option.name} (${option.code})`}
                renderOption={(props, option) => (
                  <li {...props}>
                    <Box>
                      <Typography variant="body1">{option.name}</Typography>
                      <Typography variant="caption" color="text.secondary">
                        {option.code} - {option.state}
                      </Typography>
                    </Box>
                  </li>
                )}
                renderInput={(params) => (
                  <TextField
                    {...params}
                    label="From Station"
                    required
                    placeholder="Enter source station"
                  />
                )}
              />
            </Grid>
            <Grid item xs={12} sm={6}>
              <Autocomplete
                fullWidth
                options={STATIONS}
                value={toStation}
                onChange={(event, newValue) => {
                  setToStation(newValue);
                }}
                getOptionLabel={(option) => `${option.name} (${option.code})`}
                renderOption={(props, option) => (
                  <li {...props}>
                    <Box>
                      <Typography variant="body1">{option.name}</Typography>
                      <Typography variant="caption" color="text.secondary">
                        {option.code} - {option.state}
                      </Typography>
                    </Box>
                  </li>
                )}
                renderInput={(params) => (
                  <TextField
                    {...params}
                    label="To Station"
                    required
                    placeholder="Enter destination station"
                  />
                )}
              />
            </Grid>
            <Grid item xs={12} sm={6}>
              <LocalizationProvider dateAdapter={AdapterDayjs}>
                <DatePicker
                  label="Journey Date"
                  value={date}
                  onChange={(newValue) => setDate(newValue)}
                  slotProps={{ textField: { fullWidth: true } }}
                  minDate={dayjs()}
                />
              </LocalizationProvider>
            </Grid>
            <Grid item xs={12}>
              <Button
                type="submit"
                variant="contained"
                color="primary"
                disabled={loading}
                fullWidth
              >
                {loading ? <CircularProgress size={24} /> : 'Search Trains'}
              </Button>
            </Grid>
          </Grid>
        </Box>

        {error && (
          <Typography color="error" sx={{ mt: 2 }}>
            {error}
          </Typography>
        )}

        {trains.length > 0 && (
          <Box sx={{ mt: 4 }}>
            <Typography variant="h6" gutterBottom>
              Available Trains
            </Typography>
            {trains.map((train) => (
              <Paper key={train.trainNumber} sx={{ p: 2, mb: 2 }}>
                <Grid container spacing={2}>
                  <Grid item xs={12}>
                    <Box display="flex" alignItems="center" gap={1} mb={1}>
                      <Typography variant="subtitle1" component="span">
                        {train.trainName}
                      </Typography>
                      <Chip 
                        label={train.trainType} 
                        size="small" 
                        color={getTrainTypeColor(train.trainType)}
                      />
                      <Typography variant="body2" color="text.secondary">
                        ({train.trainNumber})
                      </Typography>
                    </Box>
                  </Grid>
                  <Grid item xs={12} sm={4}>
                    <Typography variant="body2">
                      From: {train.fromStation}
                    </Typography>
                    <Typography variant="body2" color="success.main" fontWeight="bold">
                      Departure: {train.departureTime}
                    </Typography>
                    <Typography variant="body2">
                      To: {train.toStation}
                    </Typography>
                    <Typography variant="body2" color="success.main" fontWeight="bold">
                      Arrival: {train.arrivalTime}
                    </Typography>
                  </Grid>
                  <Grid item xs={12} sm={4}>
                    <Typography variant="body2">
                      Duration: {train.duration}
                    </Typography>
                    <Typography variant="body2">
                      Distance: {train.distance} km
                    </Typography>
                    <Typography variant="body2">
                      Pantry: {train.hasPantry ? 'Available' : 'Not Available'}
                    </Typography>
                  </Grid>
                  <Grid item xs={12} sm={4}>
                    <Typography variant="body2" gutterBottom>
                      Available Classes:
                    </Typography>
                    <Box display="flex" gap={0.5} flexWrap="wrap">
                      {train.classes.map((cls) => (
                        <Chip key={cls} label={cls} size="small" variant="outlined" />
                      ))}
                    </Box>
                  </Grid>
                  <Grid item xs={12}>
                    <Typography variant="body2" color="text.secondary">
                      Runs on: {train.runDays.join(', ')}
                    </Typography>
                  </Grid>
                </Grid>
              </Paper>
            ))}
          </Box>
        )}
      </Paper>
    </Container>
  );
};

export default TrainSearch; 