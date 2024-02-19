import { useDispatch, connect } from 'react-redux';
import { createStructuredSelector } from 'reselect';
import { FormattedMessage } from 'react-intl';
import PropTypes from 'prop-types';
import FmdGoodIcon from '@mui/icons-material/FmdGood';
import AssignmentIndIcon from '@mui/icons-material/AssignmentInd';
import LocalOfferIcon from '@mui/icons-material/LocalOffer';
import { useEffect, useState } from 'react';

import { numberWithPeriods } from '@utils/allUtils';
import { selectOrderingDetailData } from '../selectors';

import classes from '../style.module.scss';
import { getOrderingDetailData, updateOrderingStatus } from '../actions';

const OrderingDetailComponent = ({ id, orderingData, back, isBusiness }) => {
  const dispatch = useDispatch();

  const [status, setStatus] = useState(null);
  const [isRequireRefresh, setIsRequireRefresh] = useState(false);

  const setStatusView = (statusData) => {
    switch (statusData) {
      case 'WAITING':
        setStatus({
          text: <FormattedMessage id="status_waiting" />,
          color: 'yellow',
          status: statusData,
        });
        break;
      case 'FAILED':
        setStatus({
          text: <FormattedMessage id="status_failed" />,
          color: 'red',
          status: statusData,
        });
        break;
      case 'SUCCESS':
        setStatus({
          text: <FormattedMessage id="status_success" />,
          color: 'green',
          status: statusData,
        });
        break;
    }
  };

  const updateStatusBtn = (isSuccess) => {
    dispatch(
      updateOrderingStatus({ id, isSuccess }, () => {
        setStatusView(isSuccess ? 'SUCCESS' : 'FAILED');
        setIsRequireRefresh(true);
      })
    );
  };

  useEffect(() => {
    if (orderingData?.status) {
      setStatusView(orderingData?.status);
    }
  }, [orderingData]);
  useEffect(() => {
    dispatch(getOrderingDetailData({ id }, isBusiness));
  }, [dispatch, id, isBusiness]);

  return (
    <div className={classes.detailContainer} data-testid="ordering-detail-page">
      <div className={classes.buttonContainer}>
        <button type="button" className={classes.backBtn} onClick={() => back(isRequireRefresh)}>
          <FormattedMessage id="back" />
        </button>
      </div>
      <h2>{orderingData?.orderingCode}</h2>
      <div className={classes.contentContainer}>
        <div className={classes.leftSide}>
          <img className={classes.image} src={orderingData?.imageUrl} alt="Img failed!" />
          <div className={classes.contentDetails}>
            <div className={classes.detailIconContainer}>
              <FmdGoodIcon className={classes.icon} />
              <p className={classes.text}>{orderingData?.location}</p>
            </div>
            <div className={classes.detailIconContainer}>
              <AssignmentIndIcon className={classes.icon} />
              <p className={classes.text}>{orderingData?.organization}</p>
            </div>
          </div>
        </div>
        <div className={classes.rightSide}>
          <h2 className={classes.title}>{orderingData?.title}</h2>
          <div className={classes.priceContainer}>
            <LocalOfferIcon className={classes.icon} />
            <p className={classes.price}>Rp. {numberWithPeriods(parseFloat(orderingData?.totalPayment))}</p>
          </div>
          <div className={classes.paymentMethodContainer}>
            {orderingData?.paymentMethod === 'TRANSFER' ? (
              <h4 className={classes.text}>
                <FormattedMessage id="payment_payment_transfer" />
              </h4>
            ) : (
              <h4 className={classes.text}>
                <FormattedMessage id="payment_payment_onsitepay" />
              </h4>
            )}
          </div>
          <div className={classes.statusContainer} data-item={status?.color}>
            {status?.text}
          </div>
          {isBusiness && status?.status === 'WAITING' && (
            <div className={classes.statusBtnContainer}>
              <button type="button" className={classes.button} onClick={() => updateStatusBtn(true)}>
                <FormattedMessage id="orderings_update_status_complete" />
              </button>
              <button type="button" className={classes.button} data-type="red" onClick={() => updateStatusBtn(false)}>
                <FormattedMessage id="orderings_update_status_failed" />
              </button>
            </div>
          )}
          <div className={classes.infoContainer}>
            <h3 className={classes.titleData}>
              <FormattedMessage id="orderings_customer_info" />
            </h3>
            {isBusiness && (
              <div className={classes.infoDataContainer}>
                <p className={classes.title}>
                  <FormattedMessage id="orderings_customer_name" /> :
                </p>
                <p className={classes.data}>- {orderingData?.customer}</p>
              </div>
            )}
            <div className={classes.infoDataContainer}>
              <p className={classes.title}>
                <FormattedMessage id="payment_phone" /> :
              </p>
              <p className={classes.data}>- {orderingData?.phone}</p>
            </div>
            <div className={classes.infoDataContainer}>
              <p className={classes.title}>
                <FormattedMessage id="payment_address" /> :
              </p>
              <p className={classes.data}>- {orderingData?.address}</p>
            </div>
          </div>
          <h3 className={classes.descriptionTitle}>
            <FormattedMessage id="product_detail_desc" />
          </h3>
          <p className={classes.description}>{orderingData?.description}</p>
        </div>
      </div>
    </div>
  );
};

OrderingDetailComponent.propTypes = {
  id: PropTypes.number,
  orderingData: PropTypes.object,
  back: PropTypes.func,
  isBusiness: PropTypes.bool,
};

const mapStateToProps = createStructuredSelector({
  orderingData: selectOrderingDetailData,
});

export default connect(mapStateToProps)(OrderingDetailComponent);
