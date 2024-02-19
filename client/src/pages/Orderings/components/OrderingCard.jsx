import { useEffect, useState } from 'react';
import PropTypes from 'prop-types';
import { FormattedMessage } from 'react-intl';

import classes from '../style.module.scss';

const OrderingCard = ({ data, onClickDetail, isBusiness }) => {
  const [status, setStatus] = useState(null);

  useEffect(() => {
    if (data?.status) {
      switch (data?.status) {
        case 'WAITING':
          setStatus({
            text: <FormattedMessage id="status_waiting" />,
            color: 'yellow',
          });
          break;
        case 'FAILED':
          setStatus({
            text: <FormattedMessage id="status_failed" />,
            color: 'red',
          });
          break;
        case 'SUCCESS':
          setStatus({
            text: <FormattedMessage id="status_success" />,
            color: 'green',
          });
          break;
      }
    }
  }, [data]);

  return (
    <div className={classes.orderingCard} onClick={() => onClickDetail(data?.id)} data-testid="ordering-card-page">
      <img className={classes.cardImage} src={data?.imageUrl} alt="Img Failed" data-testid="ordering-card-page-img" />
      <div className={classes.cardContent}>
        <h4 className={classes.orderCode} data-testid="ordering-card-page-transaction-code">
          {data?.transactionCode}
        </h4>
        <h4 className={classes.title} data-testid="ordering-card-page-title">
          {data?.title}
        </h4>
        {isBusiness && (
          <p className={classes.customerName} data-testid="ordering-card-page-customer">
            {data?.customer}
          </p>
        )}
        <div className={classes.footer}>
          <div className={classes.statusContainer} data-item={status?.color}>
            <h5 className={classes.text}>{status?.text}</h5>
          </div>
        </div>
      </div>
    </div>
  );
};

OrderingCard.propTypes = {
  data: PropTypes.object.isRequired,
  onClickDetail: PropTypes.func.isRequired,
  isBusiness: PropTypes.bool,
};

export default OrderingCard;
