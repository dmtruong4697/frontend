'use client';

import { useEffect, useState } from 'react';
import { useRouter } from 'next/navigation';
import { useAuthStore } from '@/stores/useAuthStore';
import { useMatchStore } from '@/stores/useMatchStore';
import { api } from '@/services/api';
import { Button, cn } from '@/components/ui/Button';
import { Input } from '@/components/ui/Input';
import { Select, SelectOption } from '@/components/ui/Select';
import { LogOut, Search, User as UserIcon, ChevronDown, ChevronUp, Sparkles } from 'lucide-react';
import Lottie from 'lottie-react';
import funnyDogAnimation from '@/assets/animations/funny-dog.json';

const languages: SelectOption[] = [
  { label: 'Vietnamese', code: 'VN', icon: '🇻🇳' },
  { label: 'English', code: 'EN', icon: '🇺🇸' },
  { label: 'Chinese', code: 'ZH', icon: '🇨🇳' },
  { label: 'Japanese', code: 'JA', icon: '🇯🇵' },
  { label: 'Korean', code: 'KO', icon: '🇰🇷' },
  { label: 'French', code: 'FR', icon: '🇫🇷' },
  { label: 'German', code: 'DE', icon: '🇩🇪' },
  { label: 'Spanish', code: 'ES', icon: '🇪🇸' },
  { label: 'Italian', code: 'IT', icon: '🇮🇹' },
  { label: 'Russian', code: 'RU', icon: '🇷🇺' },
  { label: 'Portuguese', code: 'PT', icon: '🇵🇹' },
  { label: 'Arabic', code: 'AR', icon: '🇸🇦' },
  { label: 'Hindi', code: 'HI', icon: '🇮🇳' },
];

const prefLanguages: SelectOption[] = [
  { label: 'Any Language', code: 'any', icon: '🌍' },
  ...languages
];

const ageOptions: SelectOption[] = Array.from({ length: 43 }, (_, i) => ({
  label: (i + 18).toString(),
  code: (i + 18).toString(),
}));
const prefAgeOptions: SelectOption[] = [
  ...ageOptions,
  { label: '99+', code: '99' }
];

