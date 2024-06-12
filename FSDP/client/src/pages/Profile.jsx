import React, { useEffect, useState } from 'react';
import axios from 'axios';

const Profile = () => {
    const [user, setUser] = useState(null);

    useEffect(() => {
        const fetchUser = async () => {
            try {
                const token = localStorage.getItem('accessToken');
                const response = await axios.get('http://localhost:3000/api/profile', {
                    headers: {
                        'Authorization': `Bearer ${token}`
                    }
                });
                console.log('Response data:', response.data); // Log the response data
                setUser(response.data);
                console.log('User data:', response.data); // Log the user data after setting it
            } catch (error) {
                console.error('Error fetching profile data', error);
            }
        };

        fetchUser();
    }, []);

    if (!user) {
        return <div>Loading...</div>;
    }

    return (
        <div className="profile">
            <h1>{user.name}</h1>
            <p>Email: {user.email}</p>
            <div className="profile-picture">
                <img src={user.profilePicture} alt="Profile" />
            </div>
            <button>Edit Profile</button>
        </div>
    );
};

export default Profile;
