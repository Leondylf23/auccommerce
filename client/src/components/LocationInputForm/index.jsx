import { useState } from 'react';
import PropTypes from 'prop-types';
import { connect, useDispatch } from 'react-redux';
import { createStructuredSelector } from 'reselect';
import { produce } from 'immer';
import { FormattedMessage, useIntl } from 'react-intl';

import { showPopup } from '@containers/App/actions';
import { saveUserAddress } from '@containers/Client/actions';

import classes from './style.module.scss';

const defaultValues = {
  label: '',
  address: '',
  phone: '',
  pic: '',
  note: '',
  postalCode: '',
};

const LocationInputForm = ({ id, onClose, locationData }) => {
  const intl = useIntl();
  const dispatch = useDispatch();

  const [addressData, setAddressData] = useState(defaultValues);

  const onChangeCheck = (dataLabel, data) => {
    if ((dataLabel === 'phone' || dataLabel === 'postalCode') && isNaN(data)) return;
    if (dataLabel === 'phone' && data.length > 14) return;
    if (dataLabel === 'postalCode' && data.length > 5) return;

    setAddressData(
      produce((draft) => {
        draft[dataLabel] = data;
      })
    );
  };

  const saveData = () => {
    const pageTitle = id
      ? intl.formatMessage({ id: 'address_popup_title_edit' })
      : intl.formatMessage({ id: 'address_popup_title_add' });

    if (addressData?.label?.length < 3) {
      dispatch(showPopup(pageTitle, intl.formatMessage({ id: 'address_popup_label_len_err' })));
      return;
    }
    if (addressData?.address?.length < 6) {
      dispatch(showPopup(pageTitle, intl.formatMessage({ id: 'address_popup_address_len_err' })));
      return;
    }
    if (addressData?.phone?.length < 10) {
      dispatch(showPopup(pageTitle, intl.formatMessage({ id: 'address_popup_phone_len_err' })));
      return;
    }
    if (addressData?.pic?.length < 3) {
      dispatch(showPopup(pageTitle, intl.formatMessage({ id: 'address_popup_reciever_len_err' })));
      return;
    }
    if (addressData?.postalCode?.length < 5) {
      dispatch(showPopup(pageTitle, intl.formatMessage({ id: 'address_popup_postal_len_err' })));
      return;
    }
    if (addressData?.note?.length < 10) {
      dispatch(showPopup(pageTitle, intl.formatMessage({ id: 'address_popup_note_len_err' })));
      return;
    }

    dispatch(
      saveUserAddress(Boolean(id), { ...addressData, ...(id && { id }) }, (err) => {
        if (!err) onClose(true);
      })
    );
  };

  useState(() => {
    if (locationData) {
      if (!id) {
        onClose();
        return;
      }

      setAddressData(locationData);
    }
  });

  return (
    <div className={classes.container}>
      <h2 className={classes.title}>
        {id ? <FormattedMessage id="address_popup_title_edit" /> : <FormattedMessage id="address_popup_title_add" />}
      </h2>
      <div className={classes.dividerContainer}>
        <div className={classes.inputContainer}>
          <label htmlFor="addressLabel" className={classes.label}>
            <FormattedMessage id="address_popup_label" />
          </label>
          <input
            type="text"
            id="addressLabel"
            maxLength={255}
            className={classes.input}
            value={addressData?.label}
            onChange={(e) => onChangeCheck('label', e.target.value)}
          />
        </div>
        <div className={classes.inputContainer}>
          <label htmlFor="address" className={classes.label}>
            <FormattedMessage id="address_popup_address" />
          </label>
          <input
            type="text"
            id="address"
            maxLength={255}
            className={classes.input}
            value={addressData?.address}
            onChange={(e) => onChangeCheck('address', e.target.value)}
          />
        </div>
      </div>
      <div className={classes.dividerContainer}>
        <div className={classes.inputContainer}>
          <label htmlFor="phone" className={classes.label}>
            <FormattedMessage id="address_popup_phone" />
          </label>
          <input
            type="text"
            id="phone"
            maxLength={14}
            className={classes.input}
            value={addressData?.phone}
            onChange={(e) => onChangeCheck('phone', e.target.value)}
          />
        </div>
        <div className={classes.inputContainer}>
          <label htmlFor="postalCode" className={classes.label}>
            <FormattedMessage id="address_popup_postal" />
          </label>
          <input
            type="text"
            id="postalCode"
            className={classes.input}
            value={addressData?.postalCode}
            onChange={(e) => onChangeCheck('postalCode', e.target.value)}
          />
        </div>
      </div>
      <label htmlFor="name" className={classes.label}>
        <FormattedMessage id="address_popup_reciever" />
      </label>
      <input
        type="text"
        id="name"
        maxLength={255}
        className={classes.input}
        value={addressData?.pic}
        onChange={(e) => onChangeCheck('pic', e.target.value)}
      />
      <label htmlFor="note" className={classes.label}>
        <FormattedMessage id="address_popup_note" />
      </label>
      <textarea
        type="text"
        id="note"
        maxLength={500}
        className={classes.input}
        value={addressData?.note}
        data-type="area"
        onChange={(e) => onChangeCheck('note', e.target.value)}
      />
      <div className={classes.buttonContainer}>
        <button type="button" className={classes.button} onClick={saveData}>
          <FormattedMessage id="save" />
        </button>
        <button type="button" className={classes.button} data-type="red" onClick={() => onClose(false)}>
          <FormattedMessage id="close" />
        </button>
      </div>
    </div>
  );
};

LocationInputForm.propTypes = {
  id: PropTypes.number,
  onClose: PropTypes.func,
  locationData: PropTypes.object,
};

const mapStateToProps = createStructuredSelector({});

export default connect(mapStateToProps)(LocationInputForm);
