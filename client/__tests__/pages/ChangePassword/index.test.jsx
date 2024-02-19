import { fireEvent, render } from '@testing-library/react';
import { Provider } from 'react-redux';

import store from '@store';
import Language from '@containers/Language';
import { MemoryRouter } from 'react-router-dom';
import ChangePassword from '@pages/ChangePassword';

jest.mock('react-redux', () => ({
  ...jest.requireActual('react-redux'),
}));

const ParentComponent = (children) => (
  <Provider store={store}>
    <Language>
      <MemoryRouter>{children}</MemoryRouter>
    </Language>
  </Provider>
);

describe('Change Password Page', () => {
  beforeEach(() => {});

  test('Correct Render', () => {
    const changePassword = render(ParentComponent(<ChangePassword />));
    expect(changePassword.getByTestId('changePassword-container')).toBeInTheDocument();
    expect(changePassword).toMatchSnapshot();
  });

  test('Button Clicked', () => {
    const { getByTestId } = render(ParentComponent(<ChangePassword />));
    const buttonSubmit = getByTestId('changePassword-btn');
    expect(buttonSubmit).toBeInTheDocument();
    fireEvent.click(buttonSubmit);
  });
});
