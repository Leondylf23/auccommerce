import { useEffect, useState } from 'react';
import { useNavigate } from 'react-router-dom';
import PropTypes from 'prop-types';
import { FormattedMessage, useIntl } from 'react-intl';
import { useDispatch } from 'react-redux';

import { formatDateTimeSlashes, numberWithPeriods } from '@utils/allUtils';
import StatusCard from '@components/StatusCard/Card';
import PopupConfirmation from '@components/PopupConfirmation/Dialog';
import { sendProcessStatus } from '../actions';

import classes from '../style.module.scss';

const TransactionCard = ({ data, setDetailId }) => {
  const navigate = useNavigate();
  const dispatch = useDispatch();
  const intl = useIntl();

  const [status, setStatus] = useState(data?.status);
  const [isOpenConfirmation, setIsOpenConfirmation] = useState(false);

  const confirmData = () => {
    dispatch(
      sendProcessStatus({ id: data?.id }, (err) => {
        if (!err) {
          setStatus('SHIPPING');
          setIsOpenConfirmation(false);
        }
      })
    );
  };

  const actionBtn = (isConfirmed) => {
    if (isConfirmed) {
      confirmData();
    } else {
      setIsOpenConfirmation(false);
    }
  };

  return (
    <div className={classes.transactionCardContainer}>
      <PopupConfirmation
        message={intl.formatMessage({ id: 'orders_detail_confirm' })}
        isOpen={isOpenConfirmation}
        onConfirmation={actionBtn}
      />
      <div className={classes.midCardContainer} onClick={setDetailId}>
        <p className={classes.name}>{data?.transactionCode}</p>
        <p className={classes.itemName}>{data?.itemName}</p>
        <p className={classes.price}>Rp. {numberWithPeriods(data?.price)}</p>
        <p className={classes.date}>{formatDateTimeSlashes(data?.createdAt)}</p>
      </div>
      <div className={classes.endCardContainer}>
        <StatusCard status={status} />
        <button
          className={classes.button}
          type="button"
          onClick={() => navigate(`/item/${data?.itemId}?backurl=/orders`)}
        >
          <FormattedMessage id="orders_card_detail_btn" />
        </button>
        {status === 'WAIT_CONFIRM' && (
          <button className={classes.button} type="button" onClick={() => setIsOpenConfirmation(true)}>
            <FormattedMessage id="confirm" />
          </button>
        )}
      </div>
    </div>
  );
};

TransactionCard.propTypes = {
  data: PropTypes.object,
  setDetailId: PropTypes.func,
  refresh: PropTypes.func,
};

export default TransactionCard;
