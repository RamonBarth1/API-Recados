import { users } from "../database/user";
import { Request, Response } from "express";
import { User } from "../models/user";
import { ApiStatus } from "../util/http-response.adapter";

export class UserController {
    public getAllUsers(req: Request, res: Response) {
      try {
        const { email, password } = req.query;
  
        let result = users;
  
        if (email) {
          result = users.filter((user) => user.email === email);
        }
        if (password) {
          result = users.filter((user) => user.password === password);
        }
  
        return res.status(200).send({
          ok: true,
          message: "Users were sucessfully listed",
          
          data: result.map((user) => {
            return {
              id: user.toJson().id,
              name: user.toJson().name,
              email: user.toJson().email,
              password: user.toJson().password,
              errands: user.toJson().errands
            };
          }),
        });
      } catch (error: any) {
        return res.status(400).send({
          ok: false,
          message: error.toString(),
        });
      }
    }

    public createUser(req: Request, res: Response) {
        try {
          const { name, email, password } = req.body;
    
          const emailValid = users.some((user) => user.email === email);
    
          if (emailValid) {
            return res.status(400).send({
              ok: false,
              message: "email already registered",
            });
          }
    
          if (!name) {
            return res.status(400).send({
              ok: false,
              message: "Name was not provided",
            });
          }

          if(!email) {
            return res.status(400).send({
                ok: false,
                message: "E-mail was not provided",
              });
          }

          if (!password) {
            return res.status(400).send({
              ok: false,
              message: "Password was not provided",
            });
          }
          
    
          const user = new User(name, email, password);
          users.push(user);
          // console.log(users);

          return res.status(200).send({
            ok: true,
            message: "User was successfully created",
            data: user.toJson(),
          });
        } catch (error: any) {
          return res.status(500).send({
            ok: false,
            message: error.toString(),
          });
        }
      }

      public updateUser(req: Request, res: Response) {
        try {
          const { id } = req.params;
          const { email } = req.body;
          const { password } = req.body;  
    
          const user = users.find((user) => user.id === id);
          
    
          if (!user) {
            return res
              .status(404)
              .send({ ok: false, message: "User was not found" });
          }
    
          if (!email || user.email === email) {
            return res.status(400).send({ ok: false, message: "Email is invalid" });
          }

          if (!password || user.password === password) {
            return res.status(400).send({ ok: false, message: "Password is invalid" });
          }
    
          user.email = email;
          user.password = password;
          return res
            .status(200)
            .send({ ok: true, message: "Email and password have been updated successfully" });
        } catch (error: any) {
          return res.status(500).send({
            ok: false,
            message: error.toString(),
          });
        }
      }

      public deleteUser(req: Request, res: Response) {
        try {
          const { id } = req.params;
    
          const userIndex = users.findIndex((user) => user.id === id);
    
          if (!userIndex) {
            return res
              .status(404)
              .send({ ok: false, message: "user was not found." });
          }
    
          const deletedUser = users.splice(userIndex, 1);
    
          return res.status(200).send({
            ok: true,
            message: "user was successfully deleted",
            data: deletedUser[0].toJson(),
          });
        } catch (error: any) {
          return res.status(500).send({
            ok: false,
            message: error.toString(),
          });
        }
      }

      public login(req: Request, res: Response) {
        try {
            const { email, password } = req.body;

            if (!email) {
                return res
                .status(400)
                .send({ ok: false, message: "Email was not provided" });          
                }

            if (!password) {
              return res
              .status(400)
              .send({ ok: false, message: "Password was not provided" });
            }

            const user = users.find((user) => user.email === email && user.password === password);
            if (!user) {
              return res
              .status(400)
              .send({ ok: false, message: "Invalid email or password" }); 
            }

            return res.status(200).send({
              ok: true,
              message: "Login successfully done",
              data: user.toJson()
            });
        } catch (error: any) {
          return res.status(500).send({
            ok: false,
            message: error.toString(),
          });
        }
    }
    
  }
      