import React, { useState, useEffect } from "react";
import { BarChart, Bar, XAxis, YAxis, Tooltip, Legend } from "recharts";
import { getConventionalVehicles } from "./api";

const App = () => {
    const [vehicles, setVehicles] = useState([]);

    useEffect(() => {
      const fetchData = async () => {
          const data = await getConventionalVehicles();
          console.log("Fetched data:", data); // Debugging
          setVehicles(data);
      };
      fetchData();
  }, []);
  

    return (
        <div>
            <h1>Conventional Vehicles Fuel Economy</h1>

            {/* Table to Display Data */}
            <table border="1" style={{ width: "100%", marginBottom: "20px" }}>
                <thead>
                    <tr>
                        <th>Model Year</th>
                        <th>Manufacturer</th>
                        <th>Carline</th>
                        <th>Engine Displacement</th>
                        <th>City MPG</th>
                        <th>Highway MPG</th>
                        <th>Combined MPG</th>
                    </tr>
                </thead>
                <tbody>
                    {vehicles.map((vehicle, index) => (
                        <tr key={index}>
                            <td>{vehicle.model_year}</td>
                            <td>{vehicle.manufacturer}</td>
                            <td>{vehicle.carline}</td>
                            <td>{vehicle.engine_displacement}</td>
                            <td>{vehicle.city_fuel_economy}</td>
                            <td>{vehicle.highway_fuel_economy}</td>
                            <td>{vehicle.combined_fuel_economy}</td>
                        </tr>
                    ))}
                </tbody>
            </table>

            {/* Bar Chart */}
            <BarChart
                width={800}
                height={400}
                data={vehicles}
                margin={{ top: 20, right: 30, left: 20, bottom: 5 }}
            >
                <XAxis dataKey="carline" />
                <YAxis />
                <Tooltip />
                <Legend />
                <Bar dataKey="city_fuel_economy" fill="#8884d8" />
                <Bar dataKey="highway_fuel_economy" fill="#82ca9d" />
            </BarChart>
        </div>
    );
};

export default App;
