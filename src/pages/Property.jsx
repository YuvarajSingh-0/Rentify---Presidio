import { useEffect, useState } from 'react';
import { useNavigate, useParams } from 'react-router-dom';
import checkUserLoggedIn from '../utils/checkUserLoggedIn';
import supabase from '../utils/supabase';
// TODO: Interest Functionality Mailing
// TODO: Add Realtime Like feature

export default function Property() {
    let { id } = useParams();
    const [property, setProperty] = useState({});
    const [userState, setUserState] = useState(null);
    const [likes, setLikes] = useState(0);
    const [isLiked, setIsLiked] = useState(false);
    const [isLoadingEntirePage, setIsLoadingEntirePage] = useState(true);
    const [isLoadingInterest, setIsLoadingInterest] = useState(false)

    const navigate = useNavigate();
    const checkLiked = async () => {
        if (!userState?.userId) {
            return false;
        }
        return new Promise(async (resolve, reject) => {
            const { data, error } = await supabase
                .from('UserLikes')
                .select('propertyId')
                .eq('propertyId', property.id)
                .eq('userId', userState.userId);
            if (error) {
                alert("Something went wrong please try again later")
                console.log(error);
                return reject(error);
            }
            console.log(data)
            return resolve(data.length > 0)
        });
    };

    // Now you can use the id to load the property data
    const fetchLikeCount = async () => {
        if (!property.id) {
            return;
        }
        const { count, error } = await supabase
            .from('UserLikes')
            .select('propertyId', { count: 'exact' })
            .eq('propertyId', property.id);
        if (!error) {
            // console.log(count)
            setLikes(count);
        }
        if (error) console.log(error);
    };
    useEffect(() => {
        const fetchPropertyDetails = async () => {
            return new Promise(async (resolve, reject) => {
                try {
                    const response = await fetch(`http://localhost:9000/property/${id}`)
                    const data = await response.json()
                    if (data.error || response.status === 500 || data.Error || response.status === 404) {
                        alert("Something went wrong please try again later")
                        return reject(new Error('Property not found'));
                    }
                    setProperty(data);
                    resolve();
                } catch (error) {
                    reject(error);
                }
            });
        }
        fetchPropertyDetails()
            .then(() => {
                setIsLoadingEntirePage(false);
                return checkUserLoggedIn()
            })
            .then((data) => setUserState(data))
            .catch((err) => {
                console.log(err)
            });
    }, [])

    useEffect(() => {
        if (userState?.userId) {
            checkLiked().then((data) => setIsLiked(data))
        }
    }, [userState]);

    useEffect(() => {
        if (!property.id) {
            return;
        }

        // Fetch the initial like count when the component mounts
        fetchLikeCount();
        const subscription = supabase
            .channel('schema-db-changes')
            .on(
                'postgres_changes',
                {
                    // listen to delete and insert
                    event: '*',
                    schema: 'public',
                    table: 'UserLikes',
                },
                (payload) => fetchLikeCount()
            )
            .subscribe()

        // Clean up the subscription when the component unmounts
        return () => {
            return supabase.removeChannel(subscription);
            // supabase.removeChannel(insertSubscription);
        };
    }, [property]);


    const handleLike = async () => {
        checkUserLoggedIn().then(async (userData) => {
            if (isLiked) {
                const { data, error } = await supabase
                    .from('UserLikes')
                    .delete()
                    .eq('propertyId', property.id)
                    .eq('userId', userState.userId);
                if (error) {
                    alert("Something went wrong please try again later")
                    console.log(error);
                    return
                }
                const { data: responseData, error: err } = await supabase.rpc('decrement', { x: 1, row_id: property.id });
                console.log(responseData, err)
                setIsLiked(prev => !prev);
                return
            } else {
                const { data, error } = await supabase
                    .from('UserLikes')
                    .insert([{ propertyId: property.id, userId: userState.userId }]);
                if (error) {
                    alert("Something went wrong please try again later")
                    console.log(error);
                    return
                }
                const { data: responseData, error: err } = await supabase.rpc('increment', { x: 1, row_id: property.id });
                // setIsLiked(true)
                setIsLiked(prev => !prev);
                return
            }
        }).catch((err) => {
            console.log(err)
            alert("Please login to like the property")
            return navigate('/login')
        });

    };

    const handleInterest = async () => {
        setIsLoadingInterest(true)
        checkUserLoggedIn().then(async (userData) => {
            setUserState(userData);
            const response = await fetch(`http://localhost:9000/property/${id}/interest`, {
                method: 'POST',
                credentials: 'include'
            })
            const data = await response.json()
            console.log(data)
            setIsLoadingInterest(false)
            if (data.error) {
                console.log(data.error);
                alert("Something went wrong please try again later")
                setIsLoadingInterest(false)
            }
            alert(data.message || "Interest shown successfully")
        }).catch((err) => {
            console.log(err)
            setIsLoadingInterest(false)
            alert("Please login to show interest")
            return navigate('/login')
        });

    }

    const [currentImageIndex, setCurrentImageIndex] = useState(0);

    const handleNextImage = () => {
        setCurrentImageIndex((currentImageIndex + 1) % property.images.length);
    };

    const handlePreviousImage = () => {
        setCurrentImageIndex((currentImageIndex - 1 + property.images.length) % property.images.length);
    };

    // while the fetch request is in progress
    if (isLoadingEntirePage) {
        return <div>Loading...</div>;
    }
    // Render the property details once the data is loaded
    return (
        property &&
        <div className='p-5'>
            <button onClick={() => navigate(-1)} className='text-blue-600'>Back</button>
            <h2 className='text-3xl text-center uppercase'>{property.name}</h2>
            <div className='h-[600px] rounded-md relative overflow-hidden my-10'>
                <button onClick={handlePreviousImage} className='absolute left-0 top-[50%] z-10 text-white  bg-slate-300 p-3 rounded-full'><i className='fi fi-bs-angle-left flex items-center font-bold text-black'></i></button>
                <button onClick={handleNextImage} className='absolute right-0 top-[50%] z-10 text-white'><i className='fi fi-bs-angle-right flex items-center bg-slate-300 p-3 rounded-full text-black'></i></button>
                <div className=' rounded-md h-full flex items-center'>
                    <img className='w-[90%]  object-contain m-auto' src={property.images?.length > 0 ? property.images[currentImageIndex] : "https://wearehpi.org/wp-content/uploads/2017/07/placeholder.jpg"} alt={property.name} />
                </div>
            </div>
            <div onClick={handleLike} className=' bg-slate-200 px-3 py-2 flex gap-2 w-max m-auto mb-4 rounded-md'>
                <button className='flex items-center'>{isLiked ? <i className='flex items-center text-red-600 fi fi-ss-heart'></i> : <i class="flex items-center fi fi-rs-heart"></i>}</button>
                <p>{likes} likes</p>
            </div>
            <div>
                <h3 className='text-3xl bg-slate-200 rounded-md px-7 py-5'>Property Details</h3>
                <div className='px-7 py-3'>
                    <p className='my-2'><b>Description</b><br />{property.description}</p>
                    <p className='my-2'><b>Price</b><br />{property.price} INR</p>
                    <p className='my-2'><b>Area</b><br />{property.area} sqft</p>
                    <p className='my-2'><b>Info</b><br />{property.bedrooms} Bedrooms, {property.bathrooms} Bathrooms</p>
                    <p><b>Benifits</b><br />
                        <ul>
                            {property.amenities?.map((benefit, index) => <li className='flex capitalize gap-2 py-1' key={index}><i className='fi fi-br-check-circle flex items-center flex-wrap text-blue-500'></i>{benefit}</li>)}
                        </ul>
                    </p>
                </div>
            </div>
            <div>
                <h3 className='text-3xl bg-slate-200 rounded-md px-7 py-5'>Location</h3>
                <div className='px-7 py-3'>
                    <p className='py-2'><b>Address</b><br />{property.location}</p>

                </div>
            </div>
            <div className=''>
                <h3 className='text-3xl bg-slate-200 rounded-md px-7 py-5'>Contact Details</h3>
                <div className='px-7 py-3'>
                    <p className='my-2 capitalize'><b>Seller: </b>{property.owner?.name}</p>
                    <p className='my-2'><b>Contact: </b>{property.owner?.contact}</p>
                    <p className='my-2'><b>Email: </b>{property.owner?.email}</p>
                    <button className='px-3 py-2 bg-blue-600 min-w-24 text-white rounded-md mt-5' onClick={handleInterest}>{isLoadingInterest ? <div className="spinner"></div> : 'Show Interest'}</button>
                </div>
            </div>
        </div>
    );
}
