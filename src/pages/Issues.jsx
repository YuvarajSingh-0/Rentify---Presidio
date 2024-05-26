import IssuesCard from "../components/IssuesCard";
import { useState, useEffect } from "react";
import checkUserLoggedIn from "../utils/checkUserLoggedIn";

const Issues = () => {
    const [issuesInfo, setIssuesInfo] = useState();
    const [role, setRole] = useState();
    const [userId, setUserId] = useState();
    const [showForm, setShowForm] = useState();
    useEffect(() => {
        checkUserLoggedIn().then((data) => {
            setRole(data.role);
            setUserId(data.userId);
        }).catch((err) => {
            console.log(err)
        });

        const fetchIssues = async () => {
            if (role === "SELLER") {
                const response = await fetch(`${process.env.REACT_APP_BACKEND_URL}/issues/self`, { credentials: 'include' })
                const data = await response.json()
                // console.log(data)
                if (response.error || response.status === 500 || response.Error) {
                    alert("Something went wrong please try again later")
                    // window.location.reload()
                }
                setIssuesInfo(data)
            } else {
                const response = await fetch(`${process.env.REACT_APP_BACKEND_URL}/property/issues`, { credentials: 'include' })
                const data = await response.json()
                console.log(data)
                if (response.error) {
                    alert("Something went wrong please try again later")
                    // window.location.reload()
                }
                // console.log(data)
                setIssuesInfo(data)
            }
        }
        fetchIssues();
    }, []);


    const handleSaveIssue = async () => {
        const title = document.getElementById("title").value;
        const description = document.getElementById("description").value;
        const data = {
            title: title,
            description: description
        }
        const response = await fetch(`${process.env.REACT_APP_BACKEND_URL}/issues/new`, {
            method: 'POST',
            headers: {
                'Content-Type': 'application/json'
            },
            body: JSON.stringify(data),
            credentials: 'include'
        })
        if (response.error) {
            alert("Something went wrong please try again later")
            // window.location.reload()
        }
        setShowForm(false);
        window.location.reload()
    }


    return (
        <>
            {issuesInfo && issuesInfo.length > 0 ?
                <div>
                    <h1 className="text-4xl">Issues</h1>
                    <div className="grid">
                        {issuesInfo?.map((item, key) => <IssuesCard key={key} data={item} />)}
                    </div>
                </div> : <h1>No Issues Found</h1>}
            {role === "BUYER" && <button onClick={() => setShowForm(true)} className="bg-blue-500 hover:bg-blue-700 text-white font-bold py-2 px-4 rounded float-end mt-4">Add Issue</button>}
            {showForm && <div className="fixed z-10 inset-0 overflow-y-auto">
                <div className="flex items-end justify-center min-h-screen pt-4 px-4 pb-20 text-center sm:block sm:p-0">
                    <div className="fixed inset-0 transition-opacity" aria-hidden="true">
                        <div className="absolute inset-0 bg-gray-500 opacity-75"></div>
                    </div>
                    <span className="hidden sm:inline-block sm:align-middle sm:h-screen" aria-hidden="true">&#8203;</span>
                    <div className="inline-block align-bottom bg-white rounded-lg text-left overflow-hidden shadow-xl transform transition-all sm:my-8 sm:align-middle sm:max-w-lg sm:w-full" role="dialog" aria-modal="true" aria-labelledby="modal-headline">
                        <div className="bg-white px-4 pt-5 pb-4 sm:p-6 sm:pb-4">
                            <div className=" ">
                                <div className="mt-3 text-center sm:mt-0 sm:ml-4 sm:text-left">
                                    <h3 className="text-lg leading-6 font-medium text-gray-900" id="modal-headline">
                                        Add Issue
                                    </h3>
                                    <div className="mt-2">
                                        <form>
                                            <div>
                                                <label htmlFor="title" className="block text-sm font-medium text-gray-700">Title</label>
                                                <div className="mt-1">
                                                    <input type="text" name="title" id="title" className="px-3 py-2 drop-shadow-md outline-indigo-400 focus:ring-indigo-500 focus:border-indigo-500  w-full sm:text-sm border-gray-300 rounded-md" />
                                                </div>
                                            </div>
                                            <div className="mt-4">
                                                <label htmlFor="description" className="block text-sm font-medium text-gray-700">Description</label>
                                                <div className="mt-1">
                                                    <textarea id="description" name="description" rows="4" className="px-3 py-2 drop-shadow-md outline-indigo-400 focus:ring-indigo-500 focus:border-indigo-500 block w-full sm:text-sm border-gray-300 rounded-md"></textarea>
                                                </div>
                                            </div>
                                        </form>
                                    </div>
                                </div>
                            </div>
                        </div>
                        <div className="bg-gray-50 px-4 py-3 sm:px-6 sm:flex sm:flex-row-reverse">
                            <button onClick
                                ={() => setShowForm(false)} type="button" className="w-full inline-flex justify-center rounded-md border border-transparent shadow-sm px-4 py-2 bg-red-600 text-base font-medium text-white hover:bg-red-700 focus:outline-none focus:ring-2 focus:ring-offset-2 focus:ring-red-500 sm:ml-3 sm:w-auto sm:text-sm">
                                Close
                            </button>
                            <button type="button" onClick={handleSaveIssue} className="w-full inline-flex justify-center rounded-md border border-transparent shadow-sm px-4 py-2 bg-green-600 text-base font-medium text-white hover:bg-green-700 focus:outline-none focus:ring-2 focus:ring-offset-2 focus:ring-green-500 sm:ml-3 sm:w-auto sm:text-sm">
                                Save
                            </button>
                        </div>
                    </div>
                </div>
            </div>}

        </>
    )
}

export default Issues;