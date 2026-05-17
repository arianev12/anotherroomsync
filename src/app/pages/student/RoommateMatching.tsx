import { useState, useMemo } from "react";
import { UserCheck, Mail, Heart, X, Send } from "lucide-react";
import { roommates } from "../../data/mockData";
import { toast } from "sonner";
import { motion } from "motion/react";

export function RoommateMatching() {
  const [preferences, setPreferences] = useState({
    gender: '',
    course: '',
    year: '',
    studyHabits: '',
    sleepSchedule: '',
    cleanliness: ''
  });
  const [messageModalOpen, setMessageModalOpen] = useState(false);
  const [selectedRoommate, setSelectedRoommate] = useState<any>(null);
  const [messageText, setMessageText] = useState("");

  // Calculate match score based on preferences
  const calculateMatchScore = (roommate: any) => {
    let matches = 0;
    let totalPreferences = 0;

    // Gender matching
    if (preferences.gender) {
      totalPreferences++;
      if (preferences.gender === 'Any' || preferences.gender === roommate.gender) {
        matches++;
      }
    }

    // Year level matching (convert to number for comparison)
    if (preferences.year) {
      totalPreferences++;
      if (String(roommate.year) === preferences.year) {
        matches++;
      }
    }

    // Study habits matching (partial match)
    if (preferences.studyHabits) {
      totalPreferences++;
      if (roommate.studyHabits.toLowerCase().includes(preferences.studyHabits.toLowerCase())) {
        matches++;
      }
    }

    // Sleep schedule matching
    if (preferences.sleepSchedule) {
      totalPreferences++;
      if (roommate.sleepSchedule.includes(preferences.sleepSchedule)) {
        matches++;
      }
    }

    // Cleanliness matching
    if (preferences.cleanliness) {
      totalPreferences++;
      if (roommate.cleanliness.includes(preferences.cleanliness)) {
        matches++;
      }
    }

    // If no preferences set, return 0%
    if (totalPreferences === 0) return 0;

    // Calculate percentage based on matched preferences
    return Math.round((matches / totalPreferences) * 100);
  };

  // Filter and sort roommates based on preferences
  const filteredRoommates = useMemo(() => {
    return roommates
      .map(roommate => ({
        ...roommate,
        dynamicMatchScore: calculateMatchScore(roommate)
      }))
      .filter(roommate => {
        // If gender is set and not "Any", filter by gender
        if (preferences.gender && preferences.gender !== 'Any' && roommate.gender !== preferences.gender) {
          return false;
        }
        return true;
      })
      .sort((a, b) => b.dynamicMatchScore - a.dynamicMatchScore);
  }, [preferences]);

  const handleOpenMessage = (roommate: any) => {
    setSelectedRoommate(roommate);
    setMessageModalOpen(true);
  };

  const handleSendMessage = (e: React.FormEvent) => {
    e.preventDefault();
    if (messageText.trim()) {
      toast.success(`Message sent to ${selectedRoommate?.name}!`);
      setMessageText("");
      setMessageModalOpen(false);
      setSelectedRoommate(null);
    }
  };

  const handleCloseMessageModal = () => {
    setMessageModalOpen(false);
    setSelectedRoommate(null);
    setMessageText("");
  };

  return (
    <div className="space-y-6">
      <div>
        <h1 className="text-2xl font-semibold text-gray-900 dark:text-white">Roommate Matching</h1>
        <p className="text-sm text-gray-500 dark:text-gray-400 mt-1">Find compatible roommates based on your preferences</p>
      </div>

      <div className="grid grid-cols-1 lg:grid-cols-3 gap-6">
        {/* Preferences Form */}
        <div className="lg:col-span-1">
          <div className="bg-white dark:bg-gray-800 rounded-xl border border-gray-200 dark:border-gray-700 p-6 sticky top-24">
            <h2 className="text-lg font-semibold text-gray-900 dark:text-white mb-6">Your Preferences</h2>
            
            <div className="space-y-4">
              <div>
                <label className="block text-sm font-medium text-gray-700 dark:text-gray-300 mb-2">
                  Gender
                </label>
                <select
                  value={preferences.gender}
                  onChange={(e) => setPreferences({ ...preferences, gender: e.target.value })}
                  className="w-full px-3 py-2 border border-gray-300 dark:border-gray-600 rounded-lg bg-white dark:bg-gray-900 text-gray-900 dark:text-white"
                >
                  <option value="">Select</option>
                  <option value="Male">Male</option>
                  <option value="Female">Female</option>
                  <option value="Any">Any</option>
                </select>
              </div>

              <div>
                <label className="block text-sm font-medium text-gray-700 dark:text-gray-300 mb-2">
                  Course
                </label>
                <input
                  type="text"
                  value={preferences.course}
                  onChange={(e) => setPreferences({ ...preferences, course: e.target.value })}
                  className="w-full px-3 py-2 border border-gray-300 dark:border-gray-600 rounded-lg bg-white dark:bg-gray-900 text-gray-900 dark:text-white"
                  placeholder="e.g., Computer Science"
                />
              </div>

              <div>
                <label className="block text-sm font-medium text-gray-700 dark:text-gray-300 mb-2">
                  Year Level
                </label>
                <select
                  value={preferences.year}
                  onChange={(e) => setPreferences({ ...preferences, year: e.target.value })}
                  className="w-full px-3 py-2 border border-gray-300 dark:border-gray-600 rounded-lg bg-white dark:bg-gray-900 text-gray-900 dark:text-white"
                >
                  <option value="">Select</option>
                  <option value="1">1st Year</option>
                  <option value="2">2nd Year</option>
                  <option value="3">3rd Year</option>
                  <option value="4">4th Year</option>
                </select>
              </div>

              <div>
                <label className="block text-sm font-medium text-gray-700 dark:text-gray-300 mb-2">
                  Study Habits
                </label>
                <select
                  value={preferences.studyHabits}
                  onChange={(e) => setPreferences({ ...preferences, studyHabits: e.target.value })}
                  className="w-full px-3 py-2 border border-gray-300 dark:border-gray-600 rounded-lg bg-white dark:bg-gray-900 text-gray-900 dark:text-white"
                >
                  <option value="">Select</option>
                  <option value="Quiet">Quiet</option>
                  <option value="Moderate">Moderate</option>
                  <option value="Social">Social</option>
                </select>
              </div>

              <div>
                <label className="block text-sm font-medium text-gray-700 dark:text-gray-300 mb-2">
                  Sleep Schedule
                </label>
                <select
                  value={preferences.sleepSchedule}
                  onChange={(e) => setPreferences({ ...preferences, sleepSchedule: e.target.value })}
                  className="w-full px-3 py-2 border border-gray-300 dark:border-gray-600 rounded-lg bg-white dark:bg-gray-900 text-gray-900 dark:text-white"
                >
                  <option value="">Select</option>
                  <option value="Early Bird">Early Bird</option>
                  <option value="Night Owl">Night Owl</option>
                  <option value="Flexible">Flexible</option>
                </select>
              </div>

              <div>
                <label className="block text-sm font-medium text-gray-700 dark:text-gray-300 mb-2">
                  Cleanliness Preference
                </label>
                <select
                  value={preferences.cleanliness}
                  onChange={(e) => setPreferences({ ...preferences, cleanliness: e.target.value })}
                  className="w-full px-3 py-2 border border-gray-300 dark:border-gray-600 rounded-lg bg-white dark:bg-gray-900 text-gray-900 dark:text-white"
                >
                  <option value="">Select</option>
                  <option value="Very Clean">Very Clean</option>
                  <option value="Clean">Clean</option>
                  <option value="Moderate">Moderate</option>
                </select>
              </div>

              <div className="bg-teal-50 dark:bg-teal-900/30 border border-teal-200 dark:border-teal-700 rounded-lg p-3 mt-4">
                <p className="text-xs text-teal-700 dark:text-teal-300">
                  💡 Start at 0% - Fill in your preferences to calculate compatibility! Each preference you add increases the match percentage.
                </p>
              </div>
            </div>
          </div>
        </div>

        {/* Matches */}
        <div className="lg:col-span-2">
          <div className="mb-4">
            <h2 className="text-lg font-semibold text-gray-900 dark:text-white">
              Recommended Roommates ({filteredRoommates.length})
            </h2>
            <p className="text-sm text-gray-500 dark:text-gray-400 mt-1">
              {Object.values(preferences).some(p => p !== '')
                ? "Sorted by compatibility score - percentage increases as you fill more preferences"
                : "Fill in your preferences to calculate compatibility percentage"}
            </p>
          </div>

          <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
            {filteredRoommates.map((roommate, index) => (
              <motion.div
                key={roommate.id}
                initial={{ opacity: 0, y: 20 }}
                animate={{ opacity: 1, y: 0 }}
                transition={{ delay: index * 0.1 }}
                className="bg-white dark:bg-gray-800 rounded-xl border border-gray-200 dark:border-gray-700 p-6 hover:shadow-lg transition-shadow"
              >
                <div className="flex items-start gap-4 mb-4">
                    <img
                      src={roommate.image}
                      alt={roommate.name}
                      className="w-16 h-16 rounded-full object-cover"
                    />
                    <div className="flex-1">
                      <h3 className="font-semibold text-gray-900 dark:text-white">{roommate.name}</h3>
                      <p className="text-sm text-gray-500 dark:text-gray-400">{roommate.course} - {roommate.year}th Year</p>
                      <div className="mt-2 flex items-center gap-2">
                        <div className="flex-1 bg-gray-200 dark:bg-gray-700 rounded-full h-2">
                          <motion.div
                            className="bg-teal-600 h-2 rounded-full"
                            initial={{ width: 0 }}
                            animate={{ width: `${roommate.dynamicMatchScore}%` }}
                            transition={{ duration: 0.5 }}
                          />
                        </div>
                        <span className="text-sm font-medium text-teal-600 dark:text-teal-400">{roommate.dynamicMatchScore}%</span>
                      </div>
                    </div>
                  </div>

                  <div className="space-y-2 mb-4">
                    <div className="flex justify-between text-sm">
                      <span className="text-gray-500 dark:text-gray-400">Gender:</span>
                      <span className="text-gray-900 dark:text-white font-medium">{roommate.gender}</span>
                    </div>
                    <div className="flex justify-between text-sm">
                      <span className="text-gray-500 dark:text-gray-400">Study Habits:</span>
                      <span className="text-gray-900 dark:text-white font-medium">{roommate.studyHabits}</span>
                    </div>
                    <div className="flex justify-between text-sm">
                      <span className="text-gray-500 dark:text-gray-400">Sleep Schedule:</span>
                      <span className="text-gray-900 dark:text-white font-medium">{roommate.sleepSchedule}</span>
                    </div>
                    <div className="flex justify-between text-sm">
                      <span className="text-gray-500 dark:text-gray-400">Cleanliness:</span>
                      <span className="text-gray-900 dark:text-white font-medium">{roommate.cleanliness}</span>
                    </div>
                    <div className="flex justify-between text-sm">
                      <span className="text-gray-500 dark:text-gray-400">Hobbies:</span>
                      <span className="text-gray-900 dark:text-white font-medium">{roommate.hobbies}</span>
                    </div>
                    <div className="flex justify-between text-sm">
                      <span className="text-gray-500 dark:text-gray-400">Budget:</span>
                      <span className="text-gray-900 dark:text-white font-medium">₱{roommate.budget.toLocaleString()}/mo</span>
                    </div>
                    <div className="flex justify-between text-sm">
                      <span className="text-gray-500 dark:text-gray-400">Preferred Area:</span>
                      <span className="text-gray-900 dark:text-white font-medium">{roommate.preferredLocation}</span>
                    </div>
                  </div>

                <div className="flex gap-2">
                  <button
                    onClick={() => handleOpenMessage(roommate)}
                    className="flex-1 flex items-center justify-center gap-2 px-4 py-2 bg-teal-600 text-white rounded-lg hover:bg-teal-700"
                  >
                    <Mail className="w-4 h-4" />
                    Message
                  </button>
                  <button className="px-4 py-2 border border-gray-300 dark:border-gray-600 rounded-lg hover:bg-gray-50 dark:hover:bg-gray-700">
                    <Heart className="w-4 h-4 text-gray-600 dark:text-gray-400" />
                  </button>
                </div>
              </motion.div>
            ))}
          </div>
        </div>
      </div>

      {/* Message Modal */}
      {messageModalOpen && (
        <div className="fixed inset-0 bg-black/50 flex items-center justify-center z-50 p-4">
          <div className="bg-white dark:bg-gray-800 rounded-xl max-w-lg w-full">
            <div className="border-b border-gray-200 dark:border-gray-700 px-6 py-4">
              <h2 className="text-xl font-semibold text-gray-900 dark:text-white">Send Message</h2>
              <p className="text-sm text-gray-500 dark:text-gray-400 mt-1">To: {selectedRoommate?.name}</p>
            </div>

            <form onSubmit={handleSendMessage} className="p-6 space-y-4">
              <div className="flex items-start gap-4 pb-4 border-b border-gray-200 dark:border-gray-700">
                <img
                  src={selectedRoommate?.image}
                  alt={selectedRoommate?.name}
                  className="w-12 h-12 rounded-full object-cover"
                />
                <div className="flex-1">
                  <h3 className="font-semibold text-gray-900 dark:text-white">{selectedRoommate?.name}</h3>
                  <p className="text-sm text-gray-500 dark:text-gray-400">{selectedRoommate?.course} - {selectedRoommate?.year}th Year</p>
                  <div className="mt-2 flex items-center gap-2">
                    <div className="flex-1 bg-gray-200 dark:bg-gray-700 rounded-full h-1.5">
                      <div
                        className="bg-teal-600 h-1.5 rounded-full"
                        style={{ width: `${selectedRoommate?.dynamicMatchScore || selectedRoommate?.matchScore}%` }}
                      />
                    </div>
                    <span className="text-xs font-medium text-teal-600 dark:text-teal-400">{selectedRoommate?.dynamicMatchScore || selectedRoommate?.matchScore}% Match</span>
                  </div>
                </div>
              </div>

              <div>
                <label className="block text-sm font-medium text-gray-700 dark:text-gray-300 mb-2">
                  Message *
                </label>
                <textarea
                  required
                  rows={6}
                  value={messageText}
                  onChange={(e) => setMessageText(e.target.value)}
                  placeholder="Hi! I saw your profile and think we'd be great roommates. Would you like to connect?"
                  className="w-full px-4 py-2 border border-gray-300 dark:border-gray-600 rounded-lg focus:outline-none focus:ring-2 focus:ring-teal-500 resize-none bg-white dark:bg-gray-900 text-gray-900 dark:text-white"
                />
              </div>

              <div className="bg-blue-50 dark:bg-blue-900/30 border border-blue-200 dark:border-blue-700 rounded-lg p-3">
                <p className="text-xs text-blue-700 dark:text-blue-300">
                  💡 Be friendly and introduce yourself! Mention shared interests or study habits.
                </p>
              </div>

              <div className="flex gap-3 pt-2">
                <button
                  type="button"
                  onClick={handleCloseMessageModal}
                  className="flex-1 px-4 py-2.5 border border-gray-300 dark:border-gray-600 rounded-lg hover:bg-gray-50 dark:hover:bg-gray-700 transition-colors text-gray-900 dark:text-white"
                >
                  Cancel
                </button>
                <button
                  type="submit"
                  className="flex-1 flex items-center justify-center gap-2 px-4 py-2.5 bg-teal-600 text-white rounded-lg hover:bg-teal-700 transition-colors"
                >
                  <Send className="w-4 h-4" />
                  Send Message
                </button>
              </div>
            </form>
          </div>
        </div>
      )}
    </div>
  );
}