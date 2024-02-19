import { render } from '@testing-library/react';
import { Provider } from 'react-redux';
// import RouterDom from 'react-router-dom';

import DropdownMenu from '@components/Navbar/components/DropdownMenu';
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

describe('Dropdown Menu', () => {
  // beforeEach(() => {
  //     jest.spyOn(RouterDom, 'useNavigate').mockImplementation(() => navigate);
  // });

  test('Rendered', () => {
    const { getByTestId } = render(ParentComponent(<DropdownMenu />));
    const dropdownMenu = getByTestId('nav-dropdown');
    expect(dropdownMenu).toBeInTheDocument();
  });

  test('Should match with snapshot', () => {
    const dropdownMenu = render(ParentComponent(<DropdownMenu />));
    expect(dropdownMenu).toMatchSnapshot();
  });
});
