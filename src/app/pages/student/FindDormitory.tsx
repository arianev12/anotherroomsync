import { useState, useMemo, useRef } from "react";
import {
  Search, MapPin, Navigation, Loader, X, Users,
  ArrowRight, ChevronRight, Star, SlidersHorizontal,
  Moon, Sun, Sparkles, BookOpen, Home, ShieldCheck,
  Bot, SendHorizonal, Lightbulb, RotateCcw, ChevronDown,
} from "lucide-react";
import LeafletMap from "../../components/LeafletMap";
import { useNavigate } from "react-router";
import { motion, AnimatePresence } from "motion/react";
import { useDormitories } from "../../../hooks/useApi";

// ── Smart Search Parser ──────────────────────────────────────────────────────
interface ParsedQuery {
  budget: number | null;
  amenities: string[];
  availableOnly: boolean;
  keywords: string[];
  rawText: string;
}

const AMENITY_KEYWORDS: Record<string, string> = {
  wifi: "WiFi", internet: "WiFi", "wi-fi": "WiFi",
  aircon: "Aircon", "air con": "Aircon", "air conditioning": "Aircon", ac: "Aircon", "air-con": "Aircon",
  laundry: "Laundry", washing: "Laundry",
  kitchen: "Common Kitchen", cooking: "Common Kitchen", "lutuan": "Common Kitchen",
  security: "24/7 Security", guard: "24/7 Security", safe: "24/7 Security", secured: "24/7 Security",
  cctv: "CCTV", camera: "CCTV",
  gym: "Gym", fitness: "Gym",
  study: "Study Area", quiet: "Study Area", "study area": "Study Area",
  water: "Water Supply", tubig: "Water Supply",
  "study lounge": "Study Lounge", lounge: "Study Lounge",
  parking: "Parking",
  pool: "Pool", swimming: "Pool",
};

function parseSmartQuery(text: string): ParsedQuery {
  const lower = text.toLowerCase();

  // Extract budget
  let budget: number | null = null;
  const budgetPatterns = [
    /(?:budget|within|under|below|below|max|maximum|up to|upto)[\s:of]*(?:₱|php|pesos?)?\s*(\d[\d,]*)/i,
    /(?:₱|php|pesos?)\s*(\d[\d,]*)/i,
    /(\d[\d,]+)\s*(?:pesos?|php|₱)/i,
    /(\d[\d,]+)\s*(?:lang|only|budget)/i,
  ];
  for (const p of budgetPatterns) {
    const m = text.match(p);
    if (m) { budget = parseInt(m[1].replace(/,/g, "")); break; }
  }

  // Extract amenities
  const foundAmenities: string[] = [];
  for (const [keyword, mapped] of Object.entries(AMENITY_KEYWORDS)) {
    if (lower.includes(keyword) && !foundAmenities.includes(mapped)) {
      foundAmenities.push(mapped);
    }
  }
  // "utilities included" / "with utilities" → water + electricity hint
  if (/utilit|electricity|kuryente/.test(lower)) {
    if (!foundAmenities.includes("Water Supply")) foundAmenities.push("Water Supply");
  }

  const availableOnly = /available|vacant|may slot|may room|open/i.test(text);

  const keywords = text
    .replace(/[₱,]/g, "")
    .split(/\s+/)
    .filter(w => w.length > 3 && !/^(want|need|looking|dorm|room|budget|within|under|below|with|including|and|the|for|mga|ang|na|ng|sa|ko|ako|yung|yung|isang|that|have|has|which|where|near|close|campus|please|can|could|find|me|a|an|in|of|at)/i.test(w));

  return { budget, amenities: foundAmenities, availableOnly, keywords, rawText: text };
}

type DormitoryLike = any;

interface SmartResult {
  dorm: DormitoryLike & { distance: number };
  score: number;
  matchedCriteria: string[];
  missedCriteria: string[];
  isExact: boolean;
}

function scoreSmartResults(parsed: ParsedQuery, dormitoryList: DormitoryLike[]): SmartResult[] {
  return dormitoryList
    .map(d => {
      const dist = Math.round(Math.sqrt(Math.pow((d.latitude - 14.0711) * 111, 2) + Math.pow((d.longitude - 120.6328) * 111, 2)) * 1000);
      const matched: string[] = [];
      const missed: string[] = [];
      let score = 0;

      if (parsed.budget !== null) {
        if (d.price <= parsed.budget) { matched.push(`₱${d.price.toLocaleString()} fits ₱${parsed.budget.toLocaleString()} budget`); score += 40; }
        else { missed.push(`₱${d.price.toLocaleString()} exceeds ₱${parsed.budget.toLocaleString()} budget`); score -= 20; }
      }
      for (const amenity of parsed.amenities) {
        const has = d.amenities.some(a => a.toLowerCase().includes(amenity.toLowerCase()) || amenity.toLowerCase().includes(a.toLowerCase()));
        if (has) { matched.push(amenity); score += 15; }
        else { missed.push(amenity); score -= 5; }
      }
      if (parsed.availableOnly) {
        if (d.available > 0) { matched.push(`${d.available} slots available`); score += 10; }
        else { missed.push("No available slots"); score -= 15; }
      }

      const isExact = missed.length === 0 && matched.length > 0;
      return { dorm: { ...d, distance: dist }, score, matchedCriteria: matched, missedCriteria: missed, isExact };
    })
    .filter(r => r.score > -20)
    .sort((a, b) => b.score - a.score);
}

type FilterAvailability = "all" | "available" | "full";

interface RoommatePrefs {
  gender: string;
  studyHabits: string;
  sleepSchedule: string;
  cleanliness: string;
}

interface Tenant {
  name: string;
  gender: string;
  course: string;
  year: number;
  image: string;
  studyHabits?: string;
  sleepSchedule?: string;
  cleanliness?: string;
}

