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

  //Login
  test('Button Clicked Login', () => {
    const { getByTestId } = render(ParentComponent(<Login />));
    const buttonSubmit = getByTestId('login-button-submit');
    expect(buttonSubmit).toBeInTheDocument();
    fireEvent.click(buttonSubmit);
  });

  test('Button Clicked Register', () => {
    const { getByTestId } = render(ParentComponent(<Login />));
    const buttonSubmit = getByTestId('register-button');
    expect(buttonSubmit).toBeInTheDocument();
    fireEvent.click(buttonSubmit);
  });

  test('Button Clicked Forgot Password', () => {
    const { getByTestId, queryByTestId } = render(ParentComponent(<Login />));
    const buttonSubmit = getByTestId('forgot-pass-button');
    expect(buttonSubmit).toBeInTheDocument();
    fireEvent.click(buttonSubmit);
    const forgotPassPage = queryByTestId('forgot-pass-page');
    expect(forgotPassPage).toBeInTheDocument();
  });

  //Forget Password
  //   test('Button Clicked', () => {
  //     const { getByTestId } = render(ParentComponent(<Login />));
  //     const buttonSubmit = getByTestId('forgot-password-submit');
  //     expect(buttonSubmit).toBeInTheDocument();
  //     fireEvent.click(buttonSubmit);
  //   });

  //   test('Button Clicked', () => {
  //     const { getByTestId } = render(ParentComponent(<Login />));
  //     const buttonSubmit = getByTestId('forgot-password-back');
  //     expect(buttonSubmit).toBeInTheDocument();
  //     fireEvent.click(buttonSubmit);
  //   });

  //   test('Button Clicked', () => {
  //     const { getByTestId } = render(ParentComponent(<Login />));
  //     const buttonSubmit = getByTestId('forgot-password-copy');
  //     expect(buttonSubmit).toBeInTheDocument();
  //     fireEvent.click(buttonSubmit);
  //   });

  test('Should match with snapshot', () => {
    const loginPage = render(ParentComponent(<Login />));
    expect(loginPage).toMatchSnapshot();
  });
});
