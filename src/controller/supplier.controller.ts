import { Request, Response } from 'express'
// DB
import { connect } from '../database'
// Interfaces
import { Supllier } from '../interfaces/Supplier'

export async function listSupliers(req: Request, res: Response): Promise<Response | void> {
    try {
        const conn = await connect();
        const query: string = 'SELECT * from suppliers';
        const call = await conn.query(query);
        const suppliersstring = JSON.stringify(call[0]);
        let suppliersjson: Supllier[] = JSON.parse(suppliersstring);
        res.json(suppliersjson)
    }
    catch (e) {
        console.log(e)
    } 
}

export async function registerSupplier(req:Request, res: Response): Promise<Response | void> {
    try{
        const supplier: Supllier = req.body; 
        const conn = await connect();
        const query: string = 'Insert into suppliers(name, location, number, email, state) values (?,?,?,?,?)';
        const values: any[] = [
            supplier.name,
            supplier.location,
            supplier.number,
            supplier.email,
            supplier.state
        ];
        await conn.query(query, values);
        res.json({status: 'saved'})
    }catch(e){
        console.log(e);
    }
}

export async function updateSuplier(req: Request, res :Response): Promise<Response | void> {
    try{
        const idSupplier: number = parseInt(req.params.idsupplier_req);
        const supplier: Supllier = req.body;
        const conn = await connect();
        const query: string = 'Update suppliers set name = ?, location = ?, number = ?, email = ?, state = ? where idSupplier = ?';
        const values: any[] = [
            supplier.name,
            supplier.location,
            supplier.number,
            supplier.email,
            supplier.state,
            idSupplier
        ];
        await conn.query(query, values);
        return res.json({status: 'Supplier Updated'})
    }catch(e){
        console.log(e)
    }
}

export async function deleteSupplier(req: Request, res: Response): Promise<Response | void> {
    const idSupplier: number = parseInt(req.params.idsupplier_req);
    const conn = await connect();
    const query: string = `Delete from suppliers where idSupplier = ${idSupplier}`
    await conn.query(query);
    return res.json({status: 'Supplier Deleted'});
}