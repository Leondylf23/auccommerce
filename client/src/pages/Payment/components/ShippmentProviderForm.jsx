import { useEffect, useState } from 'react';
import { connect, useDispatch } from 'react-redux';
import { createStructuredSelector } from 'reselect';
import PropTypes from 'prop-types';

import { numberWithPeriods } from '@utils/allUtils';
import { selectPaymentData, selectProviderData, selectShippingProviders } from '../selectors';
import { getShippingProviderData, getShippingProviders, getUserAddresses } from '../actions';

import classes from '../style.module.scss';

const ShippmentProviderFormComponent = ({ draftData, providerList, providerInformation }) => {
  const dispatch = useDispatch();

  const [selectedProvider, setSelectedProvider] = useState('');

  const providerSelectorOnChange = (data) => {
    setSelectedProvider(data);
    dispatch(getShippingProviderData({ address: draftData?.address?.address }));
  };

  useEffect(() => {
    dispatch(getShippingProviders());
  }, []);

  return (
    <div className={classes.innerContainer}>
      <h3 className={classes.title}>Choose Shipping Provider</h3>
      <div className={classes.selectorContainer}>
        <select
          className={classes.input}
          name="shippingProviderSelector"
          id="shippingProviderSelector"
          value={selectedProvider}
          onChange={(e) => providerSelectorOnChange(e.target.value)}
        >
          <option value="">- Choose -</option>
          {providerList?.map((provider) => (
            <option value={provider?.id}>{provider?.name}</option>
          ))}
        </select>
      </div>
      {selectedProvider !== '' && providerInformation && (
        <div className={classes.providerInfoContainer}>
          <p className={classes.label}>Ship to:</p>
          <p className={classes.data}>{providerInformation?.address}</p>
          <p className={classes.labelEst}>Estimate price:</p>
          <p className={classes.dataEst}>Rp. {numberWithPeriods(providerInformation?.price)}</p>
        </div>
      )}
    </div>
  );
};

ShippmentProviderFormComponent.propTypes = {
  providerList: PropTypes.array,
  providerInformation: PropTypes.object,
  draftData: PropTypes.object,
};

const mapStateToProps = createStructuredSelector({
  providerList: selectShippingProviders,
  providerInformation: selectProviderData,
  draftData: selectPaymentData,
});

export default connect(mapStateToProps)(ShippmentProviderFormComponent);
