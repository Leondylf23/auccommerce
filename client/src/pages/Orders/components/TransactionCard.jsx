import { useNavigate } from 'react-router-dom';
import PropTypes from 'prop-types';
import { FormattedMessage } from 'react-intl';

import { formatDateTimeSlashes, numberWithPeriods } from '@utils/allUtils';
import StatusCard from '@components/StatusCard/Card';

import classes from '../style.module.scss';
import { useEffect } from 'react';

const TransactionCard = ({ data, setDetailId }) => {
  const navigate = useNavigate();

  const detailBtn = (id) => {
    setDetailId(id);
  };

  return (
    <div className={classes.transactionCardContainer}>
      <div className={classes.midCardContainer} onClick={detailBtn}>
        <p className={classes.name}>{data?.transactionCode}</p>
        <p className={classes.itemName}>{data?.itemName}</p>
        <p className={classes.price}>Rp. {numberWithPeriods(data?.price)}</p>
      </div>
      <div className={classes.endCardContainer}>
        <StatusCard status={data?.status} />
        {data?.status === 'WAIT_CONFIRM' && (
          <button className={classes.button} type="button" onClick={() => navigate(`./${data?.id}/payment`)}>
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
};

export default TransactionCard;
