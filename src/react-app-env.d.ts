/// <reference types="react-scripts" />
// eslint-disable-next-line no-unused-vars
import React from 'react';

declare global {
    namespace React {
        interface CSSProperties {
            '--rotation'?: string;  // Add your custom CSS property here
        }
    }
}