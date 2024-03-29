import PropTypes from 'prop-types';
import { connect, useDispatch } from 'react-redux';
import { createStructuredSelector } from 'reselect';
import { useEffect, useState } from 'react';
import { FormattedMessage } from 'react-intl';
import { useLocation } from 'react-router-dom';

import { selectMyBidsList } from './selectors';
import EmptyContainer from './components/EmptyContainer';
import BidCard from './components/BidCard';
import { getMyBids } from './actions';

import classes from './style.module.scss';

const MyBids = ({ bidsData }) => {
  const dispatch = useDispatch();
  const location = useLocation();

  const [tabIndex, setTabIndex] = useState(location.state?.tabIndex || 0);
  const [nextIndex, setNextIndex] = useState(null);
  const [isLoading, setIsLoading] = useState(false);

  const changeTab = (index) => {
    setNextIndex(null);
    setTabIndex(index);
  };

  const fetchData = (isReset) => {
    dispatch(
      getMyBids(
        { filter: tabIndex === 0 ? 'successful' : 'history', nextId: nextIndex },
        isReset,
        (nextIdData) => {
          setIsLoading(false);
          setNextIndex(nextIdData);
        },
        (err) => {
          setIsLoading(false);
        }
      )
    );
  };

  useEffect(() => {
    fetchData(true);
  }, [tabIndex]);

  return (
    <div className={classes.mainContainer} data-testid="my-bids-page">
      <div className={classes.tabs}>
        <div className={classes.tab} data-active={tabIndex === 0} onClick={() => changeTab(0)}>
          <p className={classes.text}>
            <FormattedMessage id="my_bids_tab_1_title" />
          </p>
        </div>
        <div className={classes.tab} data-active={tabIndex === 1} onClick={() => changeTab(1)}>
          <p className={classes.text}>
            <FormattedMessage id="my_bids_tab_2_title" />
          </p>
        </div>
      </div>
      <div className={classes.listBidItemsContainer}>
        {bidsData?.length > 0 ? (
          <div className={classes.listBidItems}>
            {bidsData?.map((bid) => (
              <BidCard data={bid} key={bid?.id} isShowStatus tabIndex={tabIndex} />
            ))}
          </div>
        ) : (
          <EmptyContainer />
        )}
        {isLoading && (
          <div className={classes.loadingContainer}>
            <p className={classes.text}>
              <FormattedMessage id="loading" />
            </p>
          </div>
        )}
        {nextIndex && (
          <div className={classes.loadMoreContainer}>
            <button type="button" className={classes.button} onClick={() => fetchData(false)}>
              <FormattedMessage id="load_more" />
            </button>
          </div>
        )}
      </div>
    </div>
  );
};

MyBids.propTypes = {
  bidsData: PropTypes.array,
};

const mapStateToProps = createStructuredSelector({
  bidsData: selectMyBidsList,
});

export default connect(mapStateToProps)(MyBids);
