import { useEffect, useState } from 'react';
import { useDispatch, connect } from 'react-redux';
import { FormattedMessage, useIntl } from 'react-intl';
import { createStructuredSelector } from 'reselect';
import { useNavigate, useSearchParams } from 'react-router-dom';
import PropTypes from 'prop-types';
import { selectUserData } from '@containers/Client/selectors';

import ItemCard from './components/ItemCard';
import { selectCategory, selectFiveMinOngoingBid, selectLatestCratedBid } from './selectors';
import EmptyContainer from './components/EmptyContainer';

import classes from './style.module.scss';
import CategoryCard from './components/CategoryCard';
import SearchComponent from './components/SearchComponent';
import SearchPage from './components/SearchPage';

const Home = ({ userData, latestItem, fiveMinBid, categories }) => {
  const dispatch = useDispatch();
  const intl = useIntl();
  const navigate = useNavigate();

  const [latestBidData, setLatestBidData] = useState([]);
  const [fiveMinBidData, setFiveMinBidData] = useState([]);
  const [searchData, setSearchData] = useState('');
  const [categoryId, setCategoryId] = useState(null);

  useEffect(() => {
    setLatestBidData(latestItem);
    setFiveMinBidData(fiveMinBid);
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
            <h1 className={classes.title}>Latest Created Bid Items</h1>
            {latestBidData.length > 0 ? (
              <div className={classes.listItemsX}>
                {latestBidData.map((item) => (
                  <ItemCard key={item?.id} data={item} />
                ))}
              </div>
            ) : (
              <EmptyContainer />
            )}
          </div>
          <div className={classes.sectionContainer}>
            <h1 className={classes.title}>Last Five Minutes Bid</h1>
            {fiveMinBidData.length > 0 ? (
              <div className={classes.listItemsX}>
                {fiveMinBidData.map((item) => (
                  <ItemCard data={item} />
                ))}
              </div>
            ) : (
              <EmptyContainer />
            )}
          </div>
          <div className={classes.sectionContainer}>
            <h1 className={classes.title}>Explore by Catergory</h1>
            {categories.length > 0 ? (
              <div className={classes.listItemsX}>
                {categories.map((category) => (
                  <CategoryCard key={categories?.id} data={category} setSelectCategory={setCategoryId} />
                ))}
              </div>
            ) : (
              <EmptyContainer />
            )}
          </div>
        </>
      )}
    </div>
  );
};

Home.propTypes = {
  userData: PropTypes.string,
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
