import React, { useState, useEffect } from 'react';

const Search = (props) => {
  const [searchType, setSearchType] = useState(props?.searchType ?? "");

  const handleChange = (e) => {
    props.searchValue(e.target.value);
  };

  useEffect(() => {
    setSearchType(props?.searchType ?? "");
  }, [props?.searchType])

  return (
    <form
      method='POST '
      onSubmit={(e) => {
        e.preventDefault();
      }}
      name='formName'
      className='center'
    >
      <label>
        <span>Search {searchType}: </span>
        <input
          autoComplete='off'
          type='text'
          name='searchTerm'
          onChange={handleChange}
        />
      </label>
    </form>
  );
};

export default Search;
