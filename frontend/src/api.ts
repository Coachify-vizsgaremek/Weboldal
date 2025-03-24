interface Trainer {
    id: number;
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

interface ApiResponse<T> {
    message?: string;
    data?: T;
    error?: string;
}

const API_URL = 'http://localhost:3000';

export const getTrainers = async (): Promise<Trainer[]> => {
    try {
        // First try the authenticated endpoint
        const response = await fetch(`${API_URL}/api/trainers`, {
            method: 'GET',
            credentials: 'include',
            headers: {
                'Content-Type': 'application/json',
            },
        });

        if (!response.ok) {
            if (response.status === 401) {
                // Fall back to public endpoint if unauthorized
                const publicResponse = await fetch(`${API_URL}/edzok`);
                if (!publicResponse.ok) {
                    throw new Error(`Failed to fetch trainers: ${publicResponse.status}`);
                }
                return await publicResponse.json();
            }
            throw new Error(`Failed to fetch trainers: ${response.status}`);
        }

        const result: ApiResponse<Trainer[]> = await response.json();
        return result.data || [];
    } catch (error) {
        console.error('Error fetching trainers:', error);
        throw error;
    }
};

export const login = async (email: string, password: string, role: string): Promise<{ user: any, message: string }> => {
    try {
        const response = await fetch(`${API_URL}/login`, {
            method: 'POST',
            credentials: 'include',
            headers: {
                'Content-Type': 'application/json',
            },
            body: JSON.stringify({ email, password, role }),
        });

        if (!response.ok) {
            const errorData = await response.json();
            throw new Error(errorData.message || 'Login failed');
        }

        return await response.json();
    } catch (error) {
        console.error('Login error:', error);
        throw error;
    }
};

export const logout = async (): Promise<void> => {
    try {
        const response = await fetch(`${API_URL}/logout`, {
            method: 'POST',
            credentials: 'include',
        });

        if (!response.ok) {
            throw new Error('Logout failed');
        }
    } catch (error) {
        console.error('Logout error:', error);
        throw error;
    }
};

export const getProtectedData = async (): Promise<any> => {
    try {
        const response = await fetch(`${API_URL}/protected`, {
            method: 'GET',
            credentials: 'include',
        });

        if (!response.ok) {
            throw new Error(`Protected data request failed: ${response.status}`);
        }

        return await response.json();
    } catch (error) {
        console.error('Error fetching protected data:', error);
        throw error;
    }
};

export const getUserData = async (): Promise<any> => {
    try {
        const response = await fetch(`${API_URL}/api/user`, {
            method: 'GET',
            credentials: 'include',
        });

        if (!response.ok) {
            throw new Error(`User data request failed: ${response.status}`);
        }

        return await response.json();
    } catch (error) {
        console.error('Error fetching user data:', error);
        throw error;
    }
};