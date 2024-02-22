import { useState } from 'react';
import PropTypes from 'prop-types';
import { connect } from 'react-redux';
import { createStructuredSelector } from 'reselect';

import classes from './style.module.scss';

const LocationInputForm = ({ id, onClose, locationData }) => {
  const [addressLabel, setAddressLabel] = useState('');
  const [address, setAddress] = useState('');

  return (
    <div className={classes.container}>
      <h2 className={classes.title}>{id ? 'Edit Address' : 'Add New Address'}</h2>
      <label htmlFor="addressLabel" className={classes.label}>
        Address Label
      </label>
      <input
        type="text"
        id="addressLabel"
        className={classes.input}
        value={addressLabel}
        onChange={(e) => setAddressLabel(e.target.value)}
      />
      <label htmlFor="address" className={classes.label}>
        Address
      </label>
      <input
        type="text"
        id="address"
        className={classes.input}
        value={address}
        onChange={(e) => setAddress(e.target.value)}
      />
      <div className={classes.buttonContainer}>
        <button type="button" className={classes.button}>
          Save
        </button>
        <button type="button" className={classes.button} data-type="red">
          Cancel
        </button>
      </div>
    </div>
  );
};

LocationInputForm.propTypes = {
  onClose: PropTypes.func,
  locationData: PropTypes.object,
};

const mapStateToProps = createStructuredSelector({});

export default connect(mapStateToProps)(LocationInputForm);
