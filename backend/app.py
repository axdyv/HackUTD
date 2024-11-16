from flask import Flask, jsonify
import sqlite3
from flask_cors import CORS
from flask import request

app = Flask(__name__)
CORS(app)  # Enable Cross-Origin Resource Sharing for frontend-backend communication


# Helper function to connect to the database
def get_db_connection():
    connection = sqlite3.connect("fuel_economy.db")
    connection.row_factory = sqlite3.Row  # Enables dict-like access to rows
    return connection


# Endpoint to fetch all conventional vehicles data
@app.route("/vehicles", methods=["GET"])
def get_conventional_vehicles():
    manufacturer = request.args.get("manufacturer", "")
    year = request.args.get("year", "")

    connection = get_db_connection()
    cursor = connection.cursor()

    query = "SELECT * FROM conventional_vehicles WHERE 1=1"
    params = []

    if manufacturer:
        query += " AND manufacturer LIKE ?"
        params.append(f"%{manufacturer}%")
    if year:
        query += " AND model_year = ?"
        params.append(year)

    cursor.execute(query, params)
    vehicles = cursor.fetchall()
    connection.close()

    vehicles_list = [dict(vehicle) for vehicle in vehicles]
    return jsonify(vehicles_list)

if __name__ == "__main__":
    app.run(debug=True)
