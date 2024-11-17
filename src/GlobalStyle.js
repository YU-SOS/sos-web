import { createGlobalStyle } from "styled-components";

const GlobalStyle = createGlobalStyle`
    :root {
        --border : #d1d1d1;
        --font-grey : #aaa;
        --main-color : #F02727;
    }

    body {
        font-family : "Pretendard Variable";
        height : 100%;
        width : 100%;
    }
`;

export default GlobalStyle;