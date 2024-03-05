import { render, fireEvent } from '@testing-library/react';
import { Provider } from 'react-redux';
import RouterDom from 'react-router-dom';

import Orders from '@pages/Orders';
import store from '@store';
import Language from '@containers/Language';

jest.mock('../../static/images/auction.png');

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
  <RouterDom.BrowserRouter>
    <Provider store={store}>
      <Language>{children}</Language>
    </Provider>
  </RouterDom.BrowserRouter>
);

describe('Orders Page', () => {
  beforeEach(() => {});

  test('Rendered', () => {
    const { getByTestId } = render(ParentComponent(<Orders />));
    const page = getByTestId('orders-page');
    expect(page).toBeInTheDocument();
  });
});
