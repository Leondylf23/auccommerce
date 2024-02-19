import PropTypes from 'prop-types';
import { useNavigate } from 'react-router-dom';
import FmdGoodIcon from '@mui/icons-material/FmdGood';
import AssignmentIndIcon from '@mui/icons-material/AssignmentInd';
import LocalOfferIcon from '@mui/icons-material/LocalOffer';

import { numberWithPeriods } from '@utils/allUtils';

import classes from './style.module.scss';

const ProductCard = ({ data, isBusiness }) => {
  const navigate = useNavigate();

  return (
    <div
      className={classes.cardContainer}
      onClick={() => (isBusiness ? navigate(`/product-creation/${data?.id}`) : navigate(`/product/${data?.id}`))}
    >
      <img className={classes.cardImage} src={data?.imageUrl} alt="Img Failed!" />
      <div className={classes.cardContent}>
        <p className={classes.title}>{data?.title}</p>
        <div className={classes.infoContainer}>
          <div className={classes.infoIconContainer}>
            <FmdGoodIcon className={classes.icon} />
            <p className={classes.text}>{data?.location}</p>
          </div>
          <div className={classes.infoIconContainer}>
            <AssignmentIndIcon className={classes.icon} />
            <p className={classes.text}>{data?.organization}</p>
          </div>

          <div className={classes.priceContainer}>
            <LocalOfferIcon className={classes.icon} />
            <p className={classes.text}>Rp. {numberWithPeriods(data?.price)}</p>
          </div>
        </div>
      </div>
    </div>
  );
};

ProductCard.propTypes = {
  data: PropTypes.object.isRequired,
  isBusiness: PropTypes.bool,
};

export default ProductCard;
