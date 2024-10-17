import React, { useEffect, useState } from 'react';
import axios from 'axios';
import CreateUser from "./components/create";
import DataTable from 'react-data-table-component';

const UserTable = () => {
    const [users, setUsers] = useState([]);
    const [filteredUsers, setFilteredUsers] = useState([]);  // For filtering users
    const [showPopup, setShowPopup] = useState(false);       // Popup state
    const [selectedUser, setSelectedUser] = useState(null);  // Store selected user for editing

    const usersPerPage = 5;

    // Fetch data from local or remote API using Axios
    useEffect(() => {
        fetchUsers();
    }, []);

    const fetchUsers = () => {
        axios
            .get('https://jsonplaceholder.typicode.com/users')
            .then((response) => {
                setUsers(response.data);            // Set the fetched data in state
                setFilteredUsers(response.data);    // Initialize filtered users with all users
            })
            .catch((error) => {
                console.error('Error fetching data:', error);
            });
    };

    // Function to handle adding a new user with shifting IDs
    const handleCreateUser = (newUser) => {
        const updatedUsers = users.map(user => ({ ...user, id: user.id + 1 }));
        setUsers([{ id: 1, ...newUser }, ...updatedUsers]);
        setFilteredUsers([{ id: 1, ...newUser }, ...updatedUsers]);  // Also update filtered users
    };

    // Function to handle deleting a user
    // const handleDeleteUser = (userId) => {
    //     const updatedUsers = users.filter(user => user.id !== userId);  // Remove user by ID
    //     setUsers(updatedUsers);
    //     setFilteredUsers(updatedUsers);  // Also update filtered users
    // };

    // Function to handle editing a user
    // const handleEditUser = (user) => {
    //     setSelectedUser(user);    // Store user to edit
    //     setShowPopup(false);       // Open the popup to edit
    // };

    const columns = [
        {
            name: 'ID',
            selector: row => row.id,
            sortable: true,
            width: '60px',
        },
        {
            name: 'Name',
            selector: row => row.name,
            sortable: true,
        },
        {
            name: 'Email',
            selector: row => row.email,
            sortable: true,
            width: '15rem'
        },
        {
            name: 'City',
            selector: row => row.address.city,
            sortable: true,
        },
        {
            name: 'Actions',
            width: '10rem',// Action column with Edit and Delete buttons
            selector: row => (
                <div className="flex gap-2">
                    <button
                        onClick={() => (null)}
                        className="px-2 py-1 bg-yellow-500 text-white rounded"
                    >
                        Edit
                    </button>
                    <button
                        // onClick={() => handleDeleteUser(row.id)}
                        className="px-2 py-1 bg-red-500 text-white rounded"
                    >
                        Delete
                    </button>
                </div>
            ),

        }
    ];

    const customStyles = {
        table: {
            style: {
                border: '1px solid #ddd',
            }
        },
        pagination: {
            style:{
                padding: '5px',
                borderTop: '1px solid #23a3e1',
                backgroundColor: 'rgba(35,163,225,0)',
            }
        },
        headCells: {
            style:{
                backgroundColor: '#23a3e1',
                color: 'white',
            }
        },

        rows: {
            style: {
                backgroundColor: '#ffffff',
                padding: '8px',
                fontSize: '14px',
                color: '#555',
                borderBottom: '1px solid #ddd',
            }
        }
    }

    const handleSearch = (e) => {
        const query = e.target.value.toLowerCase();  // Convert input to lowercase for case-insensitive search
        const filtered = users.filter(user =>
            user.name.toLowerCase().includes(query)  // Filter users by name
        );
        setFilteredUsers(filtered);  // Update the filtered users
    };

    return (
        <div className='flex justify-center flex-col gap-5 w-fit'>
            {/* Top section with search and create buttons */}
            <div className='flex justify-between items-center'>
                <h2 className='text-2xl font-bold text-blue-500'>User List</h2>

                <div className='flex gap-4'>
                    {/* Search input */}
                    <input
                        onChange={handleSearch}
                        placeholder='Search by name'
                        className='text-sm px-2 text-black border-2 rounded-md'
                    />

                    {/* Button to open popup for creating new user */}
                    <button
                        onClick={() => setShowPopup(true)}
                        className="text-sm px-4 py-2 bg-blue-500 text-white rounded-md"
                    >
                        Create New User
                    </button>
                </div>
            </div>

            {/* Table to display user list */}
            <DataTable
                columns={columns}
                data={filteredUsers}  // Show filtered users in the table
                pagination
                customStyles={customStyles}
                paginationPerPage={usersPerPage}
                highlightOnHover
                paginationComponentOptions={{ noRowsPerPage: true }}  // Removes "Rows per page" dropdown
            />

            {/* Popup modal for creating or editing a user */}
            {showPopup && (
                <div className="fixed inset-0 bg-gray-600 bg-opacity-75 flex items-center justify-center">
                    <div className="bg-white p-5 rounded-md shadow-lg">
                        <CreateUser
                            user={selectedUser}
                            onCreateUser={handleCreateUser}
                            onClose={() => {
                                setShowPopup(false);
                                setSelectedUser(null);
                            }}
                        />
                    </div>
                </div>
            )}
        </div>
    );
};

export default UserTable;
