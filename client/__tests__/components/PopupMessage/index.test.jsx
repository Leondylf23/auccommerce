import { render } from '@testing-library/react';
import { Provider } from 'react-redux';

import PopupMessage from '@components/PopupMessage/Dialog';
import store from '@store';
import Language from '@containers/Language';

jest.mock('react-redux', () => ({
  ...jest.requireActual('react-redux'),
}));

jest.mock('reselect', () => ({
  ...jest.requireActual('reselect'),
}));

const ParentComponent = (children) => (
  <Provider store={store}>
    <Language>{children}</Language>
  </Provider>
);

describe('PopupMessage Component', () => {
  test('Rendered', () => {
    const { getByTestId } = render(ParentComponent(<PopupMessage />));
    const popupMessageComponent = getByTestId('popup-message');
    expect(popupMessageComponent).toBeInTheDocument();
  });

  test('Title & Message', () => {
    const title = 'Test Title';
    const message = 'Test Message';
    const { getByTestId } = render(ParentComponent(<PopupMessage open title={title} message={message} />));

    expect(getByTestId('popup-message-title').textContent).toBe(title);
    expect(getByTestId('popup-message-msg').textContent).toBe(message);
  });

  test('use default msg and title', () => {
    const { getByTestId } = render(ParentComponent(<PopupMessage open />));
    const defaultTitle = getByTestId('popup-message-title').textContent;
    const defaultMessage = getByTestId('popup-message-msg').textContent;

    expect(defaultTitle).toBe('Terjadi kesalahan!');
    expect(defaultMessage).toBe('Maaf, telah terjadi kesalahan. Silakan coba beberapa saat lagi');
  });

  test('Should match with snapshot', () => {
    const popupMessageComponent = render(ParentComponent(<PopupMessage />));
    expect(popupMessageComponent).toMatchSnapshot();
  });
});
