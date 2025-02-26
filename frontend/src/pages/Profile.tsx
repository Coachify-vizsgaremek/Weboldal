import React, { useEffect, useState } from 'react';
import { useNavigate } from 'react-router-dom';
import { useAuth } from './AuthContext';
import './Profile.css';

const Profile: React.FC = () => {
    const { isLoggedIn, userName, logout, role } = useAuth();
    const navigate = useNavigate();
    const [userData, setUserData] = useState<any>(null);
    const [editMode, setEditMode] = useState(false);
    const [formData, setFormData] = useState<any>({});
    const [error, setError] = useState<string | null>(null);

    useEffect(() => {
        if (!isLoggedIn) {
            navigate('/login');
        } else {
            fetchUserData();
        }
    }, [isLoggedIn, navigate]);

    const fetchUserData = async () => {
        try {
            const response = await fetch('/api/user', {
                credentials: 'include',
            });
            if (!response.ok) {
                throw new Error('Failed to fetch user data');
            }
            const data = await response.json();
            setUserData(data);
            setFormData(data);
        } catch (error) {
            console.error('Error fetching user data:', error);
            setError('Failed to load user data. Please try again later.');
        }
    };

    const handleInputChange = (e: React.ChangeEvent<HTMLInputElement>) => {
        const { name, value } = e.target;
        setFormData({
            ...formData,
            [name]: value,
        });
    };

    const handleSubmit = async (e: React.FormEvent) => {
        e.preventDefault();
        if (!formData.full_name || !formData.email) {
            setError('Please fill in all required fields.');
            return;
        }
        try {
            const response = await fetch('/api/user', {
                method: 'PUT',
                headers: {
                    'Content-Type': 'application/json',
                },
                credentials: 'include',
                body: JSON.stringify(formData),
            });
            if (!response.ok) {
                throw new Error('Failed to update user data');
            }
            setUserData(formData);
            setEditMode(false);
            setError(null);
        } catch (error) {
            console.error('Error updating user data:', error);
            setError('Failed to update user data. Please try again later.');
        }
    };

    const handleLogout = async () => {
        try {
            await fetch('/logout', {
                method: 'POST',
                credentials: 'include',
            });
            logout();
            navigate('/');
        } catch (error) {
            console.error('Error logging out:', error);
            setError('Failed to logout. Please try again.');
        }
    };

    return (
        <div className="profile-container">
            <h1 className="profile-header">Üdvözöljük, {userName}!</h1>
            {error && <p style={{ color: '#ff4500', textAlign: 'center' }}>{error}</p>}
            <div className="profile-content">
                <div className="profile-info">
                    <p><strong>Szerepkör:</strong> {role === 'trainer' ? 'Edző' : 'Kliens'}</p>
                    {editMode ? (
                        <form onSubmit={handleSubmit} className="profile-form">
                            <div className="form-group">
                                <label>Név:</label>
                                <input
                                    type="text"
                                    name="full_name"
                                    value={formData.full_name || ''}
                                    onChange={handleInputChange}
                                    required
                                />
                            </div>
                            <div className="form-group">
                                <label>Email:</label>
                                <input
                                    type="email"
                                    name="email"
                                    value={formData.email || ''}
                                    onChange={handleInputChange}
                                    required
                                />
                            </div>
                            {role === 'trainer' && (
                                <>
                                    <div className="form-group">
                                        <label>Telefonszám:</label>
                                        <input
                                            type="text"
                                            name="phone"
                                            value={formData.phone || ''}
                                            onChange={handleInputChange}
                                        />
                                    </div>
                                    <div className="form-group">
                                        <label>Lakcím:</label>
                                        <input
                                            type="text"
                                            name="address"
                                            value={formData.address || ''}
                                            onChange={handleInputChange}
                                        />
                                    </div>
                                </>
                            )}
                            <button type="submit" className="save-button">
                                Mentés
                            </button>
                            <button type="button" className="cancel-button" onClick={() => setEditMode(false)}>
                                Mégse
                            </button>
                        </form>
                    ) : (
                        <>
                            <p><strong>Név:</strong> {userData?.full_name}</p>
                            <p><strong>Email:</strong> {userData?.email}</p>
                            {role === 'trainer' && (
                                <>
                                    <p><strong>Telefonszám:</strong> {userData?.phone}</p>
                                    <p><strong>Lakcím:</strong> {userData?.address}</p>
                                </>
                            )}
                            <button className="edit-button" onClick={() => setEditMode(true)}>
                                Szerkesztés
                            </button>
                        </>
                    )}
                </div>
            </div>
            <button className="logout-button" onClick={handleLogout}>
                Kijelentkezés
            </button>
        </div>
    );
};

export default Profile;