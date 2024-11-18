from flask import Flask, jsonify, request
import sqlite3
from flask_cors import CORS

app = Flask(__name__)
CORS(app)  # Enable Cross-Origin Resource Sharing for frontend-backend communication


# Helper function to connect to the database
def get_db_connection():
    connection = sqlite3.connect("fuel_economy.db")
    connection.row_factory = sqlite3.Row  # Enables dict-like access to rows
    return connection


# Endpoint to fetch filtered conventional vehicles data
@app.route("/vehicles", methods=["GET"])
def get_conventional_vehicles():
    # Get query parameters for filtering
    year = request.args.get("year")  # Comma-separated list of years
    manufacturer = request.args.get("manufacturer")  # Comma-separated list of manufacturers

    # Build the SQL query dynamically
    query = "SELECT * FROM conventional_vehicles WHERE 1=1"
    params = []

    if year:
        years = year.split(",")  # Split comma-separated years
        placeholders = ",".join("?" for _ in years)
        query += f" AND model_year IN ({placeholders})"
        params.extend(years)

    if manufacturer:
        manufacturers = manufacturer.split(",")  # Split comma-separated manufacturers
        placeholders = ",".join("?" for _ in manufacturers)
        query += f" AND manufacturer IN ({placeholders})"
        params.extend(manufacturers)

    # Execute the query
    connection = get_db_connection()
    cursor = connection.cursor()
    cursor.execute(query, params)
    vehicles = cursor.fetchall()
    connection.close()

    # Convert sqlite3.Row objects to dictionaries
    vehicles_list = [dict(vehicle) for vehicle in vehicles]
    return jsonify({"data": vehicles_list})


# Helper endpoint to get unique values for filters (optional)
@app.route("/filter-options", methods=["GET"])
def get_filter_options():
    connection = get_db_connection()
    cursor = connection.cursor()

    # Fetch unique model years and manufacturers
    cursor.execute("SELECT DISTINCT model_year FROM conventional_vehicles")
    years = [row["model_year"] for row in cursor.fetchall()]

    cursor.execute("SELECT DISTINCT manufacturer FROM conventional_vehicles")
    manufacturers = [row["manufacturer"] for row in cursor.fetchall()]

    connection.close()

    return jsonify({"years": years, "manufacturers": manufacturers})


if __name__ == "__main__":
    app.run(debug=True)
