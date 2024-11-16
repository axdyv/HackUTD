from flask import Flask, jsonify
import sqlite3
from flask_cors import CORS

app = Flask(__name__)
CORS(app)  # Enable Cross-Origin Resource Sharing for frontend-backend communication


# Helper function to connect to the database
def get_db_connection():
    connection = sqlite3.connect("fuel_economy.db")
    connection.row_factory = sqlite3.Row  # Allows dict-like access to rows
    return connection


# Endpoint to fetch all conventional vehicles data
@app.route("/vehicles", methods=["GET"])
def get_conventional_vehicles():
    connection = get_db_connection()
    cursor = connection.cursor()
    cursor.execute("SELECT * FROM conventional_vehicles")
    vehicles = cursor.fetchall()
    connection.close()

    vehicles_list = [dict(vehicle) for vehicle in vehicles]
    return jsonify(vehicles_list)



if __name__ == "__main__":
    app.run(debug=True)
