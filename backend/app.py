from flask import Flask, jsonify
import sqlite3
from flask_cors import CORS

app = Flask(__name__)
CORS(app)

@app.route("/vehicles", methods=["GET"])
def get_vehicles():
    connection = sqlite3.connect("fuel_economy.db")
    cursor = connection.cursor()
    cursor.execute("SELECT * FROM vehicles")
    vehicles = cursor.fetchall()
    connection.close()
    return jsonify(vehicles)

if __name__ == "__main__":
    app.run(debug=True)
