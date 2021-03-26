import { css } from 'linaria'

// export javascript colours for the SVG background in the button
export const intentPrimary = '#006580'
export const intentSecondary = '#23a4de'
export const intentCritical = '#ffb71b'
export const intentSuccess = '#a0c862'
export const intentDanger = '#d3033d'

export const elVariables = css`
  :global() {
    :root {
      /* color variables */
      --color-white: #fff;
      --color-black: #3b454e;
      --color-black-light: #363636;
      --color-grey: #74818d;
      --color-grey-light: #dbdbdb;
      --color-grey-lightest: #f5f7f9;
      --color-green: #a0c862;
      --color-green-lighter: #acf2bd;
      --color-green-lightest: #e6ffed;
      --color-red: #d3033d;
      --color-red-lighter: #fdb8c0;
      --color-red-lightest: #ffeef0;
      --color-blue: #0061a8;
      --color-blue-dark: #262f69;
      --color-blue-darkest: #1e2554;
      --color-blue-light: #23a4de;
      --color-blue-lightest: #7bc9eb;
      --color-orange: #ec631b;
      --color-lime: #cddb00;
      --color-teal: #006580;
      --color-plumb: #7a2c81;
      --color-purple: #a4185c;
      --color-gold: #ffb71b;

      /** intent variables */
      --intent-primary: var(--color-teal);
      --intent-secondary: var(--color-blue-light);
      --intent-critical: var(--color-gold);
      --intent-success: var(--color-green);
      --intent-danger: var(--color-red);

      --intent-primary-text: var(--color-white);
      --intent-secondary-text: var(--color-white);
      --intent-critical-text: var(--color-white);
      --intent-success-text: var(--color-white);
      --intent-danger-text: var(--color-white);

      /** font variables */
      --font-sans-serif: 'PT Sans', Helvetica, Arial, sans-serif;
      --font-monospace: 'Source Code Pro', monospace;

      /** font size variables */
      --font-size-heading-main: 2rem;
      --font-size-subheading-main: 1.8rem;
      --font-size-heading-secondary: 1.5rem;
      --font-size-subHeading-secondary: 1.2rem;
      --font-size-default: 1rem;
      --font-size-small: 0.8rem;

      /** layout size */
      --layout-size-base: 1rem;
      --layout-size-1_2: 0.5rem;
      --layout-size-1_4: 0.25rem;
      --layout-size-3_4: 0.75rem;
      --layout-size-1_3: calc(1rem / 3);
      --layout-size-2_3: calc(2rem / 3);
      --layout-size-2: 2rem;
      --layout-size-3: 3rem;

      /** other defaults */
      --default-border-radius: 0.25rem;
    }
  }
`
