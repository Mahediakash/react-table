import React, { useState } from 'react';
import axios from 'axios';

const CreateUser = ({ onCreateUser, onClose }) => {
    // Define state for form fields
    const [formData, setFormData] = useState({
        name: '',
        email: '',
        address: {
            city: '',
            state: ''
        },
    });

    // Function to handle input changes
    const handleInputChange = (e) => {
        const { name, value } = e.target;
        if (name === 'city') {
            setFormData({...formData,
                address: {...formData.address,
                    city: value,
                },
            });
        } else {
            setFormData({...formData,
                [name]: value,
            });
        }
    };

    // Function to handle form submission
    const handleSubmit = async (e) => {
        e.preventDefault();
        axios.post('https://jsonplaceholder.typicode.com/users', formData)
            .then((response) => {
                console.log('User created successfully:', response.data);
                // Pass the newly created user data back to the parent component
                onCreateUser({
                    name: formData.name,
                    email: formData.email,
                    address: {
                        city: formData.address.city }
                });

                // Close the modal after submission
                onClose();
            })
            .catch((error) => {
                console.error('Error creating user:', error);
            });
    };

    return (
        <div className='py-6 px-6'>
            <h2 className="text-blue-500 text-3xl font-bold mb-4">Create New User</h2>
            <form className='text-black flex flex-col' onSubmit={handleSubmit}>
                <div className="mb-2">
                    <label className="flex py-2 text-lg">Organization Name:</label>
                    <input
                        type="text"
                        name="name"
                        value={formData.name}
                        placeholder="Organization Name"
                        onChange={handleInputChange}
                        className="text-sm border flex pl-2 py-2 pr-52 rounded-md w-full"
                        required
                    />
                </div>
                <div className="mb-2">
                    <label className="flex py-2 text-lg">Email:</label>
                    <input
                        type="email"
                        name="email"
                        placeholder="Email"
                        value={formData.email}
                        onChange={handleInputChange}
                        className="text-sm border p-2 rounded-md w-full"
                        required
                    />
                </div>
                <div className="mb-2">
                    <label className="flex py-2 text-lg">Address:</label>
                    <input
                        type="text"
                        name="city"
                        placeholder="City"
                        value={formData.address.city}
                        onChange={handleInputChange}
                        className="text-sm border p-2 rounded-md w-full"
                        required
                    />
                </div>
                <div className="flex gap-5 mt-6">
                    <button type="submit" className=" text-sm px-4 py-2 bg-blue-500 text-white rounded-md">
                        Create
                    </button>
                    <button type="button" onClick={onClose} className="text-sm px-4 py-2 bg-gray-300 text-black rounded-md">
                        Cancel
                    </button>
                </div>
            </form>
        </div>
    );
};

export default CreateUser;
