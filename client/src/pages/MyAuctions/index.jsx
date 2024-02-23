import { connect, useDispatch } from 'react-redux';
import { createStructuredSelector } from 'reselect';
import { useNavigate } from 'react-router-dom';
import PropTypes from 'prop-types';
import { FormattedMessage } from 'react-intl';

import classes from './style.moudule.scss';
import AuctionDataCard from './components/AuctionDataCard';

const MyAuctions = ({ myAuctionsData }) => {
  const navigate = useNavigate();
  const dispatch = useDispatch();

  return (
    <div className={classes.mainContainer}>
      <h1 className={classes.pageTitle}>My Auctions</h1>
      <div className={classes.auctionContainer}>
        {myAuctionsData?.length > 0 ? (
          <div className={classes.auctionListContainer}>
            {myAuctionsData?.map((auction) => (
              <AuctionDataCard key={auction?.id} data={auction?.id} />
            ))}
          </div>
        ) : (
          <div className={classes.emptyContainer}>
            <p className={classes.text}>
              <FormattedMessage id="empty_data" />
            </p>
          </div>
        )}
      </div>
    </div>
  );
};

MyAuctions.propTypes = {
  myAuctionsData: PropTypes.array,
};

const mapStateToProps = createStructuredSelector({});

export default connect(mapStateToProps)(MyAuctions);
