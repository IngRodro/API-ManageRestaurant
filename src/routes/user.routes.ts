import { Router } from 'express'
import { getPosts } from '../controller/user.controller'

const router = Router();
//Ruta Login.
router.route('/')
    .get(getPosts);

export default router;