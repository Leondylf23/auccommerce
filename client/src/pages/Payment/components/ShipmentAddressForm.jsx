import { useEffect, useState } from 'react';
import { connect, useDispatch } from 'react-redux';
import { createStructuredSelector } from 'reselect';
import PropTypes from 'prop-types';
import FmdGoodIcon from '@mui/icons-material/FmdGood';
import AddLocationAltIcon from '@mui/icons-material/AddLocationAlt';
import EditIcon from '@mui/icons-material/Edit';

import PopupWindow from '@components/PopupWindow/Dialog';
import LocationInputForm from '@components/LocationInputForm';

import classes from '../style.module.scss';
import { selectUserAddresses } from '../selectors';
import { getUserAddresses } from '../actions';

const ShippmentAddressFormComponent = ({ addressList }) => {
  const dispatch = useDispatch();

  const [selectedAddress, setSelectedAddress] = useState(-1);
  const [isOpenLocationInput, setIsOpenLocationInput] = useState(false);
  const [editId, setEditId] = useState(null);

  const closeLocationForm = (isRefresh) => {
    setIsOpenLocationInput(false);
    setEditId(null);
  };

  const openEditAddress = (id) => {
    setEditId(id);
    setIsOpenLocationInput(true);
  };

  const selectAddress = (id) => {
    if (selectedAddress === id) {
      setSelectedAddress(null);
    } else {
      setSelectedAddress(id);
    }
  };

  useEffect(() => {
    dispatch(getUserAddresses());
  }, []);

  return (
    <div className={classes.innerContainer}>
      <h3 className={classes.title}>Address List</h3>
      <PopupWindow onClose={() => closeLocationForm(false)} open={isOpenLocationInput}>
        <LocationInputForm id={editId} onClose={closeLocationForm} />
      </PopupWindow>
      {addressList?.length > 0 ? (
        <div className={classes.addressListContainer}>
          {addressList?.map((address) => (
            <div className={classes.addressData} key={address?.id} data-active={selectedAddress === address?.id}>
              <FmdGoodIcon className={classes.icon} />
              <div className={classes.data} onClick={() => selectAddress(address?.id)}>
                <p className={classes.addressLabel}>{address?.label}</p>
                <p className={classes.addressText}>{address?.address}</p>
              </div>
              <button type="button" className={classes.editBtn} onClick={() => openEditAddress(address?.id)}>
                <EditIcon />
              </button>
            </div>
          ))}
        </div>
      ) : (
        <div className={classes.emptyContainer}>
          <p className={classes.text}>Kosong</p>
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
};

const mapStateToProps = createStructuredSelector({
  addressList: selectUserAddresses,
});

export default connect(mapStateToProps)(ShippmentAddressFormComponent);