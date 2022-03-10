// Express
import { Request, Response } from 'express';
// DB
import { compare, genSalt, hash } from 'bcrypt';
import jwt from 'jsonwebtoken';
import connect from '../database';
// Interfaces
import { User } from '../interfaces/User';
import { Logueo } from '../interfaces/Logueo';
// Bcrypt
// Jsonwebtoken

// Funcion encryptar Contraseña
async function cryptPassword(password: string): Promise<string | void> {
  const salt = await genSalt(12);
  return hash(password, salt);
}

// Funcion comparar Hash de la contraseña de la BD
async function comparePassword(
  password: string,
  _hash: string
): Promise<Boolean | void> {
  return compare(password, _hash);
}

// Funcion Generar Token
function genToken(usernamelogin: string): string {
  return jwt.sign({ username: usernamelogin }, process.env.TOKEN_SECRET || '', {
    expiresIn: '12h',
  });
}

// Funcion validar existencia de usuario
async function validationUser(username: string): Promise<User> {
  const conn = await connect();
  const query = `SELECT * from users where username = '${username}' and state != 0`;
  const call = await conn.query(query);
  const user: User[] = JSON.parse(JSON.stringify(call[0]));
  return user[0];
}

// Funcion validar existencia email
async function validationEmail(email: string): Promise<User> {
  const conn = await connect();
  const query = `SELECT * from users where email = '${email}' and state != 0`;
  const call = await conn.query(query);
  const user: User[] = await JSON.parse(JSON.stringify(call[0]));
  return user[0];
}

// Funcion de logueo
export async function loginUser(
  req: Request,
  res: Response
): Promise<Response | void> {
  try {
    const userlogin: Logueo = req.body;
    const validateUser = await validationUser(userlogin.isesion);
    const validateEmail = await validationEmail(userlogin.isesion);
    if (validateUser != null || validateEmail != null) {
      let userlogged: User;
      if (validateUser != null) {
        userlogged = validateUser;
      } else {
        userlogged = validateEmail;
      }
      const result = await comparePassword(
        userlogin.password,
        userlogged.password
      );
      if (result) {
        const resJson = {
          user: userlogged.username,
          rol: userlogged.rol,
          code: 200,
        };
        res
          .header('auth-token', genToken(resJson.user))
          .status(200)
          .json(resJson);
      } else {
        res.status(200).json({
          status: 'Error de sesion',
          code: 200,
        });
      }
    } else {
      res.status(200).json({
        status: 'Error de sesion',
        code: 200,
      });
    }
  } catch (e: any) {
    res.status(500).json({
      message: 'Internal server error',
      code: 500,
      errors: e?.response?.data || e?.message || null,
      data: null,
    });
  }
}

// Funcion registrar usuario
export async function registerUser(
  req: Request,
  res: Response
): Promise<Response | void> {
  try {
    const conn = await connect();
    // Constante username recoge el JSON con los datos a registrar del usuario.
    const usersave: User = req.body;
    // Constante validateUser que recoge el resultado de la validacion del usuario.
    const validateUser = await validationUser(usersave.username);
    // Constante validateEmail que recoge el resultado de la validacion del email.
    const validateEmail = await validationEmail(usersave.email);
    // Verificacion de los datos del usuario para verificar si estos estan registrados.
    if (validateUser == null && validateEmail == null) {
      // Variable sql con la consulta SQL para registrar el usuario en la tabla users.
      const sql: string =
        'INSERT INTO users(username, name, lastname, age, number, email, password, rol, state) VALUES(?,?,?,?,?,?,?,?,?)';
      // Encriptacion de la contraseña con la funcion cryptPassword
      const password: string | any = await cryptPassword(usersave.password);
      // Constante values con los datos que se registraran
      const values: any[] = [
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
      // Ejecucion de consulta SQL con los datos de values
      await conn.query(sql, values);
      // Retorno de respuesta res
      return res.status(201).json({
        status: 'User saved',
        code: 200,
      });
    }
    if (validateUser != null && validateEmail != null) {
      return res.status(200).json({
        status: 'This user and email has already been used',
        code: 200,
      });
    }
    if (validateEmail != null) {
      return res.status(200).json({
        status: 'This email has already been used',
        code: 200,
      });
    }
    return res.status(200).json({
      status: 'This user has already been used',
      code: 200,
    });
  } catch (e: any) {
    return res.status(500).json({
      message: 'Internal server error',
      code: 500,
      errors: e?.response?.data || e?.message || null,
      data: null,
    });
  }
}

// Funcion actualizar usuario
export async function updateUser(
  req: Request,
  res: Response
): Promise<Response | void> {
  try {
    const conn = await connect();
    const user: User = req.body;
    const currentUser = req.username;
    const validateEmail = await validationEmail(user.email);
    if (!validateEmail || validateEmail.username === req.username) {
      const sql: string =
        'call restaurant.sp_update_users(?, ?, ?, ?, ?, ?, ?, ?, ?)';
      const value = [
        user.name,
        user.lastname,
        user.age,
        user.number,
        user.email,
        await cryptPassword(user.password),
        user.rol,
        user.state,
        currentUser,
      ];
      await conn.query(sql, value);
      return res.status(200).json({
        status: 'User updated',
        code: 200,
      });
    }
    return res.status(200).json({
      status: 'This email has already been used',
      code: 200,
    });
  } catch (e: any) {
    return res.status(500).json({
      message: 'Internal server error',
      code: 500,
      errors: e?.response?.data || e?.message || null,
      data: null,
    });
  }
}

// Funcion actualizar username
export async function updateUsername(
  req: Request,
  res: Response
): Promise<Response | void> {
  try {
    const conn = await connect();
    const currentUsername: string = req.username;
    const userNameUpdate: User = req.body;
    if (await validationUser(userNameUpdate.username)) {
      const sql: string = 'UPDATE users set username=? where username=?';
      const value = [userNameUpdate.username, currentUsername];
      await conn.query(sql, value);
      return res.status(200).json({
        status: 'User updated',
        code: 200,
      });
    }
    return res.status(200).json({
      status: 'This user has already been used',
      code: 200,
    });
  } catch (e: any) {
    return res.status(500).json({
      message: 'Internal server error',
      code: 500,
      errors: e?.response?.data || e?.message || null,
      data: null,
    });
  }
}

// Funcion eleminar actualizar
export async function deleteUser(
  req: Request,
  res: Response
): Promise<Response | void> {
  try {
    const conn = await connect();
    const username = req.params.username_req;
    const sql: string = 'UPDATE users set state = 0 where users.username = ?';
    await conn.query(sql, username);
    return res.status(200).json({ state: 'Deleted' });
  } catch (e: any) {
    return res.status(500).json({
      message: 'Internal server error',
      code: 500,
      errors: e?.response?.data || e?.message || null,
      data: null,
    });
  }
}
