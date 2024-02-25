import { useEffect, useState } from 'react';
import { connect, useDispatch } from 'react-redux';
import { createStructuredSelector } from 'reselect';
import PropTypes from 'prop-types';
import { FormattedMessage } from 'react-intl';

import { selectPaymentData, selectPaymentMethods } from '../selectors';
import { getPaymentMethods } from '../actions';

import classes from '../style.module.scss';

const PaymentMethodComponent = ({ draftData, paymentMethods }) => {
  const dispatch = useDispatch();

  const [selectedMethod, setSelectedPayment] = useState(-1);

  const selectMethod = (id) => {
    if (selectedMethod === id) {
      setSelectedPayment(null);
    } else {
      setSelectedPayment(id);
    }
  };

  useEffect(() => {
    dispatch(getPaymentMethods());
  }, []);

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
  draftData: PropTypes.object,
  paymentMethods: PropTypes.array,
};

const mapStateToProps = createStructuredSelector({
  draftData: selectPaymentData,
  paymentMethods: selectPaymentMethods,
});

export default connect(mapStateToProps)(PaymentMethodComponent);
