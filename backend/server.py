from flask import Flask, request, jsonify
from flask_cors import CORS
import pandas as pd
from flask_cors import CORS, cross_origin


app = Flask(__name__)
CORS(app)  

mapping_options = {
    '1': 'Book Title',
    '2': 'First Author',
    '3': 'Discipline',
    '4': 'Subject Heading'
}
subjects = ['1990-1999', 'Terrorism', 'Quantitative/Statistical', 'Narrow Topic', 'Early Childhood Education', 'Allied Health', 'Nanotechnology', 
'Nursing', 'Agricultural', 'Edited Work', '1910-1919', 'Science Fiction', '1960-1969', 'Urban', 'Career', 'Biotechnology', 'Journalistic Treatment', 
'Genocide', '18th Century', 'UK Title Announcement', '17th Century', 'Medical', 'Philosophical', 'COVID-19', '1900-1909', 'Devotional', 'Coaching', 
'Anthropological', 'Bible Commentary', 'Counseling', 'School Library', 'Science', 'Leadership', 'Political', '20th Century', '16th Century', 'Environmental', 
'Staple Bound', 'Ethical', 'Doctrinal', 'Rural', 'Educational', 'Religious', 'Pictorial Work', 'Technical (Law)', 'General Librarianship', '1980-1989', 
'Music', 'Topics Current Media', 'Social Work', 'Archaeological', 'Elementary Education', 'Globalization', 'Romance Novel', 'European Union', 'Historical', 
'History of Science', 'Overview', 'Guidebook', 'Fantasy Novel', '1970-1979', 'Sociological', 'Academic/Research Library', '19th Century', 'Major Work', 
'Mystery', 'Pastoral', 'Spiral Bound', 'Computer', '1920-1929', 'Architectural', 'Geographical', 'Distance Education', 'Public Library', 'Kindergarten', 
'Military', 'Higher Educational', '1930-1939', 'Vocational/Technician', 'Art', '1950-1959', 'Proselytizing', 'Public Policy', 'Language', 'Economic', 
'Teaching of', 'Clinical', 'ESL', 'Secondary Education', 'Local Interest', 'Mass Media', 'Marine', 'Business', 'Foreign Relations', 'Dance', 'Psychological', 
'Thriller', 'Self-help', 'Legal', 'Theatre/Drama', 'Crime and Criminology', 'Communications', '1940-1949', 'Human Rights', 'Management', 'Description and Travel']

# @lru_cache(maxsize=None)
def load_excel_data():
    file_path = r'processed_file.csv'
    dtype_dict = {
        'GOBI Standardized ISBN': str,
        'GOBI Title': str,
        'Author': str,
        'Aspects_String': str,
        'Publisher': str,
        'Publication Year': int,
    }
    df = pd.read_csv(file_path, dtype=dtype_dict, low_memory=False)
    
    # Print out the columns to check names
    print("Columns available in DataFrame:", df.columns.tolist())
    
    df = df.rename(columns={
        'GOBI Standardized ISBN': 'New_ISBN',
        'GOBI Title': 'Book Title',
        'Author': 'First Author',
        'Aspects_String': 'Discipline',
        'Publisher': 'Publisher',
        'Publication Year': 'Copyright Year',
        'Is available UU?' : 'Available'
    })
    
    print('Loaded Excel as DataFrame with additional subject columns')
    return df


df = load_excel_data() 
print(df.head(5))
print("Columns available in DataFrame:", df.columns.tolist())

@cross_origin(origin='localhost', headers=['Content-Type', 'Authorization'])
@app.route('/data', methods=['POST'])
def handle_data():
    data = request.json  # Extract JSON data from request body
    optionNumber = data.get('number')
    inputValue = data.get('inputValue') if optionNumber in ['1', '2', '4'] else None
    selectedSubject = data.get('selectedSubject') if optionNumber == '3' else None
    selectedVal = data.get('selectedVal')

    # Perform query based on option number
    queried_data = query_excel(df, optionNumber, inputValue, selectedSubject)

    # Prepare response data
    response_data = {
        'message': 'Data received successfully',
        'optionNumber': optionNumber,
        'selectedVal': selectedVal,
        'inputValue': inputValue,
        'selectedSubject': selectedSubject,
        'data': queried_data  # Include queried data in the response
    }

    return jsonify(queried_data)

def query_excel(df, option, inputVal, selectedSubject):
    print('check')
    column_name = mapping_options.get(option)
    print(option, inputVal)
    if column_name:
        if option == '1' or option == '2'or option == '4':
            inputVal_lower = inputVal.lower()
            print(inputVal)
            # Perform case-insensitive search using vectorized operations
            filtered_df = df[df[column_name].astype(str).str.lower().str.contains(inputVal_lower, na=False)]
            
            # Extract relevant columns only if they exist
            columns_to_extract = ['Book Title', 'First Author', 'Discipline', 'Processed Subject Heading', 'Publisher', 'Copyright Year', 'New_ISBN', 'Available', 'Level', 'Language', 'is_textbook', 'Select Level', 'url']
            result_data = filtered_df[columns_to_extract].dropna(how='all')  # Drop rows where all extracted columns are NaN
            if option == '4':
                print(filtered_df['Processed Subject Heading'].head(1))
        
        else:
            # Perform vectorized string matching for 'Discipline'
            # Convert selectedSubject to uppercase once
            selectedSubject_upper = selectedSubject.upper()
            
            # Use vectorized operations to check if selectedSubject is in 'Aspects_String'
            mask = df['Discipline'].astype(str).str.upper().str.contains(selectedSubject_upper, na=False)
            
            filtered_df = df[mask]
            
            # Extract relevant columns only if they exist
            columns_to_extract = ['Book Title', 'First Author', 'Discipline', 'Processed Subject Heading', 'Publisher', 'Copyright Year', 'New_ISBN', 'Available', 'Level', 'Language', 'is_textbook', 'Select Level', 'url']
            result_data = filtered_df[columns_to_extract].dropna(how='all')  # Drop rows where all extracted columns are NaN
        
        # Sort result_data by 'Copyright Year' in descending order, if the column exists
        if 'Copyright Year' in result_data.columns:
            result_data = result_data.sort_values(by='Copyright Year', ascending=False)
        
        # Convert sorted result_data to dictionary format
        result_data_dict = result_data.to_dict(orient='records')
        
        return result_data_dict

    else:
        return []


if __name__ == '__main__':
    app.run(debug=True, port=5173)
