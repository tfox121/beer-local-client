// import React from 'react';
// import Provider from 'react-redux';
// import ShallowRenderer from 'react-test-renderer/shallow';

// import App from '../index';

// import configureStore from '../../../configureStore';
// import history from '../../../utils/history';

// const initialState = {};
// const store = configureStore(initialState, history);

// const renderer = new ShallowRenderer();

// describe('<App />', () => {
//   it('should render and match the snapshot', () => {
//     renderer.render(<App />);
//     const renderedOutput = renderer.getRenderOutput();
//     expect(renderedOutput).toMatchSnapshot();
//   });
// });

describe('<App />', () => {
  // it('should render and match the snapshot', () => {
  //   renderer.render(
  //     <Provider store={store}>
  //       <App />
  //     </Provider>,
  //   );
  //   const renderedOutput = renderer.getRenderOutput();
  //   expect(renderedOutput).toMatchSnapshot();
  // });

  it('Expect to have unit tests specified', () => {
    expect(true).toEqual(true);
  });
});
