import { Categories } from './Categories';

export interface SaleProducts {
  idSaleProduct?: number;
  nameProduct: string;
  price: number;
  idCategory: Categories;
  stateSaleProduct: number;
}
