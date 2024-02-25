import { useState } from 'react';
import { connect, useDispatch } from 'react-redux';
import { createStructuredSelector } from 'reselect';
import PropTypes from 'prop-types';

import { numberWithPeriods } from '@utils/allUtils';
import { selectPaymentData } from '../selectors';

import classes from '../style.module.scss';

const SummaryPaymentComponent = ({ draftData }) => {
  const dispatch = useDispatch();

  return (
    <div className={classes.innerContainer}>
      <div className={classes.summaryContainer}>
        <div className={classes.itemContainer}>
          <img
            className={classes.image}
            src={'https://d3fkkqa7lc3d5k.cloudfront.net/PRF-1-file_datas-IMG_2204.jpeg'}
            alt=""
          />
          <p className={classes.text}>Mainan apa ini</p>
          <p className={classes.price}>Rp. {numberWithPeriods(784131)}</p>
        </div>
        <div className={classes.otherPriceContainer}>
          <p className={classes.label}>Shipping</p>
          <p className={classes.price}>Rp. {numberWithPeriods(123123)}</p>
        </div>
        <div className={classes.otherPriceContainer}>
          <p className={classes.label}>Admin Charge</p>
          <p className={classes.price}>Rp. {numberWithPeriods(123123)}</p>
        </div>
        <div className={classes.totalPriceContainer}>
          <p className={classes.label}>Total Price:</p>
          <p className={classes.price}>Rp. {numberWithPeriods(12333)}</p>
        </div>
      </div>
    </div>
  );
};

SummaryPaymentComponent.propTypes = {
  draftData: PropTypes.object,
};

const mapStateToProps = createStructuredSelector({
  draftData: selectPaymentData,
});

export default connect(mapStateToProps)(SummaryPaymentComponent);
