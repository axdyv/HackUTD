import React, { useState, useEffect } from "react";
import { getVehicles } from "./api";

const App = () => {
    const [vehicles, setVehicles] = useState([]);

    useEffect(() => {
        const fetchData = async () => {
            const data = await getVehicles();
            setVehicles(data);
        };
        fetchData();
    }, []);

    return (
        <div>
            <h1>Toyota Fuel Economy Data</h1>
            <ul>
                {vehicles.map((vehicle) => (
                    <li key={vehicle[0]}>
                        {vehicle[1]} {vehicle[2]} ({vehicle[3]})
                    </li>
                ))}
            </ul>
        </div>
    );
};

export default App;
