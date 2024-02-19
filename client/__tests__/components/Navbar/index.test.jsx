import { fireEvent, render } from '@testing-library/react';
import { Provider } from 'react-redux';

import Navbar from '@components/Navbar';
import store from '@store';
import Language from '@containers/Language';

const ParentComponent = (children) => (
  <Provider store={store}>
    <Language>{children}</Language>
  </Provider>
);

jest.mock('react-redux', () => ({
  ...jest.requireActual('react-redux'),
}));

jest.mock('react-router-dom', () => ({
  useNavigate: jest.fn(),
}));

jest.mock('reselect', () => ({
  ...jest.requireActual('reselect'),
}));

describe('Navbar Component', () => {
  beforeEach(() => {});

  test('Correct render', () => {
    const navbar = render(ParentComponent(<Navbar title="Title" />));
    expect(navbar.getByTestId('navbar')).toBeInTheDocument();
  });

  test('Button profile clicked', () => {
    const navbar = render(ParentComponent(<Navbar title="Title" isUserLoginedTest />));

    const profileBtn = navbar.getByTestId('nav-profile-btn');
    fireEvent.click(profileBtn);

    expect(navbar.queryByTestId('nav-dropdown')).toBeInTheDocument();
  });

  test('Should match with snapshot', () => {
    const navbar = render(ParentComponent(<Navbar title="Title" />));
    expect(navbar).toMatchSnapshot();
  });
});
