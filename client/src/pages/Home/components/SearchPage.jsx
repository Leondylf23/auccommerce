import PropTypes from 'prop-types';
import { useEffect, useState } from 'react';
import { createStructuredSelector } from 'reselect';
import { connect, useDispatch } from 'react-redux';

import classes from '../style.module.scss';
import { selectSearchResult } from '../selectors';
import EmptyContainer from './EmptyContainer';
import ItemCard from './ItemCard';

const SearchPage = ({ searchData, categoryData, selectedCategory, setSelectedCategory, searchResult }) => {
  const [data, setData] = useState([]);

  const fetchData = () => {
    setData([]);
  };

  useEffect(() => {
    if (searchData !== '' || selectedCategory) {
      fetchData();
    }
  }, [searchData, selectedCategory]);
  useEffect(() => {
    if (searchResult && Array.isArray(searchResult) && searchResult?.length > 0) {
      setData((prevVal) => [...prevVal, ...searchResult]);
    }
  }, [searchResult]);
  return (
    <div className={classes.searchPageContainer}>
      <h1 className={classes.pageTitle}>
        {searchData !== '' ? `Search Result for "${searchData}"` : 'Search by Category'}
      </h1>
      <div className={classes.categoryTab}>
        <div className={classes.item} onClick={() => setSelectedCategory(null)} data-active={selectedCategory === null}>
          <p className={classes.name}>All</p>
        </div>
        {categoryData?.map((category) => (
          <div
            className={classes.item}
            onClick={() => setSelectedCategory(category?.id)}
            data-active={selectedCategory === category?.id}
          >
            <p className={classes.name}>{category?.name}</p>
          </div>
        ))}
      </div>
      <div className={classes.resultContainer}>
        {data?.length > 0 ? (
          <div className={classes.resultListContainer}>
            {data?.map((item) => (
              <ItemCard data={item} />
            ))}
          </div>
        ) : (
          <EmptyContainer />
        )}
      </div>
    </div>
  );
};

SearchPage.propTypes = {
  searchData: PropTypes.string.isRequired,
  categoryData: PropTypes.array.isRequired,
  selectedCategory: PropTypes.number,
  setSelectedCategory: PropTypes.func.isRequired,
  searchResult: PropTypes.array,
};

const mapStateToProps = createStructuredSelector({
  searchResult: selectSearchResult,
});

export default connect(mapStateToProps)(SearchPage);
