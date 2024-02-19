import { render } from '@testing-library/react';
import { Provider } from 'react-redux';
// import RouterDom from 'react-router-dom';

import OrderingCard from '@pages/Orderings/components/OrderingCard';
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

describe('Ordering Card', () => {
  // beforeEach(() => {
  //     jest.spyOn(RouterDom, 'useNavigate').mockImplementation(() => navigate);
  // });

  test('Rendered', () => {
    const { getByTestId } = render(ParentComponent(<OrderingCard />));
    const orderingCard = getByTestId('ordering-card-page');
    expect(orderingCard).toBeInTheDocument();
  });

  test('Rendered with correct value if role is customer', () => {
    const testData = {
      imageUrl: 'url://test-image/cust',
      transactionCode: 'trx/data-test/00-00-00/cust',
      title: 'test data customer',
    };

    const { getByTestId } = render(ParentComponent(<OrderingCard data={testData} />));

    const imageElement = getByTestId('ordering-card-page-img');
    expect(imageElement.src).toBe(testData?.imageUrl);

    const transactionCode = getByTestId('ordering-card-page-transaction-code');
    expect(transactionCode.textContent).toBe(testData?.transactionCode);

    const title = getByTestId('ordering-card-page-title');
    expect(title.textContent).toBe(testData?.title);
  });

  test('Rendered with correct value if role is business', () => {
    const testData = {
      imageUrl: 'url://test-image/business',
      transactionCode: 'trx/data-test/00-00-00/business',
      title: 'test data business',
      customer: 'customer business test',
    };

    const { getByTestId } = render(ParentComponent(<OrderingCard data={testData} isBusiness />));

    const imageElement = getByTestId('ordering-card-page-img');
    expect(imageElement.src).toBe(testData?.imageUrl);

    const transactionCode = getByTestId('ordering-card-page-transaction-code');
    expect(transactionCode.textContent).toBe(testData?.transactionCode);

    const title = getByTestId('ordering-card-page-title');
    expect(title.textContent).toBe(testData?.title);

    const customer = getByTestId('ordering-card-page-customer');
    expect(customer.textContent).toBe(testData?.customer);
  });

  test('Should match with snapshot', () => {
    const orderingCard = render(ParentComponent(<OrderingCard />));
    expect(orderingCard).toMatchSnapshot();
  });
});
