import pandas as pd
import sqlite3

# Paths
csv_files = [
    r"C:\Users\aniru\Downloads\conventional_vehicles2021.csv",
    r"C:\Users\aniru\Downloads\conventional_vehicles2022.csv",
    r"C:\Users\aniru\Downloads\conventional_vehicles2023.csv",
    r"C:\Users\aniru\Downloads\conventional_vehicles2024.csv",
    r"C:\Users\aniru\Downloads\conventional_vehicles2025.csv"
]
db_path = "fuel_economy.db"

# Load and combine CSV files
all_data = pd.concat([pd.read_csv(file) for file in csv_files])

# Debug: Print the column names to ensure consistency
print("Column names in CSV:", all_data.columns.tolist())

# Filter relevant columns
all_data = all_data[[
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
all_data.rename(columns={
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

# Connect to SQLite and write the data
connection = sqlite3.connect(db_path)
cursor = connection.cursor()

# Create the table explicitly
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

# Insert data using to_sql (replace existing table)
all_data.to_sql("conventional_vehicles", connection, if_exists="replace", index=False)

# Commit and close
connection.commit()
connection.close()

print("Table `conventional_vehicles` created and data loaded successfully.")
