import { useState, FormEvent } from "react";
import { useParams, useNavigate } from "react-router";
import { MapPin, Users, Wifi, Wind, BookOpen, Shirt, Dumbbell, Waves, ChevronLeft, Calendar, Send, X, Check } from "lucide-react";
import { useDormitory } from "../hooks/useApi";
import { toast } from "sonner";

export function DormitoryDetails() {
  const { id } = useParams();
  const navigate = useNavigate();
  const { dormitory, loading, error } = useDormitory(id ? Number(id) : null);
  const [currentImageIndex, setCurrentImageIndex] = useState(0);
  const [scheduleModalOpen, setScheduleModalOpen] = useState(false);
  const [selectedDate, setSelectedDate] = useState<number | null>(null);
  const [selectedTime, setSelectedTime] = useState("");
  const [visitName, setVisitName] = useState("");
  const [visitContact, setVisitContact] = useState("");

  const generateMayCalendar = () => {
    const may2026 = new Date(2026, 4, 1);
    const firstDay = may2026.getDay();
    const daysInMay = 31;
    const calendar: (number | null)[] = [];

    for (let i = 0; i < firstDay; i++) {
      calendar.push(null);
    }

    for (let day = 1; day <= daysInMay; day++) {
      calendar.push(day);
    }

    return calendar;
  };

  const mayCalendar = generateMayCalendar();

  const handleScheduleVisit = (e: FormEvent) => {
    e.preventDefault();

    if (selectedDate && selectedTime && visitName && visitContact) {
      toast.success(`Walk-in visit scheduled for May ${selectedDate}, 2026 at ${selectedTime}!`);
      setScheduleModalOpen(false);
      setSelectedDate(null);
      setSelectedTime("");
      setVisitName("");
      setVisitContact("");
    }
  };

  const amenityIcons: Record<string, any> = {
    WiFi: Wifi,
    Aircon: Wind,
    "Study Area": BookOpen,
    Laundry: Shirt,
    Gym: Dumbbell,
    Pool: Waves,
  };

  if (loading) {
    return (
      <div className="min-h-screen flex items-center justify-center">
        <div className="text-gray-700 dark:text-gray-200">Loading dormitory details...</div>
      </div>
    );
  }

  if (error || !dormitory) {
    return (
      <div className="min-h-screen flex items-center justify-center p-6">
        <div className="bg-white dark:bg-gray-800 rounded-2xl border border-gray-200 dark:border-gray-700 p-8 text-center shadow-lg">
          <h2 className="text-xl font-semibold text-gray-900 dark:text-white">Dormitory not found</h2>
          <p className="mt-2 text-sm text-gray-600 dark:text-gray-400">
            {error ?? 'We could not load the dormitory details. Please go back and try again.'}
          </p>
          <button
            onClick={() => navigate(-1)}
            className="mt-6 inline-flex items-center gap-2 px-4 py-2 bg-teal-600 text-white rounded-lg hover:bg-teal-700"
          >
            <ChevronLeft className="w-4 h-4" />
            Back
          </button>
        </div>
      </div>
    );
  }

  const images = dormitory.images_json ?? dormitory.images ?? [];
  const amenities = Array.isArray(dormitory.amenities_list)
    ? dormitory.amenities_list
    : dormitory.amenities?.split(", ") ?? [];
  const roomCount = dormitory.room_count ?? dormitory.rooms?.length ?? 0;
  const available = dormitory.available ?? 0;
  const occupied = dormitory.occupied ?? 0;
  const location = dormitory.address ?? dormitory.location ?? "Address not available";
  const price = Number(dormitory.price ?? 0);
  const currentImage = images[currentImageIndex] ?? images[0] ?? "https://via.placeholder.com/1200x800?text=Dorm+Image";

  return (
    <div className="space-y-6 max-w-6xl mx-auto px-4 py-6">
      <button
        onClick={() => navigate(-1)}
        className="flex items-center gap-2 text-gray-600 hover:text-gray-900"
      >
        <ChevronLeft className="w-5 h-5" />
        Back
      </button>

      <div className="bg-white rounded-xl border border-gray-200 overflow-hidden">
        <div className="relative">
          <img
            src={currentImage}
            alt={dormitory.name}
            className="w-full h-96 object-cover"
          />
          <div className="absolute bottom-4 left-1/2 transform -translate-x-1/2 flex gap-2">
            {images.slice(0, 3).map((_, index) => (
              <button
                key={index}
                onClick={() => setCurrentImageIndex(index)}
                className={`w-2 h-2 rounded-full ${currentImageIndex === index ? 'bg-white' : 'bg-white/50'}`}
              />
            ))}
          </div>
        </div>
      </div>

      <div className="grid grid-cols-1 lg:grid-cols-3 gap-6">
        <div className="lg:col-span-2 space-y-6">
          <div className="bg-white rounded-xl border border-gray-200 p-6">
            <div className="flex items-start justify-between mb-4 gap-6">
              <div className="flex-1">
                <h1 className="text-3xl font-semibold text-gray-900">{dormitory.name}</h1>
                <div className="flex items-center gap-2 mt-2 text-gray-600">
                  <MapPin className="w-5 h-5" />
                  <span>{location}</span>
                </div>
              </div>
              <div className="text-right">
                <p className="text-sm text-gray-500">Monthly Rent</p>
                <p className="text-3xl font-semibold text-teal-600">₱{price.toLocaleString()}</p>
              </div>
            </div>

            <div className="grid grid-cols-3 gap-4 py-4 border-y border-gray-200">
              <div className="text-center">
                <div className="flex items-center justify-center gap-1 text-gray-600">
                  <Users className="w-5 h-5" />
                  <span className="text-2xl font-semibold text-gray-900">{roomCount}</span>
                </div>
                <p className="text-xs text-gray-500 mt-1">Total Rooms</p>
              </div>
              <div className="text-center">
                <div className="text-2xl font-semibold text-teal-600">{available}</div>
                <p className="text-xs text-gray-500 mt-1">Available</p>
              </div>
              <div className="text-center">
                <div className="text-2xl font-semibold text-orange-600">{occupied}</div>
                <p className="text-xs text-gray-500 mt-1">Occupied</p>
              </div>
            </div>

            <div className="mt-6">
              <h3 className="font-semibold text-gray-900 mb-3">Description</h3>
              <p className="text-gray-600 leading-relaxed">{dormitory.description}</p>
            </div>
          </div>

          <div className="bg-white rounded-xl border border-gray-200 p-6">
            <h3 className="font-semibold text-gray-900 mb-4">Amenities</h3>
            <div className="grid grid-cols-2 md:grid-cols-3 gap-4">
              {amenities.length > 0 ? amenities.map((amenity) => {
                const Icon = amenityIcons[amenity] || Wifi;
                return (
                  <div key={amenity} className="flex items-center gap-3 p-3 bg-gray-50 rounded-lg">
                    <div className="w-10 h-10 bg-teal-100 rounded-lg flex items-center justify-center">
                      <Icon className="w-5 h-5 text-teal-600" />
                    </div>
                    <span className="text-sm font-medium text-gray-900">{amenity}</span>
                  </div>
                );
              }) : (
                <p className="text-sm text-gray-500">No amenities listed.</p>
              )}
            </div>
          </div>

          <div className="bg-white rounded-xl border border-gray-200 p-6">
            <h3 className="font-semibold text-gray-900 mb-4">360° Virtual Tour</h3>
            <div className="aspect-video bg-gray-100 rounded-lg flex items-center justify-center">
              <div className="text-center">
                <div className="w-16 h-16 bg-teal-100 rounded-full flex items-center justify-center mx-auto mb-3">
                  <span className="text-2xl">360°</span>
                </div>
                <p className="text-sm text-gray-600">Interactive room tour</p>
                <button className="mt-3 px-4 py-2 bg-teal-600 text-white rounded-lg hover:bg-teal-700 text-sm">
                  Launch Tour
                </button>
              </div>
            </div>
          </div>

          <div className="bg-white rounded-xl border border-gray-200 p-6">
            <h3 className="font-semibold text-gray-900 mb-4">Location</h3>
            <div
              className="w-full h-64 bg-gray-100 rounded-lg relative overflow-hidden"
              style={{
                backgroundImage: 'linear-gradient(0deg, #f0f0f0 1px, transparent 1px), linear-gradient(90deg, #f0f0f0 1px, transparent 1px)',
                backgroundSize: '20px 20px',
              }}
            >
              <div
                className="absolute w-8 h-8 bg-red-500 rounded-full border-4 border-white shadow-lg"
                style={{
                  left: '50%',
                  top: '50%',
                  transform: 'translate(-50%, -50%)',
                }}
              >
                <div className="absolute -bottom-1 left-1/2 transform -translate-x-1/2 w-0.5 h-4 bg-red-500"></div>
              </div>
            </div>
            <p className="text-sm text-gray-600 mt-3">{location}</p>
          </div>
        </div>

        <div className="lg:col-span-1">
          <div className="bg-white rounded-xl border border-gray-200 p-6 sticky top-24">
            <h3 className="font-semibold text-gray-900 mb-4">Request to Rent</h3>
            <form className="space-y-4">
              <div>
                <label className="block text-sm font-medium text-gray-700 mb-2">Full Name</label>
                <input
                  type="text"
                  className="w-full px-3 py-2 border border-gray-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-teal-500"
                  placeholder="Enter your name"
                />
              </div>

              <div>
                <label className="block text-sm font-medium text-gray-700 mb-2">Email</label>
                <input
                  type="email"
                  className="w-full px-3 py-2 border border-gray-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-teal-500"
                  placeholder="your@email.com"
                />
              </div>

              <div>
                <label className="block text-sm font-medium text-gray-700 mb-2">Phone Number</label>
                <input
                  type="tel"
                  className="w-full px-3 py-2 border border-gray-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-teal-500"
                  placeholder="+63 912 345 6789"
                />
              </div>

              <div>
                <label className="block text-sm font-medium text-gray-700 mb-2">Preferred Move-in Date</label>
                <input
                  type="date"
                  className="w-full px-3 py-2 border border-gray-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-teal-500"
                />
              </div>

              <div>
                <label className="block text-sm font-medium text-gray-700 mb-2">Message</label>
                <textarea
                  rows={3}
                  className="w-full px-3 py-2 border border-gray-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-teal-500"
                  placeholder="Any questions or special requests?"
                />
              </div>

              <button
                type="submit"
                className="w-full flex items-center justify-center gap-2 px-4 py-3 bg-teal-600 text-white rounded-lg hover:bg-teal-700 font-medium"
              >
                <Send className="w-4 h-4" />
                Submit Request
              </button>

              <button
                type="button"
                onClick={() => setScheduleModalOpen(true)}
                className="w-full flex items-center justify-center gap-2 px-4 py-3 border border-gray-300 rounded-lg hover:bg-gray-50 font-medium"
              >
                <Calendar className="w-4 h-4" />
                Schedule Walk-in Visit
              </button>
            </form>

            <div className="mt-6 pt-6 border-t border-gray-200">
              <p className="text-xs text-gray-500">
                By submitting, you agree to be contacted by the property owner regarding your rental request.
              </p>
            </div>
          </div>
        </div>
      </div>

      {scheduleModalOpen && (
        <div className="fixed inset-0 bg-black/50 flex items-center justify-center z-50 p-4">
          <div className="bg-white rounded-xl max-w-2xl w-full max-h-[90vh] overflow-y-auto">
            <div className="sticky top-0 bg-white border-b border-gray-200 px-6 py-4 flex items-center justify-between">
              <div>
                <h2 className="text-xl font-semibold text-gray-900">Schedule Walk-in Visit</h2>
                <p className="text-sm text-gray-500 mt-1">{dormitory.name}</p>
              </div>
              <button
                onClick={() => setScheduleModalOpen(false)}
                className="p-2 hover:bg-gray-100 rounded-lg transition-colors"
              >
                <X className="w-5 h-5 text-gray-500" />
              </button>
            </div>

            <form onSubmit={handleScheduleVisit} className="p-6 space-y-6">
              <div>
                <label className="block text-sm font-medium text-gray-700 mb-3">Select Date (May 2026) *</label>
                <div className="bg-gray-50 rounded-lg p-4">
                  <div className="text-center mb-4">
                    <h3 className="text-lg font-semibold text-gray-900">May 2026</h3>
                  </div>

                  <div className="grid grid-cols-7 gap-2 mb-2">
                    {['Sun', 'Mon', 'Tue', 'Wed', 'Thu', 'Fri', 'Sat'].map((day) => (
                      <div key={day} className="text-center text-xs font-medium text-gray-500 py-2">
                        {day}
                      </div>
                    ))}
                  </div>

                  <div className="grid grid-cols-7 gap-2">
                    {mayCalendar.map((day, index) => (
                      <button
                        key={index}
                        type="button"
                        disabled={day === null}
                        onClick={() => day && setSelectedDate(day)}
                        className={`
                          aspect-square flex items-center justify-center text-sm rounded-lg transition-all
                          ${day === null ? 'invisible' : ''}
                          ${selectedDate === day
                            ? 'bg-teal-600 text-white font-semibold shadow-md'
                            : 'bg-white hover:bg-teal-50 border border-gray-200'
                          }
                          ${day && day < 18 ? 'opacity-50 cursor-not-allowed' : ''}
                        `}
                      >
                        {day}
                      </button>
                    ))}
                  </div>

                  {selectedDate && (
                    <div className="mt-4 p-3 bg-teal-50 border border-teal-200 rounded-lg flex items-center gap-2">
                      <Check className="w-4 h-4 text-teal-600" />
                      <span className="text-sm text-teal-800">Selected: May {selectedDate}, 2026</span>
                    </div>
                  )}
                </div>
              </div>

              <div>
                <label className="block text-sm font-medium text-gray-700 mb-2">Preferred Time *</label>
                <select
                  required
                  value={selectedTime}
                  onChange={(e) => setSelectedTime(e.target.value)}
                  className="w-full px-4 py-2 border border-gray-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-teal-500"
                >
                  <option value="">Select time</option>
                  <option value="9:00 AM">9:00 AM</option>
                  <option value="10:00 AM">10:00 AM</option>
                  <option value="11:00 AM">11:00 AM</option>
                  <option value="1:00 PM">1:00 PM</option>
                  <option value="2:00 PM">2:00 PM</option>
                  <option value="3:00 PM">3:00 PM</option>
                  <option value="4:00 PM">4:00 PM</option>
                </select>
              </div>

              <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                <div>
                  <label className="block text-sm font-medium text-gray-700 mb-2">Your Name *</label>
                  <input
                    type="text"
                    required
                    value={visitName}
                    onChange={(e) => setVisitName(e.target.value)}
                    className="w-full px-4 py-2 border border-gray-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-teal-500"
                    placeholder="Enter your name"
                  />
                </div>
                <div>
                  <label className="block text-sm font-medium text-gray-700 mb-2">Contact Number *</label>
                  <input
                    type="tel"
                    required
                    value={visitContact}
                    onChange={(e) => setVisitContact(e.target.value)}
                    className="w-full px-4 py-2 border border-gray-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-teal-500"
                    placeholder="+63 912 345 6789"
                  />
                </div>
              </div>

              <div className="bg-blue-50 border border-blue-200 rounded-lg p-3">
                <p className="text-xs text-blue-700">
                  💡 The owner will be notified of your scheduled visit. Please arrive on time.
                </p>
              </div>

              <div className="flex gap-3 pt-4 border-t border-gray-200">
                <button
                  type="button"
                  onClick={() => setScheduleModalOpen(false)}
                  className="flex-1 px-4 py-2.5 border border-gray-300 rounded-lg hover:bg-gray-50 transition-colors"
                >
                  Cancel
                </button>
                <button
                  type="submit"
                  disabled={!selectedDate}
                  className="flex-1 px-4 py-2.5 bg-teal-600 text-white rounded-lg hover:bg-teal-700 disabled:bg-gray-300 disabled:cursor-not-allowed transition-colors"
                >
                  Confirm Visit
                </button>
              </div>
            </form>
          </div>
        </div>
      )}
    </div>
  );
}
