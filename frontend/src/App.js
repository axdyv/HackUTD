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

    const filterableColumns = [
        { key: "manufacturer", label: "Manufacturer" },
        { key: "model_year", label: "Model Year" },
        { key: "engine_displacement", label: "Engine Displacement" },
        { key: "num_cylinders", label: "Number of Cylinders" },
        { key: "transmission", label: "Transmission" },
    ];

    useEffect(() => {
        const fetchData = async () => {
            const data = await getConventionalVehicles();
            setVehicles(data);
            setFilteredVehicles(data);
        };
        fetchData();
    }, []);

    // Apply filters whenever they are updated
    useEffect(() => {
        const filtered = vehicles.filter((vehicle) =>
            filterableColumns.every(({ key }) => {
                const selectedFilters = filters[key];
                return selectedFilters.length === 0 || selectedFilters.includes(vehicle[key].toString());
            }) &&
            (filters.manufacturer.length === 0 || filters.manufacturer.includes(vehicle.manufacturer)) &&
            (filters.carline.length === 0 || filters.carline.includes(vehicle.carline))
        );
        setFilteredVehicles(filtered);
    }, [filters, vehicles]);

    // Dynamically generate unique values for each column
    const getUniqueValues = (key, filterBy) => {
        const subset = filterBy ? vehicles.filter((v) => filterBy.includes(v.manufacturer)) : vehicles;
        return [...new Set(subset.map((v) => v[key]?.toString() || ""))];
    };

    // Handle filter checkbox changes
    const handleFilterChange = (key, value) => {
        setFilters((prev) => ({
            ...prev,
            [key]: prev[key].includes(value)
                ? prev[key].filter((item) => item !== value)
                : [...prev[key], value],
            ...(key === "manufacturer" && { carline: [] }), // Reset carline filter if manufacturer changes
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

            {/* Filters */}
            <div>
                <button onClick={resetFilters}>Show All Data</button>
                {filterableColumns.map(({ key, label }) => (
                    <div key={key}>
                        <h3>Filter by {label}</h3>
                        {getUniqueValues(key).map((value) => (
                            <label key={value}>
                                <input
                                    type="checkbox"
                                    value={value}
                                    checked={filters[key].includes(value)}
                                    onChange={() => handleFilterChange(key, value)}
                                />
                                {value}
                            </label>
                        ))}
                    </div>
                ))}

                {/* Carline Filter (Depends on Manufacturer) */}
                {filters.manufacturer.length > 0 && (
                    <div>
                        <h3>Filter by Carline</h3>
                        {getUniqueValues("carline", filters.manufacturer).map((value) => (
                            <label key={value}>
                                <input
                                    type="checkbox"
                                    value={value}
                                    checked={filters.carline.includes(value)}
                                    onChange={() => handleFilterChange("carline", value)}
                                />
                                {value}
                            </label>
                        ))}
                    </div>
                )}
            </div>

            {/* Chart */}
            <BarChart
                width={800}
                height={400}
                data={filteredVehicles}
                margin={{ top: 20, right: 30, left: 20, bottom: 5 }}
            >
                <XAxis dataKey="carline" />
                <YAxis>
                    <Label
                        value="Fuel Economy (MPG)"
                        angle={-90}
                        position="insideLeft"
                        style={{ textAnchor: "middle" }}
                    />
                </YAxis>
                <Tooltip />
                <Legend />
                <Bar dataKey="city_fuel_economy" fill="#8884d8" />
                <Bar dataKey="highway_fuel_economy" fill="#82ca9d" />
            </BarChart>

            {/* Table */}
            {filteredVehicles.length > 0 && (
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
            )}
        </div>
    );
};

export default App;
