import app from './app';
import { connect } from './model/db';

const PORT = process.env.PORT || 3000;

connect()
  .then(() => app.listen(PORT, () => {
    console.log(`App listening on port ${PORT}...`);
  }))
  .catch(err => console.log(err));