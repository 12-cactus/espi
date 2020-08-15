require('dotenv').config();
const app = require('./src/server');

const { EXPRESS_PORT = 3000 } = process.env;

// Start
app.listen(EXPRESS_PORT, () => {
  // eslint-disable-next-line no-console
  console.log(`Running on ${EXPRESS_PORT}`);
});
