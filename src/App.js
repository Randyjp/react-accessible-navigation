import React from 'react';
import './App.css';
import ReactMenu from './menu';

function App() {
  return (
    <div className="App">
      <ReactMenu
        menuItems={[
          {
            id: 1,
            name: 'Google',
            url: 'https://google.com/',
          },
          {
            id: 2,
            name: 'Facebook',
            url: 'https://Facebook.com/',
          },
          {
            id: 3,
            name: 'Apple',
            url: 'https://Apple.com/',
          },
        ]}
        region={{ name: 'NYC', id: 1 }}
        onChangeHandler={() => {}}
      />
    </div>
  );
}

export default App;
