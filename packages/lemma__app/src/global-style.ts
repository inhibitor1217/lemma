import {
  createGlobalStyle,
} from '@channel.io/bezier-react';

const GlobalStyle = createGlobalStyle`
  * {
    box-sizing: border-box;
  }

  html,
  body {
    width: 100vw;
    height: 100vh;
    margin: 0;
    padding: 0;
    overflow: hidden;
  }

  body {
    font-family: 'Noto Sans', 'Noto Sans KR', 'Noto Sans JP', sans-serif;
  }

  #root {
    width: 100%;
    height: 100%;
  }

  h1,
  h2,
  h3,
  h4,
  h5,
  h6,
  p {
    margin: 0;
  }

  a,
  a:hover,
  a:link {
    text-decoration: none;
  }
`

export default GlobalStyle;
