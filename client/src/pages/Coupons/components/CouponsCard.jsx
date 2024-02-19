import PropTypes from 'prop-types';
import DiscountIcon from '@mui/icons-material/Discount';
import { numberWithPeriods } from '@utils/allUtils';

import classes from '../style.module.scss';

const CouponsCard = ({ data, onDelete }) => (
  <div className={classes.couponsCardContainer}>
    <div className={classes.topContainer}>
      <p className={classes.name}>{data?.name}</p>
      <button type="button" className={classes.delBtn} data-type="red" onClick={() => onDelete(data?.id)}>
        <p>X</p>
      </button>
    </div>
    <div className={classes.contentContainer}>
      <DiscountIcon />
      <p className={classes.number}>Rp. {numberWithPeriods(data?.priceCut)}</p>
    </div>
  </div>
);

CouponsCard.propTypes = {
  data: PropTypes.object,
  onDelete: PropTypes.func,
};

export default CouponsCard;
