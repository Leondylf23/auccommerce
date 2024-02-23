import { useState } from 'react';
import { FormattedMessage } from 'react-intl';
import PropTypes from 'prop-types';
import EditIcon from '@mui/icons-material/Edit';
import DeleteIcon from '@mui/icons-material/Delete';

import PopupWindow from '@components/PopupWindow/Dialog';
import LocationInputForm from '@components/LocationInputForm';

import classes from '../style.module.scss';

const AddressesComponenet = ({ userData }) => {
  const [deleteData, setDeleteData] = useState(null);
  const [editId, setEditId] = useState(null);
  const [isOpenAddressForm, setIsOpenAddressForm] = useState(false);

  const isOpenDeletePopup = Boolean(deleteData);

  const fetchData = () => {};

  const editBtn = (id) => {
    setEditId(id);
    setIsOpenAddressForm(true);
  };

  const closePopup = (isRefresh) => {
    if (isRefresh) fetchData();

    setIsOpenAddressForm(false);
    setEditId(null);
    setDeleteData(null);
  };

  return (
    <div className={classes.adddressContainer}>
      <div className={classes.header}>
        <h3 className={classes.containerTitle}>
          <FormattedMessage id="profile_passwords" />
        </h3>
        <button type="button" className={classes.button} onClick={() => setIsOpenAddressForm(true)}>
          Add
        </button>
      </div>
      <PopupWindow onClose={() => closePopup(false)} open={isOpenAddressForm}>
        <LocationInputForm id={editId} onClose={closePopup} />
      </PopupWindow>
      <PopupWindow onClose={() => closePopup(false)} open={isOpenDeletePopup}>
        <div className={classes.deletePopupContainer}>
          <p className={classes.message}>Are you sure want to delete {deleteData?.label}</p>
          <div className={classes.buttons}>
            <button type="button" className={classes.button} onClick={() => {}} data-type="red">
              <FormattedMessage id="yes" />
            </button>
            <button type="button" className={classes.button} onClick={() => setDeleteData(null)}>
              <FormattedMessage id="no" />
            </button>
          </div>
        </div>
      </PopupWindow>
      {userData?.addresses?.length > 0 ? (
        <div className={classes.addressListContainer}>
          {userData?.addresses?.map((address) => (
            <div className={classes.data} key={address?.id}>
              <div className={classes.textes}>
                <p className={classes.label}>{address?.label}</p>
                <p className={classes.address}>{address?.address}</p>
              </div>
              <div className={classes.buttons}>
                <button type="button" className={classes.button} onClick={() => editBtn(address?.id)} data-type="clean">
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
            <FormattedMessage id="empty_data" />
          </p>
        </div>
      )}
    </div>
  );
};

AddressesComponenet.propTypes = {
  userData: PropTypes.object,
};

export default AddressesComponenet;
