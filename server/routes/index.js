// import items from './items';
import auth from './auth.js';
export const configRoutes = (app) => {
  console.log('in routes');
  //   app.use('/items', items);
  app.use('/auth', auth);
  app.use('*', (req, res) => {
    res.status(404).json({ error: 'Not found' });
  });
};
