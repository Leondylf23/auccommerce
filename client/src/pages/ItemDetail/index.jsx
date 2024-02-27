import { useParams, useNavigate } from 'react-router-dom';
import { connect, useDispatch } from 'react-redux';
import { createStructuredSelector } from 'reselect';
import PropTypes from 'prop-types';
import TimerIcon from '@mui/icons-material/Timer';
import { useEffect, useState } from 'react';
import { FormattedMessage } from 'react-intl';

import { getUserDataDecrypt, numberWithPeriods, timerDisplay } from '@utils/allUtils';
import { selectLogin, selectToken, selectUserData } from '@containers/Client/selectors';
import { selectSocket } from '@containers/App/selectors';
import ImageCarousel from './components/ImageCarousel';
import LivePeoplesDisplay from './components/LivePeoplesDisplay';
import { selectItemDetail } from './selectors';
import LiveBidPage from './components/LiveBidPage';
import { getItemDetail } from './actions';

import classes from './style.module.scss';

const ItemDetail = ({ isLogin, token, userData, itemDetailData, socket }) => {
  const dispatch = useDispatch();
  const navigate = useNavigate();
  const { id } = useParams();

  const [isLive, setIsLive] = useState(false);
  const [userIsJoin, setUserIsJoin] = useState(false);
  const [timer, setTimer] = useState(0);
  const [isBuyer, setIsBuyer] = useState(false);

  const userJoinLive = () => {
    if (isLogin) {
      socket.emit('auction/JOIN_LIVE', { id, token });
    } else {
      navigate(`/login`);
    }
  };

  const backBtnOnClick = () => {
    if (userIsJoin) {
      setUserIsJoin(false);
    } else {
      navigate('/');
    }
  };

  const joinedLive = () => {
    setUserIsJoin();
  };

  useEffect(() => {
    dispatch(getItemDetail({ id }));

    if (userData) {
      const user = getUserDataDecrypt(userData);
      setIsBuyer(user?.role === 'buyer');
    }

    const intervalId = setInterval(() => {
      setTimer((prevVal) => {
        if (prevVal < 1) {
          dispatch(getItemDetail({ id }));
        }
        return prevVal >= 1 ? prevVal - 1 : 0;
      });
    }, 1000);

    return () => {
      if (intervalId) clearInterval(intervalId);
    };
  }, []);

  useEffect(() => {
    setTimer(itemDetailData?.isLiveNow ? itemDetailData?.timeRemaining : itemDetailData?.startingTimer || 0);
    setIsLive(itemDetailData?.isLiveNow);
  }, [itemDetailData]);

  useEffect(() => {
    if (socket) {
      socket.on('auction/JOINED_LIVE', joinedLive);

      return () => {
        socket.off('auction/JOINED_LIVE', joinedLive);
      };
    }
  }, [socket]);

  return (
    <div className={classes.mainContainer}>
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
            <LiveBidPage socket={socket} />
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
              {isLive && (isLogin ? isBuyer : true) && (
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
  userData: PropTypes.string,
  socket: PropTypes.object,
};

const mapStateToProps = createStructuredSelector({
  itemDetailData: selectItemDetail,
  token: selectToken,
  isLogin: selectLogin,
  userData: selectUserData,
  socket: selectSocket,
});

export default connect(mapStateToProps)(ItemDetail);
