import { useRef, useState } from 'react';
import handleImageUpload from '../utils/imageUpload';
function MyPropertyCard({ info }) {
    const [isEdit, setIsEdit] = useState(false)
    const [images, setImages] = useState(info.images)
    const descriptionRef = useRef();
    const priceRef = useRef();
    const areaRef = useRef();
    const amenitiesRef = useRef();
    const locationRef = useRef();
    const cityRef = useRef();
    const imageRef = useRef();
    const bedroomsref = useRef();
    const bathroomsRef = useRef();
    const hospitalsRef = useRef();
    const metrosRef = useRef();
    const schoolsRef = useRef();


    const handleDeleteProperty = async () => {
        const response = await fetch('http://localhost:9000/property/delete', {
            method: 'DELETE',
            headers: {
                'Content-Type': 'application/json',
            },
            credentials: 'include',
            body: JSON.stringify({ id: info.id }),
        });
        if (response.status === 204) {
            alert('Property Deleted Successfully')
            window.location.reload()
        }
        else {
            alert('Property not deleted. Try again later.')
        }
    }

    const handleUpload = async (e) => {
        e.preventDefault();
        const file = imageRef.current.files[0];
        const url = await handleImageUpload(file);
        setImages([...images, url])
    }

    const handleEditSave = async () => {
        if (isEdit) {
            // Save the data
            const updatedInfo = {
                id: info.id,
                description: descriptionRef.current.innerText || info.description,
                price: priceRef.current.innerText || info.price,
                area: areaRef.current.innerText || info.area,
                amenities: amenitiesRef.current.innerText || info.amenities,
                location: locationRef.current.innerText || info.location,
                city: cityRef.current.innerText || info.city,
                images: images,
                bedrooms: bedroomsref.current.innerText || info.bedrooms,
                bathrooms: bathroomsRef.current.innerText || info.bathrooms,
                nearbyHospitals: hospitalsRef.current.innerText || info.nearbyHospitals,
                nearbyMetros: metrosRef.current.innerText || info.nearbyMetros,
                nearbySchools: schoolsRef.current.innerText || info.nearbySchools,
            }
            console.log(updatedInfo)
            const response = await fetch('http://localhost:9000/property/update', {
                method: 'PUT',
                headers: {
                    'Content-Type': 'application/json',
                },
                credentials: 'include',
                body: JSON.stringify(updatedInfo),
            });
            console.log(response)
            if (response.status === 200) {
                alert('Data saved successfully')
            }
            else {
                alert('Data not saved')
            }
            window.location.reload()
        }
        setIsEdit(prev => !prev)

    }

    return (
        <div className=' flex sm:flex-row flex-col gap-5 my-9 shadow-md rounded-2xl overflow-hidden bg-white'>
            <div className={`relative w-full lg:w-1/3`} style={{ backgroundImage: `url(${info.images[0] || "https://wearehpi.org/wp-content/uploads/2017/07/placeholder.jpg"})`, backgroundSize: 'cover', backgroundPosition: 'center' }}>
                {info.images.length > 0 && <div className="absolute inset-0 bg-black bg-opacity-50 flex items-center justify-center">
                    <span className="text-white text-4xl">{info.images.length}</span>
                </div>}
            </div>
            <div className='w-full lg:w-2/3 p-5'>
                <h1 className='text-2xl capitalize'>{info.name}</h1>
                <div className='flex items-center'>
                    <span>Description: </span>
                    <p ref={descriptionRef} contentEditable={isEdit} className={`my-2 px-2 rounded-md outline-none text-lg ${isEdit ? 'border border-slate-500' : 'overflow-ellipsis whitespace-nowrap overflow-hidden'} `}>{info.description}</p>
                </div>
                <div className='flex items-center'>
                    <span>Price: </span>
                    <p ref={priceRef} contentEditable={isEdit} className={`my-2 px-2 rounded-md outline-none text-lg ${isEdit ? 'border border-slate-500' : 'overflow-ellipsis whitespace-nowrap overflow-hidden'} `}> {info.price} INR</p>
                </div>
                <div className='flex items-center'>
                    <span>Area: </span>
                    <p ref={areaRef} contentEditable={isEdit} className={`my-2 px-2 rounded-md outline-none text-lg ${isEdit ? 'border border-slate-500' : 'overflow-ellipsis whitespace-nowrap overflow-hidden'} `}>{info.area} sqft</p>
                </div>
                <div className='flex items-center'>
                    <span>Amenities: </span>
                    <p ref={amenitiesRef} contentEditable={isEdit} className={`my-2 px-2 rounded-md outline-none text-lg ${isEdit ? 'border border-slate-500' : 'overflow-ellipsis whitespace-nowrap overflow-hidden'} `}>{info.amenities.join(', ')}</p>
                </div>
                <div className='flex items-center'>
                    <span>Location: </span>
                    <p ref={locationRef} contentEditable={isEdit} className={`my-2 px-2 rounded-md outline-none text-lg ${isEdit ? 'border border-slate-500' : 'overflow-ellipsis whitespace-nowrap overflow-hidden'} `}>{info.location}</p>
                </div>
                <div className='flex items-center'>
                    <span>City: </span>
                    <p ref={cityRef} contentEditable={isEdit} className={`my-2 px-2 rounded-md outline-none text-lg ${isEdit ? 'border border-slate-500' : 'overflow-ellipsis whitespace-nowrap overflow-hidden'} `}>{info.city}</p>
                </div>
                <div className='flex items-center'>
                    <span>Bedrooms: </span>
                    <p ref={bedroomsref} contentEditable={isEdit} className={`my-2 px-2  rounded-md outline-none text-lg ${isEdit ? 'border border-slate-500' : 'overflow-ellipsis whitespace-nowrap overflow-hidden'} `}>{info.bedrooms}</p>
                </div>
                <div className='flex items-center'>
                    <span>Bathrooms: </span>
                    <p ref={bathroomsRef} contentEditable={isEdit} className={`my-2 px-2 rounded-md outline-none text-lg ${isEdit ? 'border border-slate-500' : 'overflow-ellipsis whitespace-nowrap overflow-hidden'} `}>{info.bathrooms}</p>
                </div>
                <div className='flex items-center'>
                    <span>Hospitals: </span>
                    <p ref={hospitalsRef} contentEditable={isEdit} className={`my-2 px-2 rounded-md outline-none text-lg ${isEdit ? 'border border-slate-500' : 'overflow-ellipsis whitespace-nowrap overflow-hidden'} `}>{info.nearbyHospitals.length== 0 ? 'empty' : info.nearbyHospitals}</p>
                </div>
                <div className='flex items-center'>
                    <span>Metros: </span>
                    <p ref={metrosRef} contentEditable={isEdit} className={`my-2 px-2 rounded-md outline-none text-lg ${isEdit ? 'border border-slate-500' : 'overflow-ellipsis whitespace-nowrap overflow-hidden'} `}>{info.nearbyMetros.length == 0 ? 'empty':info.nearbyMetros}</p>
                </div>
                <div className='flex items-center'>
                    <span>Schools: </span>
                    <p ref={schoolsRef} contentEditable={isEdit} className={`my-2 px-2 rounded-md outline-none text-lg ${isEdit ? 'border border-slate-500' : 'overflow-ellipsis whitespace-nowrap overflow-hidden'} `}>{info.nearbySchools.length==0 ? 'empty':info.nearbySchools}</p>
                </div>
                {isEdit && <div>
                    <input type="file" ref={imageRef} onChange={handleUpload} />
                    <div className='flex gap-3 overflow-x-scroll pr-3'>
                        {images.map((image, index) => <img key={index} src={image} className='object-contain w-28 mt-5' alt="" />)}
                    </div>
                </div>}
                <div className='flex justify-end gap-3 '>
                    <button className='shadow-sm bg-red-600 text-white px-3 py-2 rounded-md' onClick={handleDeleteProperty}>Delete</button>
                    <button className='shadow-sm float-right text-white bg-purple-600 px-3 py-2 rounded-md' onClick={handleEditSave}>{isEdit ? 'Save' : 'Edit'}</button>
                </div>
                
            </div>
            {/* <pre>
                {JSON.stringify(info, null, 2)}
            </pre> */}
        </div>
    )
}

export default MyPropertyCard;