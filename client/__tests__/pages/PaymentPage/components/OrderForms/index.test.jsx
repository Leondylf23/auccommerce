import { render } from '@testing-library/react';
import { Provider } from 'react-redux';
// import RouterDom from 'react-router-dom';

import OrderForms from '@pages/PaymentPage/components/OrderForms';
import store from '@store';
import Language from '@containers/Language';

jest.mock('react-redux', () => ({
  ...jest.requireActual('react-redux'),
}));

jest.mock('react-router-dom', () => ({
  ...jest.requireActual('react-router-dom'),
  useNavigate: jest.fn(),
}));

jest.mock('reselect', () => ({
  ...jest.requireActual('reselect'),
}));

const ParentComponent = (children) => (
  <Provider store={store}>
    <Language>{children}</Language>
  </Provider>
);

// const navigate = jest.fn().mockName('navigate');

describe('Order Forms', () => {
  // beforeEach(() => {
  //     jest.spyOn(RouterDom, 'useNavigate').mockImplementation(() => navigate);
  // });

  test('Rendered', () => {
    const { getByTestId } = render(ParentComponent(<OrderForms />));
    const orderForms = getByTestId('payment-page-order-forms');
    expect(orderForms).toBeInTheDocument();
  });

  test('Should match with snapshot', () => {
    const orderForms = render(ParentComponent(<OrderForms />));
    expect(orderForms).toMatchSnapshot();
  });
});
