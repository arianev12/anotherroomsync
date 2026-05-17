import React, { useState, useEffect } from 'react';
import { useDormitories, useAmenities, testDatabaseConnection } from '../../hooks/useApi';

export const DatabaseTestPage: React.FC = () => {
    const { dormitories, loading: dormsLoading, error: dormsError } = useDormitories();
    const { amenities, loading: amenitiesLoading, error: amenitiesError } = useAmenities();
    const [testResult, setTestResult] = useState<any>(null);
    const [testLoading, setTestLoading] = useState(false);

    useEffect(() => {
        runConnectionTest();
    }, []);

    const runConnectionTest = async () => {
        setTestLoading(true);
        const result = await testDatabaseConnection();
        setTestResult(result);
        setTestLoading(false);
    };

    return (
        <div style={{ padding: '20px', fontFamily: 'Arial, sans-serif' }}>
            <h1>🗄️ RoomSync Database Connection Test</h1>

            {/* Database Connection Test */}
            <section style={{ marginBottom: '30px', border: '1px solid #ccc', padding: '15px', borderRadius: '8px' }}>
                <h2>Database Connection</h2>
                {testLoading ? (
                    <p>Testing connection...</p>
                ) : testResult?.success ? (
                    <div style={{ backgroundColor: '#d4edda', padding: '10px', borderRadius: '5px' }}>
                        <p style={{ color: 'green', fontWeight: 'bold' }}>✅ Connected to Database</p>
                        <p><strong>Database:</strong> {testResult.data?.database}</p>
                        <p><strong>Host:</strong> {testResult.data?.host}</p>
                        <p><strong>Timestamp:</strong> {testResult.data?.timestamp}</p>
                        <h3>Database Stats:</h3>
                        <ul>
                            <li>Users: {testResult.data?.stats?.users_count}</li>
                            <li>Dormitories: {testResult.data?.stats?.dorms_count}</li>
                            <li>Rooms: {testResult.data?.stats?.rooms_count}</li>
                            <li>Amenities: {testResult.data?.stats?.amenities_count}</li>
                        </ul>
                    </div>
                ) : (
                    <div style={{ backgroundColor: '#f8d7da', padding: '10px', borderRadius: '5px' }}>
                        <p style={{ color: 'red', fontWeight: 'bold' }}>❌ Connection Failed</p>
                        <p>{testResult?.message || 'Unknown error'}</p>
                    </div>
                )}
            </section>

            {/* Dormitories Test */}
            <section style={{ marginBottom: '30px', border: '1px solid #ccc', padding: '15px', borderRadius: '8px' }}>
                <h2>Dormitories from Database</h2>
                {dormsLoading ? (
                    <p>Loading dormitories...</p>
                ) : dormsError ? (
                    <p style={{ color: 'red' }}>❌ Error: {dormsError}</p>
                ) : dormitories.length > 0 ? (
                    <div>
                        <p style={{ color: 'green', fontWeight: 'bold' }}>✅ {dormitories.length} dormitory(ies) found</p>
                        {dormitories.map((dorm: any) => (
                            <div key={dorm.dormitory_id} style={{ 
                                backgroundColor: '#e7f3ff', 
                                padding: '10px', 
                                marginBottom: '10px', 
                                borderRadius: '5px',
                                border: '1px solid #b3d9ff'
                            }}>
                                <p><strong>Name:</strong> {dorm.name}</p>
                                <p><strong>Location:</strong> {dorm.city_municipality}, {dorm.province}</p>
                                <p><strong>Price:</strong> ₱{dorm.base_price}/month</p>
                                <p><strong>Rooms:</strong> {dorm.total_rooms} | Available: {dorm.available_rooms}</p>
                                <p><strong>Amenities:</strong> {dorm.amenities || 'None'}</p>
                                <p><strong>Status:</strong> {dorm.status} | Registration: {dorm.registration_status}</p>
                            </div>
                        ))}
                    </div>
                ) : (
                    <p>⚠️ No dormitories found in database</p>
                )}
            </section>

            {/* Amenities Test */}
            <section style={{ marginBottom: '30px', border: '1px solid #ccc', padding: '15px', borderRadius: '8px' }}>
                <h2>Amenities from Database</h2>
                {amenitiesLoading ? (
                    <p>Loading amenities...</p>
                ) : amenitiesError ? (
                    <p style={{ color: 'red' }}>❌ Error: {amenitiesError}</p>
                ) : amenities.length > 0 ? (
                    <div>
                        <p style={{ color: 'green', fontWeight: 'bold' }}>✅ {amenities.length} amenities found</p>
                        <div style={{ display: 'grid', gridTemplateColumns: 'repeat(3, 1fr)', gap: '10px' }}>
                            {amenities.map((amenity: any) => (
                                <div key={amenity.amenity_id} style={{
                                    backgroundColor: '#fff3cd',
                                    padding: '10px',
                                    borderRadius: '5px',
                                    border: '1px solid #ffc107'
                                }}>
                                    <p><strong>{amenity.name}</strong></p>
                                    <p style={{ fontSize: '12px', color: '#666' }}>{amenity.category}</p>
                                </div>
                            ))}
                        </div>
                    </div>
                ) : (
                    <p>⚠️ No amenities found in database</p>
                )}
            </section>

            {/* Instructions */}
            <section style={{ marginBottom: '30px', border: '1px solid #ccc', padding: '15px', borderRadius: '8px', backgroundColor: '#f0f0f0' }}>
                <h3>📋 What This Test Shows:</h3>
                <ul>
                    <li>✅ Database connection from React to PHP API is working</li>
                    <li>✅ API endpoints are responding with data from database</li>
                    <li>✅ No hardcoded data - all data comes from MySQL</li>
                    <li>✅ CORS headers allow cross-origin requests</li>
                </ul>

                <h3>🔄 Next Steps:</h3>
                <ol>
                    <li>Replace mockData imports with useApi hooks in components</li>
                    <li>Update FindDormitory, DormitoryDetails pages to use API</li>
                    <li>Test adding new dormitory/room data via admin panel</li>
                    <li>Implement authentication and user-specific data endpoints</li>
                </ol>
            </section>

            <button 
                onClick={runConnectionTest}
                style={{
                    padding: '10px 20px',
                    backgroundColor: '#007bff',
                    color: 'white',
                    border: 'none',
                    borderRadius: '5px',
                    cursor: 'pointer',
                    fontSize: '16px'
                }}
            >
                🔄 Refresh Test
            </button>
        </div>
    );
};

export default DatabaseTestPage;
