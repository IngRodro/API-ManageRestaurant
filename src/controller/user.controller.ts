import { Request, Response } from 'express'
// DB
import { connect } from '../database'
// Interfaces
import { User } from '../interfaces/User'
import * as bcrypt from 'bcrypt'; 

export async function loginUser(req: Request, res: Response): Promise<Response | void> {
    try {
        const conn = await connect();
        let userlogin:User = req.body;
        const query: string = 'SELECT * from users where users.username = ?';
        const values: string = userlogin.username;
        const call = await conn.query(query, values);
        const user = JSON.stringify(call[0]);
        let userjson: User[] = JSON.parse(user);
        if(userjson.length === 1){
                let result = await bcrypt.compare(userlogin.password, userjson[0].password)
                    if(result){
                            const resJson = {
                                user: userjson[0].username,
                                rol : userjson[0].rol
                            }
                            res.json(resJson);
                    }else{
                        res.json({status: 'Error de sesion'});
                    }
                
            }else{
                res.json({status: 'Error de sesion'});
            } 
    }
    catch (e) {
        console.log(e)
    } 
}

export async function registerUser(req:Request, res: Response): Promise<Response | void> {
    const conn = await connect();
    let usersave: User = req.body;
    const query = `SELECT * from users where users.username = ?;`;
    const values: string = usersave.username;
    const call = await conn.query(query, values) 
    const user:string = JSON.stringify(call[0]);
    let userjson: User[] = JSON.parse(user)
            if (userjson.length === 0) {
            let sql: string = 'INSERT INTO users(username, name, lastname, age, number, email, password, rol, state) VALUES(?,?,?,?,?,?,?,?,?)';
            let values: any[] = [
                usersave.username,
                usersave.name,
                usersave.lastname,
                usersave.age,
                usersave.number,
                usersave.email,
                bcrypt.hashSync(usersave.password, 12),
                usersave.rol,
                usersave.state,
            ];
            conn.query(sql, values)
            return res.json({status: "User saved"});
    }else{
        return res.json({status: "This user has already been used"})
    }
}

export async function updateUser(req: Request, res :Response): Promise<Response | void> {
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
    bcrypt.hashSync(user.password, 12),
    user.rol,
    user.state,
    user.username,
    ];
    conn.query(sql, value);
    return res.json({status: "User updated"});
}

export async function updateUsername(req: Request, res :Response): Promise<Response | void> {
    const conn = await connect();
    let currentUsername: string = req.params.username_req;
    let usernameupdate: User = req.body;
    const query = `SELECT * from users where users.username = ?;`;
    const values: string = usernameupdate.username;
    const call = await conn.query(query, values) 
    const user:string = JSON.stringify(call[0]);
    let userjson: User[] = JSON.parse(user)
            if (userjson.length === 0) {
                let sql: string ="UPDATE users set username=? where username=?";
                const value = [usernameupdate.username, currentUsername];
                conn.query(sql, value);
                return res.json({status: "User updated"});
            }else{
                return res.json({status: "This user has already been used"})
            }
}

export async function deleteUser(req: Request, res: Response) {
        const conn = await connect();
        let username = req.params.username_req;
    
        //Consulta para eliminar el usuario.
        let sql: string = 'delete from restaurant.users where users.username = ?';
        const value: string = username;
    
        //Bloque que activa la consulta
        conn.query(sql, value)
        res.json({state: 'deleted'});
}