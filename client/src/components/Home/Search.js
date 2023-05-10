import React from 'react';
import SearchIcon from '@mui/icons-material/Search';
import { FormControl, InputAdornment, TextField } from '@mui/material';

const Search = (props) => {

  const handleChange = (e) => {
    props.searchValue(e.target.value);
  };

  return (
    <FormControl variant="outlined" sx={{ m: 1, minWidth: 200, display: "flex", justifyContent: "center", justifyItems: "center" }} onSubmit={(e) => e.preventDefault()}>
    <TextField id="outlined-search" label="Search" type="search" onChange={handleChange} 
    InputProps={{
      startAdornment: <InputAdornment position="start"><SearchIcon /></InputAdornment>,
    }}
    autoComplete='off' />
    </FormControl>
    // <form
    //   method='POST '
    //   onSubmit={(e) => {
    //     e.preventDefault();
    //   }}
    //   name='formName'
    //   className='center'
    // >
      /* <label>
        <span className='label-text'>Search Items: </span>
        <SearchIcon />
        <input
          className='styled-search'
          autoComplete='off'
          type='text'
          name='searchTerm'
          onChange={handleChange}
        />
      </label> */
      /* <div className="searchBox">
        <label for="search-input">Search Items</label>
        <input id="search-input" type="text" placeholder="Search Items" autoComplete='off' onChange={handleChange} />
        <img alt="" src={require('../close1.png')} className="closeSearch" />
      </div> */
    /* </form> */
  );
};

export default Search;
