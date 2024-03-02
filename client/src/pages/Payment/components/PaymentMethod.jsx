import { useEffect, useState } from 'react';
import { connect, useDispatch } from 'react-redux';
import { createStructuredSelector } from 'reselect';
import PropTypes from 'prop-types';
import { FormattedMessage } from 'react-intl';

import { selectPaymentMethods, selectPaymentToken, selectStepData } from '../selectors';
import { getFormData, getPaymentMethods, setIsAnyChanges, setPaymentData } from '../actions';

import classes from '../style.module.scss';

const PaymentMethodComponent = ({ paymentMethods, setIsAbleNext, stepData, token, bidId }) => {
  const dispatch = useDispatch();

  const [selectedMethod, setSelectedPayment] = useState(-1);

  const selectMethod = (id, isInitData) => {
    if (!isInitData) dispatch(setIsAnyChanges(true));

    if (selectedMethod === id) {
      setSelectedPayment(null);
      setIsAbleNext(false);
    } else {
      setSelectedPayment(id);
      setIsAbleNext(true);
    }
  };

  useEffect(() => {
    dispatch(getPaymentMethods({ token }));
  }, []);

  useEffect(() => {
    if (stepData > 3) {
      dispatch(
        getFormData({ token, step: 3, bidId }, (data, err) => {
          if (!err) selectMethod(data?.paymentMethodId, true);
        })
      );
    }
  }, [paymentMethods]);

  useEffect(() => {
    const findData = paymentMethods.find((method) => method?.id === selectedMethod);
    dispatch(setPaymentData({ paymentMethodId: selectedMethod, paymentMethodInfo: findData }));
  }, [selectedMethod]);

  return (
    <div className={classes.innerContainer}>
      <h3 className={classes.title}>
        <FormattedMessage id="payment_step_3_h2" />
      </h3>
      <div className={classes.paymentMethodListContainer}>
        {paymentMethods?.map((method) => (
          <div
            className={classes.paymentMethodData}
            key={method?.id}
            data-active={selectedMethod === method?.id}
            onClick={() => selectMethod(method?.id)}
          >
            <img className={classes.logo} src={method?.logo} alt={method?.logo} />
            <p className={classes.text}>{method?.name}</p>
          </div>
        ))}
      </div>
    </div>
  );
};

PaymentMethodComponent.propTypes = {
  paymentMethods: PropTypes.array,
  setIsAbleNext: PropTypes.func,
  stepData: PropTypes.number,
  token: PropTypes.string,
  bidId: PropTypes.number,
};

const mapStateToProps = createStructuredSelector({
  paymentMethods: selectPaymentMethods,
  stepData: selectStepData,
  token: selectPaymentToken,
});

export default connect(mapStateToProps)(PaymentMethodComponent);
