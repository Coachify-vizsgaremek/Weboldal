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
        const response = await fetch(`${API_URL}/edzok`, {
            method: 'GET',
            credentials: 'include',
        });

        if (!response.ok) {
            throw new Error(`Failed to fetch trainers: ${response.status}`);
        }

        return await response.json();
    } catch (error) {
        console.error('Error fetching trainers:', error);
        return [];
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
            if (response.status === 401) {
                return { user: null };
            }
            throw new Error(`Protected data request failed: ${response.status}`);
        }

        return await response.json();
    } catch (error) {
        console.error('Error fetching protected data:', error);
        return { user: null };
    }
};

export const getUserData = async (): Promise<any> => {
    try {
        const response = await fetch(`${API_URL}/api/user`, {
            method: 'GET',
            credentials: 'include',
        });

        if (!response.ok) {
            if (response.status === 401) {
                return { data: null };
            }
            throw new Error(`User data request failed: ${response.status}`);
        }

        return await response.json();
    } catch (error) {
        console.error('Error fetching user data:', error);
        return { data: null };
    }
};

export const getTrainerAvailability = async (trainerId: number): Promise<any> => {
    try {
        const response = await fetch(`${API_URL}/api/trainer-availability/${trainerId}`, {
            credentials: 'include'
        });
        if (!response.ok) throw new Error('Failed to fetch availability');
        return await response.json();
    } catch (error) {
        console.error('Error fetching trainer availability:', error);
        throw error;
    }
};

export const getTrainerAppointments = async (trainerId: number): Promise<any> => {
    try {
        const response = await fetch(`${API_URL}/api/appointments/${trainerId}`, {
            credentials: 'include'
        });
        if (!response.ok) throw new Error('Failed to fetch appointments');
        return await response.json();
    } catch (error) {
        console.error('Error fetching appointments:', error);
        throw error;
    }
};

export const createAppointment = async (appointmentData: {
    trainer_id: number;
    date: string;
    start_time: string;
    end_time: string;
}): Promise<any> => {
    try {
        const response = await fetch(`${API_URL}/api/appointments`, {
            method: 'POST',
            credentials: 'include',
            headers: {
                'Content-Type': 'application/json',
            },
            body: JSON.stringify(appointmentData)
        });
        if (!response.ok) {
            const errorData = await response.json();
            throw new Error(errorData.message || 'Appointment creation failed');
        }
        return await response.json();
    } catch (error) {
        console.error('Error creating appointment:', error);
        throw error;
    }
};