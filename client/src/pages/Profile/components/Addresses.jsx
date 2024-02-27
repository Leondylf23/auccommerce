import { useEffect, useState } from 'react';
import { FormattedMessage, useIntl } from 'react-intl';
import PropTypes from 'prop-types';
import EditIcon from '@mui/icons-material/Edit';
import DeleteIcon from '@mui/icons-material/Delete';
import { connect, useDispatch } from 'react-redux';
import { createStructuredSelector } from 'reselect';

import PopupWindow from '@components/PopupWindow/Dialog';
import LocationInputForm from '@components/LocationInputForm';
import { showPopup } from '@containers/App/actions';
import PopupConfirmation from '@components/PopupConfirmation/Dialog';
import { selectProfileAddressesData } from '../selectors';
import { deleteUserAddress, getUserAddresses } from '../actions';

import classes from '../style.module.scss';

const AddressesComponenet = ({ addressData }) => {
  const dispatch = useDispatch();
  const intl = useIntl();

  const [deleteData, setDeleteData] = useState(null);
  const [editData, setEditData] = useState(null);
  const [isOpenAddressForm, setIsOpenAddressForm] = useState(false);
  const [isLoading, setIsLoading] = useState(false);

  const isOpenDeletePopup = Boolean(deleteData);

  const fetchData = () => {
    setIsLoading(true);

    dispatch(
      getUserAddresses((err) => {
        if (err) dispatch(showPopup());

        setIsLoading(false);
      })
    );
  };

  const editBtn = (data) => {
    setEditData(data);
    setIsOpenAddressForm(true);
  };

  const closePopup = (isRefresh) => {
    if (isRefresh) fetchData();

    setIsOpenAddressForm(false);
    setEditData(null);
    setDeleteData(null);
  };

  const deleteDataBtn = (isDeleted) => {
    if (isDeleted) {
      dispatch(
        deleteUserAddress({ id: deleteData?.id }, (err) => {
          if (err) return;
          closePopup(true);
        })
      );
    } else {
      closePopup(false);
    }
  };

  useEffect(() => {
    fetchData();
  }, []);

  return (
    <div className={classes.adddressContainer}>
      <div className={classes.header}>
        <h3 className={classes.containerTitle}>
          <FormattedMessage id="profile_address_title" />
        </h3>
        {addressData?.length < 5 && (
          <button type="button" className={classes.button} onClick={() => setIsOpenAddressForm(true)}>
            <FormattedMessage id="add" />
          </button>
        )}
      </div>
      <PopupWindow onClose={() => closePopup(false)} open={isOpenAddressForm}>
        <LocationInputForm id={editData?.id} onClose={closePopup} locationData={editData} />
      </PopupWindow>
      <PopupConfirmation
        data={deleteData?.label}
        message={intl.formatMessage({ id: 'profile_address_del_confirmations' })}
        isOpen={isOpenDeletePopup}
        onConfirmation={deleteDataBtn}
      />
      {addressData?.length > 0 ? (
        <div className={classes.addressListContainer}>
          {addressData?.map((address) => (
            <div className={classes.data} key={address?.id}>
              <div className={classes.textes}>
                <p className={classes.label}>{address?.label}</p>
                <p className={classes.middleData}>
                  {address?.pic} - {address?.phone}
                </p>
                <p className={classes.address}>{address?.address}</p>
              </div>
              <div className={classes.buttons}>
                <button type="button" className={classes.button} onClick={() => editBtn(address)} data-type="clean">
                  <EditIcon className={classes.icon} />
                </button>
                <button type="button" className={classes.button} onClick={() => setDeleteData(address)} data-type="red">
                  <DeleteIcon className={classes.icon} />
                </button>
              </div>
            </div>
          ))}
        </div>
      ) : (
        <div className={classes.emptyContainer}>
          <p className={classes.text}>
            {isLoading ? <FormattedMessage id="loading" /> : <FormattedMessage id="empty_data" />}
          </p>
        </div>
      )}
    </div>
  );
};

AddressesComponenet.propTypes = {
  addressData: PropTypes.object,
};

const mapStateToProps = createStructuredSelector({
  addressData: selectProfileAddressesData,
});

export default connect(mapStateToProps)(AddressesComponenet);
