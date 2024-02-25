import PropTypes from 'prop-types';
import { connect } from 'react-redux';
import { createStructuredSelector } from 'reselect';
import { useEffect, useState } from 'react';
import { FormattedMessage, useIntl } from 'react-intl';

import classes from './style.module.scss';
import ShipmentAddressForm from './components/ShipmentAddressForm';
import ShippmentProviderForm from './components/ShippmentProviderForm';
import PaymentMethod from './components/PaymentMethod';
import SummaryPayment from './components/SummaryPayment';

const Payment = ({ draftData, bidData }) => {
  const intl = useIntl();
  const [pageTitle, setPageTitle] = useState('');
  const [step, setStep] = useState(1);
  const [page, setPage] = useState(null);

  const changePageStep = (stepData) => {
    if (stepData > 4) return;

    switch (stepData) {
      case 1:
        setPage(<ShipmentAddressForm />);
        setPageTitle(intl.formatMessage({ id: 'payment_step_1_h1' }));
        break;
      case 2:
        setPage(<ShippmentProviderForm />);
        setPageTitle(intl.formatMessage({ id: 'payment_step_2_h1' }));
        break;
      case 3:
        setPage(<PaymentMethod />);
        setPageTitle(intl.formatMessage({ id: 'payment_step_3_h1' }));
        break;
      case 4:
        setPage(<SummaryPayment />);
        setPageTitle(intl.formatMessage({ id: 'payment_step_4_h1' }));
        break;
      default:
        setPage(null);
        setPageTitle('');
        break;
    }

    setStep(stepData);
  };

  useEffect(() => {
    changePageStep(1);
  }, []);

  return (
    <div className={classes.mainContainer}>
      <h1 className={classes.pageTitle}>{pageTitle}</h1>
      <div className={classes.stepContainer}>{page}</div>
      <div className={classes.footer}>
        {step > 1 && (
          <button type="button" className={classes.button} onClick={() => changePageStep(step - 1)}>
            <FormattedMessage id="previous" />
          </button>
        )}
        <button type="button" className={classes.button} onClick={() => changePageStep(step + 1)}>
          {step === 4 ? intl.formatMessage({ id: 'send' }) : intl.formatMessage({ id: 'next' })}
        </button>
      </div>
    </div>
  );
};

Payment.propTypes = {
  draftData: PropTypes.object,
  bidData: PropTypes.object,
};

const mapStateToProps = createStructuredSelector({});

export default connect(mapStateToProps)(Payment);
