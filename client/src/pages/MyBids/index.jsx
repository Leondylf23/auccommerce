import PropTypes from 'prop-types';
import { connect } from 'react-redux';
import { createStructuredSelector } from 'reselect';

import classes from './style.module.scss';

const MyBids = ({ bidsData }) => {
  console.log('a');

  return (
    <div className={classes.mainContainer}>
      <div className={classes.tabs}></div>
    </div>
  );
};

MyBids.propTypes = {
  bidsData: PropTypes.array,
};

const mapStateToProps = createStructuredSelector({});

export default connect(mapStateToProps)(MyBids);
