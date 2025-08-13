import express from 'express';
const router = express.Router();

router.get('/', (req, res) => {
  res.status(501).json({ message: 'Project routes not implemented' });
});

export default router;
