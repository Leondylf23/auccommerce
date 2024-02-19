import _ from 'lodash';
import { render } from '@testing-library/react';
import { Provider } from 'react-redux';

import store from '@store';
import Language from '@containers/Language';
import { MemoryRouter } from 'react-router-dom';

import BestSellerCard from '../../../src/components/BestSellerCard/index';
import MockBestSeller from '../../database/bestSeller.json';

let mockBestSeller;

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

describe('Best Seller Card', () => {
  beforeEach(() => {
    mockBestSeller = _.cloneDeep(MockBestSeller);
  });

  test('Correct Render', () => {
    const bestSellerCard = render(ParentComponent(<BestSellerCard data={mockBestSeller} />));
    expect(bestSellerCard.getByTestId('bestSellerCard-container')).toBeInTheDocument();
    expect(bestSellerCard.getByTestId('bestSellerCard-container')).toHaveClass('container');

    expect(bestSellerCard).toMatchSnapshot();
  });
});
