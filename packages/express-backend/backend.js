// backend.js
import cors from "cors";
import dotenv from "dotenv";
import express from "express";
import mongoose from "mongoose";

import userService from "./services/user-service.js";

dotenv.config();

const { MONGO_CONNECTION_STRING } = process.env;

mongoose.set("debug", true);
mongoose
  .connect(MONGO_CONNECTION_STRING)
  .catch((error) => console.log(error));

const port = 8000;
const app = express();

app.use(cors());
app.use(express.json());

const generateId = () => Math.random().toString(36).substring(2, 8);
const findUserById = (id) =>
  users["users_list"].find((user) => user["id"] === id);
const addUser = (user) => {
  users["users_list"].push(user);
  return user;
};

app.get("/", (req, res) => {
  res.send("Hello World!");
});

app.get("/users", (req, res) => {
    const name = req.query["name"];
    const job = req.query["job"]; 
    userService
      .getUsers(name, job)
      .then((result) => res.send({users_list: result}))
      .catch((error) => {
        console.log(error); 
        res.status(500).send("An error ocuured in the server.");
      });
  }
);

app.get("/users/:id", (req, res) => {
  const id = req.params["id"]; //or req.params.id
  userService.findUserById(id).then((result) =>{
    if (result == undefined || result === null)
      res.status(404).send("Resource not found.");
    else res.send({ users_list: result });
  });
});

app.post("/users", (req, res) => {
  const id = req.params["id"];
  userService.findUserById(user).then((savedUser) =>{
    if (savedUser) res.status(201).send(savedUser);
    else res.status(500).end();
  })
});

/*
	Delete...
*/
app.delete("/users/:id", (req, res) => {
	console.log("req params", req.params.id)
  const userId = req.params.id;
  const initialLength = users["users_list"].length

	users["users_list"] = users["users_list"].filter(({ id }) => id !== userId);

  // Make sure it is deleted
  if(users["users_list"].length < initialLength)
  {
    res.status(204).send()
  }
  else
  {
    res.status(404).send("Resource Not Found")
  }
}); 

app.listen(port, () => {
  console.log(
    `Example app listening at http://localhost:${port}`
  );
});


