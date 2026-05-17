import { useState, useEffect } from 'react';

const API_BASE_URL = '/roomsyncapp/api';

/**
 * Custom hook to fetch dormitories from database API
 */
export const useDormitories = () => {
    const [dormitories, setDormitories] = useState([]);
    const [loading, setLoading] = useState(true);
    const [error, setError] = useState(null);

    useEffect(() => {
        fetchDormitories();
    }, []);

    const fetchDormitories = async () => {
        try {
            setLoading(true);
            const response = await fetch(`${API_BASE_URL}/?route=dormitories`);
            const result = await response.json();

            if (result.success) {
                setDormitories(result.data);
                setError(null);
            } else {
                setError(result.message || 'Failed to fetch dormitories');
                setDormitories([]);
            }
        } catch (err) {
            console.error('Fetch error:', err);
            setError(err.message);
            setDormitories([]);
        } finally {
            setLoading(false);
        }
    };

    return { dormitories, loading, error, refetch: fetchDormitories };
};

/**
 * Custom hook to fetch single dormitory by ID
 */
export const useDormitory = (dormitoryId) => {
    const [dormitory, setDormitory] = useState(null);
    const [loading, setLoading] = useState(true);
    const [error, setError] = useState(null);

    useEffect(() => {
        if (dormitoryId) {
            fetchDormitory(dormitoryId);
        }
    }, [dormitoryId]);

    const fetchDormitory = async (id) => {
        try {
            setLoading(true);
            const response = await fetch(`${API_BASE_URL}/?route=dormitories/${id}`);
            const result = await response.json();

            if (result.success) {
                setDormitory(result.data);
                setError(null);
            } else {
                setError(result.message || 'Failed to fetch dormitory');
                setDormitory(null);
            }
        } catch (err) {
            console.error('Fetch error:', err);
            setError(err.message);
            setDormitory(null);
        } finally {
            setLoading(false);
        }
    };

    return { dormitory, loading, error, refetch: () => fetchDormitory(dormitoryId) };
};

/**
 * Custom hook to fetch rooms for a dormitory
 */
export const useRooms = (dormitoryId = null) => {
    const [rooms, setRooms] = useState([]);
    const [loading, setLoading] = useState(true);
    const [error, setError] = useState(null);

    useEffect(() => {
        if (dormitoryId) {
            fetchRooms(dormitoryId);
        } else {
            fetchAllRooms();
        }
    }, [dormitoryId]);

    const fetchRooms = async (dormId) => {
        try {
            setLoading(true);
            const response = await fetch(`${API_BASE_URL}/?route=rooms/${dormId}`);
            const result = await response.json();

            if (result.success) {
                setRooms(result.data);
                setError(null);
            } else {
                setError(result.message || 'Failed to fetch rooms');
                setRooms([]);
            }
        } catch (err) {
            console.error('Fetch error:', err);
            setError(err.message);
            setRooms([]);
        } finally {
            setLoading(false);
        }
    };

    const fetchAllRooms = async () => {
        try {
            setLoading(true);
            const response = await fetch(`${API_BASE_URL}/?route=rooms`);
            const result = await response.json();

            if (result.success) {
                setRooms(result.data);
                setError(null);
            } else {
                setError(result.message || 'Failed to fetch rooms');
                setRooms([]);
            }
        } catch (err) {
            console.error('Fetch error:', err);
            setError(err.message);
            setRooms([]);
        } finally {
            setLoading(false);
        }
    };

    return { rooms, loading, error };
};

/**
 * Custom hook to fetch amenities
 */
export const useAmenities = () => {
    const [amenities, setAmenities] = useState([]);
    const [loading, setLoading] = useState(true);
    const [error, setError] = useState(null);

    useEffect(() => {
        fetchAmenities();
    }, []);

    const fetchAmenities = async () => {
        try {
            setLoading(true);
            const response = await fetch(`${API_BASE_URL}/?route=amenities`);
            const result = await response.json();

            if (result.success) {
                setAmenities(result.data);
                setError(null);
            } else {
                setError(result.message || 'Failed to fetch amenities');
                setAmenities([]);
            }
        } catch (err) {
            console.error('Fetch error:', err);
            setError(err.message);
            setAmenities([]);
        } finally {
            setLoading(false);
        }
    };

    return { amenities, loading, error };
};

/**
 * Test database connection
 */
export const testDatabaseConnection = async () => {
    try {
        const response = await fetch(`${API_BASE_URL}/?route=test-connection`, {
            method: 'POST'
        });
        const result = await response.json();
        return result;
    } catch (err) {
        console.error('Connection test error:', err);
        return {
            success: false,
            error: err.message
        };
    }
};

export default {
    useDormitories,
    useDormitory,
    useRooms,
    useAmenities,
    testDatabaseConnection
};
