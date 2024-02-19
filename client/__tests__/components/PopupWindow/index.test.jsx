import { render, fireEvent, queryByTestId } from '@testing-library/react';
import { Provider } from 'react-redux';

import PopupWindow from '@components/PopupWindow/Dialog';
import store from '@store';
import Language from '@containers/Language';

jest.mock('react-redux', () => ({
    ...jest.requireActual('react-redux')
}));

jest.mock('reselect', () => ({
    ...jest.requireActual('reselect')
}));

const ParentComponent = (children) => (
    <Provider store={store}>
        <Language>
            {children}
        </Language>
    </Provider>
);


describe('PopupWindow Component', () => {
    test('Rendered', () => {
        const { getByTestId } = render(ParentComponent(
            <PopupWindow open />
        ));
        const popupWindowComponent = getByTestId('popup-window');
        expect(popupWindowComponent).toBeInTheDocument();
    });

    test('Rendered child', () => {
        const testData = (<div data-testid='test-data'></div>);
        const { getByTestId } = render(ParentComponent(
            <PopupWindow open>
                {testData}
            </PopupWindow >
        ));

        expect(getByTestId('test-data')).toBeInTheDocument();
    });

    test('Not rendered when value open is false', () => {
        const { getByTestId } = render(ParentComponent(
            <PopupWindow open />
        ));
        const popupWindowComponent = getByTestId('popup-window');
        expect(popupWindowComponent).toBeInTheDocument();
    });
});
