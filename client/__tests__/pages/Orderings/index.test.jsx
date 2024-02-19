import { render } from '@testing-library/react';
import { Provider } from 'react-redux';
// import RouterDom from 'react-router-dom';

import Orderings from '@pages/Orderings';
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

describe('Orderings Page', () => {
  // beforeEach(() => {
  //     jest.spyOn(RouterDom, 'useNavigate').mockImplementation(() => navigate);
  // });

  test('Rendered', () => {
    const { getByTestId } = render(ParentComponent(<Orderings />));
    const orderingsPage = getByTestId('orderings-page');
    expect(orderingsPage).toBeInTheDocument();
  });

  test('Should match with snapshot', () => {
    const orderingsPage = render(ParentComponent(<Orderings />));
    expect(orderingsPage).toMatchSnapshot();
  });
});
