import PropTypes from 'prop-types';
import { useEffect, useState } from 'react';
import { createStructuredSelector } from 'reselect';
import { connect, useDispatch } from 'react-redux';
import { useIntl, FormattedMessage } from 'react-intl';

import classes from '../style.module.scss';
import { selectSearchResult } from '../selectors';
import EmptyContainer from './EmptyContainer';
import ItemCard from './ItemCard';
import { getSearchItems } from '../actions';

const SearchPage = ({ searchData, categoryData, selectedCategory, setSelectedCategory, searchResult }) => {
  const intl = useIntl();
  const dispatch = useDispatch();

  const [isLoading, setIsLoading] = useState(false);
  const [nextOffset, setNextOffset] = useState('');

  const fetchData = (isReset) => {
    setIsLoading(true);
    dispatch(
      getSearchItems({ itemName: searchData, category: selectedCategory }, isReset, (nextOffsetData) => {
        setIsLoading(false);
        setNextOffset(nextOffsetData);
      })
    );
  };

  useEffect(() => {
    if (searchData !== '' || selectedCategory) {
      fetchData(true);
    }
  }, [searchData, selectedCategory]);

  return (
    <div className={classes.searchPageContainer}>
      <h1 className={classes.pageTitle}>
        {searchData !== '' ? (
          `${intl.formatMessage({ id: 'home_search_result' })} "${searchData}"`
        ) : (
          <FormattedMessage id="home_search_by_category" />
        )}
      </h1>
      <div className={classes.categoryTab}>
        <div className={classes.item} onClick={() => setSelectedCategory(null)} data-active={selectedCategory === null}>
          <p className={classes.name}>All</p>
        </div>
        {categoryData?.map((category) => (
          <div
            key={category?.id}
            className={classes.item}
            onClick={() => setSelectedCategory(category?.id)}
            data-active={selectedCategory === category?.id}
          >
            <p className={classes.name}>{category?.name}</p>
          </div>
        ))}
      </div>
      <div className={classes.resultContainer}>
        {searchResult?.length > 0 ? (
          <div className={classes.resultListContainer}>
            {searchResult?.map((item) => (
              <ItemCard data={item} />
            ))}
          </div>
        ) : (
          <EmptyContainer />
        )}
      </div>
      {isLoading ? (
        <div className={classes.searchLoadingContainer}>
          <p className={classes.text}>
            <FormattedMessage id="loading" />
          </p>
        </div>
      ) : (
        nextOffset && (
          <div className={classes.loadMoreBtncontainer}>
            <button type="button" className={classes.button} onClick={() => fetchData(false)}>
              <p className={classes.text}>
                <FormattedMessage id="load_more" />
              </p>
            </button>
          </div>
        )
      )}
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
