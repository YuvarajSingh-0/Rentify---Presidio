import React, { useState, useEffect } from 'react';

function Register() {
    const [password, setPassword] = useState('');
    const [confirmPassword, setConfirmPassword] = useState('');
    const [passwordsMatch, setPasswordsMatch] = useState(false);

    useEffect(() => {
        setPasswordsMatch(password === confirmPassword);
    }, [password, confirmPassword]);

    const handleSubmit = async (e) => {
        e.preventDefault();
        if (!passwordsMatch) {
            alert('Passwords do not match');
            return;
        }
        const data = new FormData(e.target);
        const value = Object.fromEntries(data.entries());
        const response = await fetch(`${process.env.REACT_APP_BACKEND_URL}/auth/register`, {
            method: 'POST',
            headers: {
                'Content-Type': 'application/json',
            },
            body: JSON.stringify(value),
        });
        if (response.status === 201) {
            alert('Registration successful');
            window.location.href = '/login';
        }
        else {
            alert('Registration failed');
        }
    }

    return (
        <form onSubmit={handleSubmit} className="m-auto w-1/3 mt-10">
            <h1 className="text-3xl font-bold text-center">Register</h1>
            <input name='name' type="text" placeholder="Full Name" className="rounded-md border p-2 mt-4 w-full" />
            <input name='email' type="text" placeholder="Email" className="rounded-md border p-2 mt-4 w-full" required />
            <input name='contact' type="text" placeholder="Phone" className="rounded-md border p-2 mt-4 w-full" required />
            <input type="password" placeholder="Password" className="rounded-md border p-2 mt-4 w-full" required onChange={e => setPassword(e.target.value)} />
            <input name='password' type="password" placeholder="Confirm Password" className="rounded-md border p-2 mt-4 w-full" required onChange={e => setConfirmPassword(e.target.value)} />
            {password !== '' && (passwordsMatch ? <small className='text-green-700'>Passwords matched</small> : <small className='text-red-600'>Passwords do not match</small>)}
            <select name="role" defaultValue={"SELLER"} id="role" className="rounded-md border p-2 mt-4 w-full">
                <option value="SELLER">Providing Properties</option>
                <option value="BUYER">Searching for Properties</option>
            </select>
            <button type='submit' class="bg-blue-500 text-white px-4 py-2 mt-4 rounded hover:bg-blue-600">Register</button>

        </form>
    );
}

export default Register;