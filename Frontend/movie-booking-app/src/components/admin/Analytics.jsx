import React, { useState, useEffect } from 'react';
import 'bootstrap/dist/css/bootstrap.min.css';
import { PieChart, Pie, Cell, Tooltip, ResponsiveContainer, BarChart, Bar, XAxis, YAxis, CartesianGrid, Legend } from 'recharts';

const Analytics = () => {
  const [shows, setShows] = useState([]);
  const [error, setError] = useState('');
  const [isLoading, setIsLoading] = useState(true);

  useEffect(() => {
    const fetchAnalyticsData = async () => {
      try {
        const response = await fetch('http://localhost:8180/management/Admin/reports/detailed-shows');
        if (!response.ok) {
          throw new Error('Failed to fetch analytics data');
        }
        const data = await response.json();
        setShows(data);
      } catch (err) {
        setError(err.message || 'Failed to fetch data');
      } finally {
        setIsLoading(false);
      }
    };

    fetchAnalyticsData();
  }, []);

  // Group shows by movieName
  const groupedData = shows.reduce((acc, show) => {
    if (!acc[show.movieName]) {
      acc[show.movieName] = { 
        movieName: show.movieName, 
        totalBookings: 0, 
        showIds: [] 
      };
    }
    acc[show.movieName].totalBookings += show.totalBookings;
    acc[show.movieName].showIds.push(show.showId);
    return acc;
  }, {});

  const barChartData = Object.values(groupedData);

  const COLORS = ['#0088FE', '#00C49F', '#FFBB28', '#FF8042', '#A28DFF'];

  // Function to format date to "9th Feb 2025"
  const formatDate = (dateString) => {
    const date = new Date(dateString);
    const day = date.getDate();
    const suffix = ["th", "st", "nd", "rd"][((day % 10) < 4 && (day % 100 - day % 10) !== 10) ? (day % 10) : 0];
    const month = date.toLocaleString('default', { month: 'short' });
    const year = date.getFullYear();
    return `${day}${suffix} ${month} ${year}`;
  };

  return (
    <div className="container mt-5 bg-light bg-opacity-75 border p-4 rounded">
      <h1>Analytics</h1>
      {error && <div className="alert alert-danger">{error}</div>}
      {isLoading ? (
        <div className="text-center">Loading...</div>
      ) : (
        <>
          {/* Bar Chart */}
          <div className="d-flex justify-content-center mt-4">
            <ResponsiveContainer width="80%" height={300}>
              <BarChart data={barChartData}>
                <CartesianGrid strokeDasharray="3 3" />
                <XAxis dataKey="movieName" />
                <YAxis />
                <Tooltip />
                <Legend />
                <Bar dataKey="totalBookings" fill="#00C49F" />
              </BarChart>
            </ResponsiveContainer>
          </div>

          {/* Data Table */}
          <table className="table table-bordered table-rounded mt-4">
            <thead>
              <tr>
                <th>Show IDs</th>
                <th>Movie Name</th>
                <th>Total Bookings</th>
                <th>Total Amount</th>
                <th>Show Date & Time</th>
              </tr>
            </thead>
            <tbody>
              {shows.length > 0 ? (
                shows.map((show) => (
                  <tr key={show.movieId}>
                    <td>{show.showId}</td>
                    <td>{show.movieName}</td>
                    <td>{show.totalBookings}</td>
                    <td>₹ {show.totalAmount}.00</td>
                    <td>{formatDate(show.showDate)} {show.showTime}</td>
                  </tr>
                ))
              ) : (
                <tr>
                  <td colSpan="5" className="text-center">
                    No data available
                  </td>
                </tr>
              )}
            </tbody>
          </table>
        </>
      )}
    </div>
  );
};

export default Analytics;
