import { useDispatch, connect } from 'react-redux';
import { createStructuredSelector } from 'reselect';
import { FormattedMessage } from 'react-intl';
import PropTypes from 'prop-types';
import { useEffect, useState } from 'react';
import PopupWindow from '@components/PopupWindow/Dialog';

import CouponsCard from './components/CouponsCard';
import { selectCouponsPageData } from './selectors';
import CreateNewCoupon from './components/CreateNewCoupons';
import { deleteCoupon, getCouponsData } from './actions';

import classes from './style.module.scss';

const Coupons = ({ couponDatas }) => {
  const dispatch = useDispatch();

  const [isOpenCreateCoupon, setIsOpenCreateCoupon] = useState(false);

  const onCloseCreateCoupon = (isRefresh) => {
    if (isRefresh) {
      dispatch(getCouponsData());
    }
    setIsOpenCreateCoupon(false);
  };

  const onDeleteCoupon = (id) => {
    dispatch(
      deleteCoupon({ id }, () => {
        dispatch(getCouponsData());
      })
    );
  };

  useEffect(() => {
    dispatch(getCouponsData());
  }, []);

  return (
    <div className={classes.mainContainer}>
      <h1 className={classes.title}>
        <FormattedMessage id="coupons_title" />
      </h1>
      <div className={classes.topButtonContainer}>
        <button type="button" className={classes.button} onClick={() => setIsOpenCreateCoupon(true)}>
          <FormattedMessage id="coupons_create_new" />
        </button>
      </div>
      {couponDatas?.length > 0 ? (
        <div className={classes.dataContainer}>
          {couponDatas?.map((coupon) => (
            <CouponsCard key={coupon?.id} data={coupon} onDelete={onDeleteCoupon} />
          ))}
        </div>
      ) : (
        <div className={classes.emptyContainer}>
          <FormattedMessage id="empty_data" />
        </div>
      )}
      <PopupWindow open={isOpenCreateCoupon} onClose={() => onCloseCreateCoupon(false)}>
        <CreateNewCoupon onClose={onCloseCreateCoupon} />
      </PopupWindow>
    </div>
  );
};

Coupons.propTypes = {
  couponDatas: PropTypes.object,
};

const mapStateToProps = createStructuredSelector({
  couponDatas: selectCouponsPageData,
});

export default connect(mapStateToProps)(Coupons);
