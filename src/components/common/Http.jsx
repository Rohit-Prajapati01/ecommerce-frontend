export const apiUrl = "http://localhost:8000/api"
export const adminToken = () => {
    const data = localStorage.getItem('adminInfo')
    const adminData = JSON.parse(data)
    return adminData.token;
}

export const userToken = () => {
    const data = localStorage.getItem('userInfo')
    const userData = JSON.parse(data)
    return userData.token;
}

export const STRIPE_PUBLIC_KEY = 'pk_test_51TiwnOA3rCBj3zpFTXiP2fEOkpplxk4KeelygwyQY7aFlJB9BLPZB07LzIYi1CaNRawim7nJ4SdCmO2IfEbB4lUH00X3zWsAkD'