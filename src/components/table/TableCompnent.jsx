import React, { useState, useEffect } from 'react';
import './table.css';
import unilogo from '../../assets/uni-logo.png';
import liblogo from '../../assets/lib-logo.png';
import '@fortawesome/fontawesome-free/css/all.css';

const TableComponent = ({ data }) => {
  const [filterStartYear, setFilterStartYear] = useState('');
  const [filterEndYear, setFilterEndYear] = useState('');
  const [currentPage, setCurrentPage] = useState(1);
  const [tableData, setTableData] = useState([]);
  const [selectedAvailability, setSelectedAvailability] = useState('');
  const [selectedClassLevel, setSelectedClassLevel] = useState('');
  let table_class = '';
  const [isVisibleYear, setisVisibleYear] = useState(false);
  const [isVisibleAvail, setisVisibleAvail] = useState(false);
  const [isVisibleClass, setisVisibleClass] = useState(false);
  const [sortBy, setSortBy] = useState(null);
  const [sortOrder, setSortOrder] = useState('asc');

  const itemsPerPage = 50;

  useEffect(() => {
    if (data) {
      const jsonData = data.map(book => ({
        ...book,
        'Copyright Year': parseInt(book['Copyright Year'], 10)
      }));
      setTableData(jsonData);
    }
  }, [data]);

  const filteredData = tableData.filter(book => {
    const copyrightYear = parseInt(book['Copyright Year'], 10);

    const isWithinYearRange = (
      (filterStartYear === '' || copyrightYear >= parseInt(filterStartYear, 10)) &&
      (filterEndYear === '' || copyrightYear <= parseInt(filterEndYear, 10))
    );

    const isAvailable = selectedAvailability === 'available' ? book['Available'] === 'Y' : true;
    const isUnavailable = selectedAvailability === 'unavailable' ? book['Available'] === 'N' : true;

    const isCorrectClassLevel = (
      selectedClassLevel === '' ||
      (selectedClassLevel === '1' && book['Class Level'] === 'UG') ||
      (selectedClassLevel === '2' && book['Class Level'] === 'G')
    );

    return isWithinYearRange && isAvailable && isUnavailable && isCorrectClassLevel;
  });

  const sortedData = [...filteredData].sort((a, b) => {
    const aValue = a[sortBy];
    const bValue = b[sortBy];

    if (typeof aValue === 'undefined') return sortOrder === 'asc' ? -1 : 1;
    if (typeof bValue === 'undefined') return sortOrder === 'asc' ? 1 : -1;

    if (sortOrder === 'asc') {
      return String(aValue).localeCompare(String(bValue));
    } else {
      return String(bValue).localeCompare(String(aValue));
    }
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

  const handleClassLevelChange = (event) => {
    setSelectedClassLevel(event.target.value);
    setCurrentPage(1);
  };

  const sendEmail = (check, bookTitle) => {
    if (check === false) {
      console.log(`Sending email about '${bookTitle}'...`);
      alert(`We're sorry, the '${bookTitle}' book is unavailable at the moment. Please email bwyoung@olemiss.edu about your requirements.`);
    } else if (check === true) {
      console.log(`Sending email about '${bookTitle}'...`);
      alert(`The '${bookTitle}' book is available!`);
    }
  };

  const toggleVisibilityYear = () => {
    setisVisibleYear(!isVisibleYear);
  };

  const toggleVisibilityAvail = () => {
    setisVisibleAvail(!isVisibleAvail);
  };

  const toggleVisibilityClass = () => {
    setisVisibleClass(!isVisibleClass);
  };

  const handleSort = (field) => {
    if (sortBy === field) {
      setSortOrder(sortOrder === 'asc' ? 'desc' : 'asc');
    } else {
      setSortBy(field);
      setSortOrder('asc');
    }
  };

  if (visibleData.length <= 50) {
    table_class = 'table-v1';
  } else {
    table_class = 'table-v2';
  }

  return (
    <div className={table_class}>
      <div className='uni-name'><img src={unilogo} className='uni' alt="University Logo" /></div>
      <div className='unilogo'><img src={liblogo} className='lib' alt="Library Logo" /></div>
      <div className='red-div'></div>
      <div className='blue-div'></div>
      <h2 className='title'>EBooks for your search</h2>
      <div className='main-container'>
        <div className='section-one'>
          <div>
            <h3>Refine Your Search</h3>
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
                  <label htmlFor="available">Available</label>
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
                  <label htmlFor="unavailable">Unavailable</label>
                </div>
              </div>
            )}

          </div>

          <div>
            <label>Filter by Class Level:</label> <button className="btn" onClick={toggleVisibilityClass}><i className="fa fa-angle-down"></i></button>
            {isVisibleClass && (
              <div>
                <select value={selectedClassLevel} onChange={handleClassLevelChange} className='class'>
                  <option value="">Filter By</option>
                  <option value="1">Undergraduate</option>
                  <option value="2">Graduate</option>
                </select>
              </div>
            )}
          </div>
        </div>

        <div className='section-two'>
          {filteredData.length > 0 ? (
            <table>
            <colgroup>
              <col style={{ width: '35%' }} /> {/* Adjust width as needed (max) */}
              <col style={{ width: '3%' }} /> {/* Adjust width as needed (less) */}
              <col style={{ width: '25%' }} /> {/* Adjust width as needed (mid) */}
              <col style={{ width: '15%' }} /> {/* Adjust width as needed (mid) */}
              <col style={{ width: '35%' }} /> {/* Adjust width as needed (mid) */}
              <col style={{ width: '3%' }} /> {/* Adjust width as needed (max) */}
              <col style={{ width: '10%' }} /> {/* Adjust width as needed (mid) */}
            </colgroup>

              <thead>
                <tr className='heading'>
                  <th onClick={() => handleSort('Book Title')} className='ordering'>
                    Book Title {sortBy === 'Book Title' && <i className={`fas fa-sort-${sortOrder === 'asc' ? 'up' : 'down'}`}></i>}
                  </th>
                  <th onClick={() => handleSort('Copyright Year')} className='ordering'>
                    Copyright Year {sortBy === 'Copyright Year' && <i className={`fas fa-sort-${sortOrder === 'asc' ? 'up' : 'down'}`}></i>}
                  </th>
                  <th>Discipline</th>
                  <th>Author</th>
                  <th>Publisher</th>
                  <th>Class Level</th>
                  <th>Availability</th>
                </tr>
              </thead>
              <tbody>
                {visibleData.map((book, index) => (
                  <tr key={index}>
                    <td>
                      {book['title_url'] ? (
                        <a className='links' href={book['title_url']} target="_blank">{book['Book Title'] || ''}</a>
                      ) : (
                        book['Book Title'] || ''
                      )}
                    </td>
                    <td>{book['Copyright Year'] || ''}</td>
                    <td>{book['Discipline'] || ''}</td>
                    <td>{book['First Author'] || ''}</td>
                    <td>{book['Publisher'] || ''}</td>
                    <td>{book['Class Level'] || ''}</td>
                    <td>
                      {book['Available'] === 'N' ? (
                        <div className={book['Available']} onClick={() => sendEmail(false, book['Book Title'])}>
                          <button className='request'>Request</button>
                        </div>
                      ) : (
                        <div className={book['Available']} onClick={() => sendEmail(true, book['Book Title'])}>
                          Available
                        </div>
                      )}
                    </td>
                  </tr>
                ))}
              </tbody>
            </table>
          ) : (
            <div className='no-data'>No data available for the selected filters.</div>
          )}

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
      </div>
    </div>
  );
};

export default TableComponent;
