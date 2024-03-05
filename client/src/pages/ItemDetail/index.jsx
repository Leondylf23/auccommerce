import { useParams, useNavigate, useSearchParams } from 'react-router-dom';
import { connect, useDispatch } from 'react-redux';
import { createStructuredSelector } from 'reselect';
import PropTypes from 'prop-types';
import TimerIcon from '@mui/icons-material/Timer';
import { useEffect, useState } from 'react';
import { FormattedMessage, useIntl } from 'react-intl';

import { formatDateTimeSlashes, numberWithPeriods, timerDisplay } from '@utils/allUtils';
import { selectLogin, selectToken } from '@containers/Client/selectors';
import { selectSocket } from '@containers/App/selectors';
import { setLoading, showPopup } from '@containers/App/actions';
import ImageCarousel from './components/ImageCarousel';
import LivePeoplesDisplay from './components/LivePeoplesDisplay';
import { selectItemDetail } from './selectors';
import LiveBidPage from './components/LiveBidPage';
import { getItemDetail } from './actions';

import classes from './style.module.scss';

const ItemDetail = ({ isLogin, token, itemDetailData, socket }) => {
  const dispatch = useDispatch();
  const navigate = useNavigate();
  const intl = useIntl();
  const { id } = useParams();

  const [query] = useSearchParams();

  const [isLive, setIsLive] = useState(false);
  const [userIsJoin, setUserIsJoin] = useState(false);
  const [timer, setTimer] = useState(0);

  const userJoinLive = () => {
    if (isLogin) {
      socket.emit('auction/JOIN_LIVE', { id, token });
    } else {
      navigate(`/login`);
    }
  };

  const backBtnOnClick = () => {
    if (userIsJoin) {
      dispatch(getItemDetail({ id }));
      setUserIsJoin(false);
    } else {
      navigate(query.get('backurl') || '/');
    }
  };

  const joinedLive = () => {
    setUserIsJoin(true);
  };

  const errSocketMsg = (err) => {
    dispatch(setLoading(false));
    dispatch(showPopup());
  };

  const kickedUser = () => {
    setUserIsJoin(false);
  };

  const showBannedPopup = ({ dateTimeBan }) => {
    dispatch(
      showPopup(
        intl.formatMessage({ id: 'app_banned_title' }),
        `${intl.formatMessage({ id: 'app_banned_msg' })} ${formatDateTimeSlashes(dateTimeBan)}. ${intl.formatMessage({
          id: 'app_banned_msg2',
        })}`
      )
    );
  };

  useEffect(() => {
    dispatch(getItemDetail({ id }));

    const intervalId = setInterval(() => {
      setTimer((prevVal) => {
        if (prevVal < 1) {
          dispatch(getItemDetail({ id }));
          clearInterval(intervalId);
        }
        return prevVal > 0 ? prevVal - 1 : 0;
      });
    }, 1000);

    return () => {
      if (intervalId) clearInterval(intervalId);
    };
  }, []);

  useEffect(() => {
    setTimer((itemDetailData?.isLiveNow ? itemDetailData?.timeRemaining : itemDetailData?.startingTimer) || 0);
    setIsLive(itemDetailData?.isLiveNow);
  }, [itemDetailData]);

  useEffect(() => {
    if (socket) {
      socket.on('auction/JOINED_LIVE', joinedLive);
      socket.on('auction/ERROR', errSocketMsg);
      socket.on('auction/KICK_USER', kickedUser);
      socket.on('auction/BANNED', showBannedPopup);

      return () => {
        socket.off('auction/JOINED_LIVE', joinedLive);
        socket.off('auction/ERROR', errSocketMsg);
        socket.off('auction/KICK_USER', kickedUser);
        socket.off('auction/BANNED', showBannedPopup);
      };
    }
  }, [socket]);

  return (
    <div className={classes.mainContainer} data-testid="item-detail-page">
      <div className={classes.contentContainer}>
        <div className={classes.leftSide}>
          <div className={classes.backBtnContainer}>
            <button type="button" className={classes.backBtn} onClick={backBtnOnClick}>
              <FormattedMessage id="back" />
            </button>
          </div>
          {itemDetailData?.itemImages && <ImageCarousel imageDatas={itemDetailData?.itemImages} />}
        </div>
        <div className={classes.rightSide}>
          {userIsJoin ? (
            <LiveBidPage id={id} socket={socket} timer={timer} token={token} />
          ) : (
            <>
              <h1 className={classes.itemName}>{itemDetailData?.itemName}</h1>
              <div className={classes.timerContainer}>
                <div className={classes.leftContainer}>
                  <TimerIcon className={classes.icon} />
                  <p className={classes.timer}>{timerDisplay(timer)}</p>
                </div>
                <div className={classes.rightContainer}>
                  {isLive ? (
                    <LivePeoplesDisplay peoples={itemDetailData?.livePeoples} isShowTitle />
                  ) : (
                    <p className={classes.text}>
                      <FormattedMessage id="item_detail_status_waiting" />
                    </p>
                  )}
                </div>
              </div>
              <div className={classes.bidPriceContainer}>
                <div className={classes.priceContainer}>
                  <h3 className={classes.title}>
                    <FormattedMessage id="item_detail_start_prc" />
                  </h3>
                  <p className={classes.price}>Rp. {numberWithPeriods(itemDetailData?.startingPrice)}</p>
                </div>
                {isLive && (
                  <div className={classes.priceContainer}>
                    <h3 className={classes.title}>
                      <FormattedMessage id="item_detail_highest_prc" />
                    </h3>
                    <p className={classes.price}>Rp. {numberWithPeriods(itemDetailData?.highestBid)}</p>
                  </div>
                )}
              </div>
              {isLive && (
                <button type="button" onClick={userJoinLive} className={classes.joinBtn}>
                  <p className={classes.textBtn}>
                    <FormattedMessage id="item_detail_join_btn" />
                  </p>
                </button>
              )}
              <p className={classes.itemDesc}>{itemDetailData?.itemDescription}</p>
            </>
          )}
        </div>
      </div>
    </div>
  );
};

ItemDetail.propTypes = {
  itemDetailData: PropTypes.object,
  token: PropTypes.string,
  isLogin: PropTypes.bool,
  socket: PropTypes.object,
};

const mapStateToProps = createStructuredSelector({
  itemDetailData: selectItemDetail,
  token: selectToken,
  isLogin: selectLogin,
  socket: selectSocket,
});

export default connect(mapStateToProps)(ItemDetail);