export function FindDormitory() {
  const { dormitories: liveDormitories } = useDormitories();
  const navigate = useNavigate();
  const [selectedDorm, setSelectedDorm] = useState<number | null>(null);
  const [showDormModal, setShowDormModal] = useState(false);
  const [searchTerm, setSearchTerm] = useState("");
  const [priceRange, setPriceRange] = useState<[number, number]>([1500, 5000]);
  const [selectedAmenities, setSelectedAmenities] = useState<string[]>([]);
  const [availability, setAvailability] = useState<FilterAvailability>("all");
  const [isLoading, setIsLoading] = useState(false);
  const [userLocation, setUserLocation] = useState({ lat: 14.0711, lng: 120.6328 });
  const [gpsEnabled, setGpsEnabled] = useState(false);
  const [gpsLoading, setGpsLoading] = useState(false);

  // Smart Search state
  const [smartMode, setSmartMode] = useState(false);
  const [smartInput, setSmartInput] = useState("");
  const [smartQuery, setSmartQuery] = useState<string>("");
  const [parsedQuery, setParsedQuery] = useState<ParsedQuery | null>(null);
  const [smartResults, setSmartResults] = useState<SmartResult[] | null>(null);
  const [isSmartSearching, setIsSmartSearching] = useState(false);
  const [showSmartTips, setShowSmartTips] = useState(false);
  const smartInputRef = useRef<HTMLInputElement>(null);

  const SMART_EXAMPLES = [
    "I want a dorm within my budget of 3000 including water and wifi",
    "Looking for aircon room under ₱3500 near campus",
    "Budget 2500 with laundry and 24/7 security",
    "Need a quiet study area dorm available slots only",
  ];

  // ── Roommate preference state ──
  const [rmPref, setRmPref] = useState<RoommatePrefs>({
    gender: "",
    studyHabits: "",
    sleepSchedule: "",
    cleanliness: "",
  });

  const amenitiesList = [
    "WiFi", "Aircon", "Study Area", "Laundry",
    "24/7 Security", "CCTV", "Gym", "Common Kitchen",
  ];

  const calculateDistance = (lat: number, lng: number) => {
    const d = Math.sqrt(
      Math.pow((lat - userLocation.lat) * 111, 2) +
      Math.pow((lng - userLocation.lng) * 111, 2)
    );
    return Math.round(d * 1000);
  };

  // ── Roommate match score for a single tenant ──
  const calcTenantMatch = (tenant: Tenant): number => {
    let matches = 0;
    let total = 0;
    if (rmPref.gender && rmPref.gender !== "Any") {
      total++;
      if (tenant.gender === rmPref.gender) matches++;
    }
    if (rmPref.studyHabits) {
      total++;
      if (tenant.studyHabits?.toLowerCase().includes(rmPref.studyHabits.toLowerCase())) matches++;
    }
    if (rmPref.sleepSchedule) {
      total++;
      if (tenant.sleepSchedule?.toLowerCase().includes(rmPref.sleepSchedule.toLowerCase())) matches++;
    }
    if (rmPref.cleanliness) {
      total++;
      if (tenant.cleanliness?.toLowerCase().includes(rmPref.cleanliness.toLowerCase())) matches++;
    }
    if (total === 0) return -1; // no prefs set
    return Math.round((matches / total) * 100);
  };

  const hasRmPref = Object.values(rmPref).some(v => v !== "");

  // ── GPS Location Detection ──
  const detectUserLocation = () => {
    if (!navigator.geolocation) {
      alert("Geolocation is not supported by your browser");
      return;
    }

    setGpsLoading(true);
    navigator.geolocation.getCurrentPosition(
      (position) => {
        setUserLocation({
          lat: position.coords.latitude,
          lng: position.coords.longitude,
        });
        setGpsEnabled(true);
        setGpsLoading(false);
      },
      (error) => {
        console.error("Error getting location:", error);
        alert("Unable to get your location. Using default location (BatStateU Arasof).");
        setGpsLoading(false);
      },
      {
        enableHighAccuracy: true,
        timeout: 10000,
        maximumAge: 0,
      }
    );
  };

  // ── Best roommate match score across all available rooms in a dorm ──
  const getDormBestRmScore = (dorm: DormitoryLike) => {
    if (!hasRmPref) return -1;
    let best = -1;
    for (const room of dorm.rooms) {
      if (room.available > 0 && (room as any).currentTenants) {
        for (const tenant of (room as any).currentTenants as Tenant[]) {
          const s = calcTenantMatch(tenant);
          if (s > best) best = s;
        }
      }
    }
    return best;
  };

  const filteredDorms = useMemo(() => {
    return liveDormitories
      .map(d => ({
        ...d,
        distance: calculateDistance(d.latitude, d.longitude),
        bestRmScore: getDormBestRmScore(d),
      }))
      .filter(d => {
        if (
          searchTerm &&
          !d.name.toLowerCase().includes(searchTerm.toLowerCase()) &&
          !d.location.toLowerCase().includes(searchTerm.toLowerCase())
        ) return false;
        if (d.price < priceRange[0] || d.price > priceRange[1]) return false;
        if (selectedAmenities.length > 0 && !selectedAmenities.every(a => d.amenities.includes(a))) return false;
        if (availability === "available" && d.available === 0) return false;
        if (availability === "full" && d.available > 0) return false;
        // Roommate filter: if prefs set, only show dorms where at least one available room has a matching tenant
        if (hasRmPref && d.bestRmScore === 0) return false;
        return true;
      })
      .sort((a, b) => {
        // Sort by roommate score first when prefs are active, otherwise by distance
        if (hasRmPref && a.bestRmScore !== b.bestRmScore) {
          return (b.bestRmScore ?? 0) - (a.bestRmScore ?? 0);
        }
        return a.distance - b.distance;
      });
  }, [liveDormitories, searchTerm, priceRange, selectedAmenities, availability, rmPref]);

  const toggleAmenity = (amenity: string) => {
    setSelectedAmenities(prev =>
      prev.includes(amenity) ? prev.filter(a => a !== amenity) : [...prev, amenity]
    );
  };

  const clearFilters = () => {
    setPriceRange([1500, 5000]);
    setSelectedAmenities([]);
    setAvailability("all");
    setSearchTerm("");
    setRmPref({ gender: "", studyHabits: "", sleepSchedule: "", cleanliness: "" });
  };

  const clearRmPref = () => {
    setRmPref({ gender: "", studyHabits: "", sleepSchedule: "", cleanliness: "" });
  };

  const runSmartSearch = (text: string) => {
    if (!text.trim()) return;
    setIsSmartSearching(true);
    setSmartQuery(text);
    setTimeout(() => {
      const parsed = parseSmartQuery(text);
      const results = scoreSmartResults(parsed, liveDormitories);
      setParsedQuery(parsed);
      setSmartResults(results);
      setIsSmartSearching(false);
    }, 800);
  };

  const resetSmartSearch = () => {
    setSmartInput("");
    setSmartQuery("");
    setParsedQuery(null);
    setSmartResults(null);
  };

  const exitSmartMode = () => {
    setSmartMode(false);
    resetSmartSearch();
  };

  const dormFilterCount =
    (selectedAmenities.length > 0 ? 1 : 0) +
    (availability !== "all" ? 1 : 0) +
    (priceRange[0] !== 1500 || priceRange[1] !== 5000 ? 1 : 0);

  const rmPrefCount = Object.values(rmPref).filter(v => v !== "").length;
  const totalFilterCount = dormFilterCount + rmPrefCount;

  return (
    <div className="space-y-4">

      {/* ── Page Header ── */}
      <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-3">
        <div>
          <h1 className="text-2xl font-semibold text-gray-900 dark:text-white">Find Dormitory</h1>
          <p className="text-sm text-gray-500 dark:text-gray-400 mt-0.5">
            {gpsEnabled ? (
              <span className="flex items-center gap-1.5">
                <span className="w-2 h-2 bg-green-500 rounded-full animate-pulse"></span>
                Showing dormitories near your location
              </span>
            ) : (
              "Discover dormitories & find compatible roommates near BatStateU Arasof Campus"
            )}
          </p>
        </div>
        <motion.button
          whileHover={{ scale: 1.02 }}
          whileTap={{ scale: 0.98 }}
          onClick={detectUserLocation}
          disabled={gpsLoading}
          className={`flex items-center gap-2 px-4 py-2.5 rounded-lg transition-colors disabled:opacity-50 self-start sm:self-auto ${
            gpsEnabled
              ? "bg-green-600 text-white hover:bg-green-700"
              : "bg-teal-600 text-white hover:bg-teal-700"
          }`}
        >
          {gpsLoading ? (
            <>
              <Loader className="w-4 h-4 animate-spin" />
              Detecting…
            </>
          ) : gpsEnabled ? (
            <>
              <Navigation className="w-4 h-4 fill-current" />
              GPS Active
            </>
          ) : (
            <>
              <Navigation className="w-4 h-4" />
              Use My Location
            </>
          )}
        </motion.button>
      </div>

      {/* ═══════ MAIN 2-COLUMN LAYOUT ═══════ */}
      <div className="flex gap-5 items-start">

        {/* ══ LEFT — Unified Filter Panel (always visible) ══ */}
        <aside
          className="flex-shrink-0 sticky top-4 flex flex-col gap-0 rounded-xl border border-gray-200 dark:border-gray-700 overflow-hidden bg-white dark:bg-gray-800"
          style={{ width: 268 }}
        >
          {/* Panel header */}
          <div className="flex items-center justify-between px-5 py-3.5 border-b border-gray-100 dark:border-gray-700 bg-gray-50 dark:bg-gray-900/50">
            <div className="flex items-center gap-2">
              <SlidersHorizontal className="w-4 h-4 text-teal-600 dark:text-teal-400" />
              <span className="font-semibold text-sm text-gray-900 dark:text-white">Filters</span>
              {totalFilterCount > 0 && (
                <span className="w-5 h-5 bg-teal-600 text-white rounded-full text-xs flex items-center justify-center font-medium">
                  {totalFilterCount}
                </span>
              )}
            </div>
            {totalFilterCount > 0 && (
              <button onClick={clearFilters} className="text-xs text-teal-600 dark:text-teal-400 hover:underline font-medium">
                Clear All
              </button>
            )}
          </div>

          <div className="overflow-y-auto" style={{ maxHeight: "calc(100vh - 9rem)" }}>

            {/* ── SECTION 1: DORMITORY FILTERS ── */}
            <div className="px-5 pt-5 pb-4 space-y-5">
              <p className="text-xs font-bold uppercase tracking-widest text-teal-600 dark:text-teal-400 flex items-center gap-1.5">
                <Home className="w-3.5 h-3.5" /> Dorm Filters
              </p>

              {/* Price Range */}
              <div>
                <p className="text-xs font-semibold text-gray-700 dark:text-gray-300 mb-2">Price Range</p>
                <div className="flex items-center justify-between mb-2">
                  <span className="text-xs px-2 py-1 bg-teal-50 dark:bg-teal-900/30 text-teal-700 dark:text-teal-300 rounded-lg font-medium">
                    ₱{priceRange[0].toLocaleString()}
                  </span>
                  <span className="text-xs px-2 py-1 bg-teal-50 dark:bg-teal-900/30 text-teal-700 dark:text-teal-300 rounded-lg font-medium">
                    ₱{priceRange[1].toLocaleString()}
                  </span>
                </div>
                <input
                  type="range" min="1500" max="5000" step="100" value={priceRange[1]}
                  onChange={e => setPriceRange([priceRange[0], parseInt(e.target.value)])}
                  className="w-full h-2 bg-gray-200 dark:bg-gray-700 rounded-lg appearance-none cursor-pointer accent-teal-600"
                />
                <div className="flex gap-2 mt-2">
                  <div className="flex-1">
                    <label className="text-xs text-gray-400 mb-1 block">Min</label>
                    <input type="number" value={priceRange[0]}
                      onChange={e => setPriceRange([parseInt(e.target.value) || 1500, priceRange[1]])}
                      className="w-full px-2 py-1.5 border border-gray-300 dark:border-gray-600 rounded-lg text-xs bg-white dark:bg-gray-900 text-gray-900 dark:text-white focus:outline-none focus:ring-1 focus:ring-teal-500"
                    />
                  </div>
                  <div className="flex-1">
                    <label className="text-xs text-gray-400 mb-1 block">Max</label>
                    <input type="number" value={priceRange[1]}
                      onChange={e => setPriceRange([priceRange[0], parseInt(e.target.value) || 5000])}
                      className="w-full px-2 py-1.5 border border-gray-300 dark:border-gray-600 rounded-lg text-xs bg-white dark:bg-gray-900 text-gray-900 dark:text-white focus:outline-none focus:ring-1 focus:ring-teal-500"
                    />
                  </div>
                </div>
              </div>

              {/* Availability */}
              <div>
                <p className="text-xs font-semibold text-gray-700 dark:text-gray-300 mb-2">Availability</p>
                <div className="space-y-1.5">
                  {[
                    { value: "all", label: "All Dormitories" },
                    { value: "available", label: "Available Only" },
                    { value: "full", label: "Fully Booked" },
                  ].map(opt => (
                    <button key={opt.value}
                      onClick={() => setAvailability(opt.value as FilterAvailability)}
                      className={`w-full px-3 py-2 rounded-lg text-sm text-left transition-all font-medium border-2 ${
                        availability === opt.value
                          ? "bg-teal-50 dark:bg-teal-900/40 border-teal-500 dark:border-teal-400 text-teal-700 dark:text-teal-300"
                          : "bg-gray-50 dark:bg-gray-900/60 border-transparent text-gray-700 dark:text-gray-300 hover:bg-gray-100 dark:hover:bg-gray-700/60"
                      }`}
                    >
                      {opt.label}
                    </button>
                  ))}
                </div>
              </div>

              {/* Amenities */}
              <div>
                <p className="text-xs font-semibold text-gray-700 dark:text-gray-300 mb-2">Amenities</p>
                <div className="flex flex-wrap gap-1.5">
                  {amenitiesList.map(amenity => (
                    <button key={amenity} onClick={() => toggleAmenity(amenity)}
                      className={`px-2.5 py-1.5 rounded-lg text-xs font-medium transition-all ${
                        selectedAmenities.includes(amenity)
                          ? "bg-teal-600 text-white shadow-sm"
                          : "bg-gray-100 dark:bg-gray-700 text-gray-700 dark:text-gray-300 hover:bg-gray-200 dark:hover:bg-gray-600"
                      }`}
                    >
                      {amenity}
                    </button>
                  ))}
                </div>
              </div>
            </div>

            {/* ── DIVIDER ── */}
            <div className="h-2 bg-gray-100 dark:bg-gray-900/50 border-y border-gray-100 dark:border-gray-700" />

            {/* ── SECTION 2: ROOMMATE PREFERENCES ── */}
            <div className="px-5 pt-5 pb-6 space-y-4">
              <div className="flex items-center justify-between">
                <p className="text-xs font-bold uppercase tracking-widest text-purple-600 dark:text-purple-400 flex items-center gap-1.5">
                  <Sparkles className="w-3.5 h-3.5" /> Roommate Match
                </p>
                {rmPrefCount > 0 && (
                  <button onClick={clearRmPref} className="text-xs text-purple-600 dark:text-purple-400 hover:underline font-medium">
                    Clear
                  </button>
                )}
              </div>

              <div className="bg-purple-50 dark:bg-purple-900/20 border border-purple-200 dark:border-purple-700/50 rounded-lg p-3">
                <p className="text-xs text-purple-700 dark:text-purple-300">
                  Fill in your preferences to filter dorms by compatible current roommates.
                </p>
              </div>

              {/* Gender */}
              <div>
                <label className="text-xs font-semibold text-gray-700 dark:text-gray-300 mb-1.5 block flex items-center gap-1">
                  <Users className="w-3.5 h-3.5 text-gray-400" /> Preferred Gender
                </label>
                <select value={rmPref.gender}
                  onChange={e => setRmPref({ ...rmPref, gender: e.target.value })}
                  className="w-full px-3 py-2 border border-gray-300 dark:border-gray-600 rounded-lg text-xs bg-white dark:bg-gray-900 text-gray-900 dark:text-white focus:outline-none focus:ring-1 focus:ring-purple-500"
                >
                  <option value="">Any Gender</option>
                  <option value="Male">Male</option>
                  <option value="Female">Female</option>
                </select>
              </div>

              {/* Study Habits */}
              <div>
                <label className="text-xs font-semibold text-gray-700 dark:text-gray-300 mb-1.5 block flex items-center gap-1">
                  <BookOpen className="w-3.5 h-3.5 text-gray-400" /> Study Habits
                </label>
                <select value={rmPref.studyHabits}
                  onChange={e => setRmPref({ ...rmPref, studyHabits: e.target.value })}
                  className="w-full px-3 py-2 border border-gray-300 dark:border-gray-600 rounded-lg text-xs bg-white dark:bg-gray-900 text-gray-900 dark:text-white focus:outline-none focus:ring-1 focus:ring-purple-500"
                >
                  <option value="">Any</option>
                  <option value="Quiet">Quiet Study</option>
                  <option value="Moderate">Moderate</option>
                  <option value="Night Coder">Night Coder</option>
                  <option value="Group Study">Group Study</option>
                  <option value="Focused">Focused Studier</option>
                </select>
              </div>

              {/* Sleep Schedule */}
              <div>
                <label className="text-xs font-semibold text-gray-700 dark:text-gray-300 mb-1.5 block flex items-center gap-1">
                  <Moon className="w-3.5 h-3.5 text-gray-400" /> Sleep Schedule
                </label>
                <select value={rmPref.sleepSchedule}
                  onChange={e => setRmPref({ ...rmPref, sleepSchedule: e.target.value })}
                  className="w-full px-3 py-2 border border-gray-300 dark:border-gray-600 rounded-lg text-xs bg-white dark:bg-gray-900 text-gray-900 dark:text-white focus:outline-none focus:ring-1 focus:ring-purple-500"
                >
                  <option value="">Any</option>
                  <option value="Early Bird">Early Bird</option>
                  <option value="Night Owl">Night Owl</option>
                  <option value="Flexible">Flexible</option>
                </select>
              </div>

              {/* Cleanliness */}
              <div>
                <label className="text-xs font-semibold text-gray-700 dark:text-gray-300 mb-1.5 block flex items-center gap-1">
                  <Sun className="w-3.5 h-3.5 text-gray-400" /> Cleanliness
                </label>
                <select value={rmPref.cleanliness}
                  onChange={e => setRmPref({ ...rmPref, cleanliness: e.target.value })}
                  className="w-full px-3 py-2 border border-gray-300 dark:border-gray-600 rounded-lg text-xs bg-white dark:bg-gray-900 text-gray-900 dark:text-white focus:outline-none focus:ring-1 focus:ring-purple-500"
                >
                  <option value="">Any</option>
                  <option value="Very Clean">Very Clean</option>
                  <option value="Clean">Clean</option>
                  <option value="Moderate">Moderate</option>
                  <option value="Organized">Organized</option>
                </select>
              </div>

              {rmPrefCount > 0 && (
                <div className="bg-teal-50 dark:bg-teal-900/20 border border-teal-200 dark:border-teal-700/50 rounded-lg p-2.5 text-xs text-teal-700 dark:text-teal-300">
                  ✓ Filtering dorms by <span className="font-semibold">{rmPrefCount} roommate preference{rmPrefCount > 1 ? "s" : ""}</span>
                </div>
              )}
            </div>

          </div>
        </aside>

        {/* ══ RIGHT — Search + Map + Dorm Cards ══ */}
        <div className="flex-1 min-w-0 flex flex-col gap-4">

          {/* ── Search Bar (Normal or Smart mode) ── */}
          <AnimatePresence mode="wait">
            {!smartMode ? (
              <motion.div key="normal-search" initial={{ opacity: 0 }} animate={{ opacity: 1 }} exit={{ opacity: 0 }} className="flex gap-2">
                <div className="relative flex-1">
                  <Search className="absolute left-3 top-1/2 -translate-y-1/2 w-5 h-5 text-gray-400 pointer-events-none" />
                  <input
                    type="text"
                    placeholder="Search by name or location…"
                    value={searchTerm}
                    onChange={e => setSearchTerm(e.target.value)}
                    className="w-full pl-10 pr-10 py-2.5 border border-gray-300 dark:border-gray-600 rounded-lg focus:outline-none focus:ring-2 focus:ring-teal-500 bg-white dark:bg-gray-800 text-gray-900 dark:text-white placeholder-gray-400"
                  />
                  {searchTerm && (
                    <button onClick={() => setSearchTerm("")} className="absolute right-3 top-1/2 -translate-y-1/2 text-gray-400 hover:text-gray-600">
                      <X className="w-4 h-4" />
                    </button>
                  )}
                </div>
                <motion.button
                  whileHover={{ scale: 1.02 }} whileTap={{ scale: 0.98 }}
                  onClick={() => { setSmartMode(true); setTimeout(() => smartInputRef.current?.focus(), 100); }}
                  className="flex items-center gap-2 px-4 py-2.5 bg-gradient-to-r from-violet-600 to-purple-600 text-white rounded-lg text-sm font-medium shadow-sm hover:shadow-md transition-all whitespace-nowrap"
                >
                  <Bot className="w-4 h-4" />
                  Smart Search
                </motion.button>
              </motion.div>
            ) : (
              <motion.div key="smart-search" initial={{ opacity: 0, y: -8 }} animate={{ opacity: 1, y: 0 }} exit={{ opacity: 0 }} className="space-y-3">
                {/* Smart search header */}
                <div className="flex items-center justify-between">
                  <div className="flex items-center gap-2">
                    <div className="w-7 h-7 rounded-lg bg-gradient-to-br from-violet-600 to-purple-600 flex items-center justify-center">
                      <Bot className="w-4 h-4 text-white" />
                    </div>
                    <span className="font-semibold text-sm text-gray-900 dark:text-white">Smart Dorm Assistant</span>
                    <span className="text-xs px-2 py-0.5 bg-violet-100 dark:bg-violet-900/30 text-violet-700 dark:text-violet-300 rounded-full">AI-powered</span>
                  </div>
                  <button onClick={exitSmartMode} className="flex items-center gap-1 text-xs text-gray-500 dark:text-gray-400 hover:text-gray-700 dark:hover:text-gray-200">
                    <X className="w-3.5 h-3.5" /> Exit
                  </button>
                </div>

                {/* Input */}
                <div className="flex gap-2">
                  <div className="relative flex-1">
                    <input
                      ref={smartInputRef}
                      type="text"
                      value={smartInput}
                      onChange={e => setSmartInput(e.target.value)}
                      onKeyDown={e => e.key === "Enter" && runSmartSearch(smartInput)}
                      placeholder='Describe what you need, e.g. "budget 3000 with wifi and water"'
                      className="w-full px-4 py-3 border-2 border-violet-300 dark:border-violet-600 rounded-xl focus:outline-none focus:border-violet-500 bg-white dark:bg-gray-800 text-gray-900 dark:text-white placeholder-gray-400 text-sm"
                    />
                  </div>
                  <motion.button
                    whileHover={{ scale: 1.05 }} whileTap={{ scale: 0.95 }}
                    onClick={() => runSmartSearch(smartInput)}
                    disabled={isSmartSearching || !smartInput.trim()}
                    className="px-4 py-3 bg-gradient-to-r from-violet-600 to-purple-600 text-white rounded-xl hover:shadow-lg transition-all disabled:opacity-50"
                  >
                    {isSmartSearching ? <Loader className="w-5 h-5 animate-spin" /> : <SendHorizonal className="w-5 h-5" />}
                  </motion.button>
                </div>

                {/* Tips toggle */}
                <button
                  onClick={() => setShowSmartTips(v => !v)}
                  className="flex items-center gap-1.5 text-xs text-violet-600 dark:text-violet-400 hover:underline"
                >
                  <Lightbulb className="w-3.5 h-3.5" />
                  Example queries
                  <ChevronDown className={`w-3.5 h-3.5 transition-transform ${showSmartTips ? "rotate-180" : ""}`} />
                </button>
                <AnimatePresence>
                  {showSmartTips && (
                    <motion.div initial={{ height: 0, opacity: 0 }} animate={{ height: "auto", opacity: 1 }} exit={{ height: 0, opacity: 0 }} className="overflow-hidden">
                      <div className="flex flex-wrap gap-2 pb-1">
                        {SMART_EXAMPLES.map((ex, i) => (
                          <button key={i} onClick={() => { setSmartInput(ex); runSmartSearch(ex); setShowSmartTips(false); }}
                            className="text-xs px-3 py-1.5 bg-violet-50 dark:bg-violet-900/20 text-violet-700 dark:text-violet-300 border border-violet-200 dark:border-violet-700 rounded-full hover:bg-violet-100 dark:hover:bg-violet-900/40 transition-colors text-left"
                          >
                            "{ex}"
                          </button>
                        ))}
                      </div>
                    </motion.div>
                  )}
                </AnimatePresence>
              </motion.div>
            )}
          </AnimatePresence>

          {/* Smart Search Results Panel */}
          <AnimatePresence>
            {smartMode && smartResults !== null && parsedQuery && (
              <motion.div initial={{ opacity: 0, y: 8 }} animate={{ opacity: 1, y: 0 }} exit={{ opacity: 0 }} className="space-y-4">
                {/* Parsed query summary */}
                <div className="bg-violet-50 dark:bg-violet-900/20 border border-violet-200 dark:border-violet-700 rounded-xl p-4">
                  <div className="flex items-start justify-between gap-3">
                    <div className="flex-1">
                      <p className="text-xs font-semibold text-violet-700 dark:text-violet-300 mb-2">I understood from your query:</p>
                      <div className="flex flex-wrap gap-2">
                        {parsedQuery.budget && (
                          <span className="inline-flex items-center gap-1 px-2.5 py-1 bg-emerald-100 dark:bg-emerald-900/30 text-emerald-700 dark:text-emerald-300 rounded-lg text-xs font-medium">
                            💰 Budget ≤ ₱{parsedQuery.budget.toLocaleString()}
                          </span>
                        )}
                        {parsedQuery.amenities.map(a => (
                          <span key={a} className="inline-flex items-center gap-1 px-2.5 py-1 bg-blue-100 dark:bg-blue-900/30 text-blue-700 dark:text-blue-300 rounded-lg text-xs font-medium">
                            ✓ {a}
                          </span>
                        ))}
                        {parsedQuery.availableOnly && (
                          <span className="inline-flex items-center px-2.5 py-1 bg-teal-100 dark:bg-teal-900/30 text-teal-700 dark:text-teal-300 rounded-lg text-xs font-medium">
                            ✓ Available slots only
                          </span>
                        )}
                        {!parsedQuery.budget && parsedQuery.amenities.length === 0 && (
                          <span className="text-xs text-violet-500 dark:text-violet-400 italic">No specific criteria detected — showing all dorms ranked by relevance.</span>
                        )}
                      </div>
                    </div>
                    <button onClick={resetSmartSearch} className="flex-shrink-0 flex items-center gap-1 text-xs text-violet-600 dark:text-violet-400 hover:underline">
                      <RotateCcw className="w-3.5 h-3.5" /> Reset
                    </button>
                  </div>
                </div>

                {/* Results */}
                {smartResults.length === 0 ? (
                  <div className="bg-white dark:bg-gray-800 rounded-xl border border-gray-200 dark:border-gray-700 p-10 text-center">
                    <Bot className="w-10 h-10 text-violet-300 mx-auto mb-3" />
                    <p className="font-semibold text-gray-900 dark:text-white">No matching dorms found</p>
                    <p className="text-sm text-gray-500 dark:text-gray-400 mt-1">Try relaxing your criteria — e.g. a higher budget or fewer required amenities.</p>
                  </div>
                ) : (
                  <div className="space-y-4">
                    {/* Exact matches */}
                    {smartResults.some(r => r.isExact) && (
                      <div>
                        <p className="text-xs font-bold text-emerald-600 dark:text-emerald-400 uppercase tracking-wider mb-2 flex items-center gap-1.5">
                          <ShieldCheck className="w-3.5 h-3.5" /> Perfect matches ({smartResults.filter(r => r.isExact).length})
                        </p>
                        <div className="grid grid-cols-1 sm:grid-cols-2 gap-3">
                          {smartResults.filter(r => r.isExact).map(r => (
                            <SmartDormCard key={r.dorm.id} result={r} navigate={navigate} />
                          ))}
                        </div>
                      </div>
                    )}
                    {/* Suggestions */}
                    {smartResults.some(r => !r.isExact) && (
                      <div>
                        <p className="text-xs font-bold text-amber-600 dark:text-amber-400 uppercase tracking-wider mb-2 flex items-center gap-1.5">
                          <Sparkles className="w-3.5 h-3.5" />
                          {smartResults.some(r => r.isExact) ? "Close alternatives" : `Closest suggestions (${smartResults.filter(r => !r.isExact).length})`}
                        </p>
                        {!smartResults.some(r => r.isExact) && (
                          <p className="text-xs text-gray-500 dark:text-gray-400 mb-3 bg-amber-50 dark:bg-amber-900/20 border border-amber-200 dark:border-amber-800 rounded-lg px-3 py-2">
                            No dorm fully matches your criteria, but these come closest. Consider adjusting your budget or required amenities.
                          </p>
                        )}
                        <div className="grid grid-cols-1 sm:grid-cols-2 gap-3">
                          {smartResults.filter(r => !r.isExact).slice(0, 4).map(r => (
                            <SmartDormCard key={r.dorm.id} result={r} navigate={navigate} />
                          ))}
                        </div>
                      </div>
                    )}
                  </div>
                )}

                {/* Divider back to normal browse */}
                <div className="flex items-center gap-3 pt-2">
                  <div className="flex-1 h-px bg-gray-200 dark:bg-gray-700" />
                  <span className="text-xs text-gray-400">or browse all dorms below</span>
                  <div className="flex-1 h-px bg-gray-200 dark:bg-gray-700" />
                </div>
              </motion.div>
            )}
          </AnimatePresence>

          {/* Results badge (only in normal mode or after smart search) */}
          {!smartMode && (
          <div className="flex items-center justify-between bg-gradient-to-r from-teal-50 to-blue-50 dark:from-teal-900/30 dark:to-blue-900/30 border border-teal-200 dark:border-teal-700 rounded-lg px-4 py-2.5">
            <div className="flex items-center gap-2">
              <MapPin className="w-4 h-4 text-teal-600 dark:text-teal-400" />
              <p className="text-sm font-medium text-gray-900 dark:text-white">
                Found <span className="text-teal-600 dark:text-teal-400 font-semibold">{filteredDorms.length}</span> dormitor{filteredDorms.length === 1 ? "y" : "ies"}
                {hasRmPref && <span className="text-purple-600 dark:text-purple-400"> · sorted by roommate match</span>}
              </p>
            </div>
            {totalFilterCount > 0 && (
              <button onClick={clearFilters} className="text-xs text-teal-600 dark:text-teal-400 hover:underline font-medium">
                Clear all
              </button>
            )}
          </div>
          )}

          {/* ── Map ── */}
          <div className="bg-white dark:bg-gray-800 rounded-xl border border-gray-200 dark:border-gray-700 p-4">
            <div className="flex items-center justify-between mb-3">
              <h2 className="text-sm font-semibold text-gray-900 dark:text-white">Map View</h2>
              <span className="text-xs text-gray-500 dark:text-gray-400">{filteredDorms.length} dorms shown</span>
            </div>
            <div className="w-full rounded-lg relative overflow-hidden border border-gray-200 dark:border-gray-700" style={{ height: 220 }}>
              {/* Leaflet map centered on Nasugbu, Batangas */}
              <div className="h-full w-full">
                {/* Lazy load the LeafletMap to avoid SSR issues */}
                <LeafletMap dorms={filteredDorms} userLocation={userLocation} />
              </div>
            </div>
          </div>

          {/* ── Available Dormitories ── */}
          <div>
            <h2 className="text-sm font-semibold text-gray-900 dark:text-white mb-3">
              Available Dormitories
              <span className="ml-2 font-normal text-gray-500 dark:text-gray-400">({filteredDorms.length} found)</span>
            </h2>

            {filteredDorms.length === 0 ? (
              <div className="bg-white dark:bg-gray-800 rounded-xl border border-gray-200 dark:border-gray-700 p-10 text-center">
                <div className="w-12 h-12 bg-gray-100 dark:bg-gray-700 rounded-full flex items-center justify-center mx-auto mb-3">
                  <MapPin className="w-6 h-6 text-gray-400 dark:text-gray-500" />
                </div>
                <h3 className="text-sm font-semibold text-gray-900 dark:text-white mb-1">No dormitories found</h3>
                <p className="text-xs text-gray-500 dark:text-gray-400 mb-4">
                  {hasRmPref
                    ? "No dorms have roommates matching your preferences. Try adjusting your roommate filters."
                    : "Try adjusting your filters or search."}
                </p>
                <button onClick={clearFilters} className="px-4 py-2 bg-teal-600 text-white rounded-lg text-sm hover:bg-teal-700">
                  Reset All Filters
                </button>
              </div>
            ) : (
              <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
                {filteredDorms.map((dorm, index) => {
                  return (
                    <motion.div
                      key={dorm.id}
                      initial={{ opacity: 0, y: 16 }}
                      animate={{ opacity: 1, y: 0 }}
                      transition={{ delay: index * 0.06 }}
                      className="bg-white dark:bg-gray-800 rounded-xl border border-gray-200 dark:border-gray-700 overflow-hidden group shadow-sm hover:shadow-lg transition-all duration-300"
                    >
                      {/* Roommate match banner */}
                      {hasRmPref && dorm.bestRmScore > 0 && (
                        <div className="bg-gradient-to-r from-purple-600 to-purple-500 px-4 py-1.5 flex items-center gap-2">
                          <Sparkles className="w-3.5 h-3.5 text-white" />
                          <span className="text-white text-xs font-semibold">
                            Best roommate match: {dorm.bestRmScore}%
                          </span>
                        </div>
                      )}

                      {/* Card Image */}
                      <div
                        className="relative h-36 overflow-hidden bg-gray-100 dark:bg-gray-700 cursor-pointer"
                        onClick={() => navigate(`/student/dormitory/${dorm.id}`)}
                      >
                        <img src={dorm.images[0]} alt={dorm.name}
                          className="w-full h-full object-cover group-hover:scale-105 transition-transform duration-500" />
                        <div className="absolute top-3 left-3">
                          {dorm.available > 0 ? (
                            <span className="px-2.5 py-1 bg-teal-600 text-white rounded-lg text-xs font-medium shadow">{dorm.available} Available</span>
                          ) : (
                            <span className="px-2.5 py-1 bg-gray-900/80 text-white rounded-lg text-xs font-medium shadow">Fully Booked</span>
                          )}
                        </div>
                        <div className="absolute top-3 right-3 bg-white/90 dark:bg-gray-800/90 backdrop-blur-sm px-2 py-0.5 rounded-lg text-xs text-gray-700 dark:text-gray-300 font-medium shadow">
                          {dorm.distance}m
                        </div>
                        <div className="absolute bottom-3 right-3 bg-white/95 dark:bg-gray-900/95 backdrop-blur-sm px-2.5 py-1 rounded-lg shadow-lg">
                          <p className="text-xs text-gray-500 dark:text-gray-400 leading-none">From</p>
                          <p className="text-sm font-bold text-teal-600 dark:text-teal-400">₱{dorm.price.toLocaleString()}/mo</p>
                        </div>
                      </div>

                      {/* Card body */}
                      <div className="p-4">
                        <div className="flex items-center gap-1.5 mb-1">
                          <h3
                            className="font-semibold text-gray-900 dark:text-white group-hover:text-teal-600 dark:group-hover:text-teal-400 transition-colors line-clamp-1 cursor-pointer"
                            onClick={() => navigate(`/student/dormitory/${dorm.id}`)}
                          >
                            {dorm.name}
                          </h3>
                          {(dorm as any).registrationStatus === "Verified" && (
                            <ShieldCheck className="w-4 h-4 text-emerald-500 flex-shrink-0" title="Verified Dormitory" />
                          )}
                        </div>
                        <div className="flex items-center gap-1.5 text-xs text-gray-500 dark:text-gray-400 mb-2">
                          <MapPin className="w-3.5 h-3.5 flex-shrink-0" />
                          <span className="line-clamp-1">{dorm.address}</span>
                        </div>
                        <div className="flex flex-wrap gap-1.5 mb-3">
                          {dorm.amenities.slice(0, 3).map(a => (
                            <span key={a} className="px-2 py-0.5 bg-gray-100 dark:bg-gray-700 text-gray-700 dark:text-gray-300 rounded text-xs">{a}</span>
                          ))}
                          {dorm.amenities.length > 3 && (
                            <span className="px-2 py-0.5 bg-teal-50 dark:bg-teal-900/30 text-teal-700 dark:text-teal-300 rounded text-xs">+{dorm.amenities.length - 3}</span>
                          )}
                        </div>

                        {/* Rating + View Details row */}
                        <div className="flex items-center justify-between pb-3 border-b border-gray-100 dark:border-gray-700">
                          <div className="flex items-center gap-1">
                            <Star className="w-3.5 h-3.5 fill-yellow-400 text-yellow-400" />
                            <span className="text-xs font-medium text-gray-900 dark:text-white">4.8</span>
                            <span className="text-xs text-gray-500 dark:text-gray-400">(120)</span>
                          </div>
                          <button
                            onClick={() => navigate(`/student/dormitory/${dorm.id}`)}
                            className="flex items-center gap-0.5 text-xs text-teal-600 dark:text-teal-400 font-medium hover:underline"
                          >
                            View Details <ChevronRight className="w-3.5 h-3.5" />
                          </button>
                        </div>

                      </div>
                    </motion.div>
                  );
                })}
              </div>
            )}
          </div>
        </div>{/* end RIGHT */}
      </div>{/* end flex row */}

      {/* ── Quick-Info Modal ── */}
      <AnimatePresence>
        {showDormModal && selectedDorm && (() => {
          const dorm = dormitories.find(d => d.id === selectedDorm);
          if (!dorm) return null;
          return (
            <motion.div
              initial={{ opacity: 0 }} animate={{ opacity: 1 }} exit={{ opacity: 0 }}
              className="fixed inset-0 bg-black/50 backdrop-blur-sm flex items-center justify-center z-50 p-4"
              onClick={() => { setShowDormModal(false); setSelectedDorm(null); }}
            >
              <motion.div
                initial={{ scale: 0.9, opacity: 0, y: 20 }} animate={{ scale: 1, opacity: 1, y: 0 }} exit={{ scale: 0.9, opacity: 0 }}
                onClick={e => e.stopPropagation()}
                className="bg-white dark:bg-gray-800 rounded-2xl shadow-2xl max-w-md w-full overflow-hidden"
              >
                <div className="relative h-48">
                  <img src={dorm.images[0]} alt={dorm.name} className="w-full h-full object-cover" />
                  <button
                    onClick={() => { setShowDormModal(false); setSelectedDorm(null); }}
                    className="absolute top-3 right-3 w-8 h-8 bg-white/90 dark:bg-gray-800/90 backdrop-blur-sm rounded-full flex items-center justify-center shadow"
                  >
                    <X className="w-4 h-4 text-gray-900 dark:text-white" />
                  </button>
                  <div className="absolute inset-0 bg-gradient-to-t from-black/60 to-transparent" />
                  <div className="absolute bottom-3 left-4 right-4">
                    <h2 className="text-lg font-bold text-white">{dorm.name}</h2>
                    <div className="flex items-center gap-1.5 text-white/80 text-xs mt-0.5">
                      <MapPin className="w-3.5 h-3.5" /><span>{dorm.address}</span>
                    </div>
                  </div>
                </div>
                <div className="p-5">
                  <div className="grid grid-cols-3 gap-3 mb-4">
                    {[
                      { label: "Capacity",  value: String(dorm.capacity),               cls: "text-gray-900 dark:text-white" },
                      { label: "Available", value: String(dorm.available),              cls: "text-teal-600 dark:text-teal-400" },
                      { label: "/month",    value: `₱${dorm.price.toLocaleString()}`,   cls: "text-gray-900 dark:text-white" },
                    ].map(s => (
                      <div key={s.label} className="bg-gray-50 dark:bg-gray-900 rounded-xl p-3 text-center">
                        <p className={`text-base font-bold ${s.cls}`}>{s.value}</p>
                        <p className="text-xs text-gray-500 dark:text-gray-400">{s.label}</p>
                      </div>
                    ))}
                  </div>
                  <div className="flex flex-wrap gap-1.5 mb-4">
                    {dorm.amenities.slice(0, 5).map(a => (
                      <span key={a} className="px-2.5 py-1 bg-teal-50 dark:bg-teal-900/30 text-teal-700 dark:text-teal-300 rounded-lg text-xs">{a}</span>
                    ))}
                  </div>
                  <div className="space-y-2 mb-4">
                    {dorm.rooms.slice(0, 2).map((room: any) => (
                      <div key={room.id} className="flex items-center justify-between px-3 py-2 bg-gray-50 dark:bg-gray-900 rounded-lg">
                        <div className="flex items-center gap-2">
                          <Users className="w-4 h-4 text-gray-400" />
                          <span className="text-sm font-medium text-gray-900 dark:text-white">Room {room.roomNumber}</span>
                        </div>
                        <div className="flex items-center gap-2">
                          <span className={`text-xs font-medium ${room.available > 0 ? "text-green-600 dark:text-green-400" : "text-red-500 dark:text-red-400"}`}>
                            {room.available > 0 ? `${room.available} open` : "Full"}
                          </span>
                          <span className="text-teal-600 dark:text-teal-400 text-xs font-semibold">₱{room.price.toLocaleString()}</span>
                        </div>
                      </div>
                    ))}
                  </div>
                  <button
                    onClick={() => { navigate(`/student/dormitory/${dorm.id}`); setShowDormModal(false); }}
                    className="w-full flex items-center justify-center gap-2 px-5 py-2.5 bg-teal-600 text-white rounded-xl hover:bg-teal-700 font-medium transition-colors"
                  >
                    View Full Details <ArrowRight className="w-4 h-4" />
                  </button>
                </div>
              </motion.div>
            </motion.div>
          );
        })()}
      </AnimatePresence>
    </div>
  );
}

