import './index.css';

declare global {
  namespace React {
    interface CSSProperties {
      [key: string]: any;
    }
  }
}