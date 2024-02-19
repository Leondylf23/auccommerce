import { render, fireEvent } from '@testing-library/react';
import { Provider } from 'react-redux';
import RouterDom from 'react-router-dom';

import Register from '@pages/Register';
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

describe('Register Page', () => {
  beforeEach(() => {});

  test('Rendered', () => {
    const { getByTestId } = render(ParentComponent(<Register />));
    const loginPage = getByTestId('register-page');
    expect(loginPage).toBeInTheDocument();
  });

  //Register
  test('Button Clicked', () => {
    const { getByTestId } = render(ParentComponent(<Register />));
    const buttonSubmit = getByTestId('register-button-submit');
    expect(buttonSubmit).toBeInTheDocument();
    fireEvent.click(buttonSubmit);
  });

  test('Button Clicked', () => {
    const { getByTestId } = render(ParentComponent(<Register />));
    const buttonSubmit = getByTestId('login-button');
    expect(buttonSubmit).toBeInTheDocument();
    fireEvent.click(buttonSubmit);
  });

  test('Should match with snapshot', () => {
    const loginPage = render(ParentComponent(<Register />));
    expect(loginPage).toMatchSnapshot();
  });
});
