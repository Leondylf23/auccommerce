import { fireEvent, render } from '@testing-library/react';
import { Provider } from 'react-redux';
import Profile from '@pages/Profile';

import store from '@store';
import Language from '@containers/Language';
import { MemoryRouter } from 'react-router-dom';

const ParentComponent = (children) => (
  <Provider store={store}>
    <Language>
      <MemoryRouter>{children}</MemoryRouter>
    </Language>
  </Provider>
);

describe('Profile Page', () => {
  beforeEach(() => {});

  test('Correct Render', () => {
    const profile = render(ParentComponent(<Profile />));
    expect(profile.getByTestId('profile-container')).toBeInTheDocument();
    expect(profile.getByTestId('profile-container')).toHaveClass('mainContainer');

    expect(profile).toMatchSnapshot();
  });

  test('Button Clicked', () => {
    const { queryByTestId } = render(ParentComponent(<Profile />));
    const buttonSubmit = queryByTestId('profile-button-submit');
    expect(buttonSubmit).toBeInTheDocument();
    fireEvent.click(buttonSubmit);
  });
});
