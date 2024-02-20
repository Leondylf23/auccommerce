import { useNavigate, useParams } from 'react-router-dom';
import { connect, useDispatch } from 'react-redux';
import { createStructuredSelector } from 'reselect';
import PropTypes from 'prop-types';

import classes from './style.module.scss';

const ItemDetail = ({ itemDetailData }) => {
  const navigate = useNavigate();
  const dispatch = useDispatch();
  const { id } = useParams();

  return (
    <div className={classes.mainContainer}>
      <h1 className={classes.itemTitle}>Item Detail {id}</h1>
    </div>
  );
};

ItemDetail.propTypes = {
  itemDetailData: PropTypes.object,
};

const mapStateToProps = createStructuredSelector({});

export default connect(mapStateToProps)(ItemDetail);
