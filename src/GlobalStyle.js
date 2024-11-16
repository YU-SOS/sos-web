import { createGlobalStyle } from "styled-components";

const GlobalStyle = createGlobalStyle`
    :root {
        --border : #d1d1d1;
        --font-grey : #aaa;
    }

    body {
        font-family : "Pretendard Variable";
    }
`;

export default GlobalStyle;