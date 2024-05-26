const checkUserLoggedIn = () => {
    return new Promise(async (resolve, reject) => {
        try {
            const res = await fetch('http://localhost:9000/user/checkUserLoggedIn', { credentials: 'include' });
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