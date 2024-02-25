import { useEffect, useState } from 'react';
import Avatar from '@mui/material/Avatar';
import { useDispatch } from 'react-redux';
import { useIntl, FormattedMessage } from 'react-intl';
import { useNavigate } from 'react-router-dom';

import { numberWithPeriods } from '@utils/allUtils';
import PopupWindow from '@components/PopupWindow/Dialog';
import { showPopup } from '@containers/App/actions';
import LivePeoplesDisplay from './LivePeoplesDisplay';
import LiveEndedPopUp from './LiveEndedPopup';

import classes from '../style.module.scss';

const LiveBidPage = () => {
  const intl = useIntl();
  const dispatch = useDispatch();
  const navigate = useNavigate();

  const exampleDataPeople = [
    {
      id: 'dwadw',
      image: 'https://d2kwwar9pcd0an.cloudfront.net/6b9a7820fd8161e906f76e45aa152f00.jpeg',
    },
    {
      id: 'dwadwa',
      image: 'https://d2kwwar9pcd0an.cloudfront.net/5c6e598bdd7799c2cdef4120c752dce3.jpeg',
    },
    {
      id: 'dwadw1',
      image: 'https://krustorage.blob.core.windows.net/kru-public-master-blob/post-0-attatchments-no%20effects.png',
    },
    {
      id: 'dwad',
      image: 'https://krustorage.blob.core.windows.net/kru-public-master-blob/post-0-attatchments-no%20effects.png',
    },
    {
      id: '123adw1',
      image:
        'https://krustorage.blob.core.windows.net/kru-public-master-blob/post-0-attatchments-alex_rainer-jVjlBQg-Gj8-unsplash.jpg',
    },
    {
      id: 'dasd22',
      image:
        'https://krustorage.blob.core.windows.net/kru-public-master-blob/post-0-attatchments-IMG_20230905_135946.jpg',
    },
  ];
  const exampleBidData = [
    {
      id: 'adwa',
      name: 'User Name',
      profilePicture:
        'https://krustorage.blob.core.windows.net/kru-public-master-blob/post-0-attatchments-IMG_20230905_135946.jpg',
      isMine: true,
      bidPrice: 1209381231,
    },
    {
      id: 'adwa',
      name: 'User Name',
      profilePicture:
        'https://krustorage.blob.core.windows.net/kru-public-master-blob/post-0-attatchments-IMG_20230905_135946.jpg',
      isMine: true,
      bidPrice: 120938,
    },
    {
      id: 'adwa',
      name: 'User Name',
      profilePicture:
        'https://krustorage.blob.core.windows.net/kru-public-master-blob/post-0-attatchments-IMG_20230905_135946.jpg',
      isMine: false,
      bidPrice: 120938,
    },
    {
      id: 'adwa',
      name: 'User Namedawd awd awdawdawd  awd awd a adwawawda wdaw dawawdaw',
      profilePicture:
        'https://krustorage.blob.core.windows.net/kru-public-master-blob/post-0-attatchments-IMG_20230905_135946.jpg',
      isMine: false,
      bidPrice: 120938,
    },
    {
      id: 'adwa',
      name: 'User Namedawd awd awdawdawd  awd awd a adwawawda wdaw dawawdaw',
      profilePicture:
        'https://krustorage.blob.core.windows.net/kru-public-master-blob/post-0-attatchments-IMG_20230905_135946.jpg',
      isMine: false,
      bidPrice: 120938,
    },
    {
      id: 'adwa',
      name: 'User Namedawd awd awdawdawd  awd awd a adwawawda wdaw dawawdaw',
      profilePicture:
        'https://krustorage.blob.core.windows.net/kru-public-master-blob/post-0-attatchments-IMG_20230905_135946.jpg',
      isMine: false,
      bidPrice: 120938,
    },
  ];

  const [higestBidPrice, setHigestBidPrice] = useState(0);
  const [livePeoples, setLivePeoples] = useState([]);
  const [isLive, setIsLive] = useState(false);
  const [bidData, setBidData] = useState([]);
  const [bidPriceInput, setBidPriceInput] = useState(1);
  const [isShowConfirm, setIsShowConfirm] = useState(false);
  const [bidWinner, setBidWinner] = useState(null);

  const onChangeBidPriceInput = (data) => {
    if (data < 1 || Number.isNaN(data)) return;
    if (data.toString()[0] === '0') return;

    setBidPriceInput(data);
  };

  const submitBid = (e) => {
    e.preventDefault();

    if (bidPriceInput < higestBidPrice) {
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

  const sendBidData = () => {
    setBidPriceInput(1);
    setIsShowConfirm(false);
  };

  useEffect(() => {
    setLivePeoples(exampleDataPeople);
    setIsLive(false);
    setBidWinner({
      profilePicture:
        'https://krustorage.blob.core.windows.net/kru-public-master-blob/post-0-attatchments-IMG_20230905_135946.jpg',
      name: 'User Test',
      price: 12312331,
      isMine: true,
    });
    setBidData(exampleBidData);
    setHigestBidPrice(123123);
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
      <div className={classes.auctionListDatasContainer}>
        {bidData?.map((bid, index) => (
          <div key={bid?.id} className={classes.bidData} data-ismine={bid?.isMine} data-isfirst={index === 0}>
            <Avatar className={classes.avatar} src={bid?.profilePicture} alt={bid?.profilePicture} />
            <p className={classes.userNameText}>{bid?.name}</p>
            <p className={classes.bidPrice}>
              <FormattedMessage id="item_detail_bid_has_placed_bid" />{' '}
              <p className={classes.price}>Rp. {numberWithPeriods(bid?.bidPrice)}</p>
            </p>
          </div>
        ))}
      </div>
      {isLive && !bidWinner ? (
        <form className={classes.placeBidContainer} onSubmit={submitBid}>
          <label htmlFor="bidPriceInput">
            <FormattedMessage id="item_detail_bid_your_bid_label" />
          </label>
          <div className={classes.inputContainer}>
            <input
              id="bidPriceInput"
              type="number"
              name="bidPrice"
              min={0}
              value={bidPriceInput}
              onChange={(e) => onChangeBidPriceInput(e.target.value)}
              className={classes.input}
            />
            <button className={classes.button} type="submit">
              <FormattedMessage id="item_detail_bid_place_btn" />
            </button>
          </div>
        </form>
      ) : (
        <div className={classes.auctionSummary}>
          <h4 className={classes.title}>
            <FormattedMessage id="item_detail_highest_bid" />
          </h4>
          <div className={classes.peopleContainer}>
            <Avatar src={bidWinner?.profilePicture} alt={bidWinner?.profilePicture} className={classes.avatar} />
            <div className={classes.textContainer}>
              <p className={classes.peopleName}>{bidWinner?.name}</p>
              <p className={classes.price}>Rp. {numberWithPeriods(bidWinner?.price)}</p>
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

LiveBidPage.proptTypes = {};

export default LiveBidPage;
