import { connect } from 'react-redux';
import { createStructuredSelector } from 'reselect';
import { FormattedMessage } from 'react-intl';
import { useEffect } from 'react';
import PropTypes from 'prop-types';
import LocalOfferIcon from '@mui/icons-material/LocalOffer';

import { numberWithPeriods } from '@utils/allUtils';
import { selectProductDetail } from '@pages/ProductDetail/selectors';
import { selectUserInputData } from '../selectors';

import classes from '../style.module.scss';

const PaymentSumaryComponent = ({ productData, inputtedData }) => {
  useEffect(() => {}, []);
  return (
    <div className={classes.componentContainer} data-testid="payment-page-payment-summary">
      <h2 className={classes.title}>
        <FormattedMessage id="payment_step_4_name" />
      </h2>
      <h4 className={classes.pageTitleBig}>{productData?.title}</h4>
      <div className={classes.sumaryContainer}>
        <div className={classes.data}>
          <p className={classes.name}>
            <FormattedMessage id="payment_phone" />
          </p>
          <p className={classes.value}>{inputtedData?.orderForm?.phone}</p>
        </div>
        <div className={classes.data} data-type="dirY">
          <p className={classes.name}>
            <FormattedMessage id="payment_address" />
          </p>
          <p className={classes.value}>{inputtedData?.orderForm?.address}</p>
        </div>
        <div className={classes.data}>
          <p className={classes.name}>
            <FormattedMessage id="payment_summary_payment_method" />
          </p>
          <p className={classes.value}>
            {inputtedData?.paymentMethod?.nameIntlId && (
              <FormattedMessage id={inputtedData?.paymentMethod?.nameIntlId} />
            )}
          </p>
        </div>
      </div>
      <div className={classes.footer}>
        <h4 className={classes.footerTitle}>
          <FormattedMessage id="payment_summary_total_payment" />
        </h4>
        <div className={classes.priceContainer}>
          <LocalOfferIcon className={classes.icon} />
          <p className={classes.priceValue} data-variant="">
            Rp. {numberWithPeriods(inputtedData?.totalPayment)}
          </p>
        </div>
      </div>
    </div>
  );
};

PaymentSumaryComponent.propTypes = {
  inputtedData: PropTypes.object,
  productData: PropTypes.object,
};

const mapStateToProps = createStructuredSelector({
  inputtedData: selectUserInputData,
  productData: selectProductDetail,
});

export default connect(mapStateToProps)(PaymentSumaryComponent);
