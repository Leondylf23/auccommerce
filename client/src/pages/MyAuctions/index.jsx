import { connect, useDispatch } from 'react-redux';
import { createStructuredSelector } from 'reselect';
import { useNavigate } from 'react-router-dom';
import PropTypes from 'prop-types';
import { FormattedMessage } from 'react-intl';
import { useEffect, useState } from 'react';
import AddIcon from '@mui/icons-material/Add';

import AuctionDataCard from './components/AuctionDataCard';
import { selectMyAuctions } from './selectors';
import { getMyAuctions, resetMyAuctions } from './actions';

import classes from './style.module.scss';

const MyAuctions = ({ myAuctionsData }) => {
  const navigate = useNavigate();
  const dispatch = useDispatch();

  const [isLoading, setIsLoading] = useState(false);
  const [nextOffset, setNextOffset] = useState(null);

  const fetchData = (isReset) => {
    const nextOffsetTemp = nextOffset;
    setIsLoading(true);
    setNextOffset(null);
    if (isReset) dispatch(resetMyAuctions());

    dispatch(
      getMyAuctions(
        { nextId: nextOffsetTemp },
        (nextOffsetData) => {
          setIsLoading(false);
          setNextOffset(nextOffsetData);
        },
        (err) => {
          setIsLoading(false);
        }
      )
    );
  };

  useEffect(() => {
    fetchData(true);
  }, []);

  return (
    <div className={classes.mainContainer}>
      <h1 className={classes.pageTitle}>
        <FormattedMessage id="my_auctions_title" />
      </h1>
      <div className={classes.createNewBtnContainer}>
        <button type="button" className={classes.button} onClick={() => navigate('/create-auction')}>
          <AddIcon className={classes.icon} />
          <p className={classes.text}>
            <FormattedMessage id="my_auctions_new" />
          </p>
        </button>
      </div>
      <div className={classes.auctionContainer}>
        {myAuctionsData?.length > 0 ? (
          <>
            <div className={classes.auctionListContainer}>
              {myAuctionsData?.map((auction) => (
                <AuctionDataCard key={auction?.id} data={auction} />
              ))}
            </div>
            {isLoading && (
              <div className={classes.loadingContainer}>
                <p className={classes.text}>
                  <FormattedMessage id="loading" />
                </p>
              </div>
            )}
          </>
        ) : (
          <div className={classes.emptyContainer}>
            <p className={classes.text}>
              <FormattedMessage id="empty_data" />
            </p>
          </div>
        )}
        {nextOffset && (
          <div className={classes.buttonContainer}>
            <button type="button" className={classes.showMoreBtn} onClick={() => fetchData(false)}>
              <FormattedMessage id="load_more" />
            </button>
          </div>
        )}
      </div>
    </div>
  );
};

MyAuctions.propTypes = {
  myAuctionsData: PropTypes.array,
};

const mapStateToProps = createStructuredSelector({
  myAuctionsData: selectMyAuctions,
});

export default connect(mapStateToProps)(MyAuctions);
