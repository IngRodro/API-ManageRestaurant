import { Router } from 'express';
import { listSaleProducts } from '../controller/saleproducts.controller';

const router = Router();

router.route('/').get(listSaleProducts);

export default router;
