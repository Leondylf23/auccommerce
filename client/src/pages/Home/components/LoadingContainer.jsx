import { FormattedMessage } from 'react-intl';

import classes from '../style.module.scss';

const LoadingContainer = () => (
  <div className={classes.loadingContainer}>
    <h2 className={classes.text}>
      <FormattedMessage id="loading" />
    </h2>
  </div>
);

export default LoadingContainer;
