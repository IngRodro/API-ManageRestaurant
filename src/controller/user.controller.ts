// Express
import { Request, Response } from 'express';
// DB
import { connect } from '../database';
// Interfaces
import { User } from '../interfaces/User';
import { Logueo } from '../interfaces/Logueo';
//Bcrypt
import { compare, genSalt, hash } from 'bcrypt';
//Jsonwebtoken
import jwt from 'jsonwebtoken';

//Funcion encryptar Contraseña
async function cryptPassword(password: string): Promise<string | void > {
    const salt = await genSalt(12)
    return await hash(password, salt);
}

//Funcion comparar Hash de la contraseña de la BD
async function comparePassword(password: string ,hash: string): Promise<Boolean | void> {
    return await compare(password, hash);
}

//Funcion Generar Token
function genToken(usernamelogin: string): string{
    const token: string = jwt.sign({username: usernamelogin}, process.env['TOKEN_SECRET'] || '', {
        expiresIn: "12h"
    });
    return token;
}

//Funcion de logueo
export async function loginUser(req: Request, res: Response): Promise<Response | void> {
    try {
        const conn = await connect();
        let userlogin:Logueo = req.body;
        if(validateUser(userlogin.isesion) != null || validateEmail(userlogin.isesion) != null){
            let userValidate: User;
            if(validateUser(userlogin.isesion) == null){
                userValidate = await validateUser(userlogin.isesion);
            }else{
                userValidate = await validateEmail(userlogin.isesion)
            }
            let result = await comparePassword(userlogin.password, userValidate.password)
            if(result){
                const resJson = {
                    user: userValidate.username,
                    rol : userValidate.rol,
                    code: 200
                }
                res.header('auth-token', genToken(resJson.user)).status(200).json(resJson);
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

//Funcion validar existencia de usuario
async function validateUser(username: string): Promise<User | any> {
    const conn = await connect();
    const query = `SELECT * from users where username = '${username}'`;
    const call = await conn.query(query) 
    let user: User[] = JSON.parse(JSON.stringify(call[0]));
    if(user.length == 1){
        return user[0];
    }
    return null
}

async function validateEmail(email: string): Promise<User> {
    const conn = await connect();
    const query = `SELECT * from users where email = '${email}'`;
    const call = await conn.query(query);
    let user: User[] = await JSON.parse(JSON.stringify(call[0]));
    return user[0]
    
}

//Funcion registrar usuario
export async function registerUser(req:Request, res: Response): Promise<Response | void> {
    try{
        const conn = await connect();
        let usersave: User = req.body;
        if (await validateUser(usersave.username) == null && await validateEmail(usersave.email) == null) {
            let sql: string = 'INSERT INTO users(username, name, lastname, age, number, email, password, rol, state) VALUES(?,?,?,?,?,?,?,?,?)';
            let password : string | any = await cryptPassword(usersave.password);
            let values: any[] = [
                usersave.username,
                usersave.name,
                usersave.lastname,
                usersave.age,
                usersave.number,
                usersave.email,
                password,
                usersave.rol,
                usersave.state,
            ];
            conn.query(sql, values)
            return res.status(201).json({status: "User saved"});
        }else{
            if(await validateEmail(usersave.email) != null && await validateUser(usersave.username) != null){
                return res.status(200).json({status: "This user and email has already been used"})
            }
            if(await validateEmail(usersave.email) != null){
                return res.status(200).json({status: "This email has already been used"})
            }
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

//Funcion actualizar usuario
export async function updateUser(req: Request, res :Response): Promise<Response | void> {
    try{
        const conn = await connect();
        let user: User = req.body;
        if (await validateEmail(user.email) == null ||  (await validateEmail(user.email)).username == req.username) {
            let sql: string = "call restaurant.sp_update_users(?, ?, ?, ?, ?, ?, ?, ?, ?)";
            const value = [
                user.name,
                user.lastname,
                user.age,
                user.number,
                user.email,
                await cryptPassword(user.password),
                user.rol,
                user.state,
                req.username
            ];
            conn.query(sql, value);
            return res.status(200).json({status: "User updated"});
        }
        return res.status(200).json({status: "This email has already been used"});
    }catch (e: any) {
        res.status(500).json({
            message: "Internal server error",
            code: 500,
            errors: e?.response?.data || e?.message || null,
            data: null,
        });
    }
}

//Funcion actualizar username
export async function updateUsername(req: Request, res :Response): Promise<Response | void> {
    try{const conn = await connect();
        let currentUsername: string = req.username;
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

//Funcion eleminar actualizar
export async function deleteUser(req: Request, res: Response): Promise<Response | void> {
    try{
        const conn = await connect();
        let username = req.params.username_req;
        let sql: string = 'UPDATE users set state = 0 where users.username = ?';
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