// ── Smart Dorm Card ──────────────────────────────────────────────────────────
function SmartDormCard({ result, navigate }: { result: SmartResult; navigate: (path: string) => void }) {
  const { dorm, matchedCriteria, missedCriteria, isExact } = result;
  return (
    <motion.div
      initial={{ opacity: 0, y: 10 }} animate={{ opacity: 1, y: 0 }}
      className={`bg-white dark:bg-gray-800 rounded-xl border-2 overflow-hidden hover:shadow-lg transition-all ${
        isExact ? "border-emerald-300 dark:border-emerald-700" : "border-gray-200 dark:border-gray-700"
      }`}
    >
      <div className="relative h-28 overflow-hidden bg-gray-100 cursor-pointer" onClick={() => navigate(`/student/dormitory/${dorm.id}`)}>
        <img src={dorm.images[0]} alt={dorm.name} className="w-full h-full object-cover hover:scale-105 transition-transform duration-500" />
        <div className="absolute inset-0 bg-gradient-to-t from-black/50 to-transparent" />
        <div className="absolute bottom-2 left-3 right-3 flex items-end justify-between">
          <span className="text-white font-semibold text-sm line-clamp-1">{dorm.name}</span>
          <span className="text-white text-xs font-bold">₱{dorm.price.toLocaleString()}/mo</span>
        </div>
        {isExact && (
          <div className="absolute top-2 right-2 px-2 py-0.5 bg-emerald-500 text-white text-xs font-semibold rounded-full">✓ Match</div>
        )}
      </div>
      <div className="p-3 space-y-2">
        {matchedCriteria.length > 0 && (
          <div className="flex flex-wrap gap-1">
            {matchedCriteria.map(c => (
              <span key={c} className="text-xs px-1.5 py-0.5 bg-emerald-50 dark:bg-emerald-900/20 text-emerald-700 dark:text-emerald-400 rounded border border-emerald-200 dark:border-emerald-800">✓ {c}</span>
            ))}
          </div>
        )}
        {missedCriteria.length > 0 && (
          <div className="flex flex-wrap gap-1">
            {missedCriteria.map(c => (
              <span key={c} className="text-xs px-1.5 py-0.5 bg-red-50 dark:bg-red-900/20 text-red-600 dark:text-red-400 rounded border border-red-200 dark:border-red-800">✗ {c}</span>
            ))}
          </div>
        )}
        <button
          onClick={() => navigate(`/student/dormitory/${dorm.id}`)}
          className="w-full flex items-center justify-center gap-1 py-1.5 bg-teal-600 hover:bg-teal-700 text-white rounded-lg text-xs font-medium transition-colors"
        >
          View Details <ArrowRight className="w-3 h-3" />
        </button>
      </div>
    </motion.div>
  );
}