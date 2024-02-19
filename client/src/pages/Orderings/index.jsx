import { useDispatch, connect } from 'react-redux';
import { createStructuredSelector } from 'reselect';
import { FormattedMessage } from 'react-intl';
import { useEffect, useState } from 'react';
import PropTypes from 'prop-types';
import { selectUserData } from '@containers/Client/selectors';
import { getUserDataDecrypt } from '@utils/allUtils';

import { selectOrderingData } from './selectors';
import OrderingDetail from './components/OrderingDetail';
import OrderingCard from './components/OrderingCard';
import { getOrderingsData, setOrderingsData } from './actions';

import classes from './style.module.scss';

const Orderings = ({ orderingData, userData }) => {
  const dispatch = useDispatch();

  const [detailId, setDetailId] = useState(null);
  const [isBusiness, setIsBusiness] = useState(false);

  const backBtn = (isRefresh) => {
    if (isRefresh) dispatch(getOrderingsData(isBusiness));
    setDetailId(null);
  };

  useEffect(() => {
    let isBusinessTemp = false;
    if (userData) {
      const user = getUserDataDecrypt(userData);
      isBusinessTemp = user && user?.role === 'business';
      setIsBusiness(isBusinessTemp);
    }
    dispatch(setOrderingsData([]));
    dispatch(getOrderingsData(isBusinessTemp));
  }, [dispatch, userData]);

  return (
    <div className={classes.mainContainer} data-testid="orderings-page">
      <h1 className={classes.title}>
        <FormattedMessage id="orderings_title" />
      </h1>
      {!detailId ? (
        <div className={classes.dataContainer}>
          {orderingData.length > 0 ? (
            <div className={classes.dataGrid}>
              <div className={classes.innerDataGrid}>
                {orderingData.map((ordering) => (
                  <OrderingCard
                    data={ordering}
                    onClickDetail={(id) => setDetailId(id)}
                    isBusiness={isBusiness}
                    key={ordering?.id}
                  />
                ))}
              </div>
            </div>
          ) : (
            <div className={classes.empty}>
              <h3>
                <FormattedMessage id="empty_data" />
              </h3>
            </div>
          )}
        </div>
      ) : (
        <OrderingDetail id={detailId} back={backBtn} isBusiness={isBusiness} />
      )}
    </div>
  );
};

Orderings.propTypes = {
  orderingData: PropTypes.array,
  userData: PropTypes.string,
};

const mapStateToProps = createStructuredSelector({
  orderingData: selectOrderingData,
  userData: selectUserData,
});

export default connect(mapStateToProps)(Orderings);
