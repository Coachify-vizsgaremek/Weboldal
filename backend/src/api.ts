interface Trainer {
    id: number;
    full_name: string;
    email: string;
    password: string;
    location: string;
    specialization: string;
    available_training_types: string;
    price_range: string;
    languages: string;
    reviews: string;
    introduction: string;
}

interface ApiResponse {
    message: string;
    Trainers: Trainer;
}

const API_URL = 'http://localhost:3000';

export const getTrainers = async (): Promise<any> => {
    const response = await fetch(`${API_URL}/trainers`, {
        method: 'GET',
        credentials: 'include',
    });
    if (!response.ok) {
        throw new Error('Unauthorized');
    }
    return await response.json();
};