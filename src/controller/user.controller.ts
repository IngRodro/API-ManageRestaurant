// Express
import { Request, Response } from 'express'
// DB
import { connect } from '../database'
// Interfaces
import { User } from '../interfaces/User'
//Bcrypt
import { compare, hashSync } from 'bcrypt'; 

export async function loginUser(req: Request, res: Response): Promise<Response | void> {
    try {
        const conn = await connect();
        let userlogin:User = req.body;
        const query: string = 'SELECT * from users where users.username = ?';
        const values: string = userlogin.username;
        const call = await conn.query(query, values);
        let user: User[] = JSON.parse(JSON.stringify(call[0]));
        if(user.length == 0){
            let result = await compare(userlogin.password, user[0].password)
            if(result){
                const resJson = {
                    user: user[0].username,
                    rol : user[0].rol
                }
                res.status(200).json(resJson);
            }else{
                res.status(200).json({status: 'Error de sesion'});
            }
        }else{
            res.status(200).json({status: 'Error de sesion'});
        } 
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

async function validateUser(username: string): Promise<Boolean > {
    const conn = await connect();
    const query = `SELECT * from users where username = '${username}'`;
    const call = await conn.query(query) 
    let user: User[] = JSON.parse(JSON.stringify(call[0]));
    return user.length == 0;
}

export async function registerUser(req:Request, res: Response): Promise<Response | void> {
    try{
        const conn = await connect();
        let usersave: User = req.body;
        if (await validateUser(usersave.username)) {
            let sql: string = 'INSERT INTO users(username, name, lastname, age, number, email, password, rol, state) VALUES(?,?,?,?,?,?,?,?,?)';
            let values: any[] = [
                usersave.username,
                usersave.name,
                usersave.lastname,
                usersave.age,
                usersave.number,
                usersave.email,
                hashSync(usersave.password, 12),
                usersave.rol,
                usersave.state,
            ];
            conn.query(sql, values)
            return res.status(201).json({status: "User saved"});
        }else{
            return res.status(200).json({status: "This user has already been used"})
        }
    }catch (e: any) {
        res.status(500).json({
            message: "Internal server error",
            code: 500,
            errors: e?.response?.data || e?.message || null,
            data: null,
        });
    }
}

export async function updateUser(req: Request, res :Response): Promise<Response | void> {
    try{
        const conn = await connect();
        let user: User = req.body;
        let sql: string =
        "call restaurant.sp_update_users(?, ?, ?, ?, ?, ?, ?, ?, ?)";
        const value = [
            user.name,
            user.lastname,
            user.age,
            user.number,
            user.email,
            hashSync(user.password, 12),
            user.rol,
            user.state,
            user.username,
        ];
        conn.query(sql, value);
        return res.status(200).json({status: "User updated"});
    }catch (e: any) {
        res.status(500).json({
            message: "Internal server error",
            code: 500,
            errors: e?.response?.data || e?.message || null,
            data: null,
        });
    }
}

export async function updateUsername(req: Request, res :Response): Promise<Response | void> {
    try{const conn = await connect();
        let currentUsername: string = req.params.username_req;
        let usernameupdate: User = req.body;
        if (await validateUser(usernameupdate.username)) {
            let sql: string ='UPDATE users set username=? where username=?';
            const value = [usernameupdate.username, currentUsername];
            conn.query(sql, value);
            return res.status(200).json({status: "User updated"});
        }else{
            return res.status(200).json({status: "This user has already been used"})
        }
    }catch (e: any) {
        res.status(500).json({
            message: "Internal server error",
            code: 500,
            errors: e?.response?.data || e?.message || null,
            data: null,
        });
    }
}

export async function deleteUser(req: Request, res: Response): Promise<Response | void> {
    try{
        const conn = await connect();
        let username = req.params.username_req;
        //Consulta para eliminar el usuario.
        let sql: string = 'UPDATE users set state=0 where users.username = ?';
        const value: string = username;
        conn.query(sql, value)
        return res.status(200).json({state: 'Deleted'});
    }catch (e: any) {
        res.status(500).json({
            message: "Internal server error",
            code: 500,
            errors: e?.response?.data || e?.message || null,
            data: null,
        });
    }
}