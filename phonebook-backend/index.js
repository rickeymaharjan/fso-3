const mongoose = require("mongoose");
const Person = require("./models/person");
const morgan = require("morgan");
const express = require("express");
const { response } = require("express");
const app = express();

const errorHandler = (error, request, response, next) => {
  console.log(error.message);

  if (error.status === 404) {
    // Handle 404 Not Found errors
    response.status(404).send("Resource not found");
  } else if (error.status === 401) {
    // Handle 401 Unauthorized errors
    response.status(401).send("Unauthorized");
  } else {
    response.status(500).send("Internal Server Error");
  }

  next(error);
};

app.use(express.json());
app.use(morgan("dev"));

app.use(
  morgan((tokens, req, res) => {
    return [
      tokens.method(req, res),
      tokens.url(req, res),
      tokens.status(req, res),
      tokens.res(req, res, "content-length"),
      "-",
      tokens["response-time"](req, res),
      "ms",
      JSON.stringify(req.body),
    ].join(" ");
  })
);

app.use(express.static("dist"));

let persons = [];

app.get("/info", (request, response) => {
  const date = new Date();
  const info = `
      <p>The phonebook has info for ${persons.length} people</p>
      <p>${date}</p>
      `;
  response.send(`${info}`);
});

app.get("/api/persons", (request, response) => {
  Person.find({}).then((people) => response.json(people));
});

app.get("/api/persons/:id", (request, response) => {
  const id = request.params.id;

  Person.findById(id)
    .then((person) => response.json(person))
    .catch((error) => next(error));
});

app.delete("/api/persons/:id", (request, response, next) => {
  const id = request.params.id;

  Person.findByIdAndDelete(id)
    .then((results) => response.status(204).end())
    .catch((error) => error(next));
});

app.post("/api/persons", (request, response) => {
  const body = request.body;

  if (!body.name || !body.number) {
    return response.status(400).json({
      error: "name or number missing",
    });
  }

  const nameExists = persons.some((person) => person.name === body.name);

  if (nameExists) {
    return response.status(400).json({
      error: "name must be unique",
    });
  }

  const newPerson = new Person({
    name: body.name,
    number: body.number,
  });

  newPerson
    .save()
    .then((savedContact) => {
      console.log("Contact saved in DB:", savedContact);
      response.status(201).json(savedContact);
    })
    .catch((error) => {
      console.error("Error saving the contact:", error);
      response.status(500).json({ error: "Internal Server Error" });
    });
});

app.put("/api/persons/:id", (request, response, next) => {
  const id = request.params.id;
  const body = request.body;

  const person = {
    name: body.name,
    number: body.number,
  };

  Person.findByIdAndUpdate(id, person, { new: true })
    .then((updatedPerson) => response.json(updatedPerson))
    .catch((error) => next(error));
});

app.use(errorHandler);

const PORT = 3000;

app.listen(PORT, () => {
  console.log(`Server running on port ${PORT}`);
});
