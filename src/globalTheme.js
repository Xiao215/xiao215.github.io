import { createGlobalStyle } from "styled-components";

export default createGlobalStyle` * {
    -webkit-font-smoothing: antialiased;
    -moz-osx-font-smoothing: grayscale;
}

*,
*::before,
*::after {
    box-sizing: border-box;
}

html {
    height: -webkit-fill-available;
}

#root,
body {
    height: 100%;
    min-height: 100vh;
    min-height: -webkit-fill-available;
    /* mobile viewport bug fix */
}



;
overflow-y: auto;
overflow-x: auto;
scroll-behavior: smooth;
transition: all 0.45s ease;
}


button {
    padding: 0;
    border: 0;
    -webkit-appearance: none;
    -webkit-tap-highlight-color: rgba(0, 0, 0, 0);
}
`;
