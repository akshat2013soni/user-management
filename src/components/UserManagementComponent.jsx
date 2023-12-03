// UserManagementComponent.jsx

import React, { useState, useEffect } from "react";
import axios from "axios";
import delIcon from "../assets/delete.png";
import editIcon from "../assets/edit.png";
import saveIcon from "../assets/save.png";
import cancelIcon from "../assets/cancel.png";
import dashboardIcon from "../assets/dashboard.png";
import "./styles.css"; // Import the CSS file
const ENDPOINT =
  "https://geektrust.s3-ap-southeast-1.amazonaws.com/adminui-problem/members.json";

const UserManagementComponent = () => {
  const [users, setUsers] = useState([]);
  const [selectedRows, setSelectedRows] = useState([]);
  const [searchTerm, setSearchTerm] = useState("");
  const [selectAll, setSelectAll] = useState(false);
  const [currentPage, setCurrentPage] = useState(1);
  const [editingUser, setEditingUser] = useState(null); // Store the ID of the user being edited
  const [editName, setEditName] = useState(""); // Separate state for edited name
  const [editEmail, setEditEmail] = useState(""); // Separate state for edited email
  const [editRole, setEditRole] = useState(""); // Separate state for edited role
  const pageSize = 10;

  useEffect(() => {
    // Fetch user data from the API endpoint
    axios
      .get(ENDPOINT)
      .then((response) => {
        setUsers(response.data);
      })
      .catch((error) => {
        console.error("Error fetching user data:", error);
      });
  }, []); // Empty dependency array ensures the effect runs once when the component mounts

  const handleRowSelection = (userId) => {
    const isSelected = selectedRows.includes(userId);
    if (isSelected) {
      setSelectedRows(selectedRows.filter((id) => id !== userId));
    } else {
      setSelectedRows([...selectedRows, userId]);
    }
  };

  const handleSelectAll = () => {
    if (selectAll) {
      setSelectedRows([]);
    } else {
      setSelectedRows(users.map((user) => user.id));
    }
    setSelectAll(!selectAll);
  };

  const handleDeleteSelected = () => {
    const updatedUsers = users.filter(
      (user) => !selectedRows.includes(user.id)
    );
    setUsers(updatedUsers);
    setSelectedRows([]);
  };

  const handlePageChange = (newPage) => {
    setCurrentPage(newPage);
  };

  const handleEdit = (userId) => {
    const userToEdit = users.find((user) => user.id === userId);
    setEditingUser(userId);
    setEditName(userToEdit.name);
    setEditEmail(userToEdit.email);
    setEditRole(userToEdit.role);
  };

  const handleSaveEdit = (userId) => {
    const updatedUsers = users.map((user) =>
      user.id === userId
        ? { ...user, name: editName, email: editEmail, role: editRole }
        : user
    );
    setUsers(updatedUsers);
    setEditingUser(null);
    setEditName("");
    setEditEmail("");
    setEditRole("");
  };

  const handleCancelEdit = () => {
    setEditingUser(null);
    setEditName("");
    setEditEmail("");
    setEditRole("");
  };

  const handleDelete = (userId) => {
    const updatedUsers = users.filter((user) => user.id !== userId);
    setUsers(updatedUsers);
    setSelectedRows(selectedRows.filter((id) => id !== userId));
  };

  const filteredUsers = users.filter((user) =>
    Object.values(user).some((value) =>
      value.toString().toLowerCase().includes(searchTerm.toLowerCase())
    )
  );

  console.log(filteredUsers);
  const startIndex = (currentPage - 1) * pageSize;
  const paginatedUsers = filteredUsers.slice(startIndex, startIndex + pageSize);
  const totalPages = Math.ceil(filteredUsers.length / pageSize);

  return (
    <div className="home">
      <div className="title">
        <h1 className="heading">Dashboard</h1>
        <img src={dashboardIcon} alt="" className="dashboard-icon" />
      </div>
      <div className="top">
        <input
          className="searchBar"
          type="text"
          placeholder="Search..."
          value={searchTerm}
          onChange={(e) => setSearchTerm(e.target.value)}
        />
        <button className="delete-selected" onClick={handleDeleteSelected}>
          Delete Selected
        </button>
      </div>

      <div className="main">
        <table>
          <thead>
            <tr>
              <th>
                <input
                  type="checkbox"
                  checked={selectAll}
                  onChange={handleSelectAll}
                />
              </th>
              <th>ID</th>
              <th>Name</th>
              <th>Email</th>
              <th>Role</th>
              <th>Actions</th>
            </tr>
          </thead>

          <tbody>
            {paginatedUsers.map((user) => (
              <tr key={user.id}>
                <td>
                  <input
                    type="checkbox"
                    checked={selectedRows.includes(user.id)}
                    onChange={() => handleRowSelection(user.id)}
                  />
                </td>
                <td>{user.id}</td>
                <td>
                  {editingUser === user.id ? (
                    <input
                      type="text"
                      value={editName}
                      onChange={(e) => setEditName(e.target.value)}
                    />
                  ) : (
                    user.name
                  )}
                </td>
                <td>
                  {editingUser === user.id ? (
                    <input
                      type="text"
                      value={editEmail}
                      onChange={(e) => setEditEmail(e.target.value)}
                    />
                  ) : (
                    user.email
                  )}
                </td>
                <td>
                  {editingUser === user.id ? (
                    <input
                      type="text"
                      value={editRole}
                      onChange={(e) => setEditRole(e.target.value)}
                    />
                  ) : (
                    user.role
                  )}
                </td>
                <td>
                  {editingUser === user.id ? (
                    <span>
                      <img
                        src={saveIcon}
                        alt="Save"
                        onClick={() => handleSaveEdit(user.id)}
                      />
                      <img
                        src={cancelIcon}
                        alt="Cancel"
                        onClick={() => handleCancelEdit(user.id)}
                      />
                    </span>
                  ) : (
                    <img
                      src={editIcon}
                      alt="Edit"
                      onClick={() => handleEdit(user.id)}
                    />
                  )}
                  <img
                    src={delIcon}
                    alt="Delete"
                    onClick={() => handleDelete(user.id)}
                  />
                </td>
              </tr>
            ))}
          </tbody>
        </table>
      </div>

      <div className="bottom">
        <div className="selected-rows-display">
          {`${selectedRows.length} of ${users.length} row(s) selected`}
        </div>
        <div className="navigation">
          <button className="first-page" onClick={() => handlePageChange(1)}>
            First Page
          </button>
          <button
            className="previous-page"
            onClick={() => handlePageChange(currentPage - 1)}
            disabled={currentPage === 1}
          >
            Previous Page
          </button>
          {Array.from({ length: totalPages }, (_, index) => (
            <button
              key={index + 1}
              onClick={() => handlePageChange(index + 1)}
              className={
                currentPage === index + 1
                  ? "current-page"
                  : "page-number-button"
              }
            >
              {index + 1}
            </button>
          ))}
          <button
            className="next-page"
            onClick={() => handlePageChange(currentPage + 1)}
            disabled={currentPage === totalPages}
          >
            Next Page
          </button>
          <button
            className="last-page"
            onClick={() => handlePageChange(totalPages)}
          >
            Last Page
          </button>
        </div>
      </div>
    </div>
  );
};

export default UserManagementComponent;
