import { useState, useEffect, useRef } from "react";
import PropertyCard from "../components/PropertyCard";
import { useNavigate } from "react-router-dom";

// TODO: Pagination
const LandingPage = () => {
    const navigate = useNavigate();
    const searchValue = useRef();
    const [properties, setProperties] = useState();
    const [sortedData, setSortedData] = useState();
    const [currentPage, setCurrentPage] = useState(1);
    const [itemsPerPage, setItemsPerPage] = useState(8);
    const [sortBy, setSortBy] = useState('price');
    const [order, setOrder] = useState('asc');
    const [isLastPage, setIsLastPage] = useState(false);

    useEffect(() => {

        const fetchProperties = async () => {
            const response = await fetch(`http://localhost:9000/property/all?page=${currentPage}&limit=${itemsPerPage}&sort=${sortBy}&order=${order}&search=${searchValue.current.value}`)
            const data = await response.json()
            console.log(data)
            if (response.error) {
                alert("Something went wrong please try again later")
                window.location.reload()
            }
            setProperties(data)
            setSortedData(data)
            setIsLastPage(data.length < itemsPerPage);
        }
        fetchProperties();
    }, [currentPage, order, sortBy, itemsPerPage]);

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

        <div className="home md:p-10">
            <div className="home-header">
                {!sortedData ? <h1>Loading...</h1> : <h1 className="text-4xl">Home</h1>}
                <div className="flex gap-5">
                    <select onChange={(e) => {
                        const [sort, order] = e.target.value.split('-');
                        setSortBy(sort);
                        setOrder(order);
                    }} className="px-3 py-2 rounded-[20px]">
                        <option value="">Sort by</option>
                        <option value="price-asc">Price Increasing</option>
                        <option value="price-desc">Price Descreasing</option>
                        <option value="likesCount-desc">Most Liked</option>
                        <option value="likesCount-asc">Least Liked</option>
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
            <div className="grid">
                {sortedData?.map((item, key) => <PropertyCard key={key} info={item} />)}
            </div>
            <button onClick={() => navigate('/login')} className="bg-blue-600 text-white px-3 py-2 rounded-md bottom-10 right-10 shadow-md fixed">Login</button>
            <div className="mt-10 w-max m-auto flex gap-4">
                <button className={` rounded-md px-4 py-2 ${currentPage == 1 ? 'bg-slate-200 text-slate-500' : 'bg-slate-300 text-black'}`} onClick={() => setCurrentPage(prev => prev - 1)} disabled={currentPage === 1}>Previous</button>
                <button className={` rounded-md px-4 py-2 ${isLastPage ? 'bg-slate-200 text-slate-500' : 'bg-slate-300 text-black'}`} onClick={() => setCurrentPage(prev => prev + 1)} disabled={isLastPage}>Next</button>
            </div>
        </div>
    )
}

export default LandingPage;