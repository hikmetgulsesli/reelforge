// @ts-check

// TextEncoder/TextDecoder polyfill for Node.js environment
import { TextEncoder, TextDecoder } from "util";

globalThis.TextEncoder = TextEncoder as typeof globalThis.TextEncoder;
// @ts-expect-error - TextDecoder types mismatch
globalThis.TextDecoder = TextDecoder;

import "@testing-library/jest-dom";