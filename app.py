from flask import Flask, jsonify
import pandas as pd

app = Flask(__name__)

df = pd.read_excel('data.xlsx', sheet_name='Sheet1')

@app.route('/api/data', methods=['GET'])
def get_data():
    return jsonify(df.to_dict(orient='records'))

if __name__ == '__main__':
    app.run(debug=True)