export default function HomePage() {
  const router = useRouter();
  const { user, token, logout, updateUser } = useAuthStore();
  const { isSearching, setSearching, setMatch, roomID } = useMatchStore();
  const [isHydrated, setIsHydrated] = useState(false);

  useEffect(() => {
    setIsHydrated(true);
  }, []);

  const [profileForm, setProfileForm] = useState({
    gender: user?.gender || '',
    age: user?.age?.toString() || '',
    language: user?.language || 'VN',
    interests: user?.interests?.join(', ') || '',
    preferences: {
      gender: user?.preferences?.gender || 'any',
      min_age: user?.preferences?.min_age || 18,
      max_age: user?.preferences?.max_age || 99,
      language: user?.preferences?.language || 'any',
      interests: user?.preferences?.interests || [],
    }
  });

  const [showAllMyInterests, setShowAllMyInterests] = useState(false);
  const [showAllPrefInterests, setShowAllPrefInterests] = useState(false);
  const [isSaving, setIsSaving] = useState(false);
  const [error, setError] = useState<string | null>(null);

  useEffect(() => {
    if (!isHydrated) return;
    if (!token) {
      router.replace('/login');
      return;
    }
    if (roomID) {
      router.replace('/chat');
    }
  }, [token, roomID, isHydrated, router]);

  // Load profile on mount
  useEffect(() => {
    const fetchProfile = async () => {
      try {
        const res = await api.get('/me');
        if (res.data) {
          updateUser(res.data);
          setProfileForm({
            gender: res.data.gender || '',
            age: res.data.age?.toString() || '',
            language: res.data.language || 'VN',
            interests: res.data.interests?.join(', ') || '',
            preferences: {
              gender: res.data.preferences?.gender || 'any',
              min_age: res.data.preferences?.min_age || 18,
              max_age: res.data.preferences?.max_age || 99,
              language: res.data.preferences?.language || 'any',
              interests: res.data.preferences?.interests || [],
            }
          });
        }
      } catch (err: any) {
        if (err?.code !== 'UNAUTHORIZED') {
          console.error('Failed to load profile', err);
        }
      }
    };
    if (token) fetchProfile();
  }, [token]); // eslint-disable-line

  const handleUpdateProfile = async () => {
    try {
      setIsSaving(true);
      setError(null);
      const interestsArray = profileForm.interests
        ? profileForm.interests.split(',').map((i) => i.trim()).filter((i) => i.length > 0)
        : [];

      const payload = {
        gender: profileForm.gender,
        age: parseInt(profileForm.age) || 0,
        language: profileForm.language,
        interests: interestsArray,
        preferences: {
          gender: profileForm.preferences.gender,
          min_age: Number(profileForm.preferences.min_age),
          max_age: Number(profileForm.preferences.max_age),
          language: profileForm.preferences.language,
          interests: profileForm.preferences.interests,
        },
      };

      const res: any = await api.put('/me/update', payload);
      if (res.status === 200) {
        updateUser(payload);
      }
    } catch (err: any) {
      setError(err?.message || 'Failed to update profile');
    } finally {
      setIsSaving(false);
    }
  };

  const handlePrefInterestToggle = (interest: string) => {
    const current = profileForm.preferences.interests || [];
    const updated = current.includes(interest)
      ? current.filter((i) => i !== interest)
      : [...current, interest];

    setProfileForm({
      ...profileForm,
      preferences: { ...profileForm.preferences, interests: updated }
    });
  };

  const handleStartMatch = async () => {
    try {
      setSearching(true);
      setError(null);
      const res = await api.post('/match/start');
      if (res.data?.room_id) {
        setMatch(res.data.room_id, res.data.stranger_id);
        router.push('/chat');
      } else {
        // Assume polling might be needed, or WebSocket sends `matched` event?
        // Wait, the backend `/match/start` might block until matched or return a room right away. 
        // Based on Postman it looks like a standard POST. Let's assume it returns {room_id, stranger_id}.
        // If not, we might need to handle a waiting state. Let's just hold the state until matched.
      }
    } catch (err: any) {
      setError(err?.message || 'Failed to start matching');
      setSearching(false);
    }
  };

  const handleStopMatch = async () => {
    try {
      await api.post('/match/stop');
      setSearching(false);
    } catch (err) {
      console.error(err);
      setSearching(false);
    }
  };

  if (!user) {
    return (
      <div className="flex-1 flex items-center justify-center bg-cream-50 text-forest-700">
        <div className="animate-bounce">
          <div className="w-12 h-12 bg-matcha-500 rounded-full" />
        </div>
      </div>
    );
  }

  const interestOptions = [
    { label: 'Music', icon: '🎵' },
    { label: 'Gaming', icon: '🎮' },
    { label: 'Tech', icon: '💻' },
    { label: 'Food', icon: '🍕' },
    { label: 'Travel', icon: '✈️' },
    { label: 'Art', icon: '🎨' },
    { label: 'Movies', icon: '🎬' },
    { label: 'Sports', icon: '⚽' },
    { label: 'Reading', icon: '📚' },
    { label: 'Pets', icon: '🐾' },
  ];

  const handleInterestToggle = (interest: string) => {
    const currentInterests = profileForm.interests ? profileForm.interests.split(',').map(i => i.trim()).filter(i => i) : [];
    if (currentInterests.includes(interest)) {
      setProfileForm({ ...profileForm, interests: currentInterests.filter(i => i !== interest).join(', ') });
    } else {
      setProfileForm({ ...profileForm, interests: [...currentInterests, interest].join(', ') });
    }
  };

  return (
    <div className="flex-1 flex flex-col bg-cream-50 overflow-y-auto">
      <header className="sticky top-0 z-10 bg-white/70 backdrop-blur-md border-b border-matcha-100 p-4 flex items-center justify-between shadow-sm">
        <div className="flex items-center gap-3">
          <div className="w-10 h-10 bg-matcha-500 rounded-2xl flex items-center justify-center shadow-inner">
            <UserIcon className="w-5 h-5 text-white" />
          </div>
          <div>
            <h2 className="text-forest-900 font-bold leading-tight">{user.name}</h2>
            <p className="text-xs text-matcha-600 font-medium">
              Chatting is fun! ✨
              {/* what the fuck ???? */}
            </p>
          </div>
        </div>
        <Button variant="ghost" onClick={logout} className="!p-2 text-forest-700 hover:bg-matcha-100 rounded-full">
          <LogOut className="w-5 h-5" />
        </Button>
      </header>

      <main className="flex-1 p-6 flex flex-col items-center">
        <div className="w-full max-w-5xl flex flex-col gap-6">

          {/* Match Section */}
          <div className="bg-white border-2 border-matcha-100 rounded-[2.5rem] p-8 flex flex-col items-center text-center gap-6 shadow-xl shadow-matcha-600/5">
            <div className="w-32 h-32 flex items-center justify-center relative">
              <div className="relative z-10 w-32 h-32">
                <Lottie
                  animationData={funnyDogAnimation}
                  loop={true}
                  autoplay={true}
                />
              </div>
            </div>
            <div className="space-y-2">
              <h3 className="text-2xl font-black text-forest-900 tracking-tight">
                {isSearching ? 'Joining Queue...' : 'Meet Someone New!'}
              </h3>
              <p className="text-forest-700 font-medium leading-relaxed">
                {isSearching
                  ? 'Hang tight! We are finding your perfect chat partner...'
                  : 'Ready to make some friends? Press the button to start!'}
              </p>
            </div>

            {error && <p className="text-rose-500 text-sm font-semibold bg-rose-50 px-4 py-2 rounded-full">{error}</p>}

            {isSearching ? (
              <Button variant="danger" className="w-full h-14 text-lg rounded-2xl shadow-lg shadow-rose-200 lg:max-w-sm" onClick={handleStopMatch}>
                Stop Searching
              </Button>
            ) : (
              <Button variant="primary" className="w-full h-14 text-lg rounded-2xl shadow-lg shadow-matcha-200 lg:max-w-sm" onClick={handleStartMatch}>
                Find Match ✨
              </Button>
            )}
          </div>

          <div className="grid grid-cols-1 lg:grid-cols-2 gap-6">
            {/* Profile Section */}
            <div className="bg-white border-2 border-matcha-100 rounded-[2.5rem] p-8 flex flex-col gap-6 shadow-xl shadow-matcha-600/5">
              <h3 className="text-xl font-bold text-forest-900 border-b-2 border-matcha-100 pb-2 flex items-center gap-2">
                <UserIcon className="w-5 h-5 text-matcha-500" />
                Your Profile
              </h3>

              {/* Gender Picker */}
              <div className="space-y-3">
                <label className="text-sm font-bold text-forest-700 ml-1">Gender</label>
                <div className="flex gap-2">
                  {['male', 'female', 'other'].map((g) => (
                    <button
                      key={g}
                      type="button"
                      onClick={() => setProfileForm({ ...profileForm, gender: g })}
                      className={cn(
                        'flex-1 py-3 rounded-2xl font-bold capitalize transition-all border-2',
                        profileForm.gender === g
                          ? 'bg-matcha-500 border-matcha-500 text-white shadow-md'
                          : 'bg-white border-matcha-100 text-forest-700 hover:border-matcha-300'
                      )}
                    >
                      {g}
                    </button>
                  ))}
                </div>
              </div>

              {/* Age Input */}
              <div className="space-y-3">
                <label className="text-sm font-bold text-forest-700 ml-1">Your Age</label>
                <Input
                  type="number"
                  placeholder="Enter your age..."
                  value={profileForm.age}
                  onChange={(e) => setProfileForm({ ...profileForm, age: e.target.value })}
                  className="h-12 text-lg font-bold"
                />
              </div>

              {/* Language Picker */}
              <Select
                label="Your Language"
                options={prefLanguages}
                value={profileForm.language}
                onChange={(val) => setProfileForm({ ...profileForm, language: val })}
              />

              {/* Interests Picker */}
              <div className="space-y-3">
                <label className="text-sm font-bold text-forest-700 ml-1 flex justify-between items-center">
                  <span>Interests</span>
                  <span className="text-[10px] text-matcha-400 uppercase tracking-widest">{profileForm.interests?.split(',').filter(Boolean).length || 0} selected</span>
                </label>
                <div className="flex flex-wrap gap-2">
                  {(showAllMyInterests ? interestOptions : interestOptions.slice(0, 6)).map((opt) => {
                    const isActive = profileForm.interests?.includes(opt.label);
                    return (
                      <button
                        key={opt.label}
                        type="button"
                        onClick={() => handleInterestToggle(opt.label)}
                        className={cn(
                          'px-4 py-2 rounded-full text-[13px] font-bold transition-all border-2 shadow-sm',
                          isActive
                            ? 'bg-matcha-100 border-matcha-500 text-matcha-600'
                            : 'bg-white border-matcha-100 text-forest-700 hover:border-matcha-300'
                        )}
                      >
                        {opt.icon} {opt.label}
                      </button>
                    );
                  })}
                  <button
                    type="button"
                    onClick={() => setShowAllMyInterests(!showAllMyInterests)}
                    className="px-4 py-2 rounded-full text-[13px] font-bold transition-all border-2 border-dashed border-matcha-200 text-matcha-600 hover:bg-matcha-50 flex items-center gap-1"
                  >
                    {showAllMyInterests ? (
                      <><ChevronUp className="w-3 h-3" /> Show Less</>
                    ) : (
                      <><ChevronDown className="w-3 h-3" /> +{interestOptions.length - 6} More</>
                    )}
                  </button>
                </div>
              </div>
            </div>

            {/* Preferences Section */}
            <div className="bg-white border-2 border-matcha-100 rounded-[2.5rem] p-8 flex flex-col gap-6 shadow-xl shadow-matcha-600/5">
              <h3 className="text-xl font-bold text-forest-900 border-b-2 border-matcha-100 pb-2 flex items-center gap-2">
                <Search className="w-5 h-5 text-matcha-500" />
                Who you want to meet
              </h3>

              {/* Preferred Language */}
              <Select
                label="Preferred Language"
                options={prefLanguages}
                value={profileForm.preferences.language}
                onChange={(val) => setProfileForm({
                  ...profileForm,
                  preferences: { ...profileForm.preferences, language: val }
                })}
              />

              {/* Gender Preference */}
              <div className="space-y-3">
                <label className="text-sm font-bold text-forest-700 ml-1">Preferred Gender</label>
                <div className="grid grid-cols-2 gap-2">
                  {['any', 'male', 'female', 'other'].map((g) => (
                    <button
                      key={g}
                      type="button"
                      onClick={() => setProfileForm({
                        ...profileForm,
                        preferences: { ...profileForm.preferences, gender: g }
                      })}
                      className={cn(
                        'py-3 rounded-2xl font-bold capitalize transition-all border-2 text-sm',
                        profileForm.preferences.gender === g
                          ? 'bg-matcha-500 border-matcha-500 text-white shadow-md'
                          : 'bg-white border-matcha-100 text-forest-700 hover:border-matcha-300'
                      )}
                    >
                      {g}
                    </button>
                  ))}
                </div>
              </div>

              {/* Age Preferences */}
              <div className="space-y-4">
                <label className="text-sm font-bold text-forest-700 ml-1">Preferred Age Range</label>
                <div className="grid grid-cols-2 gap-4">
                  <Select
                    label="Min Age"
                    options={ageOptions}
                    value={profileForm.preferences.min_age.toString()}
                    onChange={(val) => setProfileForm({
                      ...profileForm,
                      preferences: { ...profileForm.preferences, min_age: parseInt(val) }
                    })}
                  />
                  <Select
                    label="Max Age"
                    options={prefAgeOptions}
                    value={profileForm.preferences.max_age.toString()}
                    onChange={(val) => setProfileForm({
                      ...profileForm,
                      preferences: { ...profileForm.preferences, max_age: parseInt(val) }
                    })}
                  />
                </div>
              </div>

              {/* Preferred Interests */}
              <div className="space-y-3">
                <label className="text-sm font-bold text-forest-700 ml-1 flex justify-between items-center">
                  <span>Preferred Interests</span>
                  <Sparkles className="w-3 h-3 text-matcha-400" />
                </label>
                <div className="flex flex-wrap gap-2">
                  {(showAllPrefInterests ? interestOptions : interestOptions.slice(0, 6)).map((opt) => {
                    const isActive = profileForm.preferences.interests?.includes(opt.label);
                    return (
                      <button
                        key={opt.label}
                        type="button"
                        onClick={() => handlePrefInterestToggle(opt.label)}
                        className={cn(
                          'px-4 py-2 rounded-full text-[13px] font-bold transition-all border-2 shadow-sm',
                          isActive
                            ? 'bg-matcha-100 border-matcha-500 text-matcha-600'
                            : 'bg-white border-matcha-100 text-forest-700 hover:border-matcha-300'
                        )}
                      >
                        {opt.icon} {opt.label}
                      </button>
                    );
                  })}
                  <button
                    type="button"
                    onClick={() => setShowAllPrefInterests(!showAllPrefInterests)}
                    className="px-4 py-2 rounded-full text-[13px] font-bold transition-all border-2 border-dashed border-matcha-200 text-matcha-600 hover:bg-matcha-50 flex items-center gap-1"
                  >
                    {showAllPrefInterests ? (
                      <><ChevronUp className="w-3 h-3" /> Show Less</>
                    ) : (
                      <><ChevronDown className="w-3 h-3" /> +{interestOptions.length - 6} More</>
                    )}
                  </button>
                </div>
              </div>

              <div className="mt-auto pt-4 border-t border-matcha-100/50">
                <p className="text-xs text-matcha-600 font-medium leading-relaxed italic text-center">
                  ✨ We will try our best to find someone matching your preferences!
                </p>
              </div>
            </div>
          </div>

          <div className="flex justify-center pb-12">
            <Button
              variant="secondary"
              className="w-full h-14 text-lg font-black shadow-xl shadow-matcha-600/10 border-2 border-matcha-100 max-w-sm"
              onClick={handleUpdateProfile}
              isLoading={isSaving}
              disabled={isSearching}
            >
              SAVE ALL CHANGES 💾
            </Button>
          </div>

        </div>
      </main>
    </div>
  );
}
