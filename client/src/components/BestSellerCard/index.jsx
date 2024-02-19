import { numberWithPeriods } from '@utils/allUtils';
import { FormattedMessage } from 'react-intl';
import PropTypes from 'prop-types';
import { Link } from 'react-router-dom';
import clasess from './style.module.scss';

const BestSellerCard = ({ data }) => (
  <Link data-testid="bestSellerCard-container" to={`/product/${data?.productId}`} className={clasess.container}>
    <div className={clasess.image}>
      <img src={data?.product?.imageUrl} alt="" />
    </div>
    <div className={clasess.desc}>
      <h5>{data?.product?.title}</h5>
      <p className={clasess.price}>Rp. {numberWithPeriods(data?.product?.price)}</p>
      <p className={clasess.org}>{data?.product?.user?.organization}</p>
      <p className={clasess.sold}>
        <span>
          <FormattedMessage id="product_bought_by" />
        </span>{' '}
        {data?.productCount}{' '}
        <span>
          <FormattedMessage id="times" />
        </span>
      </p>
    </div>
  </Link>
);

BestSellerCard.propTypes = {
  data: PropTypes.object,
};

export default BestSellerCard;
