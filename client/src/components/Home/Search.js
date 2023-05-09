import React, { useState, useEffect } from 'react';

const Search = (props) => {

  const handleChange = (e) => {
    props.searchValue(e.target.value);
  };

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
        <span className='label-text'>Search Items: </span>
        <input
          className='styled-search'
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
