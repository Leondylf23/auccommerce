import { useDispatch, connect } from 'react-redux';
import { createStructuredSelector } from 'reselect';
import { FormattedMessage } from 'react-intl';
import { useEffect, useState } from 'react';
import PropTypes from 'prop-types';
import AccountBalanceIcon from '@mui/icons-material/AccountBalance';
import PointOfSaleIcon from '@mui/icons-material/PointOfSale';

import { selectUserInputData } from '../selectors';
import { setUserInputs } from '../actions';

import classes from '../style.module.scss';

const PaymentSelectionComponent = ({ inputtedData }) => {
  const dispatch = useDispatch();

  const [selectedPayment, setSelectedPayment] = useState(null);

  const selectPaymentBtn = (isTransfer) => {
    const temp = isTransfer
      ? {
          id: 'TRANSFER',
          nameIntlId: 'payment_payment_transfer',
        }
      : {
          id: 'CASH',
          nameIntlId: 'payment_payment_onsitepay',
        };

    setSelectedPayment(temp);
    dispatch(setUserInputs({ ...inputtedData, paymentMethod: temp }));
  };

  useEffect(() => {
    if (inputtedData?.paymentMethod) {
      setSelectedPayment(inputtedData?.paymentMethod);
    }
  }, [inputtedData]);

  return (
    <div className={classes.componentContainer} data-testid="payment-page-payment-selection">
      <h2 className={classes.title}>
        <FormattedMessage id="payment_step_3_name" />
      </h2>
      <h4 className={classes.pageTitle}>
        <FormattedMessage id="payment_payment_page_title" />
      </h4>
      <div className={classes.paymentSelectionContainer}>
        <div
          className={classes.payment}
          onClick={() => selectPaymentBtn(true)}
          data-active={selectedPayment?.id === 'TRANSFER'}
        >
          <AccountBalanceIcon />
          <p className={classes.text}>
            <FormattedMessage id="payment_payment_transfer" />
          </p>
        </div>
        <div
          className={classes.payment}
          onClick={() => selectPaymentBtn(false)}
          data-active={selectedPayment?.id === 'CASH'}
        >
          <PointOfSaleIcon />
          <p className={classes.text}>
            <FormattedMessage id="payment_payment_onsitepay" />
          </p>
        </div>
      </div>
    </div>
  );
};

PaymentSelectionComponent.propTypes = {
  inputtedData: PropTypes.object,
};

const mapStateToProps = createStructuredSelector({
  inputtedData: selectUserInputData,
});

export default connect(mapStateToProps)(PaymentSelectionComponent);
