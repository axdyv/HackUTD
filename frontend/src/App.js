import React, { useState, useEffect } from "react";
import { BarChart, Bar, XAxis, YAxis, Tooltip, Legend, Label } from "recharts";
import { getConventionalVehicles } from "./api";

const App = () => {
    const [vehicles, setVehicles] = useState([]);
    const [filteredVehicles, setFilteredVehicles] = useState([]);
    const [filters, setFilters] = useState({
        manufacturer: [],
        model_year: [],
        carline: [],
        engine_displacement: [],
        num_cylinders: [],
        transmission: [],
    });
    const [loading, setLoading] = useState(false); // Loading state

    const colors = {
        2021: "#8884d8",
        2022: "#82ca9d",
        2023: "#ffc658",
        2024: "#ff7300",
        2025: "#a4de6c",
    };

    useEffect(() => {
        const fetchData = async () => {
            setLoading(true);
            const response = await getConventionalVehicles({
                year: filters.model_year.join(","), // Send selected years as a comma-separated string
                manufacturer: filters.manufacturer.join(","),
            });
            setVehicles(response.data);
            setFilteredVehicles(response.data);
            setLoading(false);
        };
        fetchData();
    }, [filters.model_year, filters.manufacturer]); // Refetch when model year or manufacturer changes

    // Group data by year for the chart
    const groupedData = () => {
      const years = [...new Set(filteredVehicles.map((v) => v.model_year))];
      return years.map((year) => {
          const yearVehicles = filteredVehicles.filter((v) => v.model_year === year);
          const cityAverage = yearVehicles.reduce((sum, v) => sum + (v.city_fuel_economy || 0), 0) / yearVehicles.length;
          const highwayAverage = yearVehicles.reduce((sum, v) => sum + (v.highway_fuel_economy || 0), 0) / yearVehicles.length;
  
          return {
              year,
              cityFuelEconomy: parseFloat(cityAverage.toFixed(2)),
              highwayFuelEconomy: parseFloat(highwayAverage.toFixed(2)),
          };
      });
  };
  

    // Custom tooltip for the bar chart
    const CustomTooltip = ({ active, payload, label }) => {
        if (active && payload && payload.length) {
            return (
                <div className="custom-tooltip" style={{ background: "#fff", border: "1px solid #ccc", padding: "10px" }}>
                    <p><strong>Year:</strong> {label}</p>
                    <p><strong>City Fuel Economy:</strong> {payload[0].value} MPG</p>
                    <p><strong>Highway Fuel Economy:</strong> {payload[1].value} MPG</p>
                </div>
            );
        }
        return null;
    };

    // Handle filter checkbox changes
    const handleFilterChange = (key, value) => {
        setFilters((prev) => ({
            ...prev,
            [key]: prev[key].includes(value)
                ? prev[key].filter((item) => item !== value)
                : [...prev[key], value],
        }));
    };

    // Reset all filters
    const resetFilters = () => {
        setFilters({
            manufacturer: [],
            model_year: [],
            carline: [],
            engine_displacement: [],
            num_cylinders: [],
            transmission: [],
        });
    };

    return (
        <div>
            <h1>Conventional Vehicles Fuel Economy</h1>

            {/* Model Year Filter */}
            <div>
                <h3>Filter by Model Year</h3>
                {[2021, 2022, 2023, 2024, 2025].map((year) => (
                    <label key={year}>
                        <input
                            type="checkbox"
                            value={year}
                            checked={filters.model_year.includes(year.toString())}
                            onChange={() => handleFilterChange("model_year", year.toString())}
                        />
                        {year}
                    </label>
                ))}
            </div>

            {/* Manufacturer Filter */}
            <div>
                <h3>Filter by Manufacturer</h3>
                {[...new Set(vehicles.map((v) => v.manufacturer))].map((manufacturer) => (
                    <label key={manufacturer}>
                        <input
                            type="checkbox"
                            value={manufacturer}
                            checked={filters.manufacturer.includes(manufacturer)}
                            onChange={() => handleFilterChange("manufacturer", manufacturer)}
                        />
                        {manufacturer}
                    </label>
                ))}
            </div>

            {/* Chart */}
            <BarChart
                width={800}
                height={400}
                data={groupedData()}
                margin={{ top: 20, right: 30, left: 20, bottom: 5 }}
            >
                <XAxis dataKey="year" />
                <YAxis>
                    <Label
                        value="Fuel Economy (MPG)"
                        angle={-90}
                        position="insideLeft"
                        style={{ textAnchor: "middle" }}
                    />
                </YAxis>
                <Tooltip content={<CustomTooltip />} />
                <Legend />
                {Object.entries(colors).map(([year, color]) => (
                    <Bar
                        key={year}
                        dataKey={parseInt(year) === 2021 ? "cityFuelEconomy" : "highwayFuelEconomy"}
                        fill={color}
                        name={`Year ${year}`}
                    />
                ))}
            </BarChart>

            {/* Table */}
            {loading ? (
                <p>Loading...</p>
            ) : filteredVehicles.length > 0 ? (
                <table border="1" style={{ width: "100%", marginBottom: "20px" }}>
                    <thead>
                        <tr>
                            <th>Model Year</th>
                            <th>Manufacturer</th>
                            <th>Carline</th>
                            <th>Engine Displacement</th>
                            <th>Number of Cylinders</th>
                            <th>Transmission</th>
                            <th>City MPG</th>
                            <th>Highway MPG</th>
                            <th>Combined MPG</th>
                        </tr>
                    </thead>
                    <tbody>
                        {filteredVehicles.map((vehicle, index) => (
                            <tr key={index}>
                                <td>{vehicle.model_year}</td>
                                <td>{vehicle.manufacturer}</td>
                                <td>{vehicle.carline}</td>
                                <td>{vehicle.engine_displacement}</td>
                                <td>{vehicle.num_cylinders}</td>
                                <td>{vehicle.transmission}</td>
                                <td>{vehicle.city_fuel_economy}</td>
                                <td>{vehicle.highway_fuel_economy}</td>
                                <td>{vehicle.combined_fuel_economy}</td>
                            </tr>
                        ))}
                    </tbody>
                </table>
            ) : (
                <p>No data available for the selected filters.</p>
            )}
        </div>
    );
};

export default App;
