import { render, fireEvent } from '@testing-library/react';
import { Provider } from 'react-redux';
import RouterDom from 'react-router-dom';

import ProductCreation from '@pages/ProductCreation';
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

jest.mock('../../static/images/no_image.png', () => ({
  ...jest.requireActual(`../fixtures/no_image.png`),
}));

const ParentComponent = (children) => (
  <Provider store={store}>
    <Language>{children}</Language>
  </Provider>
);

describe('ProductCreation Page', () => {
  beforeEach(() => {});

  test('Rendered', () => {
    const { getByTestId } = render(ParentComponent(<ProductCreation />));
    const loginPage = getByTestId('productCreation-page');
    expect(loginPage).toBeInTheDocument();
  });

  //   test('Button Clicked', () => {
  //     const { getByTestId } = render(ParentComponent(<ProductCreation />));
  //     const buttonSubmit = getByTestId('save-button');
  //     expect(buttonSubmit).toBeInTheDocument();
  //     fireEvent.click(buttonSubmit);
  //   });
  //   test('Button Clicked', () => {
  //     const { getByTestId } = render(ParentComponent(<ProductCreation />));
  //     const buttonSubmit = getByTestId('delete-button');
  //     expect(buttonSubmit).toBeInTheDocument();
  //     fireEvent.click(buttonSubmit);
  //   });

  //   test('Button Clicked', () => {
  //     const { getByTestId } = render(ParentComponent(<ProductCreation />));
  //     const buttonSubmit = getByTestId('image-button');
  //     expect(buttonSubmit).toBeInTheDocument();
  //     fireEvent.click(buttonSubmit);
  //   });

  test('Should match with snapshot', () => {
    const loginPage = render(ParentComponent(<ProductCreation />));
    expect(loginPage).toMatchSnapshot();
  });
});
