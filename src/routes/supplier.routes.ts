import { Router } from 'express';
import {
  deleteSupplier,
  listSupliers,
  registerSupplier,
  updateSuplier,
} from '../controller/supplier.controller';

const router = Router();

router.route('/').get(listSupliers).post(registerSupplier);

router.route('/:idsupplier_req').put(updateSuplier).delete(deleteSupplier);

export default router;
