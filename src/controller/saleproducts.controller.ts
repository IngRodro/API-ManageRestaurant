import { Request, Response } from 'express'
// DB
import { connect } from '../database'
import { Categorias } from '../interfaces/Categorias';
// Interfaces
import { SaleProducts } from '../interfaces/SaleProducts'

export async function listSaleProducts(req: Request, res: Response): Promise<Response | void> {
    try {
        const conn = await connect();
        const query: string = 'SELECT * from SaleProducts JOIN Categorias ON SaleProducts.idCategoria = Categorias.idCategoria where stateCategory != 0 and stateProduct != 0';
        const call = await conn.query(query);
        let saleProducts: any[] = JSON.parse(JSON.stringify(call[0]));
        const saleProductsCategory = saleProducts.map(saleProduct =>{
            return {
                idSaleProduct: saleProduct.idSaleProduct,
                nameProduct: saleProduct.nameProduct,
                price: saleProduct.price,
                idCategoria: {
                    idCategoria: saleProduct.idCategoria,
                    nameCategory: saleProduct.nameCategory,
                    stateCategory: saleProduct.stateCategory
                },
                stateProduct: saleProduct.stateProduct
            };
        })
        res.json(saleProductsCategory);
    }
    catch (e: any) {
        res.status(500).json({
            message: "Internal server error",
            code: 500,
            errors: e?.response?.data || e?.message || null,
            data: null,
        });
    } 
}