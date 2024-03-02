import { useParams, useNavigate, useLocation } from 'react-router-dom';
import { connect, useDispatch } from 'react-redux';
import { createStructuredSelector } from 'reselect';
import PropTypes from 'prop-types';
import { useEffect } from 'react';
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
  const location = useLocation();

  const backBtnOnClick = () => {
    navigate('/my-bids');
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
          <button
            type="button"
            className={classes.detailBtn}
            onClick={() => navigate(`/item/${bidDetailData?.itemId}?backurl=/my-bids/${id}`)}
          >
            <FormattedMessage id="detail" />
          </button>
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
            {bidDetailData?.isWinner ? (
              <>
                <p className={classes.title}>
                  <FormattedMessage id="my_bids_detail_winner_msg" />
                </p>
                <p className={classes.price}>Rp. {numberWithPeriods(bidDetailData?.highestBid)}</p>
                <div className={classes.paymentStatusContainer}>
                  {bidDetailData?.transactionData && bidDetailData?.status === 'WAIT_PAYMENT' ? (
                    <p className={classes.text}>
                      <FormattedMessage id="my_bids_detail_pay_until" />:
                      <p>{formatDateTimeSlashes(bidDetailData?.transactionData?.payUntil)}</p>
                    </p>
                  ) : (
                    <p className={classes.text}>
                      <FormattedMessage id="my_bids_detail_status" />:
                    </p>
                  )}
                  <StatusCard status={bidDetailData?.status} />
                  {(bidDetailData?.status === 'WAIT_PAYMENT' || bidDetailData?.status === 'WAITING') && (
                    <button
                      type="button"
                      className={classes.button}
                      onClick={() =>
                        bidDetailData?.transactionData?.transactionCode
                          ? (window.location.href = bidDetailData?.transactionData?.redirUrl)
                          : navigate(`./payment`)
                      }
                    >
                      <FormattedMessage id="pay" />
                    </button>
                  )}
                </div>
                {bidDetailData?.transactionData && (
                  <div className={classes.transactionDetailContainer}>
                    <h3 className={classes.transactionTitle}>
                      <FormattedMessage id="my_bids_detail_transaction_title" />
                    </h3>
                    <p className={classes.transactionCodeText}>{bidDetailData?.transactionData?.transactionCode}</p>
                    <div className={classes.detailData}>
                      <div className={classes.detailContainer}>
                        <p className={classes.label}>Total Payment:</p>
                        <p className={classes.data}>Alamat aja</p>
                      </div>
                      <div className={classes.detailContainer}>
                        <p className={classes.label}>Shipment Cost:</p>
                        <p className={classes.data}>Alamat aja</p>
                      </div>
                      <div className={classes.detailContainer}>
                        <p className={classes.label}>Admin Cost:</p>
                        <p className={classes.data}>Alamat aja</p>
                      </div>
                      <div className={classes.detailContainer}>
                        <p className={classes.label}>Payment Method:</p>
                        <p className={classes.data}>Alamat aja</p>
                      </div>
                    </div>
                  </div>
                )}
              </>
            ) : (
              <div className={classes.bidStatus}>
                <p className={classes.text}>
                  <FormattedMessage id="my_bids_detail_status" />:
                </p>
                <StatusCard status={bidDetailData?.status} />
              </div>
            )}
          </div>
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
