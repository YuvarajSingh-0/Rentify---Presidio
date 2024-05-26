import { useEffect, useState } from 'react';
import { useNavigate } from 'react-router-dom';
import '../../src/App.css';
import checkUserLoggedIn from '../utils/checkUserLoggedIn';

const Login = () => {
    const [formDetails, setFormDetails] = useState({ email: "", password: "" });
    const navigate = useNavigate();
    const [loading, setLoading] = useState(false);

    useEffect(() => {
        const checkLoginStatus = async () => {
            try {
                const result = await checkUserLoggedIn();
                console.log(result)
                if (!result.error) {
                    navigate('/auth/home');
                }
            } catch (err) {
                console.log(err)
            }
        }
        checkLoginStatus();
    }, [navigate]);

    const logInWithEmailAndPassword = async (email, password) => {
        setLoading(true);
        fetch(`${process.env.REACT_APP_BACKEND_URL}/auth/login`, {
            method: 'POST',
            headers: {
                'Content-Type': 'application/json',
            },
            credentials: 'include',
            body: JSON.stringify({ email, password }),
        })
            .then((res) => res.json())
            .then((data) => {
                if (data.error) {
                    console.log(data);
                    alert(data.error);
                }
                else {
                    navigate('/auth/home');
                }
                setLoading(false);
            })
            .catch((error) => ({ error: true, message: error.message }))
    }


    const handleFormSubmit = (e) => {
        e.preventDefault();
        setLoading(true);
        logInWithEmailAndPassword(formDetails.email, formDetails.password);
    };

    const handleFormInput = (e) => {
        e.preventDefault();
        setFormDetails((prev) => ({
            ...prev,
            [e.target.name]: e.target.value,
        }));
    };


    return (
        <div className='login-page'>
            <h1 className='login-header text-5xl text-slate-800 font-bold'>Login</h1>
            <form className='login-form' onSubmit={handleFormSubmit}>
                <input onChange={handleFormInput} type="email" placeholder="Email" name="email" id="email" required />
                <input onChange={handleFormInput} type="password" placeholder="Password" name="password" id="password" required />
                <button type="submit" className='login-btn'>Login</button>
                <hr style={{ width: "100%", color: "#c9caca" }} />
            </form>
            <div className='register'>
                <p>Don't have an account? <a className='text-blue-500 underline' href='/register'>Create one</a></p>
            </div>
        </div>
    )
}

export default Login;