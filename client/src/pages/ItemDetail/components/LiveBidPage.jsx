import PropTypes from 'prop-types';
import { useEffect, useState } from 'react';
import Avatar from '@mui/material/Avatar';
import { useDispatch } from 'react-redux';
import { useIntl } from 'react-intl';

import { numberWithPeriods } from '@utils/allUtils';
import { showPopup } from '@containers/App/actions';
import LivePeoplesDisplay from './LivePeoplesDisplay';

import classes from '../style.module.scss';
import PopupWindow from '@components/PopupWindow/Dialog';
import LiveEndedPopUp from './LiveEndedPopup';

const LiveBidPage = () => {
  const intl = useIntl();
  const dispatch = useDispatch();

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
      dispatch(showPopup('Price Too Low', 'Price must be higher than highest bid!'));
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
    setBidData(exampleBidData);
    setHigestBidPrice(123123);
  }, []);

  return (
    <div className={classes.liveBidContainer}>
      {!isLive && <LiveEndedPopUp />}
      <PopupWindow open={isShowConfirm} onClose={() => setIsShowConfirm(false)}>
        <div className={classes.confirmationDialog}>
          <p className={classes.message}>
            Are you sure want to place your bid?
            <p className={classes.price}>Rp. {numberWithPeriods(bidPriceInput)}</p>
          </p>
          <div className={classes.buttons}>
            <button type="button" className={classes.button} onClick={sendBidData}>
              Yes
            </button>
            <button type="button" className={classes.button} onClick={() => setIsShowConfirm(false)} data-type="red">
              No
            </button>
          </div>
        </div>
      </PopupWindow>
      <div className={classes.header}>
        <div className={classes.liveIndicator}>
          <div className={classes.indicator} data-active={isLive} />
          <h3 className={classes.pageTitle}>LIVE AUCTION</h3>
        </div>
        <LivePeoplesDisplay peoples={livePeoples} />
      </div>
      <div className={classes.auctionListDatasContainer}>
        {bidData?.map((bid, index) => (
          <div className={classes.bidData} data-ismine={bid?.isMine} data-isfirst={index === 0}>
            <Avatar className={classes.avatar} src={bid?.profilePicture} alt={bid?.profilePicture} />
            <p className={classes.userNameText}>{bid?.name}</p>
            <p className={classes.bidPrice}>
              Has place bid <p className={classes.price}>Rp. {numberWithPeriods(bid?.bidPrice)}</p>
            </p>
          </div>
        ))}
      </div>
      {isLive && !bidWinner ? (
        <form className={classes.placeBidContainer} onSubmit={submitBid}>
          <label htmlFor="bidPriceInput">Place Your Bid in Rp.</label>
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
              Place
            </button>
          </div>
        </form>
      ) : (
        <div className={classes.auctionSummary}>
          <h4 className={classes.title}>Highest bid in this auction is</h4>
          <div className={classes.peopleContainer}>
            <Avatar src={bidWinner?.profilePic} alt={bidWinner?.profilePic} />
          </div>
          <p className={classes.price}>Rp. {numberWithPeriods(123123)}</p>
        </div>
      )}
    </div>
  );
};

LiveBidPage.proptTypes = {};

export default LiveBidPage;
