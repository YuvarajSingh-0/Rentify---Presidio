const checkUserLoggedIn = () => {
    return new Promise(async (resolve, reject) => {
        try {
            const res = await fetch(`${process.env.REACT_APP_BACKEND_URL}/user/checkUserLoggedIn`, { credentials: 'include' });
            const data = await res.json();

            if (res.status === 200) {
                resolve({ role: data.role, userId: data.userId });
            } else {
                reject(new Error('User not logged in'));
            }
        } catch (error) {
            reject(error);
        }
    });
};

export default checkUserLoggedIn;