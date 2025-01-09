import { useEffect, useState } from "react";
import dayjs from "dayjs";

export default function Todo() {
    const [title, setTitle] = useState("");
    const [description, setDesciption] = useState("");
    const [todos, setTodos] = useState([]);
    const [error, setError] = useState("");
    const [message, setMessage] = useState("");
    const [editId, setEditId] = useState(-1);

    const [editTitle, setEditTitle] = useState("");
    const [editDescription, setEditDesciption] = useState("");

    const apiUrl = "https://todo-qp95.onrender.com";

    const handleSubmit = () => {
        setError("");
        const dateTime = dayjs().format("YYYY-MM-DD HH:mm:ss");
        if (title.trim() !== "" && description.trim() !== "") {
            fetch(apiUrl + "/todos", {
                method: "POST",
                headers: {
                    "Content-Type": "application/json",
                },
                body: JSON.stringify({ title, description, dateTime }),
            })
                .then((res) => {
                    if (res.ok) {
                        setTodos([
                            ...todos,
                            { _id: Date.now(), title, description, dateTime },
                        ]);
                        setTitle("");
                        setDesciption("");
                        setMessage("Item added successfully");
                        setTimeout(() => setMessage(""), 3000);
                    } else {
                        setError("Unable to create Todo item");
                    }
                })
                .catch(() => {
                    setError("Unable to create Todo item");
                });
        }
    };

    useEffect(() => {
        getItems();
    }, []);

    const getItems = () => {
        fetch(apiUrl + "/todos")
            .then((res) => res.json())
            .then((res) => {
                setTodos(res);
            });
    };

    const handleEdit = (item) => {
        setEditId(item._id);
        setEditTitle(item.title);
        setEditDesciption(item.description);
    };

    const handleUpdate = () => {
        setError("");
        if (editTitle.trim() !== "" && editDescription.trim() !== "") {
            fetch(apiUrl + "/todos/" + editId, {
                method: "PUT",
                headers: {
                    "Content-Type": "application/json",
                },
                body: JSON.stringify({
                    title: editTitle,
                    description: editDescription,
                }),
            })
                .then((res) => {
                    if (res.ok) {
                        const updatedTodos = todos.map((item) => {
                            if (item._id === editId) {
                                item.title = editTitle;
                                item.description = editDescription;
                            }
                            return item;
                        });

                        setTodos(updatedTodos);
                        setEditTitle("");
                        setEditDesciption("");
                        setEditId(-1);
                        setMessage("Item updated successfully");
                        setTimeout(() => setMessage(""), 3000);
                    } else {
                        setError("Unable to update Todo item");
                    }
                })
                .catch(() => {
                    setError("Unable to update Todo item");
                });
        }
    };

    const handleEditCancel = () => {
        setEditId(-1);
    };

    const handleDelete = (id) => {
        if (window.confirm("Are you sure you want to delete?")) {
            fetch(apiUrl + "/todos/" + id, {
                method: "DELETE",
            }).then(() => {
                const updatedTodos = todos.filter((item) => item._id !== id);
                setTodos(updatedTodos);
            });
        }
    };

    return (
        <>
            <div className="row p-3 bg-primary text-light d-flex justify-content-center">
                <h1 className="text-center">TASK MASTER</h1>
            </div>
            <div className="row">
                <h3>Add Item</h3>
                {message && <p className="text-info">{message}</p>}
                <div className="form-group d-flex gap-2">
                    <input
                        placeholder="Title"
                        onChange={(e) => setTitle(e.target.value)}
                        value={title}
                        className="form-control"
                        type="text"
                    />
                    <input
                        placeholder="Description"
                        onChange={(e) => setDesciption(e.target.value)}
                        value={description}
                        className="form-control"
                        type="text"
                    />
                    <button className="btn btn-dark" onClick={handleSubmit}>
                        Submit
                    </button>
                </div>
                {error && <p className="text-warning">{error}</p>}
            </div>
            <div className="row mt-3">
                <h3>Tasks</h3>
                <div className="col-md-6">
                    <ul className="list-group">
                        {todos.map((item) => (
                            <li
                                className="list-group-item bg-info d-flex justify-content-between align-items-center my-2"
                                key={item._id}
                            >
                                <div className="d-flex flex-column me-2">
                                    {editId === -1 || editId !== item._id ? (
                                        <>
                                            <span className="fw-bold">{item.title}</span>
                                            <span>{item.description}</span>
                                            <span className="text-muted">{item.dateTime}</span>
                                        </>
                                    ) : (
                                        <div className="form-group d-flex gap-2">
                                            <input
                                                placeholder="Title"
                                                onChange={(e) =>
                                                    setEditTitle(e.target.value)
                                                }
                                                value={editTitle}
                                                className="form-control"
                                                type="text"
                                            />
                                            <input
                                                placeholder="Description"
                                                onChange={(e) =>
                                                    setEditDesciption(e.target.value)
                                                }
                                                value={editDescription}
                                                className="form-control"
                                                type="text"
                                            />
                                        </div>
                                    )}
                                </div>
                                <div className="d-flex gap-2">
                                    {editId === -1 ? (
                                        <>
                                            <button
                                                className="btn btn-danger"
                                                onClick={() => handleEdit(item)}
                                            >
                                                Edit
                                            </button>
                                            <button
                                                className="btn btn-danger"
                                                onClick={() =>
                                                    handleDelete(item._id)
                                                }
                                            >
                                                Delete
                                            </button>
                                        </>
                                    ) : (
                                        <>
                                            <button
                                                className="btn btn-warning"
                                                onClick={handleUpdate}
                                            >
                                                Update
                                            </button>
                                            <button
                                                className="btn btn-danger"
                                                onClick={handleEditCancel}
                                            >
                                                Cancel
                                            </button>
                                        </>
                                    )}
                                </div>
                            </li>
                        ))}
                    </ul>
                </div>
            </div>
        </>
    );
}
