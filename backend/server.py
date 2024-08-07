from flask import Flask, request, jsonify
from flask_cors import CORS
import pandas as pd
from flask_cors import CORS, cross_origin


app = Flask(__name__)
CORS(app)  

mapping_options = {
    '1': 'Book Title',
    '2': 'First Author',
    '3': 'Discipline'
}
subjects = ['African American Studies', 'African Studies', 'Agriculture', 'American Indian Studies', 'American Studies',
    'Anthropology', 'Aquatic Sciences', 'Archaeology', 'Architecture & Architectural History',
    'Architecture and Architectural History', 'Art & Art History', 'Asian Studies', 'Astronomy', 'Bibliography',
    'Biological Sciences', 'Botany & Plant Sciences', 'British Studies', 'Business', 'Chemistry',
    'Classical Studies', 'Communication Studies', 'Computer Science', 'Criminology & Criminal Justice',
    'Cultural Studies', 'Development Studies', 'Developmental & Cell Biology', 'Ecology & Evolutionary Biology',
    'Economics', 'Education', 'Engineering', 'Environmental Science', 'Environmental Studies', 'European Studies',
    'Feminist & Women\'s Studies', 'Film Studies', 'Finance', 'Folklore', 'Food Studies', 'Garden & Landscape',
    'Gender Studies', 'General Science', 'Geography', 'Geology', 'Health Policy', 'Health Sciences', 'History',
    'History of Science & Technology', 'Horticulture', 'International Relations', 'Irish Studies', 'Jewish Studies',
    'Labor & Employment Relations', 'Language & Literature', 'Latin American Studies', 'Law', 'Library Science',
    'Linguistics', 'Management & Organizational Behavior', 'Marketing & Advertising', 'Mathematics',
    'Middle East Studies', 'Military Studies', 'Museum Studies', 'Music', 'Paleontology', 'Peace & Conflict Studies',
    'Performing Arts', 'Philosophy', 'Physics', 'Political Science', 'Population Studies', 'Psychology',
    'Public Health', 'Public Policy & Administration', 'Religion', 'Science & Technology Studies', 'Slavic Studies',
    'Social Work', 'Sociology', 'Statistics', 'Technology', 'Transportation Studies', 'Urban Studies', 'Zoology',
    'gardland-discipline', 'horticulture-discipline']

# @lru_cache(maxsize=None)
def load_excel_data():
    # Load Excel file into a DataFrame
    file_path = r'C:\Users\MDsota\Desktop\dashboard\backend\complete_list.xlsx'
    df = pd.read_excel(file_path, sheet_name='Sheet1')  

    # Rename columns to match your keys
    df = df.rename(columns={
        'ebook ISBN without hyphens': 'ISBN',
        'publication_title': 'Book Title',
        'first_author': 'First Author',
        'discipline': 'Discipline',
        'publisher_name': 'Publisher',
        'copyright_year': 'Copyright Year',
        'title_url' : 'title_url', 
        'class_level': 'Class Level',
        'available': 'Available'
        
    })
    for subject in subjects:
        df[subject] = 0

    # Update values based on the 'Discipline' field
    for index, row in df.iterrows():
        discipline = str(row['Discipline'])  # Convert to string to handle NaN values
        if pd.notna(discipline):
            for subject in subjects:
                if subject in discipline:
                    df.at[index, subject] = 1

    print('Loaded Excel as DataFrame with additional subject columns')
    return df


df = load_excel_data() 

@cross_origin(origin='localhost', headers=['Content-Type', 'Authorization'])
@app.route('/data', methods=['POST'])
def handle_data():
    data = request.json  # Extract JSON data from request body
    optionNumber = data.get('number')
    inputValue = data.get('inputValue') if optionNumber in ['1', '2'] else None
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
    column_name = mapping_options.get(option)
    print('check',inputVal, type(inputVal))
    if column_name:
        if option == '1' or option == '2':
            inputVal_lower = inputVal.lower()
            # Perform case-insensitive search
            filtered_df = df[df[column_name].astype(str).str.lower().str.contains(inputVal_lower, na=False)]
            
            # Extract relevant columns
            result_data = filtered_df[['Book Title', 'First Author', 'Discipline', 'Publisher', 'Copyright Year', 'title_url', 'Class Level', 'Available']]
        
        else:
            # Convert Discipline column to string and then split by ';'
            
            # Filter based on selectedSubject in the flattened Discipline column
            selectedSubject_edit = selectedSubject.strip()
            filtered_df = df[df[selectedSubject_edit] == 1]

            # Extract relevant columns
            result_data = filtered_df[['Book Title', 'First Author', 'Discipline', 'Publisher', 'Copyright Year', 'title_url', 'Class Level', 'Available']]
        
        # Sort result_data by 'Copyright Year' in descending order
        result_data_sorted = result_data.sort_values(by='Copyright Year', ascending=False)
        
        # Convert sorted result_data to dictionary format
        result_data_dict = result_data_sorted.to_dict(orient='records')
        
        return result_data_dict

    else:
        return []


if __name__ == '__main__':
    app.run(debug=True, port=5173)
