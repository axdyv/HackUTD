import sqlite3

connection = sqlite3.connect("fuel_economy.db")
cursor = connection.cursor()

# Create vehicles table
cursor.execute('''
CREATE TABLE IF NOT EXISTS vehicles (
    id INTEGER PRIMARY KEY,
    make TEXT,
    model TEXT,
    year INTEGER,
    category TEXT
)
''')

connection.commit()
connection.close()
