// Root wrapper for PaaS platforms (Render) that run `node index.js` from project root.
// This file simply requires the backend entrypoint so the server starts as expected.
try {
  require('./backend/src/index.js');
} catch (err) {
  // If requiring the backend fails, log full error and rethrow so PaaS shows the error in logs.
  console.error('Failed to start backend from root index.js', err);
  throw err;
}
