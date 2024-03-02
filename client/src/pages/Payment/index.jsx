import PropTypes from 'prop-types';
import { connect, useDispatch } from 'react-redux';
import { createStructuredSelector } from 'reselect';
import { useEffect, useState } from 'react';
import { FormattedMessage, useIntl } from 'react-intl';
import { useNavigate, useParams } from 'react-router-dom';

import { encryptDataAES } from '@utils/allUtils';
import ShipmentAddressForm from './components/ShipmentAddressForm';
import ShippmentProviderForm from './components/ShippmentProviderForm';
import PaymentMethod from './components/PaymentMethod';
import SummaryPayment from './components/SummaryPayment';
import {
  appendFormData,
  checkPaymentForm,
  completeFormData,
  setIsAnyChanges,
  setPaymentData,
  setStepData,
} from './actions';
import { selectIsAnyChanges, selectPaymentData, selectPaymentToken, selectStepData } from './selectors';

import classes from './style.module.scss';

const Payment = ({ token, stepData, stepPaymentData, isAnyChanges }) => {
  const navigate = useNavigate();
  const intl = useIntl();
  const dispatch = useDispatch();
  const { id } = useParams();

  const [pageTitle, setPageTitle] = useState('');
  const [step, setStep] = useState(0);
  const [page, setPage] = useState(null);
  const [isEnableNext, setIsEnableNext] = useState(false);

  const changePageStep = (data) => {
    if (data > 4) return;

    if (data < 3) setIsEnableNext(false);

    switch (data) {
      case 1:
        setPage(<ShipmentAddressForm setIsAbleNext={setIsEnableNext} bidId={id} />);
        setPageTitle(intl.formatMessage({ id: 'payment_step_1_h1' }));
        break;
      case 2:
        setPage(<ShippmentProviderForm setIsAbleNext={setIsEnableNext} bidId={id} />);
        setPageTitle(intl.formatMessage({ id: 'payment_step_2_h1' }));
        break;
      case 3:
        setPage(<PaymentMethod setIsAbleNext={setIsEnableNext} bidId={id} />);
        setPageTitle(intl.formatMessage({ id: 'payment_step_3_h1' }));
        break;
      case 4:
        setPage(<SummaryPayment setIsAbleNext={setIsEnableNext} bidId={id} />);
        setPageTitle(intl.formatMessage({ id: 'payment_step_4_h1' }));
        break;
      default:
        setPage(null);
        setPageTitle('');
        break;
    }

    setStep(data);
  };

  const submitStepData = (data) => {
    if (isAnyChanges && stepPaymentData && data < 4) {
      const encryptedData = encryptDataAES(
        JSON.stringify({
          step,
          bidId: id,
          data: stepPaymentData,
        })
      );
      dispatch(
        appendFormData({ data: encryptedData, ...(token && { token }) }, (err) => {
          if (!err) {
            dispatch(setPaymentData(null));
            dispatch(setIsAnyChanges(false));
            changePageStep(data + 1);
          }
        })
      );
    } else if (data === 4) {
      dispatch(
        completeFormData({ token }, (redirectUrl, err) => {
          if (err) return;
          window.location.href = redirectUrl;
        })
      );
    } else if (stepData >= data) {
      changePageStep(data + 1);
    }
  };

  useEffect(() => {
    if (token) {
      dispatch(
        checkPaymentForm({ token, bidId: id }, (nextStep, err) => {
          if (err) {
            navigate(`/my-bids/${id}`);
            return;
          }

          dispatch(setStepData(nextStep));
          changePageStep(nextStep);
          if (nextStep === 4) setIsEnableNext(true);
        })
      );
    } else {
      changePageStep(1);
    }
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
        <button type="button" className={classes.button} onClick={() => submitStepData(step)} disabled={!isEnableNext}>
          {step === 4 ? intl.formatMessage({ id: 'send' }) : intl.formatMessage({ id: 'next' })}
        </button>
      </div>
    </div>
  );
};

Payment.propTypes = {
  token: PropTypes.string,
  stepData: PropTypes.number,
  stepPaymentData: PropTypes.object,
  isAnyChanges: PropTypes.bool,
};

const mapStateToProps = createStructuredSelector({
  token: selectPaymentToken,
  stepData: selectStepData,
  stepPaymentData: selectPaymentData,
  isAnyChanges: selectIsAnyChanges,
});

export default connect(mapStateToProps)(Payment);
