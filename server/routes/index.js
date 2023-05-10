import items from './items.js';
import auth from './auth.js';
import user from './user.js';
export const configRoutes = (app) => {
  console.log('in routes');
  app.use('/items', items);
  app.use('/user', user);
  app.use('/auth', auth);
  app.use('*', (req, res) => {
    res.status(404).json({ error: 'Not found' });
  });
};
