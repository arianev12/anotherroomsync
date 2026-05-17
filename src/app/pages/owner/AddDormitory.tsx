import { useState } from "react";
import { useNavigate } from "react-router";
import { MapPin, Upload, X, Plus, Trash2, Home } from "lucide-react";

interface Room {
  id: number;
  roomNumber: string;
  capacity: string;
  price: string;
  image: string | null;
}

export function AddDormitory() {
  const navigate = useNavigate();
  const [formData, setFormData] = useState({
    name: '',
    address: '',
    description: '',
    amenities: [] as string[],
    registrationNumber: '',
  });
  const [rooms, setRooms] = useState<Room[]>([
    { id: 1, roomNumber: '', capacity: '', price: '', image: null }
  ]);
  const [mapMarker, setMapMarker] = useState({ lat: 14.0711, lng: 120.6328 });
  const [dormImages, setDormImages] = useState<string[]>([]);

  const amenitiesOptions = ['WiFi', 'Aircon', 'Study Area', 'Laundry', 'Gym', 'Pool', 'Parking', 'Security'];

  const toggleAmenity = (amenity: string) => {
    setFormData(prev => ({
      ...prev,
      amenities: prev.amenities.includes(amenity)
        ? prev.amenities.filter(a => a !== amenity)
        : [...prev.amenities, amenity]
    }));
  };

  const addRoom = () => {
    const newRoom: Room = {
      id: rooms.length + 1,
      roomNumber: '',
      capacity: '',
      price: '',
      image: null
    };
    setRooms([...rooms, newRoom]);
  };

  const handleRoomImageUpload = (id: number, e: React.ChangeEvent<HTMLInputElement>) => {
    const file = e.target.files?.[0];
    if (file) {
      const reader = new FileReader();
      reader.onloadend = () => {
        setRooms(rooms.map(room =>
          room.id === id ? { ...room, image: reader.result as string } : room
        ));
      };
      reader.readAsDataURL(file);
    }
  };

  const removeRoomImage = (id: number) => {
    setRooms(rooms.map(room =>
      room.id === id ? { ...room, image: null } : room
    ));
  };

  const removeRoom = (id: number) => {
    if (rooms.length > 1) {
      setRooms(rooms.filter(room => room.id !== id));
    }
  };

  const updateRoom = (id: number, field: keyof Room, value: string) => {
    setRooms(rooms.map(room =>
      room.id === id ? { ...room, [field]: value } : room
    ));
  };

  const handleMapClick = (e: React.MouseEvent<HTMLDivElement>) => {
    const rect = e.currentTarget.getBoundingClientRect();
    const x = ((e.clientX - rect.left) / rect.width) * 100;
    const y = ((e.clientY - rect.top) / rect.height) * 100;
    setMapMarker({ lat: 14.0 + (y / 150), lng: 120.5 + (x / 150) });
  };

  const handleDormImageUpload = (e: React.ChangeEvent<HTMLInputElement>) => {
    const files = e.target.files;
    if (files) {
      const newImages: string[] = [];
      Array.from(files).forEach(file => {
        const reader = new FileReader();
        reader.onloadend = () => {
          newImages.push(reader.result as string);
          if (newImages.length === files.length) {
            setDormImages([...dormImages, ...newImages]);
          }
        };
        reader.readAsDataURL(file);
      });
    }
  };

  const removeDormImage = (index: number) => {
    setDormImages(dormImages.filter((_, i) => i !== index));
  };

  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault();

    // Calculate total capacity and availability for the new dormitory
    const totalCapacity = rooms.reduce((sum, room) => sum + Number(room.capacity || 0), 0);

    // For a new dormitory, available = capacity (no one occupied yet)
    const dormData = {
      ...formData,
      capacity: totalCapacity,
      available: totalCapacity, // All slots available for new dorm
      occupied: 0, // No one occupied yet
      status: 'Active',
      location: mapMarker,
      images: dormImages,
      registrationNumber: formData.registrationNumber,
      registrationStatus: 'Pending',
      rooms: rooms.map(room => ({
        ...room,
        capacity: Number(room.capacity),
        price: Number(room.price),
        available: Number(room.capacity),
        occupied: 0,
        image: room.image,
      }))
    };

    console.log('New Dormitory Data:', dormData);
    navigate('/owner/dormitories');
  };

  return (
    <div className="space-y-6 max-w-4xl">
      <div>
        <h1 className="text-2xl font-semibold text-gray-900 dark:text-white">Add Dormitory</h1>
        <p className="text-sm text-gray-500 dark:text-gray-400 mt-1">Register a new dormitory property</p>
      </div>

      <form onSubmit={handleSubmit} className="space-y-6">
        <div className="bg-white dark:bg-gray-800 rounded-xl border border-gray-200 dark:border-gray-700 p-6">
          <h2 className="text-lg font-semibold text-gray-900 dark:text-white mb-6">Basic Information</h2>
          
          <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
            <div className="md:col-span-2">
              <label className="block text-sm font-medium text-gray-700 dark:text-gray-300 mb-2">
                Registration Number
              </label>
              <div className="relative">
                <input
                  type="text"
                  value={formData.registrationNumber}
                  onChange={(e) => setFormData({ ...formData, registrationNumber: e.target.value })}
                  className="w-full px-4 py-2.5 border border-gray-300 dark:border-gray-600 rounded-lg focus:outline-none focus:ring-2 focus:ring-teal-500 bg-white dark:bg-gray-900 text-gray-900 dark:text-white"
                  placeholder="e.g., BLGF-2024-007"
                  required
                />
              </div>
              <p className="mt-1.5 text-xs text-gray-500 dark:text-gray-400">
                Enter your dormitory's official registration number from the Bureau of Local Government Finance (BLGF) or your local government unit. This will be reviewed by the admin.
              </p>
            </div>

            <div className="md:col-span-2">
              <label className="block text-sm font-medium text-gray-700 dark:text-gray-300 mb-2">
                Dormitory Name
              </label>
              <input
                type="text"
                value={formData.name}
                onChange={(e) => setFormData({ ...formData, name: e.target.value })}
                className="w-full px-4 py-2.5 border border-gray-300 dark:border-gray-600 rounded-lg focus:outline-none focus:ring-2 focus:ring-teal-500 bg-white dark:bg-gray-900 text-gray-900 dark:text-white"
                placeholder="Enter dormitory name"
                required
              />
            </div>

            <div className="md:col-span-2">
              <label className="block text-sm font-medium text-gray-700 dark:text-gray-300 mb-2">
                Address
              </label>
              <input
                type="text"
                value={formData.address}
                onChange={(e) => setFormData({ ...formData, address: e.target.value })}
                className="w-full px-4 py-2.5 border border-gray-300 dark:border-gray-600 rounded-lg focus:outline-none focus:ring-2 focus:ring-teal-500 bg-white dark:bg-gray-900 text-gray-900 dark:text-white"
                placeholder="Enter full address"
                required
              />
            </div>

            <div className="md:col-span-2">
              <label className="block text-sm font-medium text-gray-700 dark:text-gray-300 mb-2">
                Description
              </label>
              <textarea
                value={formData.description}
                onChange={(e) => setFormData({ ...formData, description: e.target.value })}
                rows={4}
                className="w-full px-4 py-2.5 border border-gray-300 dark:border-gray-600 rounded-lg focus:outline-none focus:ring-2 focus:ring-teal-500 bg-white dark:bg-gray-900 text-gray-900 dark:text-white"
                placeholder="Describe your dormitory"
                required
              />
            </div>
          </div>
        </div>

        <div className="bg-white dark:bg-gray-800 rounded-xl border border-gray-200 dark:border-gray-700 p-6">
          <div className="flex items-center justify-between mb-6">
            <div className="flex-1">
              <h2 className="text-lg font-semibold text-gray-900 dark:text-white">Room Details</h2>
              <p className="text-sm text-gray-500 dark:text-gray-400 mt-1">Add multiple rooms with individual capacity and pricing</p>
            </div>
            <div className="flex items-center gap-4">
              <div className="text-right">
                <p className="text-xs text-gray-500 dark:text-gray-400">Total Capacity</p>
                <p className="text-2xl font-bold text-teal-600 dark:text-teal-400">
                  {rooms.reduce((sum, room) => sum + Number(room.capacity || 0), 0)}
                </p>
              </div>
              <button
                type="button"
                onClick={addRoom}
                className="flex items-center gap-2 px-4 py-2 bg-teal-600 text-white rounded-lg hover:bg-teal-700 transition-colors"
              >
                <Plus className="w-4 h-4" />
                Add Room
              </button>
            </div>
          </div>

          <div className="space-y-4">
            {rooms.map((room, index) => (
              <div key={room.id} className="bg-gray-50 dark:bg-gray-900 rounded-lg p-4 border border-gray-200 dark:border-gray-700">
                <div className="flex items-center gap-3 mb-4">
                  <div className="w-10 h-10 bg-teal-100 dark:bg-teal-900/30 rounded-lg flex items-center justify-center">
                    <Home className="w-5 h-5 text-teal-600 dark:text-teal-400" />
                  </div>
                  <h3 className="text-sm font-medium text-gray-900 dark:text-white">Room #{index + 1}</h3>
                  {rooms.length > 1 && (
                    <button
                      type="button"
                      onClick={() => removeRoom(room.id)}
                      className="ml-auto p-2 text-red-600 dark:text-red-400 hover:bg-red-50 dark:hover:bg-red-900/20 rounded-lg transition-colors"
                      title="Remove Room"
                    >
                      <Trash2 className="w-4 h-4" />
                    </button>
                  )}
                </div>

                <div className="grid grid-cols-1 md:grid-cols-3 gap-4 mb-4">
                  <div>
                    <label className="block text-sm font-medium text-gray-700 dark:text-gray-300 mb-2">
                      Room Number
                    </label>
                    <input
                      type="text"
                      value={room.roomNumber}
                      onChange={(e) => updateRoom(room.id, 'roomNumber', e.target.value)}
                      className="w-full px-4 py-2.5 border border-gray-300 dark:border-gray-600 rounded-lg focus:outline-none focus:ring-2 focus:ring-teal-500 bg-white dark:bg-gray-800 text-gray-900 dark:text-white"
                      placeholder="e.g., 101"
                      required
                    />
                  </div>

                  <div>
                    <label className="block text-sm font-medium text-gray-700 dark:text-gray-300 mb-2">
                      Capacity (persons)
                    </label>
                    <input
                      type="number"
                      value={room.capacity}
                      onChange={(e) => updateRoom(room.id, 'capacity', e.target.value)}
                      className="w-full px-4 py-2.5 border border-gray-300 dark:border-gray-600 rounded-lg focus:outline-none focus:ring-2 focus:ring-teal-500 bg-white dark:bg-gray-800 text-gray-900 dark:text-white"
                      placeholder="e.g., 4"
                      min="1"
                      required
                    />
                  </div>

                  <div>
                    <label className="block text-sm font-medium text-gray-700 dark:text-gray-300 mb-2">
                      Monthly Price (₱)
                    </label>
                    <input
                      type="number"
                      value={room.price}
                      onChange={(e) => updateRoom(room.id, 'price', e.target.value)}
                      className="w-full px-4 py-2.5 border border-gray-300 dark:border-gray-600 rounded-lg focus:outline-none focus:ring-2 focus:ring-teal-500 bg-white dark:bg-gray-800 text-gray-900 dark:text-white"
                      placeholder="e.g., 3000"
                      min="0"
                      required
                    />
                  </div>
                </div>

                {/* Room Image Upload */}
                <div>
                  <label className="block text-sm font-medium text-gray-700 dark:text-gray-300 mb-2">
                    Room Photo
                  </label>
                  {room.image ? (
                    <div className="relative group rounded-lg overflow-hidden h-40 border-2 border-gray-300 dark:border-gray-600">
                      <img
                        src={room.image}
                        alt={`Room ${room.roomNumber || index + 1}`}
                        className="w-full h-full object-cover"
                      />
                      <div className="absolute inset-0 bg-black/40 opacity-0 group-hover:opacity-100 transition-opacity flex items-center justify-center gap-2">
                        <label className="px-3 py-1.5 bg-white/90 text-gray-800 rounded-lg text-xs font-medium cursor-pointer hover:bg-white transition-colors">
                          Change
                          <input
                            type="file"
                            accept="image/*"
                            onChange={(e) => handleRoomImageUpload(room.id, e)}
                            className="hidden"
                          />
                        </label>
                        <button
                          type="button"
                          onClick={() => removeRoomImage(room.id)}
                          className="px-3 py-1.5 bg-red-500/90 text-white rounded-lg text-xs font-medium hover:bg-red-500 transition-colors"
                        >
                          Remove
                        </button>
                      </div>
                    </div>
                  ) : (
                    <label className="block cursor-pointer">
                      <div className="border-2 border-dashed border-gray-300 dark:border-gray-600 rounded-lg p-5 text-center hover:border-teal-500 dark:hover:border-teal-500 transition-colors bg-white dark:bg-gray-800 flex items-center gap-4">
                        <div className="w-10 h-10 bg-gray-100 dark:bg-gray-700 rounded-lg flex items-center justify-center flex-shrink-0">
                          <Upload className="w-5 h-5 text-gray-400 dark:text-gray-500" />
                        </div>
                        <div className="text-left">
                          <p className="text-sm text-gray-600 dark:text-gray-400">Click to upload room photo</p>
                          <p className="text-xs text-gray-400 dark:text-gray-500 mt-0.5">PNG, JPG up to 10MB</p>
                        </div>
                      </div>
                      <input
                        type="file"
                        accept="image/*"
                        onChange={(e) => handleRoomImageUpload(room.id, e)}
                        className="hidden"
                      />
                    </label>
                  )}
                </div>
              </div>
            ))}
          </div>

          {/* Info Note */}
          <div className="mt-4 bg-blue-50 dark:bg-blue-900/30 border border-blue-200 dark:border-blue-700 rounded-lg p-4">
            <p className="text-sm text-blue-700 dark:text-blue-300">
              💡 <strong>Available Capacity:</strong> For a new dormitory, all room slots will be automatically marked as available since there are no tenants yet. Total capacity is calculated from all rooms combined.
            </p>
          </div>
        </div>

        <div className="bg-white dark:bg-gray-800 rounded-xl border border-gray-200 dark:border-gray-700 p-6">
          <h2 className="text-lg font-semibold text-gray-900 dark:text-white mb-6">Amenities</h2>
          <div className="grid grid-cols-2 md:grid-cols-4 gap-3">
            {amenitiesOptions.map((amenity) => (
              <button
                key={amenity}
                type="button"
                onClick={() => toggleAmenity(amenity)}
                className={`px-4 py-3 rounded-lg text-sm font-medium transition-colors ${
                  formData.amenities.includes(amenity)
                    ? 'bg-teal-600 text-white'
                    : 'bg-gray-100 dark:bg-gray-700 text-gray-600 dark:text-gray-300 hover:bg-gray-200 dark:hover:bg-gray-600'
                }`}
              >
                {amenity}
              </button>
            ))}
          </div>
        </div>

        <div className="bg-white dark:bg-gray-800 rounded-xl border border-gray-200 dark:border-gray-700 p-6">
          <h2 className="text-lg font-semibold text-gray-900 dark:text-white mb-6">Upload Images</h2>
          <div className="space-y-4">
            {/* Dormitory Images */}
            <div>
              <label className="block text-sm font-medium text-gray-700 dark:text-gray-300 mb-2">
                Dormitory Images (Multiple)
              </label>
              {dormImages.length > 0 && (
                <div className="grid grid-cols-2 md:grid-cols-4 gap-4 mb-4">
                  {dormImages.map((image, index) => (
                    <div key={index} className="relative group">
                      <img
                        src={image}
                        alt={`Dorm ${index + 1}`}
                        className="w-full h-32 object-cover rounded-lg border-2 border-gray-300 dark:border-gray-600"
                      />
                      <button
                        type="button"
                        onClick={() => removeDormImage(index)}
                        className="absolute top-2 right-2 p-1.5 bg-red-500 text-white rounded-lg hover:bg-red-600 transition-colors opacity-0 group-hover:opacity-100"
                      >
                        <X className="w-4 h-4" />
                      </button>
                    </div>
                  ))}
                </div>
              )}
              <label className="block">
                <div className="border-2 border-dashed border-gray-300 dark:border-gray-600 rounded-lg p-8 text-center hover:border-teal-500 dark:hover:border-teal-500 transition-colors cursor-pointer bg-white dark:bg-gray-900">
                  <Upload className="w-12 h-12 text-gray-400 dark:text-gray-500 mx-auto mb-3" />
                  <p className="text-sm text-gray-600 dark:text-gray-400">Click to upload dormitory images</p>
                  <p className="text-xs text-gray-400 dark:text-gray-500 mt-1">PNG, JPG up to 10MB (multiple files)</p>
                </div>
                <input
                  type="file"
                  accept="image/*"
                  multiple
                  onChange={handleDormImageUpload}
                  className="hidden"
                />
              </label>
            </div>

          </div>
        </div>

        <div className="bg-white dark:bg-gray-800 rounded-xl border border-gray-200 dark:border-gray-700 p-6">
          <h2 className="text-lg font-semibold text-gray-900 dark:text-white mb-6">Location</h2>

          {/* Manual Coordinate Input */}
          <div className="grid grid-cols-2 gap-4 mb-4">
            <div>
              <label className="block text-sm font-medium text-gray-700 dark:text-gray-300 mb-2">
                Latitude
              </label>
              <input
                type="number"
                step="0.0001"
                value={mapMarker.lat}
                onChange={(e) => setMapMarker({ ...mapMarker, lat: parseFloat(e.target.value) || 0 })}
                className="w-full px-4 py-2.5 border border-gray-300 dark:border-gray-600 rounded-lg focus:outline-none focus:ring-2 focus:ring-teal-500 bg-white dark:bg-gray-900 text-gray-900 dark:text-white"
                placeholder="14.0711"
              />
            </div>
            <div>
              <label className="block text-sm font-medium text-gray-700 dark:text-gray-300 mb-2">
                Longitude
              </label>
              <input
                type="number"
                step="0.0001"
                value={mapMarker.lng}
                onChange={(e) => setMapMarker({ ...mapMarker, lng: parseFloat(e.target.value) || 0 })}
                className="w-full px-4 py-2.5 border border-gray-300 dark:border-gray-600 rounded-lg focus:outline-none focus:ring-2 focus:ring-teal-500 bg-white dark:bg-gray-900 text-gray-900 dark:text-white"
                placeholder="120.6328"
              />
            </div>
          </div>

          {/* Map Preview */}
          <div
            onClick={handleMapClick}
            className="w-full h-96 bg-gray-100 dark:bg-gray-900 rounded-lg relative overflow-hidden cursor-crosshair border-2 border-gray-300 dark:border-gray-600"
            style={{
              backgroundImage: 'linear-gradient(0deg, #e5e7eb 1px, transparent 1px), linear-gradient(90deg, #e5e7eb 1px, transparent 1px)',
              backgroundSize: '20px 20px'
            }}
          >
            <div className="absolute inset-0 flex items-center justify-center pointer-events-none">
              <div className="text-center">
                <MapPin className="w-12 h-12 text-gray-400 dark:text-gray-500 mx-auto mb-2" />
                <p className="text-sm text-gray-500 dark:text-gray-400">Click on the map to set location</p>
              </div>
            </div>
            <div
              className="absolute w-8 h-8 bg-red-500 rounded-full border-4 border-white dark:border-gray-800 shadow-lg pointer-events-none"
              style={{
                left: `${((mapMarker.lng - 120.5) / 0.3) * 100}%`,
                top: `${((mapMarker.lat - 14.0) / 0.15) * 100}%`,
                transform: 'translate(-50%, -100%)'
              }}
            >
              <div className="absolute -bottom-1 left-1/2 transform -translate-x-1/2 w-0.5 h-4 bg-red-500"></div>
            </div>
          </div>
          <div className="mt-4 p-3 bg-blue-50 dark:bg-blue-900/20 rounded-lg border border-blue-200 dark:border-blue-800">
            <p className="text-sm text-blue-800 dark:text-blue-300">
              <strong>Tip:</strong> You can click on the map or manually enter coordinates above. Default location: Nasugbu, Batangas
            </p>
          </div>
        </div>

        <div className="flex gap-4">
          <button
            type="button"
            onClick={() => navigate('/owner/dormitories')}
            className="px-6 py-2.5 border border-gray-300 dark:border-gray-600 rounded-lg text-gray-700 dark:text-gray-300 hover:bg-gray-50 dark:hover:bg-gray-700"
          >
            Cancel
          </button>
          <button
            type="submit"
            className="px-6 py-2.5 bg-teal-600 text-white rounded-lg hover:bg-teal-700"
          >
            Save Dormitory
          </button>
        </div>
      </form>
    </div>
  );
}