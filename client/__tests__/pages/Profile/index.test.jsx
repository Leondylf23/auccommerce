import { fireEvent, render } from '@testing-library/react';
import { Provider } from 'react-redux';
import Profile from '@pages/Profile';
import RouterDom from 'react-router-dom';

import store from '@store';
import Language from '@containers/Language';

const ParentComponent = (children) => (
  <RouterDom.BrowserRouter>
    <Provider store={store}>
      <Language>{children}</Language>
    </Provider>
  </RouterDom.BrowserRouter>
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
