import { useDispatch, connect } from 'react-redux';
import { createStructuredSelector } from 'reselect';
import { useNavigate, useParams } from 'react-router-dom';
import { useIntl, FormattedMessage } from 'react-intl';
import PropTypes from 'prop-types';
import FmdGoodIcon from '@mui/icons-material/FmdGood';
import AssignmentIndIcon from '@mui/icons-material/AssignmentInd';
import LocalOfferIcon from '@mui/icons-material/LocalOffer';
import { useEffect, useState } from 'react';

import { showPopup } from '@containers/App/actions';
import { decryptDataAES, numberWithPeriods } from '@utils/allUtils';
import { selectUserData } from '@containers/Client/selectors';
import { selectProductDetail } from './selectors';
import { getProductData } from './actions';

import classes from './style.module.scss';

const ProductDetail = ({ productDetail, userData }) => {
  const intl = useIntl();
  const navigate = useNavigate();
  const dispatch = useDispatch();
  const { id } = useParams();

  const [detailData, setDetailData] = useState(null);
  const [isCustomer, setIsCustomer] = useState(false);

  const payBtn = () => {
    navigate('./pay');
  };

  useEffect(() => {
    let resData = productDetail;

    if (!resData) return;

    resData = {
      ...resData,
    };

    setDetailData(resData);
  }, [productDetail]);
  useEffect(() => {
    if (id) {
      dispatch(
        getProductData({ id }, () => {
          dispatch(
            showPopup(
              intl.formatMessage({ id: 'product_detail_title' }),
              intl.formatMessage({ id: 'product_detail_not_found' })
            )
          );
          navigate('/');
        })
      );
    } else {
      navigate('/');
    }
  }, [id]);
  useEffect(() => {
    try {
      const user = JSON.parse(decryptDataAES(userData));
      if (user) {
        setIsCustomer(user?.role === 'customer');
      }
    } catch (error) {
      console.warn('Error decoding user data.');
    }
  }, [userData]);

  return (
    <div className={classes.mainContainer} data-testid="product-detail-page">
      <div className={classes.topContentContainer}>
        <div className={classes.leftContent}>
          <img className={classes.image} src={detailData?.imageUrl} alt="Img failed!" />
          <div className={classes.contentDetails}>
            <div className={classes.detailIconContainer}>
              {/* <FmdGoodIcon className={classes.icon} /> */}
              <p className={classes.text}>{detailData?.location}</p>
            </div>
            <div className={classes.detailIconContainer}>
              <AssignmentIndIcon className={classes.icon} />
              <p className={classes.text}>{detailData?.organization}</p>
            </div>
          </div>
        </div>
        <div className={classes.rightContent}>
          <h2 className={classes.title}>{detailData?.title}</h2>
          <div className={classes.priceContainer}>
            <LocalOfferIcon className={classes.icon} />
            <p className={classes.price}>Rp. {numberWithPeriods(detailData?.price)}</p>
          </div>
          {isCustomer && (
            <button type="button" className={classes.buyButton} onClick={payBtn}>
              <FormattedMessage id="product_detail_buy_btn" />
            </button>
          )}
          <h3 className={classes.descriptionTitle}>
            <FormattedMessage id="product_detail_desc" />
          </h3>
          <p className={classes.description}>{detailData?.description}</p>
        </div>
      </div>
    </div>
  );
};

ProductDetail.propTypes = {
  productDetail: PropTypes.object,
  userData: PropTypes.string,
};

const mapStateToProps = createStructuredSelector({
  productDetail: selectProductDetail,
  userData: selectUserData,
});

export default connect(mapStateToProps)(ProductDetail);
