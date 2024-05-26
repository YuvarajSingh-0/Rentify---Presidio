import { useEffect, useState } from 'react';
import MyPropertyCard from '../components/MyPropertyCard';


const Profile = ({ userState }) => {
    const [disableInput, setDisableInput] = useState(true);
    const [details, setDetails] = useState([]);
    const [properties, setProperties] = useState([]);
    //['name', 'phone', 'email', 'properties', 'active properties'
    const handleChange = (e) => {
        const { name, value } = e.target;
        setDetails({ ...details, [name]: value });
    }

    const handleProfileEdit = () => {
        if (disableInput) {
            setDisableInput(false)
        } else {
            setDisableInput(true)
            fetch('http://localhost:9000/user', {
                method: 'PUT',
                headers: {
                    'Content-Type': 'application/json',
                },
                credentials: 'include',
                body: JSON.stringify(details),
            })
                .then((res) => res.json())
                .then((data) => {
                    console.log(data)
                    if (data.error) {
                        alert("Something went wrong please try again later")
                    }
                    else{
                        alert("Profile Updated Successfully")
                    }
                })
            
        }
    }


    useEffect(() => {
        const fetchProperties = async () => {
            {
                const response = await fetch('http://localhost:9000/user', { credentials: 'include' })
                const data = await response.json()
                console.log(data)
                setDetails(data)
            }

            const response = await fetch('http://localhost:9000/property/self', { credentials: 'include' })
            const data = await response.json()
            console.log(data)
            if (response.error) {
                alert("Something went wrong please try again later")
                window.location.reload()
            }
            setProperties(data)
        }

        fetchProperties();
    }, []);


    return (
        <div>
            <div className="profile-header">
                <h1 className='text-4xl'>Profile</h1>
                <div onClick={handleProfileEdit}>
                    {disableInput ? <i class="fi fi-br-edit"></i> : <i class="fi fi-br-check"></i>}
                </div>
            </div>
            <div className="profile-info">
                <table>
                    <tr>
                        <td>Name</td>
                        <td><input name="name" disabled={disableInput} onChange={handleChange} type="text" value={details.name}></input></td>
                    </tr>
                    <tr>
                        <td>Phone</td>
                        <td><input name="contact" disabled={disableInput} onChange={handleChange} type="number" value={details.contact}></input></td>
                    </tr>
                    <tr>
                        <td>Email</td>
                        <td><input name="email" disabled={disableInput} onChange={handleChange} type="text" value={details.email}></input></td>
                    </tr>
                    {userState.role === 'SELLER' && <tr>
                        <td>Total Properties</td>
                        <td><input name="properties" disabled={true} type="text" value={properties.length}></input></td>
                    </tr>}
                </table>
            </div>
            {userState.role === 'SELLER' && <div>
                <h1 className='text-4xl'>Edit/Delete Properties</h1>
                <div className="property-cards">
                    {properties.map(property => <MyPropertyCard info={property} />)}
                </div>
            </div>}
        </div>
    )
}

export default Profile;