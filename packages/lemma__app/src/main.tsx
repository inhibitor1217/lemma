import React from 'react';
import ReactDOM from 'react-dom/client';

function main() {
  ReactDOM.createRoot(document.getElementById('root') as HTMLElement)
    .render(
      <React.StrictMode>
        <div />
      </React.StrictMode>
    );
}

main();
