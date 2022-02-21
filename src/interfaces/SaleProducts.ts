import { Categorias } from "./Categorias";

export interface SaleProducts {
    idSaleProduct?: number;
    nameProduct: string;
    price: number;
    idCategoria: Categorias;
    stateProduct: number;
}