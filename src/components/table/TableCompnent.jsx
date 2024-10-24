import React, { useState, useEffect } from 'react';
import axios from 'axios';
import '../landing/landing.css'
import './table.css';
import unilogo from '../../assets/uni-logo.png';
import liblogo from '../../assets/lib-logo.png';
import '@fortawesome/fontawesome-free/css/all.css';

const TableComponent = () => {
  const subjects = ['1990-1999', 'Terrorism', 'Quantitative/Statistical', 'Narrow Topic', 'Early Childhood Education', 'Allied Health', 'Nanotechnology', 
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
  // State variables for table data and filters
  const [showTable, setShowTable] = useState(false)
  const [filteredData, setFilteredData] = useState([]);
  const [filtersApplied, setFiltersApplied] = useState(false);
  const [originalData, setOriginalData] = useState([]);
  const [filterStartYear, setFilterStartYear] = useState('');
  const [selectedVal, setSelectedVal] = useState('');
  const [filterEndYear, setFilterEndYear] = useState('');
  const [currentPage, setCurrentPage] = useState(1);
  const [tableData, setTableData] = useState([]);
  const [selectedAvailability, setSelectedAvailability] = useState('');
  const [selectedClassLevel, setSelectedClassLevel] = useState('');
  const [selectedSubject, setSelectedSubject] = useState('');
  const [subjectOptions, setSubjectOptions] = useState(subjects);
  const [refineSubjects, setRefineSubjects] = useState(subjects);
  const [refineSubjectSelection, setRefineSubjectSelection] = useState ('')
  const [isVisibleYear, setIsVisibleYear] = useState(false);
  const [isVisible, setIsVisible] = useState(false);
  const [isVisibleAvail, setIsVisibleAvail] = useState(false);
  const [isVisibleClass, setIsVisibleClass] = useState(false);
  const [isVisibletb, setIsVisibletb] = useState(false);
  const [sortBy, setSortBy] = useState(null);
  const [sortOrder, setSortOrder] = useState('asc');
  const [loading, setLoading] = useState (false)
  const [isFormVisible, setFormVisible] = useState(false);
  const [isTb, setIsTb] = useState(false);
  const [isVisibleLanguage, setIsVisibleLanguage] = useState(false);
  const [selectedLanguage, setSelectedLanguage] = useState('');

  const mapping = {
    '1': 'Textbook Title',
    '2': 'Author',
    '3': 'Aspect',
    '4' : 'Subject'
  };
  let perfEntries
  useEffect(() => {
    perfEntries = performance.getEntriesByType("navigation");

    if (perfEntries[0].type === "back_forward") {
    location.reload();
}
  }, []);

  const contactUsForm = () =>{
    alert('Your query form is submitted!')
    setFormVisible(false);
  }

  const handleButtonClick = () => {
    
    setFormVisible(true);
  };

  // Handlers
  const handleSelection = (event) => {
    const value = event.target.value;
    setSelectedVal(value);
    setSelectedSubject(''); 
    // setFiltersApplied(false)
    setTableData([]);          
    setFilteredData([]); 
    setShowTable(false);  
    setFilterStartYear('');
    setFilterEndYear('');
    setSelectedClassLevel('')
    setSelectedAvailability('')
    setCurrentPage(1)
    setRefineSubjects('')
    setFiltersApplied(false)
    setIsTb('')
    setSelectedLanguage('')
  };

  const handleSubjectSelection = (event) => {
    setSelectedSubject(event.target.value);
    // setCurrentPage(1)
  };

  const handleLanguageChange = (event) => {
    setSelectedLanguage(event.target.value);
    setCurrentPage(1)
};

  const refineSubject = (event) => {
    let val = event.target.value

    setRefineSubjectSelection(val.trim());
  };

  const handleSubmit = async (event) => {
    event.preventDefault();
    setLoading(true)
    setCurrentPage(1)
    let formData = {};
  
    if (selectedVal === '1' || selectedVal === '2' || selectedVal === '4') {
      const inputValue = event.target.querySelector('input[type="text"]').value;
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
    console.log('formdata:', formData)
    setShowTable(true);
  
    try {
      const response = await axios.post('http://127.0.0.1:5173/data', formData);
      let jsonArray = Array.isArray(response.data) ? response.data : eval('(' + response.data + ')');
      
      setOriginalData(jsonArray); 
      // setTableData(jsonArray);
      setFilteredData(jsonArray); 
      setFiltersApplied(false); 
      setRefineSubjectSelection('')
    } catch (error) {
      console.error('Error sending data to backend:', error);
    }
    finally{
      setLoading(false)
    }
  };
  
  const applyFilters = () => {
    console.log('clicked');
    const newFilteredData = filteredData.filter(book => {
        const copyrightYear = parseInt(book['Copyright Year'], 10);

        const isWithinYearRange = (
            (filterStartYear === '' || copyrightYear >= parseInt(filterStartYear, 10)) &&
            (filterEndYear === '' || copyrightYear <= parseInt(filterEndYear, 10))
        );

        const isAvailable = selectedAvailability === 'available' ? book['Available'] === 'Y' : true;
        const isUnavailable = selectedAvailability === 'unavailable' ? book['Available'] === 'N' : true;
        const isTbFilter = isTb === 'tb' ? book['is_textbook'] === 'Y' : true;
        const notTbFilter = isTb === 'notb' ? book['is_textbook'] === 'N' : true;

        // console.log(typeof(selectedClassLevel))

        // Adjusted condition for numeric class levels
        const isCorrectClassLevel = (
            selectedClassLevel === '' ||
            (String(book['Level']) === selectedClassLevel)
        );

        const isLanguage = (
          selectedLanguage === '' ||
          (String(book['Language']) === String(selectedLanguage))
      );

        // Ensure book.Discipline is a string before splitting
        const disciplineString = typeof book['Discipline'] === 'string' ? book['Discipline'] : '';
        const aspectsArray = disciplineString.split(',').map(subject => subject.trim().toUpperCase());

        // Check if the selectedSubject is in the array of aspects
        const subjectMatch = selectedSubject !== '' 
            ? aspectsArray.includes(selectedSubject.toUpperCase())
            : true;

        // Apply refineSubjectSelection if provided
        const refineMatch = refineSubjectSelection === '' 
            ? true
            : aspectsArray.includes(refineSubjectSelection.toUpperCase());

        const whichSubject = subjectMatch && refineMatch;

        return isWithinYearRange && isAvailable && isUnavailable && isCorrectClassLevel && whichSubject && isTbFilter && notTbFilter && isLanguage;
    });
    setCurrentPage(1)
    setFilteredData(newFilteredData);
    setFiltersApplied(true); // Ensure to set filters as applied
};

  const resetFilters = () =>{
    setFilterStartYear('');
    setFilterEndYear('');
    setSelectedClassLevel('')
    setSelectedAvailability('')
    setFilteredData(originalData);
    setFiltersApplied(false)
    setRefineSubjectSelection('')
    setCurrentPage(1)
    setIsVisible(false)
    setIsVisibleYear(false)
    setIsVisibleClass(false)
    setIsVisibleAvail(false)
    setIsTb('')
    setSelectedLanguage('')
  }

  const renderSelectedComponent = () => {
    let placeholder = '';
    if (selectedVal === '1' || selectedVal === '2' || selectedVal === '4') {
      placeholder = 'Enter ' + mapping[selectedVal] + ' ...';
      return (
        <>
          <input type="text" className='names' placeholder={placeholder} required />
          <button type="submit" className='search-btn'>Submit</button>
        </>
      );
    } else if (selectedVal === '3') {
      return (
        <>
          <select value={selectedSubject} onChange={handleSubjectSelection} className='subjects' required>
            <option value="" disabled hidden>Select Aspect...</option>
            {subjectOptions.map((subject, index) => (
              <option className='subjects' key={index} value={subject}>
                {subject}
              </option>
            ))}
          </select>
          <button type="submit" className='search-btn'>Submit</button>
        </>
      );
    }
};
  const itemsPerPage = 50;

  const sortedData = [...filteredData].sort((a, b) => {
    const aValue = a[sortBy];
    const bValue = b[sortBy];

    if (typeof aValue === 'undefined') return sortOrder === 'asc' ? -1 : 1;
    if (typeof bValue === 'undefined') return sortOrder === 'asc' ? 1 : -1;

    return sortOrder === 'asc'
      ? String(aValue).localeCompare(String(bValue))
      : String(bValue).localeCompare(String(aValue));
  });

  const startIndex = (currentPage - 1) * itemsPerPage;
  const visibleData = sortedData.slice(startIndex, startIndex + itemsPerPage);
  const totalPages = Math.ceil(sortedData.length / itemsPerPage);

  const handlePageChange = (page) => {
    setCurrentPage(page);
  };

  const handleFilterStartYearChange = (event) => {
    setFilterStartYear(event.target.value);
    setCurrentPage(1);
  };

  const handleFilterEndYearChange = (event) => {
    setFilterEndYear(event.target.value);
    setCurrentPage(1);
  };

  const handleAvailabilityChange = (event) => {
    setSelectedAvailability(event.target.value);
    setCurrentPage(1);
  };

  const handletbChange = (event) => {
    setIsTb(event.target.value);
    setCurrentPage(1);
  };

  const handleClassLevelChange = (event) => {
    setSelectedClassLevel(event.target.value);
    // setCurrentPage(1);
  };

  const sendEmail = (check, bookTitle) => {
    if (check === false) {
      alert(`We're sorry, the '${bookTitle}' book is unavailable at the moment. Please email bwyoung@olemiss.edu about your requirements.`);
    } else if (check === true) {
      alert(`The '${bookTitle}' book is available!`);
    }
  };


  const toggleVisibilityLanguage = () => {
    setIsVisibleLanguage (!isVisibleLanguage );
  };

  const toggleVisibilitySubject = () => {
    setIsVisible(!isVisible);
  };

  const toggleVisibilityTextbook = () => {
    setIsVisibletb(!isVisibletb);
  };

  const toggleVisibilityYear = () => {
    setIsVisibleYear(!isVisibleYear);
  };

  const toggleVisibilityAvail = () => {
    setIsVisibleAvail(!isVisibleAvail);
  };

  const toggleVisibilityClass = () => {
    setIsVisibleClass(!isVisibleClass);
  };

  const handleSort = (field) => {
    if (sortBy === field) {
      setSortOrder(sortOrder === 'asc' ? 'desc' : 'asc');
    } else {
      setSortBy(field);
      setSortOrder('asc');
    }
  };

  useEffect(() => {
    console.log('Table Data:', tableData);
    console.log('Filtered Data:', filteredData);
  }, [tableData, filteredData]);
  
  const table_class = visibleData.length <= 50 ? 'table-v1' : 'table-v2';

  const generateContactForm = () => {
    let contact = document.getElementById('contact-form');
    
    let form = document.createElement('form');
    form.setAttribute('action', '#'); 
    form.setAttribute('method', 'post');
    
    // Function to create label and input wrapper
    const createFormGroup = (labelText, inputType, inputId, inputName) => {
        let formGroup = document.createElement('div');
        formGroup.className = 'form-group';

        let label = document.createElement('label');
        label.setAttribute('for', inputId);
        label.textContent = labelText;
        
        let input;
        if (inputType === 'textarea') {
            input = document.createElement('textarea');
        } else {
            input = document.createElement('input');
            input.setAttribute('type', inputType);
        }
        input.setAttribute('id', inputId);
        input.setAttribute('name', inputName);
        input.setAttribute('required', true);

        formGroup.appendChild(label);
        formGroup.appendChild(input);
        
        return formGroup;
    };

    form.appendChild(createFormGroup('Name:', 'text', 'name', 'name'));
    form.appendChild(createFormGroup('Email:', 'email', 'email', 'email'));
    form.appendChild(createFormGroup('Message:', 'textarea', 'message', 'message'));

    let buttonContainer = document.createElement('div');
    buttonContainer.className = 'button-container';
    
    // Create and append the submit button
    let submitButton = document.createElement('button');
    submitButton.setAttribute('type', 'submit');
    submitButton.textContent = 'Submit';
    
    // Add an onclick event listener to the submit button
    submitButton.addEventListener('click', (event) => {
      alert('your information requested has been submitted!')
        event.preventDefault(); // Prevent the default form submission
        location.reload(); // Refresh the page
        
    });
    
    buttonContainer.appendChild(submitButton);
    
    // Append the button container to the form
    form.appendChild(buttonContainer);

    // Clear any existing content in the contact div and append the new form
    contact.innerHTML = '';
    contact.appendChild(form);
}
  return (
    <div className={table_class}>
      <div className='uni-name'><img src={unilogo} className='uni' alt="University Logo" /></div>
      <div className='unilogo'><img src={liblogo} className='lib' alt="Library Logo" /></div>
      <div className='red-div'></div>
      <div className='blue-div'></div>
      <h2 className='title'>EBooks for your search (testing phase)</h2>
      {/* <main className='main'> */}
        <form onSubmit={handleSubmit}>
          <label>
            Select a search category:
            <select className='dropdown1' value={selectedVal} onChange={handleSelection}>
            <option value="" disabled hidden>Select ...</option>
              <option value='1'>Book Title</option>
              <option value='2'>Author</option>
              <option value='3'>Aspect</option>
              <option value= '4'> Subject </option>
            </select>
          </label>
          {renderSelectedComponent()}
          {/*<button type='button' onClick = {() => resetFilters()}>Reset Filters</button>*/}
          {filteredData.length === 0 && filtersApplied &&
            <button type='button' onClick = {() => resetFilters()}  className='search-btn'>Reset Refined Filters</button>
          }
        </form>

        {!showTable &&
          <div className='instr-cont'>
            <p className='instructions'>
            The Edashboard project aims to create a user-friendly tool for  Ole Miss instructors. <br /> This dashboard will enable instructors to easily filter and discover ebooks that offer unlimited access within the Ole Miss' digital library. </p>
            <p className='instructions'>Choose your filter type and enter your search <br /></p>
            <p className='instructions'></p>
        </div>
        }
        {loading === true ? (<p>Loading...</p>) : 
          (showTable && (
            <div className='main-container'>
              {filteredData.length > 0 && 
                <div className='section-one'>
                  <h3>Refine Your Search</h3>
                  <div>
                    <label>Filter by Aspect:</label> <button className="btn" onClick={toggleVisibilitySubject}><i className="fa fa-angle-down"></i></button>
                    {isVisible && (
                    <>
                      {/* <p>check</p> */}
                      <select value={refineSubjectSelection} onChange={refineSubject} className='subject-select' required>
                        <option value="" disabled hidden>Select Aspect...</option>
                        {subjectOptions.map((subject, index) => (
                          <option className='subject-select' key={index} value={subject}>
                            {subject}
                          </option>
                        ))}
                      </select>
                    </>
                  )}
                  </div>
                  <div>
                    <label htmlFor="filterStartYear">Filter by Copyright Year Range:</label> <button className="btn" onClick={toggleVisibilityYear}><i className="fa fa-angle-down"></i></button>
                    {isVisibleYear && (
                      <div className='yearFilter-cont'>
                        <input
                          className='year'
                          type="text"
                          id="filterStartYear"
                          name="filterStartYear"
                          value={filterStartYear}
                          onChange={handleFilterStartYearChange}
                          placeholder="Start year..."
                        />
                        <input
                          className='year'
                          type="text"
                          id="filterEndYear"
                          name="filterEndYear"
                          value={filterEndYear}
                          onChange={handleFilterEndYearChange}
                          placeholder="End year..."
                        />
                        {/* <button type='submit' onClick={filteredData}>Search</button> */}
                      </div>
                    )}
                  </div>
    
                  <div className='avail'>
                    <label>Filter by Availability:</label> <button className="btn" onClick={toggleVisibilityAvail}><i className="fa fa-angle-down"></i></button> <br />
                    {isVisibleAvail && (
                      <div className='radio-cont'>
                        <div>
                          <input
                            className='radio'
                            type="radio"
                            id="available"
                            name="availability"
                            value="available"
                            checked={selectedAvailability === 'available'}
                            onChange={handleAvailabilityChange}
                          />
                          <label htmlFor="available" className='radio-class'>Available</label>
                        </div>
    
                        <div>
                          <input
                            className='radio'
                            type="radio"
                            id="unavailable"
                            name="availability"
                            value="unavailable"
                            checked={selectedAvailability === 'unavailable'}
                            onChange={handleAvailabilityChange}
                          />
                          <label htmlFor="unavailable" className='radio-class'>Unavailable</label>
                        </div>
                      </div>
                    )}
                  </div>

                  <div className='avail'>
                    <label>Filter by if Textbook:</label> <button className="btn" onClick={toggleVisibilityTextbook}><i className="fa fa-angle-down"></i></button> <br />
                    {isVisibletb && (
                      <div className='radio-cont'>
                        <div>
                          <input
                            className='radio'
                            type="radio"
                            id="tb"
                            name="tb"
                            value="tb"
                            checked={isTb === 'tb'}
                            onChange={handletbChange}
                          />
                          <label htmlFor="available" className='radio-class'>Is Textbook</label>
                        </div>
    
                        <div>
                          <input
                            className='radio'
                            type="radio"
                            id="notb"
                            name="notb"
                            value="notb"
                            checked={isTb === 'notb'}
                            onChange={handletbChange}
                          />
                          <label htmlFor="unavailable" className='radio-class'>Not Textbook</label>
                        </div>
                      </div>
                    )}
                  </div>
    
                  <div className='class-level'>
                    <label>Filter by Class Level:</label>
                    <button className="btn" onClick={toggleVisibilityClass}>
                      <i className="fa fa-angle-down"></i>
                    </button>
                    {isVisibleClass && (
                      <div className='dropdown-cont'>
                        <select
                          className='subject-select'
                          value={selectedClassLevel}
                          onChange={handleClassLevelChange}
                        >
                          <option value="" disabled hidden>Select Level...</option>
                          <option className='subject-select' value="1">1 - Basic-Essential</option>
                          <option className='subject-select' value="2">2 - Research-Essential</option>
                          <option className='subject-select' value="3">3 - Basic-Recommended</option>
                          <option className='subject-select' value="4">4 - Research-Recommended</option>
                          <option className='subject-select' value="5">5 - Specialized</option>
                          <option className='subject-select' value="6">6 - Supplementary</option>
                          <option className='subject-select' value="7">7 - Not a Select book</option>
                          <option className='subject-select' value="8">8 - Contains book</option>
                        </select>
                      </div>
                    )}
                  </div>

                  <div className='language-filter'>
                    <label>Filter by Language:</label>
                    <button className="btn" onClick={toggleVisibilityLanguage}>
                        <i className="fa fa-angle-down"></i>
                    </button>
                    {isVisibleLanguage && (
                        <div className='dropdown-cont'>
                            <select
                                className='lang-select'
                                value={selectedLanguage}
                                onChange={handleLanguageChange}
                            >
                                <option value="" disabled hidden>Select Language...</option>
                                <option className='lang-select' value="English">English</option>
                                <option className='lang-select' value="German">German</option>
                                <option className='lang-select' value="French">French</option>
                                <option className='lang-select' value="Spanish">Spanish</option>
                                <option className='lang-select' value="Greek">Greek</option>
                                <option className='lang-select' value="Latin">Latin</option>
                                <option className='lang-select' value="Hebrew">Hebrew</option>
                                <option className='lang-select' value="Arabic">Arabic</option>
                                <option className='lang-select' value="Italian">Italian</option>
                                <option className='lang-select' value="Russian">Russian</option>
                                <option className='lang-select' value="Dutch">Dutch</option>
                                <option className='lang-select' value="Galician">Galician</option>
                                <option className='lang-select' value="Chinese">Chinese</option>
                                <option className='lang-select' value="Bulgarian">Bulgarian</option>
                                <option className='lang-select' value="Other">Other</option>
                            </select>
                        </div>
                    )}
                </div>


                  <button type='button' onClick={() => applyFilters()} className='search-btn'>Apply Filters</button>
                  <button type='button' onClick = {() => resetFilters()} className='search-btn'>Reset Filters</button>
                  <div className='key'><p className='legend'>Legend</p>
                  {/* <div className='key-value'><i class="fa-solid fa-check"></i> <p className='value'>&nbsp;&nbsp;:&nbsp;&nbsp;&nbsp;Ebook Available</p></div>
                  <div className='key-value'><button className='N'>Request</button> <p className='value'>&nbsp;&nbsp;:&nbsp;&nbsp;&nbsp;Request Button to request that book</p></div> */}
                  <table className='legend-values'>
                    <tr className='key-value'>
                      <td><i class="fa-solid fa-check"></i></td>
                      <td className='value'>Ebook Available</td>
                    </tr>
                    <tr className='key-value'>
                      <td><button className='N'>Request</button></td>
                      <td className='value'>Button to request that book</td>
                    </tr>
                  </table>
                  </div>
                  <div id="contact-us">
                    {!isFormVisible ? (
                      <button className="contact-us-btn" onClick={handleButtonClick}>
                        Contact Us For More Information
                      </button>
                    ) : (
                      <form onSubmit={contactUsForm}>
                        <div className="form-group">
                          <label htmlFor="name">Name:</label>
                          <input type="text" id="name" name="name" required />
                        </div>
                        <div className="form-group">
                          <label htmlFor="email">Email:</label>
                          <input type="email" id="email" name="email" required />
                        </div>
                        <div className="form-group">
                          <label htmlFor="message">Message:</label>
                          <textarea id="message" name="message" required></textarea>
                        </div>
                        <div className="button-container">
                          <button type="submit">Submit</button>
                        </div>
                      </form>
                    )}
                  </div>
                </div>
              }

            <div className='section-two'>
              {filteredData.length > 0 ? (
                <table>
                  <colgroup>
                    <col style={{ width: '2%' }} />
                    <col style={{ width: '7%' }} />
                    <col style={{ width: '2%' }} />
                    <col style={{ width: '1%' }} />
                    <col style={{ width: '7%' }} />
                    <col style={{ width: '8%' }} />
                    <col style={{ width: '7%' }} />
                    <col style={{ width: '5%' }} />
                    <col style={{ width: '1%' }} />
                    <col style={{ width: '1%' }} />
                    <col style={{ width: '1%' }} />
                  </colgroup>
                  <thead>
                    <tr className='heading'>
                      <th>Status</th>
                      <th onClick={() => handleSort('Book Title')} className='ordering'>
                        Book Title
                        <i className="fa fa-sort"></i>
                      </th>
                      <th>ISBN</th>
                      <th onClick={() => handleSort('Copyright Year')} className='ordering'>
                        Copyright Year
                        <i className="fa fa-sort"></i>
                      </th>
    
                      <th>Aspect</th>
                      <th>Subject Heading</th>
                      <th>Author</th>
                      <th>Publisher</th>
                      <th>Level</th>
                      <th>Language</th>
                      <th>textbook</th>
                    </tr>
                  </thead>
                  <tbody>
                    {visibleData.map((book, index) => (
                      <tr key={index}>
                        <td>
                          {book['Available'] === 'Y' ? (
                            <div className={book['Available']} onClick={() => sendEmail(true, book['Book Title'])}>
                              {/* <button className='request'>Request</button> */}
                              <i class="fa-solid fa-check" title = 'Available'></i>
                            </div>
                          ) : (
                            <div className={book['Available']} onClick={() => sendEmail(false, book['Book Title'])}>
                              <button className='request'>Request</button>
                            </div> )}
                        </td>
                        <td>
                          {book['url'] ? (
                            // <a className='links' href={book['title_url']} target="_blank" rel="noopener noreferrer">{book['Book Title'] || ''}</a>
                            <a className='links' href={book['url']} target="_blank" rel="noopener noreferrer">{book['Book Title'] || ''}</a> || ''
                          ) : (
                            book['Book Title'] || ''
                          )}
                        </td>
                        <td>{book['New_ISBN'] || ''}</td>
                        <td>{book['Copyright Year'] || ''}</td>
                        <td>{book['Discipline'] || ''}</td>
                        <td>{book['Processed Subject Heading'] || ''}</td>
                        <td>{book['First Author'] || ''}</td>
                        <td>{book['Publisher'] || ''}</td>
                        {/* <td>{book['Class Level'] || ''}</td> */}
                        <td className='level'>{book['Select Level'] || ''}</td>
                        <td>{book['Language'] || ''}</td>
                        <td>{book['is_textbook'] || 'empty'}</td>
                      </tr>
                    ))}
                  </tbody>
                </table>
              ) : (
                <div className='no-data'>
                  <p>No data available for the selected filters.</p>
                  <button className='more-info' onClick={generateContactForm}>Contact For More Information</button>
                  <div id='contact-form'></div>
                </div>
              )}
    
              {/*check pagination here, add the page state here, which can reset to one later*/}
    
              {filteredData.length > itemsPerPage && (
                <div className='pagination'>
                  <button onClick={() => handlePageChange(currentPage - 1)} disabled={currentPage === 1}>Previous</button>
                  {Array.from({ length: totalPages }, (_, index) => (
                    <button
                      key={index}
                      onClick={() => handlePageChange(index + 1)}
                      className={currentPage === index + 1 ? 'active' : ''}
                    >
                      {index + 1}
                    </button>
                  ))}
                  <button onClick={() => handlePageChange(currentPage + 1)} disabled={currentPage === totalPages}>Next</button>
                </div>
              )}
            </div>
          </div>)
        )}
    </div>
  );
};

export default TableComponent;
