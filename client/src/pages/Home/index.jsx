import { useEffect, useState } from 'react';
import { useDispatch, connect } from 'react-redux';
import { FormattedMessage } from 'react-intl';
import { createStructuredSelector } from 'reselect';
import PropTypes from 'prop-types';
import { selectUserData } from '@containers/Client/selectors';

import ItemCard from './components/ItemCard';
import { selectCategory, selectFiveMinOngoingBid, selectLatestCratedBid } from './selectors';
import EmptyContainer from './components/EmptyContainer';
import CategoryCard from './components/CategoryCard';
import SearchComponent from './components/SearchComponent';
import SearchPage from './components/SearchPage';

import classes from './style.module.scss';
import { getCategory, getFiveMoreMinBids, getLatestBidData } from './actions';
import LoadingContainer from './components/LoadingContainer';

const Home = ({ latestItem, fiveMinBid, categories }) => {
  const dispatch = useDispatch();

  const [isLoadingLatestBid, setIsLoadingLatesBid] = useState(false);
  const [isLoadingFiveMoreMin, setIsLoadingFiveMoreMin] = useState(false);
  const [isLoadingCategories, setIsLoadingCategories] = useState(false);
  const [searchData, setSearchData] = useState('');
  const [categoryId, setCategoryId] = useState(null);

  const loadingContainerSwitch = (isLoading) => (isLoading ? <LoadingContainer /> : <EmptyContainer />);

  useEffect(() => {
    setIsLoadingLatesBid(true);
    setIsLoadingFiveMoreMin(true);
    setIsLoadingCategories(true);

    dispatch(
      getLatestBidData(() => {
        setIsLoadingLatesBid(false);
      })
    );
    dispatch(
      getFiveMoreMinBids(() => {
        setIsLoadingFiveMoreMin(false);
      })
    );
    dispatch(
      getCategory(() => {
        setIsLoadingCategories(false);
      })
    );
  }, []);

  return (
    <div className={classes.mainContainer}>
      <SearchComponent onSubmitSearch={(search) => setSearchData(search)} />
      {searchData !== '' || categoryId ? (
        <SearchPage
          searchData={searchData}
          categoryData={categories}
          selectedCategory={categoryId}
          setSelectedCategory={setCategoryId}
        />
      ) : (
        <>
          <div className={classes.sectionContainer}>
            <h1 className={classes.title}>
              <FormattedMessage id="home_latest_bid" />
            </h1>
            {latestItem.length > 0 ? (
              <div className={classes.listItemsX}>
                {latestItem.map((item) => (
                  <ItemCard key={item?.id} data={item} />
                ))}
              </div>
            ) : (
              loadingContainerSwitch(isLoadingLatestBid)
            )}
          </div>
          <div className={classes.sectionContainer}>
            <h1 className={classes.title}>
              <FormattedMessage id="home_five_min_bid" />
            </h1>
            {fiveMinBid.length > 0 ? (
              <div className={classes.listItemsX}>
                {fiveMinBid.map((item) => (
                  <ItemCard data={item} />
                ))}
              </div>
            ) : (
              loadingContainerSwitch(isLoadingFiveMoreMin)
            )}
          </div>
          <div className={classes.sectionContainer}>
            <h1 className={classes.title}>
              <FormattedMessage id="home_explore_by_category" />
            </h1>
            {categories.length > 0 ? (
              <div className={classes.listItemsX}>
                {categories.map((category) => (
                  <CategoryCard key={categories?.id} data={category} setSelectCategory={setCategoryId} />
                ))}
              </div>
            ) : (
              loadingContainerSwitch(isLoadingCategories)
            )}
          </div>
        </>
      )}
    </div>
  );
};

Home.propTypes = {
  latestItem: PropTypes.array,
  fiveMinBid: PropTypes.array,
  categories: PropTypes.array,
};

const mapStateToProps = createStructuredSelector({
  userData: selectUserData,
  latestItem: selectLatestCratedBid,
  fiveMinBid: selectFiveMinOngoingBid,
  categories: selectCategory,
});

export default connect(mapStateToProps)(Home);
