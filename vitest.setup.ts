import "@testing-library/jest-dom";

// jsdom does not implement canvas; return null so components that guard on a
// missing 2D context early-return quietly instead of logging a "Not
// implemented" warning on every run. No test needs real canvas drawing.
HTMLCanvasElement.prototype.getContext = () => null;
