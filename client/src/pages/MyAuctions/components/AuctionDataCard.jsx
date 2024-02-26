import PropTypes from 'prop-types';
import { useNavigate } from 'react-router-dom';
import { FormattedMessage } from 'react-intl';

import { formatDateTimeSlashes, numberWithPeriods } from '@utils/allUtils';
import StatusCard from '@components/StatusCard/Card';

import classes from '../style.module.scss';

const AuctionDataCard = ({ data }) => {
  const navigate = useNavigate();

  return (
    <div className={classes.auctionCardContainer} onClick={() => navigate(`/edit-auction/${data?.id}`)}>
      <img className={classes.image} src={data?.itemImage} alt={data?.itemImage} />
      <p className={classes.itemName}>{data?.itemName}</p>
      <p className={classes.price}>Rp. {numberWithPeriods(data?.price)}</p>
      <p className={classes.endsOn}>
        {data?.status === 'LIVE' ? (
          <>
            <FormattedMessage id="home_item_card_ends_on" /> : {formatDateTimeSlashes(data?.endsOn)}
          </>
        ) : (
          <>
            <FormattedMessage id="home_item_card_starts" /> : {formatDateTimeSlashes(data?.startDate)}
          </>
        )}
      </p>
      <p className={classes.endsOnData}>{data?.itemBidDeadline}</p>
      <StatusCard status={data?.status} />
      <p className={classes.itemCreatedDate}>{formatDateTimeSlashes(data?.createdAt)}</p>
    </div>
  );
};

AuctionDataCard.propTypes = {
  data: PropTypes.object.isRequired,
};

export default AuctionDataCard;
