import { render } from '@testing-library/react';
import { Provider } from 'react-redux';
// import RouterDom from 'react-router-dom';

import OrderingDetail from '@pages/Orderings/components/OrderingDetail';
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

describe('Ordering Detail Page', () => {
  // beforeEach(() => {
  //     jest.spyOn(RouterDom, 'useNavigate').mockImplementation(() => navigate);
  // });

  test('Rendered', () => {
    const { getByTestId } = render(ParentComponent(<OrderingDetail />));
    const oerderingDetail = getByTestId('ordering-detail-page');
    expect(oerderingDetail).toBeInTheDocument();
  });

  test('Should match with snapshot', () => {
    const oerderingDetail = render(ParentComponent(<OrderingDetail />));
    expect(oerderingDetail).toMatchSnapshot();
  });
});
