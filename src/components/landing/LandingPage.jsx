import React, { useState } from 'react';
import axios from 'axios';
import './landing.css'
import unilogo from '../../assets/uni-logo.png'
import liblogo from '../../assets/lib-logo.png'
// import { useNavigate } from 'react-router-dom';
const LandingPage = ({ onSubmit }) => {

  // const history = useNavigate();

  const [selectedVal, setSelectedVal] = useState('');
  const [selectedSubject, setSelectedSubject] = useState('');
  const [subjectOptions, setSubjectOptions] = useState([
    'African American Studies', 'African Studies', 'Agriculture', 'American Indian Studies', 'American Studies',
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
    'gardland-discipline', 'horticulture-discipline'
  ]);

  const mapping = {
    '1': 'Textbook Title',
    '2': 'Author',
    '3': 'Subject'
  };

  const handleSelection = (event) => {
    const value = event.target.value;
    setSelectedVal(value);
    setSelectedSubject(''); 
  };

  const handleSubjectSelection = (event) => {
    setSelectedSubject(event.target.value);
  };

  const handleInputChange = (event) => {
    const value = event.target.value;
    setSelectedSubject(value); // Update selected subject as user types
    // Filter subject options based on input text
    const filteredOptions = subjectOptions.filter(option =>
      option.toLowerCase().includes(value.toLowerCase())
    );
    setSubjectOptions(filteredOptions);
  };

  const handleSubmit = async (event) => {
    event.preventDefault();
    
    let formData = {};

    if (selectedVal === '1' || selectedVal === '2') {
      const inputValue = event.target.querySelector('input[type="text"]').value;
      console.log(typeof(inputValue))
      formData = {
        number: selectedVal,
        selectedVal: mapping[selectedVal],
        inputValue: inputValue,
      };
    } else {
      formData = {
        number: selectedVal,
        selectedVal: mapping[selectedVal],
        selectedSubject: selectedSubject,
      };
    }

    try {
      console.log('here')
      const response = await axios.post('http://127.0.0.1:5173/data', formData);
      const jsonData = response.data; 
      console.log(response)
      console.log(response.data)
      console.log(jsonData)
      // console.log(typeof(jsonData))

      // let jsonArray = eval('(' + jsonData + ')');
      // console.log(jsonArray)
      // console.log(typeof(jsonArray))
      // onSubmit(jsonData); 
      let jsonArray = []
      if (Array.isArray(jsonData)){
        jsonArray = jsonData
      }
      else{
        jsonArray = eval('(' + jsonData + ')');
      }
      onSubmit(jsonArray); 
      // history.push({
      //   pathname: '/table',
      //   state: { jsonData } 
      // });
    } catch (error) {
      console.error('Error sending data to backend:', error);
    }
  };

  const renderSelectedComponent = () => {
     let place = ''
    if (selectedVal === '1') {
      place  = 'Enter ' + mapping[selectedVal] + ' ...'
      return <input type="text" className='names' placeholder={place} required/>;
    } else if (selectedVal === '2') {
      place  = 'Enter ' + mapping[selectedVal] + ' ...'
      return <input type="text" className='names' placeholder={place} required/>
    } else if(selectedVal == '3') {
      return (
        <select value={selectedSubject} onChange={handleSubjectSelection} className='subjects' required>
          <option value="" disabled hidden>Select Subject...</option>
          {subjectOptions.map((subject, index) => (
            <option className='subjects' key={index} value={subject}>
              {subject}
            </option>
          ))}
        </select>
      );;
    }
  };

  return (
    <div className='landing-page'>
      <div className='uni-name'><img src = {unilogo} className='uni' /></div> {/*For uni logo*/ }
      <div className='unilogo'><img  src = {liblogo} className='lib'/></div> {/*For uni library logo*/ }
      <div className='red-div'></div>
      <div className='blue-div'></div>
      <div className='title'>
        <h2>Find EBooks Here (Testing Phase) </h2>
      </div>
      <div className='instr-cont'>
        <p className='instructions'>
        The Edashboard project aims to create a user-friendly tool for  Ole Miss instructors. <br /> This dashboard will enable instructors to easily filter and discover ebooks that offer unlimited access within the Ole Miss' digital library. </p>
        <p className='instructions'>Choose your filter type and enter your search <br /></p>
        <p className='instructions'></p>
      </div>

       {/*for the form input div*/}
       {/* <label> Choose Filter here</label> */}
      <form onSubmit={handleSubmit}>
      <label>Filter Type</label>
      <div className='form-format'>
        <div id='dropdown1'>
          
          <select value={selectedVal} onChange={handleSelection} required>
            <option value="" disabled hidden>Filter By</option>
            <option value="1">Textbook Title</option>
            <option value="2">Author</option>
            <option value="3">Subject</option>
          </select>
        </div>
        <div id='selectionInput' required>
          {renderSelectedComponent()}
        </div>
        </div>
        <div className='button-cont'>
            <button type="submit">Submit</button>
        </div>
      </form>
      
    </div>
  );
};

export default LandingPage;
