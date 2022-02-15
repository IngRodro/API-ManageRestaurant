import { Request, Response } from 'express'
// DB
import { connect } from '../database'
// Interfaces
import { User } from '../interfaces/User'
import * as bcrypt from 'bcrypt'; 

export async function getPosts(req: Request, res: Response): Promise<Response | void> {
    try {
        let userlogin:User = req.body;
        const query = `SELECT * from users where users.username = ?`;
        const values: string = userlogin.username;
        const conn = await connect();
        const call = await conn.query(query, values);
        const users = call[0]
        let string =  JSON.stringify(users);
        let json: User[] = JSON.parse(string)
        if(json.length === 1){
                let result = await bcrypt.compare(userlogin.password, json[0].password)
                    if(result){
                            const resJson = {
                                user: json[0].username,
                                rol : json[0].rol
                            }
                            res.json(resJson);
                    }else{
                        res.json({status: 'Error de sesion'})
                    }
                
            }else{
                res.json({status: 'Error de sesion'})
            } 
    }
    catch (e) {
        console.log(e)
    } 
}
