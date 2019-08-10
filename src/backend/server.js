const express = require('express');
const app = express();
const bodyParser = require('body-parser');
const cors = require('cors');
const mongoose = require('mongoose');

require('dotenv').config();

const todoRoutes = express.Router();
const PORT = process.env.PORT || 4000;

let Todo = require('./todo.model');

app.use(cors());
app.use(bodyParser.json());


mongoose.connect(process.env.DB_URI, {useNewUrlParser: true})
        .then(() => {
            console.log("MongoDB database initial connection established successfully");
        })
        .catch((err) => {
            console.log("Not Connected to Database ERROR! ");
            console.log(err);
        });

const connection = mongoose.connection;
connection.on('disconnected',()=> {console.log('lost connection!')});
connection.on('reconnected',()=> {console.log('reconnected to db again!')});
 
todoRoutes.route('/').get(function(req, res) {
    Todo.find(function(err, todos) {
        if (err) {
            console.log(err);
        } else {
            res.json(todos);
        }
    });
});

todoRoutes.route('/:id').get(function(req, res) {
    let id = req.params.id;
    Todo.findById(id, function(err, todo) {
        res.json(todo);
    });
});

todoRoutes.route('/update/:id').post(function(req, res) {
    Todo.findById(req.params.id, function(err, todo) {
        if (!todo)
            res.status(404).send("data is not found");
        else
            todo.todo_description = req.body.todo_description;
            todo.todo_responsible = req.body.todo_responsible;
            todo.todo_priority = req.body.todo_priority;
            todo.todo_completed = req.body.todo_completed;

            todo.save().then(todo => {
                res.json('Todo updated!');
            })
            .catch(err => {
                res.status(400).send("Update not possible");
            });
    });
});

todoRoutes.route('/add').post(function(req, res) {
    let todo = new Todo(req.body);
    todo.save()
        .then(todo => {
            res.status(200).json({'todo': 'todo added successfully'});
        })
        .catch(err => {
            res.status(400).send('adding new todo failed');
        });
});

app.use('/todos', todoRoutes);

process.on('uncaughtException', (err) => {
    console.error('There was an uncaught error', err)
    process.exit(1) //mandatory (as per the Node docs)
})

app.listen(process.env.API_PORT, function() {
    console.log("Server is running on Port: " + process.env.API_PORT);
});