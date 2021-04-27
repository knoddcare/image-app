import { fireEvent } from '@testing-library/dom';
import React from 'react';
import { render } from 'react-dom'
import { act } from 'react-dom/test-utils';
import { FileUploader } from './file-uploader.component';

jest.mock('./file-uploader.service');
const uploadService = require('./file-uploader.service');

const mockFile = new File(['test'], test.png, {type: 'image/png'})

let container = null;
beforeEach(() => {
  container = document.createElement('div');
  document.body.appendChild(container);
}) 

it('should show error header on failed upload', async () => {
  uploadService.uploadImage.mockImplementationOnce(() => {
    return new Promise((resolve, reject) => {
      reject('Test error');
    })
  });
  act(() => {
    render(<FileUploader></FileUploader>, container);
  });
  const nameInput = container.querySelector('#name-input');
  const fileInput = container.querySelector('#file-input');
  const sendBtn = container.querySelector('#send-btn');
  act(() => {  
    fireEvent.change(nameInput, {target: { value: 'test'}});
    fireEvent.change(fileInput, {target: { files: [mockFile]}});
  });
  await act( async() => {
    fireEvent.click(sendBtn);
  });

  const doneHeader = container.querySelector('.file-upload__card h3');
  expect(doneHeader.textContent).toContain('Something went wrong!');
});

it('should show success on completed upload', async () => {
  uploadService.uploadImage.mockImplementationOnce(() => {
    return new Promise((resolve, reject) => {
      resolve();
    })
  });
  act(() => {
    render(<FileUploader></FileUploader>, container);
  });
  const nameInput = container.querySelector('#name-input');
  const fileInput = container.querySelector('#file-input');
  const sendBtn = container.querySelector('#send-btn');
  act(() => {  
    fireEvent.change(nameInput, {target: { value: 'test'}});
    fireEvent.change(fileInput, {target: { files: [mockFile]}});
  });
  await act( async () => {
    fireEvent.click(sendBtn);
  });

  const doneHeader = container.querySelector('.file-upload__card h3');
  expect(doneHeader.textContent).toContain('Your image is uploaded!');
})