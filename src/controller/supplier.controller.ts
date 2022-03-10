import { Request, Response } from 'express';
// DB
import connect from '../database';
// Interfaces
import { Supllier } from '../interfaces/Supplier';

export async function listSupliers(
  req: Request,
  res: Response
): Promise<Response | void> {
  try {
    const conn = await connect();
    const query: string = 'SELECT * from suppliers where state != 0';
    const call = await conn.query(query);
    res.json(call[0]);
  } catch (e: any) {
    res.status(500).json({
      message: 'Internal server error',
      code: 500,
      errors: e?.response?.data || e?.message || null,
      data: null,
    });
  }
}

export async function registerSupplier(
  req: Request,
  res: Response
): Promise<Response | void> {
  try {
    const supplier: Supllier = req.body;
    const conn = await connect();
    const query: string =
      'Insert into suppliers(name, location, number, email, state) values (?,?,?,?,?)';
    const values: any[] = [
      supplier.name,
      supplier.location,
      supplier.number,
      supplier.email,
      supplier.state,
    ];
    await conn.query(query, values);
    res.json({ status: 'saved' });
  } catch (e: any) {
    res.status(500).json({
      message: 'Internal server error',
      code: 500,
      errors: e?.response?.data || e?.message || null,
      data: null,
    });
  }
}

export async function updateSuplier(
  req: Request,
  res: Response
): Promise<Response | void> {
  try {
    const idSupplier: number = parseInt(req.params.idsupplier_req, 10);
    const supplier: Supllier = req.body;
    const conn = await connect();
    const query: string =
      'Update suppliers set name = ?, location = ?, number = ?, email = ?, state = ? where idSupplier = ?';
    const values: any[] = [
      supplier.name,
      supplier.location,
      supplier.number,
      supplier.email,
      supplier.state,
      idSupplier,
    ];
    await conn.query(query, values);
    return res.json({ status: 'Supplier Updated' });
  } catch (e: any) {
    return res.status(500).json({
      message: 'Internal server error',
      code: 500,
      errors: e?.response?.data || e?.message || null,
      data: null,
    });
  }
}

export async function deleteSupplier(
  req: Request,
  res: Response
): Promise<Response | void> {
  try {
    const idSupplier: number = parseInt(req.params.idsupplier_req, 10);
    const conn = await connect();
    const query: string = `Update suppliers set state = 0 where idSupplier = ${idSupplier}`;
    await conn.query(query);
    return res.json({ status: 'Supplier Deleted' });
  } catch (e: any) {
    return res.status(500).json({
      message: 'Internal server error',
      code: 500,
      errors: e?.response?.data || e?.message || null,
      data: null,
    });
  }
}
