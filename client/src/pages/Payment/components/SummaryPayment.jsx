import { useEffect, useState } from 'react';
import { connect, useDispatch } from 'react-redux';
import { createStructuredSelector } from 'reselect';
import PropTypes from 'prop-types';
import { FormattedMessage } from 'react-intl';

import { numberWithPeriods } from '@utils/allUtils';
import { selectPaymentToken } from '../selectors';

import classes from '../style.module.scss';
import { getFormSummary } from '../actions';

const SummaryPaymentComponent = ({ token }) => {
  const dispatch = useDispatch();

  const [summaryData, setSummaryData] = useState(null);

  useEffect(() => {
    dispatch(
      getFormSummary({ token }, (data, err) => {
        if (!err) setSummaryData(data);
      })
    );
  }, []);

  return (
    <div className={classes.innerContainer}>
      <div className={classes.summaryContainer}>
        <div className={classes.itemContainer}>
          <img className={classes.image} src={summaryData?.itemData?.image} alt={summaryData?.itemData?.itemImage} />
          <p className={classes.text}>{summaryData?.itemData?.itemName}</p>
          <p className={classes.price}>Rp. {numberWithPeriods(summaryData?.bidPrice)}</p>
        </div>
        <div className={classes.otherPriceContainer}>
          <p className={classes.label}>
            <FormattedMessage id="payment_step_4_shipping" />:
          </p>
          <p className={classes.price}>Rp. {numberWithPeriods(summaryData?.shipingDataPrice)}</p>
        </div>
        <div className={classes.otherPriceContainer}>
          <p className={classes.label}>
            <FormattedMessage id="payment_step_4_adm_chrg" />:
          </p>
          <p className={classes.price}>Rp. {numberWithPeriods(summaryData?.adminPrice)}</p>
        </div>
        <div className={classes.totalPriceContainer}>
          <p className={classes.label}>
            <FormattedMessage id="payment_step_4_total_prc" />:
          </p>
          <p className={classes.price}>Rp. {numberWithPeriods(summaryData?.totalPrice)}</p>
        </div>
        <div className={classes.paymentMethodContainer}>
          <p className={classes.label}>
            <FormattedMessage id="payment_step_3_h1" />:
          </p>
          <div className={classes.paymentMethodDataContainer}>
            <img
              className={classes.logo}
              src={summaryData?.paymentMethod?.logo}
              alt={summaryData?.paymentMethod?.logo}
            />
            <p className={classes.name}>{summaryData?.paymentMethod?.name}</p>
          </div>
        </div>
      </div>
    </div>
  );
};

SummaryPaymentComponent.propTypes = {
  token: PropTypes.string,
};

const mapStateToProps = createStructuredSelector({
  token: selectPaymentToken,
});

export default connect(mapStateToProps)(SummaryPaymentComponent);
