import { Router } from 'express'
import { deleteUser, loginUser, registerUser, updateUser, updateUsername } from '../controller/user.controller'

const router = Router();

router.route('/')
    .get(loginUser)
    .post(registerUser)
    .put(updateUser);

router.route('/:username_req')
    .delete(deleteUser)
    .put(updateUsername);

export default router;