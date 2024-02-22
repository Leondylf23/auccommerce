import { useParams, useNavigate } from 'react-router-dom';
import { connect, useDispatch } from 'react-redux';
import { createStructuredSelector } from 'reselect';
import PropTypes from 'prop-types';
import { useEffect, useState } from 'react';
import { FormattedMessage } from 'react-intl';

import { formatDateTimeSlashes, numberWithPeriods } from '@utils/allUtils';
import StatusCard from '@components/StatusCard/Card';
import ImageCarousel from './components/ImageCarousel';
import { selectBidDetail } from './selectors';
import { getBidDetail } from './actions';

import classes from './style.module.scss';

const MyBidDetail = ({ bidDetailData }) => {
  const dispatch = useDispatch();
  const navigate = useNavigate();
  const { id } = useParams();

  const backBtnOnClick = () => {
    navigate('/mybids');
  };

  useEffect(() => {
    dispatch(getBidDetail({ id }));
  }, []);
  useEffect(() => {}, [bidDetailData]);

  return (
    <div className={classes.mainContainer}>
      <div className={classes.contentContainer}>
        <div className={classes.leftSide}>
          <div className={classes.backBtnContainer}>
            <button type="button" className={classes.backBtn} onClick={backBtnOnClick}>
              <FormattedMessage id="back" />
            </button>
          </div>
          {bidDetailData?.itemImages && <ImageCarousel imageDatas={bidDetailData?.itemImages} />}
        </div>
        <div className={classes.rightSide}>
          <h1 className={classes.itemName}>{bidDetailData?.itemName}</h1>
          <div className={classes.bidPriceContainer}>
            <div className={classes.priceContainer}>
              <h3 className={classes.title}>
                <FormattedMessage id="item_detail_start_prc" />
              </h3>
              <p className={classes.price}>Rp. {numberWithPeriods(bidDetailData?.startingPrice)}</p>
            </div>
            <div className={classes.priceContainer}>
              <h3 className={classes.title}>
                <FormattedMessage id="item_detail_highest_prc" />
              </h3>
              <p className={classes.price}>Rp. {numberWithPeriods(bidDetailData?.highestBid)}</p>
            </div>
          </div>
          <div className={classes.winnerContainer}>
            <p className={classes.title}>You are the the auction bid winner.</p>
            <p className={classes.price}>Rp. {numberWithPeriods(bidDetailData?.winnerBid?.paymentPrice)}</p>
            <div className={classes.paymentStatusContainer}>
              <p className={classes.text}>
                Pay until:
                <p>{formatDateTimeSlashes(bidDetailData?.winnerBid?.payUntil)}</p>
              </p>
              <StatusCard status={bidDetailData?.winnerBid?.status} />
              <button type="button" className={classes.button} onClick={() => navigate(`./payment`)}>
                Pay
              </button>
            </div>
          </div>
          <p className={classes.itemDesc}>{bidDetailData?.itemDescription}</p>
        </div>
      </div>
    </div>
  );
};

MyBidDetail.propTypes = {
  bidDetailData: PropTypes.object,
};

const mapStateToProps = createStructuredSelector({
  bidDetailData: selectBidDetail,
});

export default connect(mapStateToProps)(MyBidDetail);