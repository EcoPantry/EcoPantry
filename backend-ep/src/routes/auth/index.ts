import { Router } from 'express';
import {
  signupInitiate,
  signupVerify,
  login,
  logout,
} from '../../controllers/auth.controllers';

const router = Router();

router.post('/signup/initiate', signupInitiate);
router.post('/signup/verify', signupVerify);
router.post('/login', login);
router.post('/logout', logout);

export default router;
