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

  const barChartData = shows.map((show) => ({
    movieName: show.movieName,
    totalBookings: show.totalBookings,
  }));

  const COLORS = ['#0088FE', '#00C49F', '#FFBB28', '#FF8042', '#A28DFF'];

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
                <th>Show</th>
                <th>Movie Name</th>
                <th>Total Bookings</th>
                <th>Total Collection</th>
                
              </tr>
            </thead>
            <tbody>
              {shows.length > 0 ? (
                shows.map((show) => (
                  <tr key={show.movieId}>
                    <td>{show.showId} - {show.showDate} {show.showTime}</td>
                    <td>{show.movieName}</td>
                    <td>{show.totalBookings}</td>
                    <td>₹ {show.totalAmount}.00</td>
                  </tr>
                ))
              ) : (
                <tr>
                  <td colSpan="2" className="text-center">
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
