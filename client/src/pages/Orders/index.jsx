import PropTypes from 'prop-types';
import { connect, useDispatch } from 'react-redux';
import { createStructuredSelector } from 'reselect';
import { useEffect, useState } from 'react';
import { FormattedMessage } from 'react-intl';
import { useLocation } from 'react-router-dom';

import PopupWindow from '@components/PopupWindow/Dialog';
import EmptyContainer from './components/EmptyContainer';
import { selectOrderList } from './selectors';
import { getOrders } from './actions';
import TransactionCard from './components/TransactionCard';
import DetailPopup from './components/DetailPopup';

import classes from './style.module.scss';

const Orders = ({ ordersData }) => {
  const dispatch = useDispatch();

  const [nextIndex, setNextIndex] = useState(null);
  const [isLoading, setIsLoading] = useState(false);
  const [detailId, setDetailId] = useState(null);

  const fetchData = (isReset) => {
    dispatch(
      getOrders(
        { nextId: nextIndex },
        isReset,
        (nextIdData) => {
          setIsLoading(false);
          setNextIndex(nextIdData);
        },
        (err) => {
          setIsLoading(false);
        }
      )
    );
  };

  const onClosePopup = (isResetData) => {
    setDetailId(null);
  };

  useEffect(() => {
    fetchData(true);
  }, []);

  return (
    <div className={classes.mainContainer}>
      <PopupWindow open={Boolean(detailId)} onClose={onClosePopup}>
        <DetailPopup id={detailId} onClose={onClosePopup} />
      </PopupWindow>
      <h1 className={classes.pageTitle}>
        <FormattedMessage id="orders_page_title" />
      </h1>
      <div className={classes.listTransactionItemContainer}>
        {ordersData?.length > 0 ? (
          <div className={classes.listTransaction}>
            {ordersData?.map((transaction) => (
              <TransactionCard
                data={transaction}
                setDetailId={() => setDetailId(transaction?.id)}
                refresh={() => fetchData(true)}
                key={transaction?.id}
              />
            ))}
          </div>
        ) : (
          <EmptyContainer />
        )}
        {isLoading && (
          <div className={classes.loadingContainer}>
            <p className={classes.text}>
              <FormattedMessage id="loading" />
            </p>
          </div>
        )}
        {nextIndex && (
          <div className={classes.loadMoreContainer}>
            <button type="button" className={classes.button} onClick={() => fetchData(false)}>
              <FormattedMessage id="load_more" />
            </button>
          </div>
        )}
      </div>
    </div>
  );
};

Orders.propTypes = {
  ordersData: PropTypes.array,
};

const mapStateToProps = createStructuredSelector({
  ordersData: selectOrderList,
});

export default connect(mapStateToProps)(Orders);
