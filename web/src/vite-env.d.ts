/// <reference types="vite/client" />
/// <reference types="react" />
/// <reference types="react-dom" />
/// <reference types="react/jsx-runtime" />

// Ensure React types are loaded
import 'react';
import 'react-dom';
import 'react/jsx-runtime';

// Explicitly declare JSX namespace to ensure IntrinsicElements are available
declare global {
  namespace JSX {
    interface IntrinsicElements extends React.JSX.IntrinsicElements {}
  }
}