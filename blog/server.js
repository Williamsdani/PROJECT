const express = require("express");
const mongoose = require("mongoose");
PORT = 7000;

const app = express();
app.use(express.json());


const databaseUrl = "mongodb://127.0.0.1/blogDB";


mongoose
    .connect(databaseUrl)
    .then(() => {
        console.log("Database connected");
    })
    .catch((e) => {
        console.log(e).message;
    });


const blogSchema = mongoose.Schema({
    headers: { type: String, required: [true, "headers is required"] },
    connect: { type: String, required: [true, "connect is required"] },
    message: { type: String, required: [true, "message is required"] },
    dateCreated: {
        type: Date,
        default: function () {
            const date = new Date();
            return date;
        },
    },
});


const blogModel = mongoose.model("blogs", blogSchema);


app.post("/blog", async (req, res) => {
    try {
        const blog = await blogModel.create(req.body);
        if (!blog) {
            res.status(400).json({
                message: "error posting blog",
            });
        } else {
            res.status(201).json({
                message: "blog created",
                data: blog,
            });
        }
    } catch (e) {
        res.status(500).json({
            message: e.message,
        });
    }
});

app.get("/blog", async (req, res) => {
    try {
        const blogs = await blogModel.find();
        if (!blogs) {
            res.status(404).json({
                message: "blog database not found",
            });
        } else if (blogs.length == 0) {
            res.status(200).json({
                message: "no blogs on the database",
            });
        } else {
            res.status(200).json({
                message: "successful",
                data: blogs,
            });
        }
    } catch (error) {
        res.status(500).json({
            message: error.message,
        });
    }
});
app.get("/blog/:id", async (req, res) => {
    try {
        const blogId = req.params.id;
        const blog = await blogModel.findById(blogId);
        if (!blog) {
            res.status(404).json({
                message: "task not found",
            });
        } else {
            res.status(200).json({
                message: "successful",
                data: blog,
            });
        }
    } catch (error) {
        res.status(500).json({
            message: error.message,
        });
    }
});


app.put("/blog/:id", async (req, res) => {
    try {
        const blogId = req.params.id;
        const updatedBlog = await blogModel.findByIdAndUpdate(blogId, req.body, {
            new: true,
            runValidators: true,
        });
        if (!updatedBlog) {
            res.status(404).json({
                message: "blog not found",
            });
        } else {
            res.status(200).json({
                message: "blog updated",
                data: updatedBlog,
            });
        }
    } catch (error) {
        res.status(500).json({
            message: error.message,
        });
    }
});


app.delete("/blog/:id", async (req, res) => {
    try {
        const blogId = req.params.id;
        const deletedBlog = await blogModel.findByIdAndDelete(blogId);
        if (!deletedBlog) {
            res.status(404).json({
                message: "blog not found",
            });
        } else {
            res.status(200).json({
                message: "blog deleted",
                data: deletedBlog,
            });
        }
    } catch (error) {
        res.status(500).json({
            message: error.message,
        });
    }
});

app.listen(PORT, () => {
    console.log("server is on ", PORT);
});