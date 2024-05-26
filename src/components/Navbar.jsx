import { Link } from 'react-router-dom';

const Navbar = ({ userState }) => {
    const handleLogout = () => {
        fetch('http://localhost:9000/auth/logout', {
            method: 'POST',
            headers: {
                'Content-Type': 'application/json',
            },
            credentials: 'include',
        }).then(() => {
            window.location.href = '/login';
        });
    };
    return (
        <div className='navbar'>
            <ul>
                <li>
                    <Link to={'/auth/home'}>
                        <i title={userState.role === 'SELLER?' ? 'My Properties' : 'Home'} className={userState.role === 'SELLER' ? "fi fi-br-apps" : "fi fi-br-home"}>
                        </i>
                    </Link>
                </li>
                {/* <li>
                    <Link to={'/auth/issues'}>
                        <i className="fi fi-br-info"></i>
                    </Link>
                </li>
                <li>
                    <Link to={'/auth/payments'}>
                        <i className="fi fi-br-wallet"></i>
                    </Link>
                </li> */}
                <li>
                    <Link to={'/auth/profile'}>
                        <i title='Profile' className="fi fi-br-user"></i>
                    </Link>
                </li>
                <li onClick={handleLogout}><i title='Logout' className="fi fi-br-sign-out-alt"></i></li>

            </ul>
        </div>
    )
}

export default Navbar;