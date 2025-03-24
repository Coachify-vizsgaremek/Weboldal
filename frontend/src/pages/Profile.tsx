import React, { useEffect, useState } from 'react';
import { useNavigate } from 'react-router-dom';
import { useAuth } from './AuthContext';
import './Profile.css';

interface TrainerData {
    full_name: string;
    email: string;
    location: string;
    specialization: string;
    available_training_types: string;
    price_range: string;
    languages: string;
    reviews: string;
    introduction: string;
}

interface ClientData {
    full_name: string;
    email: string;
    age: number;
}

const Profile: React.FC = () => {
    const { isLoggedIn, userName, logout } = useAuth();
    const navigate = useNavigate();
    const [userData, setUserData] = useState<TrainerData | ClientData | null>(null);
    const [editMode, setEditMode] = useState(false);
    const [formData, setFormData] = useState<any>({});
    const [passwordForm, setPasswordForm] = useState({ 
        currentPassword: '', 
        newPassword: '', 
        confirmPassword: '' 
    });
    const [error, setError] = useState<string | null>(null);
    const [role, setRole] = useState<string>('');
    const [loading, setLoading] = useState(true);

    useEffect(() => {
        if (!isLoggedIn) {
            navigate('/bejelentkezes');
        } else {
            fetchUserData();
        }
    }, [isLoggedIn, navigate]);

    const fetchUserData = async () => {
        setLoading(true);
        setError(null);
        
        try {
            // Először lekérjük a szerepkört
            const roleResponse = await fetch('http://localhost:3000/api/user/role', {
                credentials: 'include',
            });

            if (!roleResponse.ok) {
                throw new Error('Nem sikerült lekérni a felhasználó szerepkörét');
            }

            const roleData = await roleResponse.json();
            setRole(roleData.role);

            // Majd a felhasználói adatokat a szerepkör alapján
            const userResponse = await fetch('http://localhost:3000/api/user', {
                credentials: 'include',
            });

            if (!userResponse.ok) {
                throw new Error('Nem sikerült lekérni a felhasználói adatokat');
            }

            const userData = await userResponse.json();
            setUserData(userData);
            setFormData(userData);
            
        } catch (error) {
            console.error('Hiba a felhasználói adatok lekérésekor:', error);
            setError('Nem sikerült betölteni a felhasználói adatokat. Kérjük, próbáld újra később.');
            if (error instanceof Error && error.message.includes('Unauthorized')) {
                logout();
                navigate('/bejelentkezes');
            }
        } finally {
            setLoading(false);
        }
    };

    const handleInputChange = (e: React.ChangeEvent<HTMLInputElement | HTMLTextAreaElement | HTMLSelectElement>) => {
        const { name, value } = e.target;
        setFormData({
            ...formData,
            [name]: value,
        });
    };

    const handlePasswordChange = (e: React.ChangeEvent<HTMLInputElement>) => {
        const { name, value } = e.target;
        setPasswordForm({
            ...passwordForm,
            [name]: value,
        });
    };

    const handleSubmit = async (e: React.FormEvent) => {
        e.preventDefault();
        
        try {
            const response = await fetch('http://localhost:3000/api/user', {
                method: 'PUT',
                headers: {
                    'Content-Type': 'application/json',
                },
                credentials: 'include',
                body: JSON.stringify(formData),
            });
            
            if (!response.ok) {
                throw new Error('Nem sikerült frissíteni a felhasználói adatokat');
            }
            
            setUserData(formData);
            setEditMode(false);
            setError(null);
            alert('Adatok sikeresen frissítve!');
        } catch (error) {
            console.error('Hiba az adatok frissítésekor:', error);
            setError('Nem sikerült frissíteni az adatokat. Kérjük, próbáld újra később.');
        }
    };

    const handlePasswordSubmit = async (e: React.FormEvent) => {
        e.preventDefault();
        if (passwordForm.newPassword !== passwordForm.confirmPassword) {
            setError('A jelszavak nem egyeznek');
            return;
        }
        
        try {
            const response = await fetch('http://localhost:3000/api/user/password', {
                method: 'PUT',
                headers: {
                    'Content-Type': 'application/json',
                },
                credentials: 'include',
                body: JSON.stringify(passwordForm),
            });
            
            if (!response.ok) {
                throw new Error('Nem sikerült frissíteni a jelszót');
            }
            
            setPasswordForm({ currentPassword: '', newPassword: '', confirmPassword: '' });
            setError(null);
            alert('Jelszó sikeresen frissítve!');
        } catch (error) {
            console.error('Hiba a jelszó frissítésekor:', error);
            setError('Nem sikerült frissíteni a jelszót. Kérjük, próbáld újra később.');
        }
    };

    const handleLogout = async () => {
        try {
            const response = await fetch('http://localhost:3000/logout', {
                method: 'POST',
                credentials: 'include',
            });
            
            if (!response.ok) {
                throw new Error('Nem sikerült kijelentkezni');
            }
            
            logout();
            navigate('/');
        } catch (error) {
            console.error('Hiba a kijelentkezéskor:', error);
            setError('Nem sikerült kijelentkezni. Kérjük, próbáld újra.');
        }
    };

    if (loading) {
        return <div className="profile-container">Betöltés...</div>;
    }

    return (
        <div className="profile-container">
            <h1 className="profile-header">Üdvözöljük, {userName}!</h1>
            {error && <p className="profile-error">{error}</p>}
            
            <div className="profile-content">
                <div className="profile-info">
                    <p><strong>Szerepkör:</strong> {role === 'trainer' ? 'Edző' : 'Kliens'}</p>
                    
                    {editMode ? (
                        <form onSubmit={handleSubmit} className="profile-form">
                            <div className="form-group">
                                <label>Teljes név:</label>
                                <input
                                    type="text"
                                    name="full_name"
                                    value={formData.full_name || ''}
                                    onChange={handleInputChange}
                                    disabled
                                />
                            </div>
                            
                            <div className="form-group">
                                <label>Email:</label>
                                <input
                                    type="email"
                                    name="email"
                                    value={formData.email || ''}
                                    onChange={handleInputChange}
                                    disabled
                                />
                            </div>
                            
                            {role === 'trainer' ? (
                                <>
                                    <div className="form-group">
                                        <label>Telephely:</label>
                                        <input
                                            type="text"
                                            name="location"
                                            value={formData.location || ''}
                                            onChange={handleInputChange}
                                        />
                                    </div>
                                    
                                    <div className="form-group">
                                        <label>Specializáció:</label>
                                        <input
                                            type="text"
                                            name="specialization"
                                            value={formData.specialization || ''}
                                            onChange={handleInputChange}
                                        />
                                    </div>
                                    
                                    <div className="form-group">
                                        <label>Elérhető edzések típusai:</label>
                                        <input
                                            type="text"
                                            name="available_training_types"
                                            value={formData.available_training_types || ''}
                                            onChange={handleInputChange}
                                        />
                                    </div>
                                    
                                    <div className="form-group">
                                        <label>Árkategória:</label>
                                        <input
                                            type="text"
                                            name="price_range"
                                            value={formData.price_range || ''}
                                            onChange={handleInputChange}
                                        />
                                    </div>
                                    
                                    <div className="form-group">
                                        <label>Nyelvek:</label>
                                        <input
                                            type="text"
                                            name="languages"
                                            value={formData.languages || ''}
                                            onChange={handleInputChange}
                                        />
                                    </div>
                                    
                                    <div className="form-group">
                                        <label>Értékelések:</label>
                                        <input
                                            type="text"
                                            name="reviews"
                                            value={formData.reviews || ''}
                                            onChange={handleInputChange}
                                        />
                                    </div>
                                    
                                    <div className="form-group">
                                        <label>Bemutatkozás:</label>
                                        <textarea
                                            name="introduction"
                                            value={formData.introduction || ''}
                                            onChange={handleInputChange}
                                            rows={4}
                                        />
                                    </div>
                                </>
                            ) : (
                                <div className="form-group">
                                    <label>Életkor:</label>
                                    <input
                                        type="number"
                                        name="age"
                                        value={formData.age || ''}
                                        onChange={handleInputChange}
                                    />
                                </div>
                            )}
                            
                            <div className="form-buttons">
                                <button type="submit" className="save-button">
                                    Mentés
                                </button>
                                <button 
                                    type="button" 
                                    className="cancel-button" 
                                    onClick={() => setEditMode(false)}
                                >
                                    Mégse
                                </button>
                            </div>
                        </form>
                    ) : (
                        <>
                            <p><strong>Teljes név:</strong> {userData?.full_name}</p>
                            <p><strong>Email:</strong> {userData?.email}</p>
                            
                            {role === 'trainer' ? (
                                <>
                                    <p><strong>Telephely:</strong> {userData && 'location' in userData ? userData.location : 'Nincs megadva'}</p>
                                    <p><strong>Specializáció:</strong> {userData && 'specialization' in userData ? userData.specialization : 'Nincs megadva'}</p>
                                    <p><strong>Elérhető edzések:</strong> {userData && 'available_training_types' in userData ? userData.available_training_types : 'Nincs megadva'}</p>
                                    <p><strong>Árkategória:</strong> {userData && 'price_range' in userData ? userData.price_range : 'Nincs megadva'}</p>
                                    <p><strong>Nyelvek:</strong> {userData && 'languages' in userData ? userData.languages : 'Nincs megadva'}</p>
                                    <p><strong>Értékelések:</strong> {userData && 'reviews' in userData ? userData.reviews : 'Nincs megadva'}</p>
                                    <p><strong>Bemutatkozás:</strong> {userData && 'introduction' in userData ? userData.introduction : 'Nincs megadva'}</p>
                                </>
                            ) : (
                                <p><strong>Életkor:</strong> {userData && 'age' in userData ? userData.age : 'Nincs megadva'}</p>
                            )}
                            
                            <button 
                                className="edit-button" 
                                onClick={() => setEditMode(true)}
                            >
                                Adatok szerkesztése
                            </button>
                        </>
                    )}
                </div>
                
                <div className="password-form">
                    <h2>Jelszó módosítása</h2>
                    <form onSubmit={handlePasswordSubmit}>
                        <div className="form-group">
                            <label>Jelenlegi jelszó:</label>
                            <input
                                type="password"
                                name="currentPassword"
                                value={passwordForm.currentPassword}
                                onChange={handlePasswordChange}
                                required
                            />
                        </div>
                        
                        <div className="form-group">
                            <label>Új jelszó:</label>
                            <input
                                type="password"
                                name="newPassword"
                                value={passwordForm.newPassword}
                                onChange={handlePasswordChange}
                                required
                            />
                        </div>
                        
                        <div className="form-group">
                            <label>Új jelszó megerősítése:</label>
                            <input
                                type="password"
                                name="confirmPassword"
                                value={passwordForm.confirmPassword}
                                onChange={handlePasswordChange}
                                required
                            />
                        </div>
                        
                        <button type="submit" className="save-button">
                            Jelszó módosítása
                        </button>
                    </form>
                </div>
            </div>
            
            <button className="logout-button" onClick={handleLogout}>
                Kijelentkezés
            </button>
        </div>
    );
};

export default Profile;