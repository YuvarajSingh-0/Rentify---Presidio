import { useState, useEffect, useRef } from "react";
import PropertyCard from "../components/PropertyCard";
import { useNavigate } from "react-router-dom";

// TODO: Pagination

const Home = ({ userState }) => {
    const searchValue = useRef();
    const [properties, setProperties] = useState();
    const [sortedData, setSortedData] = useState();
    const navigate = useNavigate();
    const [currentPage, setCurrentPage] = useState(1);
    const [itemsPerPage, setItemsPerPage] = useState(8);
    const [sortBy, setSortBy] = useState('');
    const [order, setOrder] = useState('');
    const [isLastPage, setIsLastPage] = useState(false);

    useEffect(() => {
        // console.log(userState);

        const fetchProperties = async () => {
            // console.log(role)
            if (userState.role === 'BUYER') {

                const response = await fetch(`http://localhost:9000/property/all?page=${currentPage}&limit=${itemsPerPage}&sort=${sortBy}&order=${order}&search=${searchValue.current.value}`)
                const data = await response.json()
                console.log(data)
                if (data.error) {
                    alert("Something went wrong please try again later")
                }
                setProperties(data)
                setSortedData(data)
                setIsLastPage(data.length < itemsPerPage);
            } else if (userState.role === 'SELLER') {
                const response = await fetch(`http://localhost:9000/property/self?page=${currentPage}&limit=${itemsPerPage}&sort=${sortBy}&order=${order}&search=${searchValue.current.value}`, { credentials: 'include' })
                const data = await response.json()
                // console.log(data)
                if (data.error) {
                    alert("Something went wrong please try again later")
                }
                setProperties(data)
                setSortedData(data)

            }
        }

        fetchProperties();
    }, [userState, currentPage, itemsPerPage, sortBy, order]);

    async function handleSearch(e) {
        e.preventDefault();
        const search = searchValue.current.value;
        if (search === "") {
            setSortedData(properties)
        } else {
            let response = await fetch(`http://localhost:9000/property/all?search=${search}&sort=${sortBy}&order=${order}&limit=${itemsPerPage}`)
            let data = await response.json()
            setProperties(data)
            setSortedData(data)
        }
    }

    return (

        <div className="home">
            <div className="home-header">

                {!sortedData ? <h1>Loading...</h1> : <h1 className="text-4xl">{userState.role === 'SELLER' ? < div onClick={() => navigate('/auth/add-property')} className="flex gap-3">
                    <h1>
                        My Properties
                    </h1>
                    <div className="bg-slate-200 flex p-3 rounded-full cursor-pointer" title="Add Property">
                        <i className='fi fi-br-add w-full flex items-center text-2xl'></i>
                    </div>
                </div> : 'Browse Properties'}</h1>}
                <div className="flex gap-5">
                    <select onChange={(e) => {
                        e.preventDefault();
                        console.log(e.target.value)
                        const [sort, order] = e.target.value.split('-');
                        setSortBy(sort);
                        setOrder(order);
                    }} className="px-3 py-2 rounded-[20px]">
                        <option className="px-3 py-1" value="">Sort by</option>
                        <option className="px-3 py-1" value="price-asc">Price Increasing</option>
                        <option className="px-3 py-1" value="price-desc">Price Descreasing</option>
                        <option className="px-3 py-1" value="likesCount-desc">Most Liked</option>
                        <option className="px-3 py-1" value="likesCount-asc">Least Liked</option>
                    </select>
                    <form onSubmit={handleSearch}>
                        <div className="searchbar">
                            <input ref={searchValue} type="text" placeholder="Search by Keywords..." />
                            <button type="submit">Enter</button>
                        </div>
                    </form>
                </div>
            </div>
            {sortedData?.length === 0 && <h1>No Properties Found</h1>}

            <div className="grid mb-5">
                {sortedData?.map((item, key) => <PropertyCard key={key} info={item} />)}
            </div>
            {userState.role === 'SELLER' && <a className="text-blue-500 underline" href="/">Browse Properties &rarr; </a>}
            <div className="mt-10 w-max m-auto flex gap-4">
                <button className={` rounded-md px-4 py-2 ${currentPage == 1 ? 'bg-slate-200 text-slate-500' : 'bg-slate-300 text-black'}`} onClick={() => setCurrentPage(prev => prev - 1)} disabled={currentPage === 1}>Previous</button>
                <button className={` rounded-md px-4 py-2 ${isLastPage ? 'bg-slate-200 text-slate-500' : 'bg-slate-300 text-black'}`} onClick={() => setCurrentPage(prev => prev + 1)} disabled={isLastPage}>Next</button>
            </div>
        </div>
    )
}

export default Home;