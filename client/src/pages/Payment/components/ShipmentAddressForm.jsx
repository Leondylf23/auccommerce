import { useEffect, useState } from 'react';
import { connect, useDispatch } from 'react-redux';
import { createStructuredSelector } from 'reselect';
import PropTypes from 'prop-types';
import FmdGoodIcon from '@mui/icons-material/FmdGood';
import AddLocationAltIcon from '@mui/icons-material/AddLocationAlt';
import EditIcon from '@mui/icons-material/Edit';
import { FormattedMessage } from 'react-intl';

import PopupWindow from '@components/PopupWindow/Dialog';
import LocationInputForm from '@components/LocationInputForm';
import { selectPaymentToken, selectStepData, selectUserAddresses } from '../selectors';
import { getFormData, getUserAddresses, setIsAnyChanges, setPaymentData } from '../actions';

import classes from '../style.module.scss';

const ShippmentAddressFormComponent = ({ addressList, setIsAbleNext, token, stepData, bidId }) => {
  const dispatch = useDispatch();

  const [selectedAddress, setSelectedAddress] = useState(null);
  const [isOpenLocationInput, setIsOpenLocationInput] = useState(false);
  const [editData, setEditData] = useState(null);

  const closeLocationForm = (isRefresh) => {
    if (isRefresh) dispatch(getUserAddresses());
    setIsOpenLocationInput(false);
    setEditData(null);
  };

  const openEditAddress = (data) => {
    setEditData(data);
    setIsOpenLocationInput(true);
  };

  const selectAddress = (id, isInitData) => {
    if (!isInitData) dispatch(setIsAnyChanges(true));

    if (selectedAddress === id) {
      setSelectedAddress(null);
      setIsAbleNext(false);
    } else {
      setSelectedAddress(id);
      setIsAbleNext(true);
    }
  };

  useEffect(() => {
    dispatch(
      getUserAddresses((error) => {
        if (stepData > 1 && !error) {
          dispatch(
            getFormData({ token, step: 1, bidId }, (data, err) => {
              if (!err) selectAddress(data?.selectedAddressId, true);
            })
          );
        }
      })
    );
  }, []);

  useEffect(() => {
    const findData = addressList.find((address) => address?.id === selectedAddress);
    dispatch(setPaymentData({ selectedAddressId: selectedAddress, addressInformation: findData }));
  }, [selectedAddress]);

  return (
    <div className={classes.innerContainer}>
      <h3 className={classes.title}>
        <FormattedMessage id="payment_step_1_h2" />
      </h3>
      <PopupWindow onClose={() => closeLocationForm(false)} open={isOpenLocationInput}>
        <LocationInputForm id={editData?.id} onClose={closeLocationForm} locationData={editData} />
      </PopupWindow>
      {addressList?.length > 0 ? (
        <div className={classes.addressListContainer}>
          {addressList?.map((address) => (
            <div className={classes.addressData} key={address?.id} data-active={selectedAddress === address?.id}>
              <div className={classes.iconContainer} onClick={() => selectAddress(address?.id)}>
                <FmdGoodIcon className={classes.icon} />
              </div>
              <div className={classes.data} onClick={() => selectAddress(address?.id)}>
                <p className={classes.addressLabel}>{address?.label}</p>
                <p className={classes.addressText}>{address?.address}</p>
              </div>
              <button type="button" className={classes.editBtn} onClick={() => openEditAddress(address)}>
                <EditIcon />
              </button>
            </div>
          ))}
        </div>
      ) : (
        <div className={classes.emptyContainer}>
          <p className={classes.text}>
            <FormattedMessage id="empty" />
          </p>
        </div>
      )}
      <div className={classes.addAddressContainer}>
        <button type="button" className={classes.button} onClick={() => setIsOpenLocationInput(true)}>
          <AddLocationAltIcon />
        </button>
      </div>
    </div>
  );
};

ShippmentAddressFormComponent.propTypes = {
  addressList: PropTypes.array,
  setIsAbleNext: PropTypes.func,
  token: PropTypes.string,
  stepData: PropTypes.number,
  bidId: PropTypes.number,
};

const mapStateToProps = createStructuredSelector({
  addressList: selectUserAddresses,
  token: selectPaymentToken,
  stepData: selectStepData,
});

export default connect(mapStateToProps)(ShippmentAddressFormComponent);
