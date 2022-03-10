import express, { Application } from 'express';
import morgan from 'morgan';

// Routes
import UserRoutes from './routes/user.routes';
import SupplierRoutes from './routes/supplier.routes';
import SalesProductsRoutes from './routes/saleproducts.routes';
import { TokenValidation } from './libs/validationToken';

export default class App {
  app: Application;

  constructor(private port?: number) {
    this.app = express();
    this.settings();
    this.middlewares();
    this.routes();
  }

  private settings() {
    this.app.set('port', this.port);
  }

  private middlewares() {
    this.app.use(morgan('dev'));
    this.app.use(express.json());
  }

  private routes() {
    this.app.use('/user', UserRoutes);
    this.app.use('/supplier', TokenValidation, SupplierRoutes);
    this.app.use('/saleproducts', TokenValidation, SalesProductsRoutes);
    this.app.use((req, res) => {
      res.status(404).json({
        message: 'Not Found',
        code: 404,
        data: null,
      });
    });
  }

  async listen(): Promise<void> {
    this.app.listen(this.app.get('port'));
    console.log('Server on port', this.app.get('port'));
  }
}
