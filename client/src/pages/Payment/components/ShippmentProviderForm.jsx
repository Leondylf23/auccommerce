import { useEffect, useState } from 'react';
import { connect, useDispatch } from 'react-redux';
import { createStructuredSelector } from 'reselect';
import PropTypes from 'prop-types';
import { FormattedMessage } from 'react-intl';

import { numberWithPeriods } from '@utils/allUtils';
import { selectPaymentToken, selectProviderData, selectShippingProviders, selectStepData } from '../selectors';
import { getFormData, getShippingProviders, setIsAnyChanges, setPaymentData } from '../actions';

import classes from '../style.module.scss';

const ShippmentProviderFormComponent = ({ providerList, setIsAbleNext, stepData, token, bidId }) => {
  const dispatch = useDispatch();

  const [selectedProvider, setSelectedProvider] = useState('');
  const [providerInformation, setProviderInformation] = useState(null);

  const providerSelectorOnChange = (data, isInitData) => {
    if (!isInitData) dispatch(setIsAnyChanges(true));

    const findData = providerList.find((provider) => provider?.id === parseInt(data, 10));
    if (!findData) return;

    setIsAbleNext(data !== '');
    setSelectedProvider(data);
    setProviderInformation(findData);
  };

  useEffect(() => {
    dispatch(getShippingProviders({ token }));
  }, []);

  useEffect(() => {
    if (stepData > 2) {
      dispatch(
        getFormData({ token, step: 2, bidId }, (data, err) => {
          if (!err) providerSelectorOnChange(data?.providerId, true);
        })
      );
    }
  }, [providerList]);

  useEffect(() => {
    const findData = providerList.find((provider) => provider?.id === parseInt(selectedProvider, 10));
    dispatch(setPaymentData({ providerId: selectedProvider, providerInfo: findData }));
  }, [selectedProvider]);

  return (
    <div className={classes.innerContainer}>
      <h3 className={classes.title}>
        <FormattedMessage id="payment_step_2_h2" />
      </h3>
      <div className={classes.selectorContainer}>
        <select
          className={classes.input}
          name="shippingProviderSelector"
          id="shippingProviderSelector"
          value={selectedProvider}
          onChange={(e) => providerSelectorOnChange(e.target.value)}
        >
          <option value="">
            <FormattedMessage id="payment_step_2_choose" />
          </option>
          {providerList?.map((provider) => (
            <option value={provider?.id} key={provider?.id}>
              {provider?.name}
            </option>
          ))}
        </select>
      </div>
      {selectedProvider !== '' && providerInformation && (
        <div className={classes.providerInfoContainer}>
          <p className={classes.label}>
            <FormattedMessage id="payment_step_2_ship_to" />:
          </p>
          <p className={classes.data}>{providerInformation?.address}</p>
          <div className={classes.infoContainer}>
            <p className={classes.labelEst}>
              <FormattedMessage id="payment_step_2_est_time" />:
            </p>
            <p className={classes.time}>{providerInformation?.estTime}</p>
          </div>
          <div className={classes.infoContainer}>
            <p className={classes.labelEst}>
              <FormattedMessage id="payment_step_2_est_price" />:
            </p>
            <p className={classes.dataEst}>Rp. {numberWithPeriods(providerInformation?.estPrice)}</p>
          </div>
        </div>
      )}
    </div>
  );
};

ShippmentProviderFormComponent.propTypes = {
  providerList: PropTypes.array,
  stepData: PropTypes.number,
  bidId: PropTypes.number,
  setIsAbleNext: PropTypes.func,
  token: PropTypes.string,
};

const mapStateToProps = createStructuredSelector({
  providerList: selectShippingProviders,
  providerInformation: selectProviderData,
  stepData: selectStepData,
  token: selectPaymentToken,
});

export default connect(mapStateToProps)(ShippmentProviderFormComponent);
