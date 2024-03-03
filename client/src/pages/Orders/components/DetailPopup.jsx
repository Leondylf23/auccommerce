import { useEffect, useState } from 'react';
import PropTypes from 'prop-types';
import { FormattedMessage } from 'react-intl';
import { useDispatch } from 'react-redux';
import Avatar from '@mui/material/Avatar';

import { formatDateTimeSlashes, numberWithPeriods } from '@utils/allUtils';
import StatusCard from '@components/StatusCard/Card';
import { getOrderDetail } from '../actions';

import classes from '../style.module.scss';

const DetailPopup = ({ id, onClose }) => {
  const dispatch = useDispatch();

  const [data, setData] = useState(null);

  useEffect(() => {
    if (id) {
      dispatch(
        getOrderDetail({ id }, (dataIn, err) => {
          if (err) {
            onClose(false);
            return;
          }

          setData(dataIn);
        })
      );
    }
  }, [id]);

  return (
    <div className={classes.transactionDetailContainer}>
      <div className={classes.header}>
        <h3 className={classes.title}>{data?.transactionCode}</h3>
        <div className={classes.statusContainer}>
          <StatusCard status={data?.bid?.status} />
        </div>
      </div>
      <p className={classes.infoTitle}>
        <FormattedMessage id="orders_detail_bid_info" />:
      </p>
      <div className={classes.dataContainer} data-type="image">
        <Avatar src={data?.user?.pictureUrl} alt={data?.user?.pictureUrl} />
        <p className={classes.data}>{data?.user?.fullname}</p>
      </div>
      <div className={classes.dataContainer}>
        <p className={classes.label}>
          <FormattedMessage id="orders_detail_item" />:
        </p>
        <p className={classes.data}>{data?.transactionData?.itemName}</p>
      </div>
      <div className={classes.dataContainer}>
        <p className={classes.label}>
          <FormattedMessage id="orders_detail_bid_plcd" />:
        </p>
        <p className={classes.data}>Rp. {numberWithPeriods(data?.bid?.bidPlacePrice)}</p>
      </div>
      <div className={classes.dataContainer}>
        <p className={classes.label}>
          <FormattedMessage id="orders_detail_date" />:
        </p>
        <p className={classes.data}>{formatDateTimeSlashes(data?.bid?.createdAt)}</p>
      </div>
      <p className={classes.infoTitle}>
        <FormattedMessage id="orders_detail_shipping_info" />:
      </p>
      <div className={classes.dataContainer}>
        <p className={classes.label}>
          <FormattedMessage id="orders_detail_address" />:
        </p>
        <p className={classes.data}>{data?.transactionData?.shippingData?.address}</p>
      </div>
      <div className={classes.dataContainer}>
        <p className={classes.label}>
          <FormattedMessage id="orders_detail_reciever" />:
        </p>
        <p className={classes.data}>{data?.transactionData?.shippingData?.reciever}</p>
      </div>
      <div className={classes.dataContainer}>
        <p className={classes.label}>
          <FormattedMessage id="orders_detail_phone" />:
        </p>
        <p className={classes.data}>{data?.transactionData?.shippingData?.phone}</p>
      </div>
      <div className={classes.dataContainer}>
        <p className={classes.label}>
          <FormattedMessage id="orders_detail_provider" />:
        </p>
        <p className={classes.data}>{data?.transactionData?.shippingData?.provider}</p>
      </div>
      <div className={classes.dataContainer}>
        <p className={classes.label}>
          <FormattedMessage id="orders_detail_est_time" />:
        </p>
        <p className={classes.data}>{data?.transactionData?.shippingData?.estTime}</p>
      </div>
      <div className={classes.dataContainer}>
        <p className={classes.label}>
          <FormattedMessage id="orders_detail_price" />:
        </p>
        <p className={classes.data}>{data?.transactionData?.shippingData?.price}</p>
      </div>
    </div>
  );
};

DetailPopup.propTypes = {
  id: PropTypes.object,
  onClose: PropTypes.func,
};

export default DetailPopup;
