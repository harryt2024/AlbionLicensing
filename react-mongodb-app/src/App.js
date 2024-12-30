// Frontend: React Application
import React, { useState } from 'react';
import axios from 'axios';

const App = () => {
    const [username, setUsername] = useState('');
    const [password, setPassword] = useState('');
    const [token, setToken] = useState('');
    const [value, setValue] = useState('');
    const [data, setData] = useState([]);

    const handleRegister = async () => {
        try {
            await axios.post('http://localhost:5000/api/register', { username, password });
            alert('Registration successful');
        } catch (err) {
            console.error(err);
            alert('Registration failed');
        }
    };

    const handleLogin = async () => {
        try {
            const response = await axios.post('http://localhost:5000/api/login', { username, password });
            setToken(response.data.token);
            alert('Login successful');
        } catch (err) {
            console.error(err);
            alert('Login failed');
        }
    };

    const handleAddData = async () => {
        try {
            await axios.post('http://localhost:5000/api/data', { token, value });
            alert('Data added successfully');
            setValue(''); // Clear input field
            fetchData(); // Refresh data
        } catch (err) {
            console.error(err);
            alert('Failed to add data');
        }
    };

    const fetchData = async () => {
        try {
            const response = await axios.get('http://localhost:5000/api/data', {
                headers: { token },
            });
            setData(response.data);
        } catch (err) {
            console.error(err);
            alert('Failed to fetch data');
        }
    };

    return (
        <div style={{ padding: '20px' }}>
            <h1>React + MongoDB Project</h1>

            <div style={{ marginBottom: '20px' }}>
                <h2>Register</h2>
                <input
                    type="text"
                    placeholder="Username"
                    value={username}
                    onChange={(e) => setUsername(e.target.value)}
                />
                <input
                    type="password"
                    placeholder="Password"
                    value={password}
                    onChange={(e) => setPassword(e.target.value)}
                />
                <button onClick={handleRegister}>Register</button>
            </div>

            <div style={{ marginBottom: '20px' }}>
                <h2>Login</h2>
                <input
                    type="text"
                    placeholder="Username"
                    value={username}
                    onChange={(e) => setUsername(e.target.value)}
                />
                <input
                    type="password"
                    placeholder="Password"
                    value={password}
                    onChange={(e) => setPassword(e.target.value)}
                />
                <button onClick={handleLogin}>Login</button>
            </div>

            {token && (
                <div style={{ marginBottom: '20px' }}>
                    <h2>Add Data</h2>
                    <input
                        type="text"
                        placeholder="Value"
                        value={value}
                        onChange={(e) => setValue(e.target.value)}
                    />
                    <button onClick={handleAddData}>Add</button>
                </div>
            )}

            {token && (
                <div>
                    <h2>Your Data</h2>
                    <button onClick={fetchData}>Refresh</button>
                    <ul>
                        {data.map((item) => (
                            <li key={item._id}>{item.value}</li>
                        ))}
                    </ul>
                </div>
            )}
        </div>
    );
};

export default App;
