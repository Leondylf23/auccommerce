import { useDispatch, connect } from 'react-redux';
import { createStructuredSelector } from 'reselect';
import { useNavigate, useParams } from 'react-router-dom';
import { useIntl, FormattedMessage } from 'react-intl';
import { useEffect, useState } from 'react';
import PropTypes from 'prop-types';

import { encryptDataAES } from '@utils/allUtils';
import { selectProductDetail } from '@pages/ProductDetail/selectors';
import { showPopup } from '@containers/App/actions';
import OrderForms from './components/OrderForms';
import PaymentSelection from './components/PaymentSelection';
import PaymentSumary from './components/PaymentSumary';
import { selectUserInputData } from './selectors';
import { sendOrderingData, setUserInputs } from './actions';

import classes from './style.module.scss';

const PaymentPage = ({ inputtedData, productDetail }) => {
  const dispatch = useDispatch();
  const navigate = useNavigate();
  const intl = useIntl();
  const { id } = useParams();
  const stepPages = [
    {
      id: 1,
      name: intl.formatMessage({ id: 'payment_step_1_name' }),
      page: <OrderForms />,
    },
    {
      id: 2,
      name: intl.formatMessage({ id: 'payment_step_3_name' }),
      page: <PaymentSelection />,
    },
    {
      id: 3,
      name: intl.formatMessage({ id: 'payment_step_4_name' }),
      page: <PaymentSumary />,
    },
  ];

  const [stepPage, setStepPage] = useState(null);
  const [step, setStep] = useState(-1);

  const setStepPageTab = (data) => {
    if (
      data?.id > 1 &&
      !(inputtedData && inputtedData?.orderForm?.phone !== '' && inputtedData?.orderForm?.address !== '')
    ) {
      dispatch(
        showPopup(
          intl.formatMessage({ id: 'payment_title' }),
          intl.formatMessage({ id: 'payment_step_1_not_complete' })
        )
      );
      return;
    }
    if (data?.id > 2 && !(inputtedData && inputtedData?.paymentMethod)) {
      dispatch(
        showPopup(
          intl.formatMessage({ id: 'payment_title' }),
          intl.formatMessage({ id: 'payment_step_3_not_complete' })
        )
      );
      return;
    }

    setStep(data?.id);
    setStepPage(data?.page);
  };

  const finish = () => {
    const encryptedData = encryptDataAES(
      JSON.stringify({
        ...inputtedData,
        paymentMethod: inputtedData?.paymentMethod?.id,
        index: undefined,
      })
    );

    dispatch(
      sendOrderingData({ data: encryptedData }, () => {
        dispatch(setUserInputs(null));
        dispatch(
          showPopup(intl.formatMessage({ id: 'payment_title' }), intl.formatMessage({ id: 'payment_step_complete' }))
        );
        navigate('/orderings');
      })
    );
  };

  useEffect(() => {
    if (!productDetail) navigate(`/product/${id}`);
    setStepPageTab(stepPages[0]);
    dispatch(setUserInputs({ productId: id, totalPayment: productDetail?.price }));
  }, []);

  return (
    <div className={classes.mainContainer} data-testid="payment-page">
      <div className={classes.innerContainer}>
        <div className={classes.leftSide}>
          {stepPages.map((page) => (
            <div
              className={classes.stepsIndicators}
              key={page?.id}
              data-active={page?.id === step}
              onClick={() => setStepPageTab(page)}
            >
              <div className={classes.stepNumberContainer}>
                <p className={classes.stepNumber}>{page?.id}</p>
              </div>
              <p className={classes.stepTitle}>{page?.name}</p>
            </div>
          ))}
        </div>
        <div className={classes.rightSide}>
          {stepPage}
          <div className={classes.rightSideFooter}>
            <button
              type="button"
              className={classes.prevBtn}
              onClick={() => (step === 1 ? navigate(`/product/${id}`) : setStepPageTab(stepPages[step - 2]))}
            >
              <FormattedMessage id="payment_previous_btn" />
            </button>
            <button
              type="button"
              className={classes.nextBtn}
              onClick={() => (step === 3 ? finish() : setStepPageTab(stepPages[step]))}
            >
              {step === 3
                ? intl.formatMessage({ id: 'payment_finish_btn' })
                : intl.formatMessage({ id: 'payment_next_btn' })}
            </button>
          </div>
        </div>
      </div>
    </div>
  );
};

PaymentPage.propTypes = {
  inputtedData: PropTypes.object,
  productDetail: PropTypes.object,
};

const mapStateToProps = createStructuredSelector({
  inputtedData: selectUserInputData,
  productDetail: selectProductDetail,
});

export default connect(mapStateToProps)(PaymentPage);
