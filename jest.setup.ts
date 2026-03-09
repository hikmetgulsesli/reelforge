import "@testing-library/jest-dom";

// Polyfills for Prisma Client in Jest
import { TextEncoder, TextDecoder } from "util";

global.TextEncoder = TextEncoder;
global.TextDecoder = TextDecoder as typeof global.TextDecoder;
