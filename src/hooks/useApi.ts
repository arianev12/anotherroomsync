import { useState, useEffect } from 'react';

const API_BASE_URL = '/roomsyncapp/api';

const normalizeImageList = (value) => {
    if (Array.isArray(value)) {
        return value;
    }

    if (typeof value === 'string' && value.trim()) {
        try {
            const parsed = JSON.parse(value);
            return Array.isArray(parsed) ? parsed : [];
        } catch {
            return value.split(',').map(item => item.trim()).filter(Boolean);
        }
    }

    return [];
};

const normalizeDormitory = (dormitory) => {
    const ownerFirstName = dormitory.owner_first_name || dormitory.first_name || '';
    const ownerLastName = dormitory.owner_last_name || dormitory.last_name || '';
    const ownerName = [ownerFirstName, ownerLastName].filter(Boolean).join(' ').trim();
    const registrationStatus = dormitory.registration_status || dormitory.registrationStatus || 'Pending';
    const registrationNumber = dormitory.registration_number || dormitory.registrationNumber || dormitory.reg_number || '';

    const rooms = Array.isArray(dormitory.rooms)
        ? dormitory.rooms.map(room => ({
            ...room,
            id: room.room_id || room.id,
            roomNumber: room.room_number || room.roomNumber,
            capacity: Number(room.capacity || 0),
            price: Number(room.price || 0),
            available: Number(room.available || room.available_slots || room.slots_available || 0),
            occupied: Number(room.current_occupants || room.occupied || 0),
            images: normalizeImageList(room.images_json || room.images),
        }))
        : [];

    return {
        ...dormitory,
        id: dormitory.dormitory_id || dormitory.id,
        name: dormitory.name,
        location: dormitory.location,
        price: Number(dormitory.price || 0),
        available: Number(dormitory.available || 0),
        capacity: Number(dormitory.capacity || 0),
        occupied: Number(dormitory.current_occupants || dormitory.occupied || 0),
        status: dormitory.status || 'Inactive',
        owner: ownerName || dormitory.owner || 'Unknown Owner',
        ownerPhone: dormitory.owner_phone || dormitory.phone || '',
        ownerEmail: dormitory.owner_email || '',
        registrationStatus,
        registrationNumber,
        images: normalizeImageList(dormitory.images_json || dormitory.images),
        amenities: dormitory.amenities_list || (typeof dormitory.amenities === 'string' ? dormitory.amenities.split(', ').filter(Boolean) : (dormitory.amenities || [])),
        latitude: dormitory.latitude ? Number(dormitory.latitude) : dormitory.latitude,
        longitude: dormitory.longitude ? Number(dormitory.longitude) : dormitory.longitude,
        rooms,
    };
};

/**
 * Custom hook to fetch dormitories from database API
 */
export const useDormitories = (includeAll = false) => {
    const [dormitories, setDormitories] = useState([]);
    const [loading, setLoading] = useState(true);
    const [error, setError] = useState(null);

    useEffect(() => {
        fetchDormitories();
    }, [includeAll]);

    const fetchDormitories = async () => {
        try {
            setLoading(true);
            const response = await fetch(`${API_BASE_URL}/?route=dormitories${includeAll ? '&all=true' : ''}`);
            const result = await response.json();

            if (result.success) {
                setDormitories(result.data.map(normalizeDormitory));
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
                setDormitory(normalizeDormitory(result.data));
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
 * Custom hook to fetch owners from database API
 */
export const useOwners = () => {
    const [owners, setOwners] = useState([]);
    const [loading, setLoading] = useState(true);
    const [error, setError] = useState(null);

    useEffect(() => {
        fetchOwners();
    }, []);

    const fetchOwners = async () => {
        try {
            setLoading(true);
            const response = await fetch(`${API_BASE_URL}/?route=owners`);
            const result = await response.json();

            if (result.success) {
                setOwners(result.data.map(owner => ({
                    ...owner,
                    id: owner.user_id || owner.id,
                    name: owner.name || `${owner.first_name || ''} ${owner.last_name || ''}`.trim(),
                    dormitories: Number(owner.dormitories_count || owner.dormitories || 0),
                    status: owner.status || 'Active'
                })));
                setError(null);
            } else {
                setError(result.message || 'Failed to fetch owners');
                setOwners([]);
            }
        } catch (err) {
            console.error('Fetch error:', err);
            setError(err.message);
            setOwners([]);
        } finally {
            setLoading(false);
        }
    };

    return { owners, loading, error, refetch: fetchOwners };
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
