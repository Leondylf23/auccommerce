import PropTypes from 'prop-types';
import { connect } from 'react-redux';
import { createStructuredSelector } from 'reselect';
import { useEffect, useState } from 'react';

import classes from './style.module.scss';
import ShipmentAddressForm from './components/ShipmentAddressForm';
import ShippmentProviderForm from './components/ShippmentProviderForm';
import PaymentMethod from './components/PaymentMethod';
import SummaryPayment from './components/SummaryPayment';

const Payment = ({ draftData, bidData }) => {
  const [pageTitle, setPageTitle] = useState('');
  const [step, setStep] = useState(1);
  const [page, setPage] = useState(null);

  const changePageStep = (stepData) => {
    if (stepData > 4) return;

    switch (stepData) {
      case 1:
        setPage(<ShipmentAddressForm />);
        setPageTitle('Shipping Address');
        break;
      case 2:
        setPage(<ShippmentProviderForm />);
        setPageTitle('Shipping Provider');
        break;
      case 3:
        setPage(<PaymentMethod />);
        setPageTitle('Payment Method');
        break;
      case 4:
        setPage(<SummaryPayment />);
        setPageTitle('Summary');
        break;
      default:
        setPage(null);
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
            Previous
          </button>
        )}
        <button type="button" className={classes.button} onClick={() => changePageStep(step + 1)}>
          {step === 4 ? 'Finish' : 'Next'}
        </button>
      </div>
    </div>
  );
};

Payment.propTypes = {
  paymentData: PropTypes.object,
  bidData: PropTypes.object,
};

const mapStateToProps = createStructuredSelector({});

export default connect(mapStateToProps)(Payment);
