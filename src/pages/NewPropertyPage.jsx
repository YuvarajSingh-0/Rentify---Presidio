import { useState, useRef, useEffect } from 'react';
import supabase from '../utils/supabase';
import { useNavigate } from 'react-router-dom';
import handleImageUpload from '../utils/imageUpload';

function NewPropertyPage() {
    const [images, setImages] = useState([])
    const navigate = useNavigate();
    const fileInput = useRef();
    const handleUpload = async (e) => {
        e.preventDefault()
        const file = fileInput.current.files[0];
        const url = await handleImageUpload(file);
        setImages([...images, url])
        // console.log(url)
    }

    const handleSubmit = async (e) => {
        e.preventDefault()
        const data = new FormData(e.target);
        const value = Object.fromEntries(data.entries());
        // console.log(value)
        try {
            // Send the data to the server
            console.log(value)
            if (images.length > 0) {
                value.images = images;
            }
            else {
                value.images = []
            }
            const response = await fetch('http://localhost:9000/property/new', {
                method: 'POST',
                headers: {
                    'Content-Type': 'application/json',
                },
                credentials: 'include',
                body: JSON.stringify(value),
            });
            navigate('/auth/home')

        } catch (e) {
            console.log(e);
            alert('Error');
        }

    }

    return (
        <div className='flex'>

            <div className='add-house-card flex flex-col items-center justify-evenly p-8 relative rounded-r-lg bg-white shadow-md transition-all duration-200 ease-in overflow-hidden flex-1'>
                <form className="addhouseform" method="POST" onSubmit={handleSubmit}>
                    <input required placeholder="Property Name" id="property_name" type="text" name="property_name" />
                    <input required placeholder="xyz Blakers Street, London" id="location" type="text" name="location" />
                    <input required placeholder="London" id="city" type="text" name="city" />
                    <input required placeholder="Bedrooms" id="bedrooms" type="number" name="bedrooms" />
                    <input required placeholder="Bathrooms" id="bathrooms" type="number" name="bathrooms" />
                    <input required placeholder="Nearby Metros" id="nearbyMetros" type="text" name="nearbyMetros" />
                    <input required placeholder="Nearby Schools" id="nearbySchools" type="text" name="nearbySchools" />
                    <input required placeholder="Nearby Hospitals" id="nearbyHospitals" type="text" name="nearbyHospitals" />
                    <input required placeholder="900 sqft" id="property_type" type="text" name="area" />
                    <div className="flex flex-col">
                        <input required className="mb-0 pb-0" placeholder="$$$" id="rent" type="number" name="price" />
                    </div>

                    <input required placeholder="Swimming Pool, Backyard" id="amenities" type="text" name="amenities" />
                    <textarea required placeholder="Description/Additional information about property" type="text" id="description" name="description" />
                    <input required type="file" name="images" onChange={handleUpload} ref={fileInput} />
                    <div className='flex-1 flex gap-3'>
                        <div className='w-24 flex gap-3'>
                            {images.map((image, index) => <img key={index} src={image} className='object-contain' alt="" />)}
                        </div>
                    </div>
                    <button className="px-3 py-2 text-white bg-blue-500 rounded-full w-1/2 m-auto" type="submit">Add</button>
                </form>
            </div>
        </div>
    );
}

export default NewPropertyPage;