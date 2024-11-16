import React, { useState, useEffect } from "react";
import { BarChart, Bar, XAxis, YAxis, Tooltip, Legend } from "recharts";
import { getConventionalVehicles } from "./api";

const App = () => {
    const [vehicles, setVehicles] = useState([]);
    const [filteredVehicles, setFilteredVehicles] = useState([]);
    const [selectedManufacturers, setSelectedManufacturers] = useState([]);
    const [selectedYears, setSelectedYears] = useState([]);
    const [showTable, setShowTable] = useState(false); // Controls table visibility

    // Fetch data from API
    useEffect(() => {
        const fetchData = async () => {
            const data = await getConventionalVehicles();
            setVehicles(data);
            setFilteredVehicles(data); // Initially display all data
        };
        fetchData();
    }, []);

    // Update filtered data whenever filters change
    useEffect(() => {
        const filtered = vehicles.filter((vehicle) => {
            return (
                (selectedManufacturers.length === 0 || selectedManufacturers.includes(vehicle.manufacturer)) &&
                (selectedYears.length === 0 || selectedYears.includes(vehicle.model_year.toString()))
            );
        });
        setFilteredVehicles(filtered);

        // Show the table only if there are filters or "Show All Data" is selected
        setShowTable(selectedManufacturers.length > 0 || selectedYears.length > 0 || filtered.length === vehicles.length);
    }, [selectedManufacturers, selectedYears, vehicles]);

    // Unique filter options
    const uniqueManufacturers = [...new Set(vehicles.map((v) => v.manufacturer))];
    const uniqueYears = [...new Set(vehicles.map((v) => v.model_year.toString()))];

    // Helper function to toggle checkbox selection
    const toggleSelection = (value, setFunction, selectedValues) => {
        if (selectedValues.includes(value)) {
            setFunction(selectedValues.filter((item) => item !== value));
        } else {
            setFunction([...selectedValues, value]);
        }
    };

    return (
        <div>
            <h1>Conventional Vehicles Fuel Economy</h1>

            {/* Filters */}
            <div>
                <h3>Filter by Manufacturer</h3>
                <label>
                    <input
                        type="checkbox"
                        checked={selectedManufacturers.length === 0}
                        onChange={() => setSelectedManufacturers([])}
                    />
                    Show All Manufacturers
                </label>
                {uniqueManufacturers.map((manufacturer) => (
                    <label key={manufacturer}>
                        <input
                            type="checkbox"
                            value={manufacturer}
                            checked={selectedManufacturers.includes(manufacturer)}
                            onChange={() =>
                                toggleSelection(manufacturer, setSelectedManufacturers, selectedManufacturers)
                            }
                        />
                        {manufacturer}
                    </label>
                ))}

                <h3>Filter by Model Year</h3>
                <label>
                    <input
                        type="checkbox"
                        checked={selectedYears.length === 0}
                        onChange={() => setSelectedYears([])}
                    />
                    Show All Years
                </label>
                {uniqueYears.map((year) => (
                    <label key={year}>
                        <input
                            type="checkbox"
                            value={year}
                            checked={selectedYears.includes(year)}
                            onChange={() => toggleSelection(year, setSelectedYears, selectedYears)}
                        />
                        {year}
                    </label>
                ))}
            </div>

            {/* Chart Component */}
            <BarChart
                width={800}
                height={400}
                data={filteredVehicles}
                margin={{ top: 20, right: 30, left: 20, bottom: 5 }}
            >
                <XAxis dataKey="carline" />
                <YAxis />
                <Tooltip />
                <Legend />
                <Bar dataKey="city_fuel_economy" fill="#8884d8" />
                <Bar dataKey="highway_fuel_economy" fill="#82ca9d" />
            </BarChart>

            {/* Table (Visible Only When Filters Are Applied or "Show All Data" is Selected) */}
            {showTable && (
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
                        {filteredVehicles.map((vehicle, index) => (
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
            )}
        </div>
    );
};

export default App;
