import { useState, useEffect, useRef } from "react";
import PropertyCard from "../components/PropertyCard";
import { useNavigate } from "react-router-dom";
import checkUserLoggedIn from "../utils/checkUserLoggedIn";

// TODO: Pagination

const LandingPage = () => {
    const navigate = useNavigate();
    const searchValue = useRef();
    const [properties, setProperties] = useState();
    const [sortedData, setSortedData] = useState();
    const [currentPage, setCurrentPage] = useState(1);
    const [itemsPerPage, setItemsPerPage] = useState(8);
    const [sortBy, setSortBy] = useState('');
    const [order, setOrder] = useState('');
    const [isLastPage, setIsLastPage] = useState(false);

    const [isOpen, setIsOpen] = useState(false);
    const [minPrice, setMinPrice] = useState(0);
    const [maxPrice, setMaxPrice] = useState(1000000000);
    const [schoolDistance, setSchoolDistance] = useState(0);
    const [metroDistance, setMetroDistance] = useState(0);
    const [hospitalDistance, setHospitalDistance] = useState(0);
    const [searchWord, setSearchWord] = useState('');
    const [isLoading, setIsLoading] = useState(true);
    const [userState, setUserState] = useState({});
    useEffect(() => {
        const fetchProperties = async () => {
            setIsLoading(true);
            let url = `${process.env.REACT_APP_BACKEND_URL}`
            const response = await fetch(`${url}/property/all?page=${currentPage}&limit=${itemsPerPage}&sort=${sortBy}&order=${order}&search=${searchValue.current.value}&minPrice=${minPrice}&maxPrice=${maxPrice}&schoolDistance=${schoolDistance}&metroDistance=${metroDistance}&hospitalDistance=${hospitalDistance}`)
            if (response.status === 500) {
                alert('Something went wrong. Please try again later')
                return navigate('/')
            }
            const data = await response.json()
            if (data.error) {
                alert("Something went wrong please try again later")
                return navigate('/')
            }
            setProperties(data)
            setSortedData(data)
            setIsLastPage(data.length < itemsPerPage);
            setIsLoading(false);
        }
        function fetchPropertiesDebounce() {
            const timeout = setTimeout(fetchProperties, 1000)
            return () => clearTimeout(timeout)
        }
        fetchPropertiesDebounce();
    }, [currentPage, itemsPerPage, sortBy, order, searchWord, minPrice, maxPrice, schoolDistance, metroDistance, hospitalDistance]);

    useEffect(() => {
        checkUserLoggedIn().then((d) => setUserState(d)).catch((e)=>console.log(e));
    }, [])

    async function handleSearch(e) {
        e.preventDefault();
        const search = searchValue.current.value;
        if (search === "") {
            setSortedData(properties)
        } else {
            setSearchWord(search)
        }
    }

    useEffect(() => {
        if (minPrice > maxPrice) {
            alert('Minimum price cannot be greater than maximum price')
        }
    }, [minPrice, maxPrice])

    return (
        <div className="mt-10">
            <div className="flex items-center justify-between mb-8">
                {isLoading ? <h1>Loading...</h1> : <h1 className="text-3xl">Browse Properties</h1>}
                <div className="flex flex-col md:flex-row gap-5">
                    <div className="relative inline-block text-left">
                        <div>
                            <button type="button" onClick={() => setIsOpen(!isOpen)} className="text-center px-5 py-2 inline-flex justify-center w-full rounded-2xl border border-gray-300 shadow-sm bg-white text-gray-700 hover:bg-gray-50 focus:outline-none focus:ring-2 focus:ring-offset-gray-100 focus:ring-orange-500" id="options-menu" aria-haspopup="true" aria-expanded="true">
                                <p className="text-center m-auto">Filter Properties  {isOpen ? <>&uarr;</> : <>&darr;</>}</p>
                            </button>
                        </div>
                        {isOpen && (

                            <div role="menu" aria-orientation="vertical" aria-labelledby="options-menu" className="origin-top-right absolute z-10 right-0 top- min-w-64 rounded-md shadow-lg bg-white ring-1 ring-black ring-opacity-5">
                                <div className="px-4 py-2">
                                    <label className="block">Price between {minPrice.toLocaleString('en-US')} and {maxPrice.toLocaleString('en-US')}</label>
                                    <input type="range" min="500000" max="100000000" value={minPrice} onChange={(e) => setMinPrice(Number(e.target.value))} className="mt-1 block w-full rounded-md border-gray-300 shadow-sm focus:border-indigo-300 focus:ring focus:ring-indigo-200 focus:ring-opacity-50" />
                                    <input type="range" min="500000" max="100000000" value={maxPrice} onChange={(e) => setMaxPrice(Number(e.target.value))} className="mt-1 block w-full rounded-md border-gray-300 shadow-sm focus:border-indigo-300 focus:ring focus:ring-indigo-200 focus:ring-opacity-50" />
                                </div>
                                <div className="px-4 py-2">
                                    <label className="block">School Distance less than {schoolDistance} km</label>
                                    <input min={5} max={100} type="range" placeholder="Max Distance" onChange={(e) => setSchoolDistance(Number(e.target.value))} className="mt-1 block w-full rounded-md border-gray-300 shadow-sm focus:border-indigo-300 focus:ring focus:ring-indigo-200 focus:ring-opacity-50" />
                                </div>
                                <div className="px-4 py-2">
                                    <label className="block">Metro Distance less than {metroDistance} km</label>
                                    <input min={5} max={100} type="range" placeholder="Max Distance" onChange={(e) => setMetroDistance(Number(e.target.value))} className="mt-1 block w-full rounded-md border-gray-300 shadow-sm focus:border-indigo-300 focus:ring focus:ring-indigo-200 focus:ring-opacity-50" />
                                </div>
                                <div className="px-4 py-2">
                                    <label className="block">Hospital Distance less than {hospitalDistance} km</label>
                                    <input min={5} max={100} type="range" placeholder="Max Distance" onChange={(e) => setHospitalDistance(Number(e.target.value))} className="mt-1 block w-full rounded-md border-gray-300 shadow-sm focus:border-indigo-300 focus:ring focus:ring-indigo-200 focus:ring-opacity-50" />
                                </div>
                            </div>
                        )}
                    </div>
                    <select onChange={(e) => {
                        e.preventDefault();
                        console.log(e.target.value)
                        const [sort, order] = e.target.value.split('-');
                        setSortBy(sort);
                        setOrder(order);
                    }} className="px-5 py-2 rounded-2xl focus:outline-none focus:ring-2 focus:ring-offset-gray-100 focus:ring-orange-500 shadow-sm">
                        <option className="px-3 py-1" value="">Sort by</option>
                        <option className="px-3 py-1" value="price-asc">Price Increasing</option>
                        <option className="px-3 py-1" value="price-desc">Price Decreasing</option>
                        <option className="px-3 py-1" value="likesCount-desc">Most Liked</option>
                        <option className="px-3 py-1" value="likesCount-asc">Least Liked</option>
                    </select>
                    <form onSubmit={handleSearch}>
                        <div className="searchbar ">
                            <input ref={searchValue} type="text" className="border w-full outline-orange-300 pl-3 pr-20 py-2 rounded-2xl  focus:outline-none focus:ring-2 focus:ring-offset-gray-100 focus:ring-orange-500 shadow-sm" placeholder="Search by Keywords..." />
                            <button className="absolute right-0 py-2 px-5 bg-orange-500 cursor-pointer text-white rounded-2xl" type="submit">Enter</button>
                        </div>
                    </form>
                </div>
            </div>
            {sortedData?.length === 0 && <h1>No Properties Found</h1>}

            <div className="grid mb-5">
                {sortedData?.map((item, key) => <PropertyCard key={key} info={item} />)}
            </div>
            <div className="mt-10 w-max m-auto flex gap-4">
                <button className={` rounded-md px-4 py-2 ${currentPage == 1 ? 'bg-slate-200 text-slate-500' : 'bg-slate-300 text-black'}`} onClick={() => setCurrentPage(prev => prev - 1)} disabled={currentPage === 1}>Previous</button>
                <button className={` rounded-md px-4 py-2 ${isLastPage ? 'bg-slate-200 text-slate-500' : 'bg-slate-300 text-black'}`} onClick={() => setCurrentPage(prev => prev + 1)} disabled={isLastPage}>Next</button>
            </div>
            {!userState.userId ? <a href="/login" className="bg-blue-600 px-3 py-2 rounded-md shadow-2xl text-white fixed bottom-10 right-10 ">Login</a> : userState.role==='SELLER' ? <a href="/auth/home" className="bg-blue-600 px-3 py-2 rounded-md text-white shadow-2xl fixed bottom-10 right-10 ">Dashboard</a>: <a href="/auth/home" className="bg-blue-600 px-3 py-2 rounded-md text-white shadow-2xl fixed bottom-10 right-10 ">Home</a>}
        </div>
    )
}

export default LandingPage;