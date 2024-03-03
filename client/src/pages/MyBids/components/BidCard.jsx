import { useState } from 'react';
import { useNavigate } from 'react-router-dom';
import PropTypes from 'prop-types';
import { FormattedMessage } from 'react-intl';
import { useDispatch } from 'react-redux';
import { useIntl } from 'react-intl';

import { formatDateTimeSlashes, numberWithPeriods } from '@utils/allUtils';
import PopupConfirmation from '@components/PopupConfirmation/Dialog';
import StatusCard from '@components/StatusCard/Card';
import { sendCompleteOrder } from '../actions';

import classes from '../style.module.scss';

const BidCard = ({ data, isShowStatus, tabIndex }) => {
  const navigate = useNavigate();
  const dispatch = useDispatch();
  const intl = useIntl();

  const [status, setStatus] = useState(data?.status);
  const [isOpenConfirmation, setIsOpenConfirmation] = useState(false);

  const detailBtn = () => {
    navigate(`./${data?.id}`, { state: { tabIndex } });
  };

  const actionBtn = (isConfirmed) => {
    if (isConfirmed) {
      dispatch(
        sendCompleteOrder({ id: data?.id }, (err) => {
          if (!err) {
            setStatus('COMPLETED');
            setIsOpenConfirmation(false);
          }
        })
      );
    } else {
      setIsOpenConfirmation(false);
    }
  };

  return (
    <div className={classes.bidCardContainer}>
      <PopupConfirmation
        isOpen={isOpenConfirmation}
        message={intl.formatMessage({ id: 'my_bids_confirmation_msg' })}
        onConfirmation={actionBtn}
      />
      <div className={classes.startCardContainer} onClick={detailBtn}>
        <img className={classes.img} src={data?.itemImage} alt={data?.itemImage} />
      </div>
      <div className={classes.midCardContainer} onClick={detailBtn}>
        <p className={classes.name}>{data?.itemName}</p>
        <p className={classes.price}>Rp. {numberWithPeriods(data?.price)}</p>
        <p className={classes.date}>
          <FormattedMessage id="my_bids_card_bid_date" /> {formatDateTimeSlashes(data?.createdAt)}
        </p>
      </div>
      <div className={classes.endCardContainer}>
        {isShowStatus && <StatusCard status={status} />}
        {status === 'WAITING' && isShowStatus && (
          <button className={classes.button} type="button" onClick={() => navigate(`./${data?.id}/payment`)}>
            <FormattedMessage id="my_bids_pay_btn" />
          </button>
        )}
        {status === 'SHIPPING' && isShowStatus && (
          <button className={classes.button} type="button" onClick={() => setIsOpenConfirmation(true)}>
            <FormattedMessage id="my_bids_card_complete_btn" />
          </button>
        )}
      </div>
    </div>
  );
};

BidCard.propTypes = {
  data: PropTypes.object,
  isShowStatus: PropTypes.bool,
  tabIndex: PropTypes.number,
};

export default BidCard;
