import React from 'react';
import { render, screen, fireEvent } from '@testing-library/react';
import Playback from './Playback';

describe('Playback component', () => {
    test('renders Playback component', () => {
        const { container } = render(<Playback />);
        expect(container.firstChild).toMatchSnapshot();
    });

    test('change input and form submission', () => {
        render(<Playback />);
        const urlInput = screen.getByTestId('tmpUrl-test') as HTMLInputElement;
        const url = 'testURL';
        fireEvent.change(urlInput, { target: { value: url } });
        expect(urlInput.value).toEqual(url);
        const form = screen.getByTestId('form') as HTMLFormElement;
        fireEvent.click(screen.getByText("Retrieve Video"));
        expect(urlInput.value).toEqual('');
    });

    test('video retrieval', () => {

    })
});