// backend.js
import express from "express";
import cors from "cors";


const app = express();
const port = 8000;
const users = {
  users_list: [
    {
      id: "xyz789",
      name: "Charlie",
      job: "Janitor"
    },
    {
      id: "abc123",
      name: "Mac",
      job: "Bouncer"
    },
    {
      id: "ppp222",
      name: "Mac",
      job: "Professor"
    },
    {
      id: "yat999",
      name: "Dee",
      job: "Aspring actress"
    },
    {
      id: "zap555",
      name: "Dennis",
      job: "Bartender"
    }
  ]
};

const findUserByName = (name) => {
  return users["users_list"].filter(
    (user) => user["name"] === name
  );
};

app.use(cors());
app.use(express.json());

app.get("/", (req, res) => {
  res.send("Hello World!");
});

app.get("/users", (req, res) => {
  const name = req.query.name;
  if (name != undefined) {
    let result = findUserByName(name);
    result = { users_list: result };
    res.send(result);
  } else {
    res.send(users);
  }
});

const generateId = () => Math.random().toString(36).substring(2, 8);

const findUserById = (id) =>
  users["users_list"].find((user) => user["id"] === id);

app.get("/users/:id", (req, res) => {
  const id = req.params["id"]; //or req.params.id
  let result = findUserById(id);
  if (result === undefined) {
    res.status(404).send("Resource not found.");
  } else {
    res.send(result);
  }
});

const addUser = (user) => {
  users["users_list"].push(user);
  return user;
};

app.post("/users", (req, res) => {
  const userToAdd = req.body;
  userToAdd.id = generateId();
  addUser(userToAdd);
	res.status(201).json(userToAdd); // Respond with 201 when created
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


