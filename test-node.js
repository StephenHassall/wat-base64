import Base64Node from "./base64-node.js";
import Test from "./test.js";

// Create base64 node object
const base64 = new Base64Node();

// Load the instance
await base64.load();

// Perform the tests
Test.run(base64);
