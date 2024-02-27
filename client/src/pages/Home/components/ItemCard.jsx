import PropTypes from 'prop-types';
import GavelIcon from '@mui/icons-material/Gavel';
import { useNavigate } from 'react-router-dom';
import { FormattedMessage } from 'react-intl';

import { formatDateOnly, formatTimeOnly, numberWithPeriods } from '@utils/allUtils';

import classes from '../style.module.scss';

const ItemCard = ({ data, isFull }) => {
  const navigate = useNavigate();

  return (
    <div
      className={classes.itemCardContainer}
      data-type={isFull && 'full'}
      onClick={() => navigate(`/item/${data?.id}`)}
    >
      <img className={classes.image} src={data?.itemImage} alt="Url Broken" />
      <p className={classes.itemName}>{data?.itemName}</p>
      <p className={classes.itemPrice}>Rp. {numberWithPeriods(data?.price)}</p>
      <div className={classes.midTextContainer}>
        {data?.isLiveNow ? (
          <>
            <GavelIcon className={classes.icon} />
            <p className={classes.endsOnText}>
              <FormattedMessage id="home_item_card_ends_on" />
            </p>
          </>
        ) : (
          <>
            <GavelIcon className={classes.icon} />
            <p className={classes.endsOnText}>
              <FormattedMessage id="home_item_card_starts" />
            </p>
          </>
        )}
      </div>
      <div className={classes.auctionTimeContainer}>
        <p className={classes.dateContainer}>{formatDateOnly(data?.isLiveNow ? data?.endsOn : data?.startDate)}</p>
        <p className={classes.timeContainer}>{formatTimeOnly(data?.isLiveNow ? data?.endsOn : data?.startDate)}</p>
      </div>
    </div>
  );
};

ItemCard.propTypes = {
  data: PropTypes.object.isRequired,
  isFull: PropTypes.bool,
};

export default ItemCard;
