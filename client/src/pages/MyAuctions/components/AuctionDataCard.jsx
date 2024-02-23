import PropTypes from 'prop-types';
import { useNavigate } from 'react-router-dom';

import { numberWithPeriods } from '@utils/allUtils';
import StatusCard from '@components/StatusCard/Card';

import classes from '../style.module.scss';

const AuctionDataCard = ({ data }) => {
  const navigate = useNavigate();

  return (
    <div className={classes.auctionCardContainer} onClick={() => navigate(`/edit-auction/${data?.id}`)}>
      <img className={classes.image} src={data?.itemImage} alt={data?.itemImage} />
      <p className={classes.itemName}>{data?.itemName}</p>
      <p className={classes.price}>Rp. {numberWithPeriods(12313)}</p>
      <p className={classes.endsOn}>Ends On: </p>
      <p className={classes.endsOnData}>{data?.itemBidDeadline}</p>
      <p className={classes.statusText}>Status</p>
      <StatusCard status="WAITING" />
      <p className={classes.itemCreatedDate}>{data?.createdDate}</p>
    </div>
  );
};

AuctionDataCard.propTypes = {
  data: PropTypes.object.isRequired,
};

export default AuctionDataCard;
