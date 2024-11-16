import pandas as pd
import sqlite3

# Paths
csv_path = r"C:\Users\aniru\Downloads\conventional_vehicles2021.csv"
db_path = "fuel_economy.db"

# Load CSV
data = pd.read_csv(csv_path)

# Debug: Print the column names
print("Column names in CSV:", data.columns.tolist())

# Filter relevant columns
data = data[[
    "Model Year",
    "Mfr Name",
    "Division",
    "Carline",
    "Eng Displ",
    "# Cyl",
    "Transmission",
    "City FE (Guide) - Conventional Fuel",
    "Hwy FE (Guide) - Conventional Fuel",
    "Comb FE (Guide) - Conventional Fuel"
]]

# Rename columns to match the database schema
data.rename(columns={
    "Model Year": "model_year",
    "Mfr Name": "manufacturer",
    "Division": "division",
    "Carline": "carline",
    "Eng Displ": "engine_displacement",
    "# Cyl": "num_cylinders",
    "Transmission": "transmission",
    "City FE (Guide) - Conventional Fuel": "city_fuel_economy",
    "Hwy FE (Guide) - Conventional Fuel": "highway_fuel_economy",
    "Comb FE (Guide) - Conventional Fuel": "combined_fuel_economy"
}, inplace=True)

# Connect to SQLite and create table
connection = sqlite3.connect(db_path)
cursor = connection.cursor()

# Create the `conventional_vehicles` table
cursor.execute('''
CREATE TABLE IF NOT EXISTS conventional_vehicles (
    id INTEGER PRIMARY KEY AUTOINCREMENT,
    model_year INTEGER,
    manufacturer TEXT,
    division TEXT,
    carline TEXT,
    engine_displacement REAL,
    num_cylinders INTEGER,
    transmission TEXT,
    city_fuel_economy INTEGER,
    highway_fuel_economy INTEGER,
    combined_fuel_economy INTEGER
)
''')

# Insert data into the table
data.to_sql("conventional_vehicles", connection, if_exists="replace", index=False)

# Commit and close the connection
connection.commit()
connection.close()

print("Table `conventional_vehicles` created and data loaded successfully.")
