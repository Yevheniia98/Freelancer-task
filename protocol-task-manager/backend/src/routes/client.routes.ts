import express from 'express';
const router = express.Router();

router.get('/', (req, res) => {
  res.status(501).json({ message: 'Client routes not implemented' });
});

export default router;
