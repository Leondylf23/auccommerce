import { useNavigate } from 'react-router-dom';
import PropTypes from 'prop-types';

import { formatDateOnly, numberWithPeriods } from '@utils/allUtils';
import StatusCard from '@components/StatusCard/Card';

import classes from '../style.module.scss';

const BidCard = ({ data, isShowStatus }) => {
  const navigate = useNavigate();

  const detailBtn = () => {
    navigate(`./${data?.id}`);
  };

  return (
    <div className={classes.bidCardContainer}>
      <div className={classes.startCardContainer} onClick={detailBtn}>
        <img className={classes.img} src={data?.itemImage} alt={data?.itemImage} />
      </div>
      <div className={classes.midCardContainer} onClick={detailBtn}>
        <p className={classes.name}>{data?.itemName}</p>
        <p className={classes.price}>Rp. {numberWithPeriods(data?.price)}</p>
        <p className={classes.date}>Bid Date: {formatDateOnly('2024-02-12')}</p>
      </div>
      <div className={classes.endCardContainer}>
        {isShowStatus && <StatusCard status={data?.status} />}
        {data?.status === 'WAITING' && (
          <button className={classes.button} type="button" onClick={() => navigate(`./${data?.id}/payment`)}>
            Pay
          </button>
        )}
      </div>
    </div>
  );
};

BidCard.propTypes = {
  data: PropTypes.object,
  isShowStatus: PropTypes.bool,
};

export default BidCard;
