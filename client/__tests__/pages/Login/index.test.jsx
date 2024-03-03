import { render, fireEvent } from '@testing-library/react';
import { Provider } from 'react-redux';
import RouterDom from 'react-router-dom';

import Login from '@pages/Login';
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

describe('Login Page', () => {
  beforeEach(() => {});

  test('Rendered', () => {
    const { getByTestId } = render(ParentComponent(<Login />));
    const loginPage = getByTestId('login-page');
    expect(loginPage).toBeInTheDocument();
  });

  test('Should match with snapshot', () => {
    const loginPage = render(ParentComponent(<Login />));
    expect(loginPage).toMatchSnapshot();
  });
});
