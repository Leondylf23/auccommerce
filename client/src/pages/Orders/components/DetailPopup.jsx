import { useEffect, useState } from 'react';
import { useNavigate } from 'react-router-dom';
import PropTypes from 'prop-types';
import { FormattedMessage } from 'react-intl';
import { useDispatch } from 'react-redux';

import { formatDateTimeSlashes, numberWithPeriods } from '@utils/allUtils';
import StatusCard from '@components/StatusCard/Card';
import { getOrderDetail } from '../actions';

import classes from '../style.module.scss';

const DetailPopup = ({ id, onClose }) => {
  const navigate = useNavigate();
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
      <h3 className={classes.title}>
        <FormattedMessage id="orders_detail_title" />
      </h3>
    </div>
  );
};

DetailPopup.propTypes = {
  id: PropTypes.object,
  onClose: PropTypes.func,
};

export default DetailPopup;
