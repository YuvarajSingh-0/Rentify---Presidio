import { useState, useRef, useEffect } from 'react';
import supabase from '../utils/supabase';
import { useNavigate } from 'react-router-dom';
import handleImageUpload from '../utils/imageUpload';

function NewPropertyPage() {
    const [images, setImages] = useState([])
    const [hospitalDistance, setHospitalDistance] = useState(0);
    const [metroDistance, setMetroDistance] = useState(0);
    const [schoolDistance, setSchoolDistance] = useState(0);

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
            value.hospitalDistance = hospitalDistance;
            value.metroDistance = metroDistance;
            value.schoolDistance = schoolDistance;
            if (images.length > 0) {
                value.images = images;
            }
            else {
                value.images = []
            }
            console.log(value)
            const response = await fetch(`${process.env.REACT_APP_BACKEND_URL}/property/new`, {
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
                    <input required placeholder="Swimming Pool, Backyard" id="amenities" type="text" name="amenities" />
                    <input required placeholder="900 sqft" id="property_type" type="text" name="area" />
                    <input required className="mb-0 pb-0" placeholder="$$$" id="rent" type="number" name="price" />
                    <hr />
                    <input placeholder="Nearby Metros" id="nearbyMetros" type="text" name="nearbyMetros" />
                    <div className='flex flex-col mb-5'>
                        <label htmlFor="metroDistance">Distance to nearest Metro: {metroDistance}</label>
                        <input id='metroDistance' onChange={(e) => setMetroDistance(Number(e.target.value))} className='w-96' type="range" min={0} max={100} value={metroDistance} name='metroDistance' />
                    </div>
                    <hr />
                    <input placeholder="Nearby Schools" id="nearbySchools" type="text" name="nearbySchools" />
                    <div className='flex flex-col mb-5'>
                        <label htmlFor="schoolDistance">Distance to nearest School: {schoolDistance}</label>
                        <input id='schoolDistance' onChange={(e) => setSchoolDistance(Number(e.target.value))} className='w-96' type="range" min={0} max={100} value={schoolDistance} name='schoolDistance' />
                    </div>
                    <hr />
                    <input placeholder="Nearby Hospitals" id="nearbyHospitals" type="text" name="nearbyHospitals" />
                    <div className='flex flex-col mb-5'>
                        <label htmlFor="hospitalDistance">Distance to nearest Hospital: {hospitalDistance}</label>
                        <input id='hospitalDistance' onChange={(e) => setHospitalDistance(Number(e.target.value))} className='w-96' type="range" min={0} max={100} value={hospitalDistance} name='hospitalDistance' />
                    </div>
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