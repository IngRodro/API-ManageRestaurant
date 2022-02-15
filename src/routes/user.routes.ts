import { Router } from 'express'
import { loginUser, registerUser, updateUser } from '../controller/user.controller'

const router = Router();

router.route('/')
    .get(loginUser)
    .post(registerUser)
    .put(updateUser);

export default router;