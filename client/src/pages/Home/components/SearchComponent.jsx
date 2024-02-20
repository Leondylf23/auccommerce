import { useEffect, useState } from 'react';
import SearchIcon from '@mui/icons-material/Search';
import SearchOffIcon from '@mui/icons-material/SearchOff';
import PropTypes from 'prop-types';
import { useSearchParams } from 'react-router-dom';

import classes from '../style.module.scss';

const SearchComponent = ({ onSubmitSearch }) => {
  const [searchParams, setSearchParams] = useSearchParams();
  const searchDataParam = searchParams?.get('search') || '';

  const [searchText, setSearchText] = useState(searchDataParam);
  const [timeoutId, setTimeoutId] = useState(null);

  const searchInputOnChange = (data) => {
    setSearchText(data);
    if (data !== '') {
      setSearchParams({ search: data });
    } else {
      setSearchParams({});
    }
  };

  useEffect(() => {
    if (timeoutId) {
      clearTimeout(timeoutId);
    }

    setTimeoutId(
      setTimeout(() => {
        onSubmitSearch(searchText);
        setTimeoutId(null);
      }, 500)
    );
  }, [searchText]);
  useEffect(() => {
    if (searchParams?.get('search')) {
      setSearchText(searchParams.get('search'));
    } else {
      setSearchText('');
    }
  }, [searchParams]);

  return (
    <div className={classes.searchComponentContainer}>
      <input
        type="text"
        placeholder="Search..."
        className={classes.input}
        value={searchText}
        onChange={(e) => searchInputOnChange(e.target.value)}
      />
      <button type="button" className={classes.searchBtn} onClick={() => setSearchText('')}>
        {searchText !== '' ? <SearchOffIcon /> : <SearchIcon />}
      </button>
    </div>
  );
};

SearchComponent.propTypes = {
  onSubmitSearch: PropTypes.func.isRequired,
};

export default SearchComponent;
