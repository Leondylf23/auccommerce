import PropTypes from 'prop-types';
import GavelIcon from '@mui/icons-material/Gavel';
import { useNavigate } from 'react-router-dom';

import { formatDateOnly, formatTimeOnly, numberWithPeriods } from '@utils/allUtils';

import classes from '../style.module.scss';

const ItemCard = ({ data }) => {
  const navigate = useNavigate();

  return (
    <div className={classes.itemCardContainer} onClick={() => navigate(`/item/${data?.id}`)}>
      <img className={classes.image} src={data?.itemPicture} alt="Url Broken" />
      <p className={classes.itemName}>{data?.itemName}</p>
      <p className={classes.itemPrice}>Rp. {numberWithPeriods(data?.startingBid)}</p>
      <div className={classes.midTextContainer}>
        <GavelIcon className={classes.icon} />
        <p className={classes.endsOnText}>Ends on</p>
      </div>
      <div className={classes.auctionTimeContainer}>
        <p className={classes.dateContainer}>{formatDateOnly(data?.endBid)}</p>
        <p className={classes.timeContainer}>{formatTimeOnly(data?.endBid)}</p>
      </div>
    </div>
  );
};

ItemCard.propTypes = {
  data: PropTypes.object.isRequired,
};

export default ItemCard;
