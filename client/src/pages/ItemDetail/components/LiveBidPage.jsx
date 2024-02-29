import { useEffect, useState } from 'react';
import Avatar from '@mui/material/Avatar';
import { useDispatch } from 'react-redux';
import { useIntl, FormattedMessage } from 'react-intl';
import { useNavigate } from 'react-router-dom';
import PropTypes from 'prop-types';
import TimerIcon from '@mui/icons-material/Timer';

import { numberWithPeriods, timerDisplay } from '@utils/allUtils';
import PopupWindow from '@components/PopupWindow/Dialog';
import { setLoading, showPopup } from '@containers/App/actions';
import LivePeoplesDisplay from './LivePeoplesDisplay';
import LiveEndedPopUp from './LiveEndedPopup';

import classes from '../style.module.scss';

const LiveBidPage = ({ socket, id, timer, token }) => {
  const intl = useIntl();
  const dispatch = useDispatch();
  const navigate = useNavigate();

  const [higestBidPrice, setHigestBidPrice] = useState(0);
  const [livePeoples, setLivePeoples] = useState([]);
  const [isLive, setIsLive] = useState(false);
  const [bidData, setBidData] = useState([]);
  const [bidPriceInput, setBidPriceInput] = useState(0);
  const [isShowConfirm, setIsShowConfirm] = useState(false);
  const [bidWinner, setBidWinner] = useState(null);
  const [userId, setUserId] = useState(null);
  const [isAbleBid, setIsAbleBid] = useState(false);

  const onChangeBidPriceInput = (data) => {
    setBidPriceInput(data);
  };

  const submitBid = (e) => {
    e.preventDefault();

    if (bidPriceInput <= higestBidPrice) {
      dispatch(
        showPopup(
          intl.formatMessage({ id: 'item_detail_bid_place_validation_title' }),
          intl.formatMessage({ id: 'item_detail_bid_place_validation_msg' })
        )
      );
      return;
    }

    setIsShowConfirm(true);
  };

  const addBid = (price) => {
    setBidPriceInput(higestBidPrice + price);
  };

  const sendBidData = () => {
    if (bidPriceInput <= higestBidPrice) {
      dispatch(
        showPopup(
          intl.formatMessage({ id: 'item_detail_bid_place_validation_title' }),
          intl.formatMessage({ id: 'item_detail_bid_place_validation_msg' })
        )
      );
      return;
    }

    socket.emit('auction/PLACE_BID', { id, token, bid: bidPriceInput });
    dispatch(setLoading(true));
  };

  const setLiveData = (data) => {
    setLivePeoples(data?.users);
    setBidData(data?.bids);
    setHigestBidPrice(data?.highestBid);
    setUserId(data?.userId);
    setIsAbleBid(data?.isAbleBid);
    setIsLive(data?.isLive);
    setBidWinner(data?.topUser);
  };

  const updateLiveUsers = (data) => {
    setLivePeoples(data?.users);
  };

  const setLiveEnded = () => {
    setIsLive(false);
  };

  const bidPlaced = () => {
    setBidPriceInput(1);
    setIsShowConfirm(false);
    dispatch(setLoading(false));
  };

  const updateBidData = (data) => {
    setBidData(data?.bids);
    setHigestBidPrice(data?.highestBid);
    setBidWinner(data?.topUser);
  };

  const cooldownNotice = ({ cooldownSeconds }) => {
    dispatch(setLoading(false));
    dispatch(
      showPopup(
        intl.formatMessage({ id: 'item_detail_bid_place_cooldown_title' }),
        `${intl.formatMessage({ id: 'item_detail_bid_place_cooldown_msg' })} ${cooldownSeconds} ${intl.formatMessage({
          id: 'item_detail_bid_place_cooldown_msg_seconds',
        })}`
      )
    );
  };

  useEffect(() => {
    socket.on('auction/SET_LIVE_DATA', setLiveData);
    socket.on('auction/UPDATE_LIVE_USERS', updateLiveUsers);
    socket.on('auction/PLACE_BID_SUCCESS', bidPlaced);
    socket.on('auction/UPDATE_BID_DATA', updateBidData);
    socket.on('auction/COOLDOWN', cooldownNotice);
    socket.on('auction/LIVE_ENDED', setLiveEnded);

    return () => {
      socket.off('auction/SET_LIVE_DATA', setLiveData);
      socket.off('auction/UPDATE_LIVE_USERS', updateLiveUsers);
      socket.off('auction/PLACE_BID_SUCCESS', bidPlaced);
      socket.off('auction/UPDATE_BID_DATA', updateBidData);
      socket.off('auction/COOLDOWN', cooldownNotice);
      socket.off('auction/LIVE_ENDED', setLiveEnded);
    };
  }, [socket]);

  useEffect(() => {
    socket.emit('auction/GET_LIVE_DATA', { id, token });

    return () => {
      socket.emit('auction/LEAVE_LIVE', { id, token });
    };
  }, []);

  return (
    <div className={classes.liveBidContainer}>
      {!isLive && <LiveEndedPopUp />}
      <PopupWindow open={isShowConfirm} onClose={() => setIsShowConfirm(false)}>
        <div className={classes.confirmationDialog}>
          <p className={classes.message}>
            <FormattedMessage id="item_detail_bid_confirmation" />
            <p className={classes.price}>Rp. {numberWithPeriods(bidPriceInput)}</p>
          </p>
          <div className={classes.buttons}>
            <button type="button" className={classes.button} onClick={sendBidData}>
              <FormattedMessage id="yes" />
            </button>
            <button type="button" className={classes.button} onClick={() => setIsShowConfirm(false)} data-type="red">
              <FormattedMessage id="no" />
            </button>
          </div>
        </div>
      </PopupWindow>
      <div className={classes.header}>
        <div className={classes.liveIndicator}>
          <div className={classes.indicator} data-active={isLive} />
          <h3 className={classes.pageTitle}>
            <FormattedMessage id="item_detail_live_auction" />
          </h3>
        </div>
        <LivePeoplesDisplay peoples={livePeoples} />
      </div>
      <div className={classes.midContainer}>
        <div className={classes.leftContainer}>
          <TimerIcon className={classes.icon} />
          <p className={classes.timer}>{timerDisplay(timer)}</p>
        </div>
        <div className={classes.rightContainer}>
          <p className={classes.label}>
            <FormattedMessage id="item_detail_highest_prc" />
          </p>
          <p className={classes.price}>Rp. {numberWithPeriods(higestBidPrice)}</p>
        </div>
      </div>
      <div className={classes.auctionListDatasContainer}>
        {bidData?.map((bid, index) => (
          <div key={bid?.bidId} className={classes.bidData} data-ismine={bid?.id === userId} data-isfirst={index === 0}>
            <Avatar className={classes.avatar} src={bid?.image} alt={bid?.profilePicture} />
            <p className={classes.userNameText}>{bid?.fullname}</p>
            <p className={classes.bidPrice}>
              <FormattedMessage id="item_detail_bid_has_placed_bid" />{' '}
              <p className={classes.price}>Rp. {numberWithPeriods(bid?.bid)}</p>
            </p>
          </div>
        ))}
      </div>
      {/* eslint-disable-next-line no-nested-ternary */}
      {isLive ? (
        isAbleBid ? (
          <form className={classes.placeBidContainer} onSubmit={submitBid}>
            <label htmlFor="bidPriceInput" className={classes.label}>
              <FormattedMessage id="item_detail_bid_your_bid_label" />
            </label>
            <div className={classes.inputContainer}>
              <input
                id="bidPriceInput"
                type="number"
                name="bidPrice"
                min={0}
                max={1000000000000}
                value={bidPriceInput}
                onChange={(e) => onChangeBidPriceInput(e.target.value)}
                className={classes.input}
                disabled={!isAbleBid}
              />
              <button className={classes.button} type="submit" disabled={!isAbleBid}>
                <FormattedMessage id="item_detail_bid_place_btn" />
              </button>
            </div>
            <div className={classes.addButtons}>
              <p className={classes.label}>
                <FormattedMessage id="item_detail_bid_live_add_template" />
              </p>
              <div className={classes.buttons}>
                <button type="button" className={classes.button} onClick={() => addBid(100000)} disabled={!isAbleBid}>
                  Rp. 100.000
                </button>
                <button type="button" className={classes.button} onClick={() => addBid(500000)} disabled={!isAbleBid}>
                  Rp. 500.000
                </button>
                <button type="button" className={classes.button} onClick={() => addBid(1000000)} disabled={!isAbleBid}>
                  Rp. 1.000.000
                </button>
                <button type="button" className={classes.button} onClick={() => addBid(5000000)} disabled={!isAbleBid}>
                  Rp. 5.000.000
                </button>
              </div>
            </div>
          </form>
        ) : (
          <div className={classes.auctionSummary}>
            <h4 className={classes.title}>
              <FormattedMessage id="item_detail_bid_live_spectator" />
            </h4>
          </div>
        )
      ) : (
        <div className={classes.auctionSummary}>
          <h4 className={classes.title}>
            <FormattedMessage id="item_detail_highest_bid" />
          </h4>
          <div className={classes.peopleContainer}>
            <Avatar src={bidWinner?.image} alt={bidWinner?.image} className={classes.avatar} />
            <div className={classes.textContainer}>
              <p className={classes.peopleName}>{bidWinner?.fullname}</p>
              <p className={classes.price}>Rp. {numberWithPeriods(bidWinner?.bid)}</p>
              {bidWinner?.id === userId && (
                <div className={classes.buttonContainer}>
                  <button type="button" className={classes.myBidButton} onClick={() => navigate('/my-bids')}>
                    <FormattedMessage id="item_detail_bid_live_my_bid" />
                  </button>
                </div>
              )}
            </div>
          </div>
          {bidWinner?.isMine && (
            <button
              className={classes.button}
              type="button"
              onClick={() => navigate(`/my-bids/${bidWinner?.myBidId || 1}/payment`)}
            >
              <FormattedMessage id="item_detail_bid_go_to_payment_btn" />
            </button>
          )}
        </div>
      )}
    </div>
  );
};

LiveBidPage.propTypes = {
  socket: PropTypes.object,
  id: PropTypes.number,
  timer: PropTypes.number,
  token: PropTypes.string,
};

export default LiveBidPage;
