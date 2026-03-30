'use client';

import { useEffect, useState } from 'react';
import { useRouter } from 'next/navigation';
import { useAuthStore } from '@/stores/useAuthStore';
import { useMatchStore } from '@/stores/useMatchStore';
import { useToastStore } from '@/stores/useToastStore';
import { api } from '@/services/api';
import { Button, cn } from '@/components/ui/Button';
import { Input } from '@/components/ui/Input';
import { Select, SelectOption } from '@/components/ui/Select';
import { LogOut, User as UserIcon, ChevronDown, ChevronUp, Sparkles, Heart } from 'lucide-react';
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
  ...languages,
];

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

// ── Reusable section card ──
function Card({ children, className }: { children: React.ReactNode; className?: string }) {
  return (
    <div
      className={cn('bg-white rounded-[2rem] p-6 flex flex-col gap-5', className)}
      style={{ boxShadow: '0 4px 24px rgba(124,110,240,0.08), 0 1px 4px rgba(0,0,0,0.04)', border: '1.5px solid #E2E0F0' }}
    >
      {children}
    </div>
  );
}

// ── Section heading ──
function SectionHeading({ icon, children }: { icon: React.ReactNode; children: string }) {
  return (
    <div className="flex items-center gap-2.5 pb-3" style={{ borderBottom: '1.5px solid #E2E0F0' }}>
      <span className="w-8 h-8 rounded-2xl flex items-center justify-center shrink-0" style={{ background: '#E4E1FF' }}>
        {icon}
      </span>
      <h3 className="text-base font-black" style={{ color: '#1E1C2E' }}>{children}</h3>
    </div>
  );
}

// ── Interest chip ──
function Chip({ active, onClick, children }: { active: boolean; onClick: () => void; children: React.ReactNode }) {
  return (
    <button
      type="button"
      onClick={onClick}
      className="px-3.5 py-1.5 rounded-full text-xs font-bold transition-all duration-150 border-2 select-none cursor-pointer"
      style={
        active
          ? { background: '#E4E1FF', borderColor: '#7C6EF0', color: '#4D3CB8' }
          : { background: '#fff', borderColor: '#E2E0F0', color: '#6B6880' }
      }
    >
      {children}
    </button>
  );
}

// ── Gender button ──
function GenderBtn({ active, label, onClick }: { active: boolean; label: string; onClick: () => void }) {
  return (
    <button
      type="button"
      onClick={onClick}
      className="flex-1 py-2.5 rounded-2xl font-bold capitalize text-sm transition-all duration-150 border-2 cursor-pointer"
      style={
        active
          ? { background: '#7C6EF0', borderColor: '#7C6EF0', color: '#fff', boxShadow: '0 2px 12px rgba(124,110,240,0.3)' }
          : { background: '#fff', borderColor: '#E2E0F0', color: '#6B6880' }
      }
    >
      {label}
    </button>
  );
}

export default function HomePage() {
  const router = useRouter();
  const { user, token, logout, updateUser } = useAuthStore();
  const { isSearching, setSearching, setMatch, roomID } = useMatchStore();
  const [isHydrated, setIsHydrated] = useState(false);

  useEffect(() => { setIsHydrated(true); }, []);

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
    },
  });

  const [showAllMyInterests, setShowAllMyInterests] = useState(false);
  const [showAllPrefInterests, setShowAllPrefInterests] = useState(false);
  const [isSaving, setIsSaving] = useState(false);
  const { addToast } = useToastStore();
  const [error, setError] = useState<string | null>(null);

  useEffect(() => {
    if (!isHydrated) return;
    if (!token) { router.replace('/'); return; }
    if (roomID) { router.replace('/chat'); }
  }, [token, roomID, isHydrated, router]);

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
            },
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
        addToast('Profile updated successfully!', 'success');
      }
    } catch (err: any) {
      setError(err?.message || 'Failed to update profile');
    } finally {
      setIsSaving(false);
    }
  };

  const handleInterestToggle = (interest: string) => {
    const current = profileForm.interests ? profileForm.interests.split(',').map((i) => i.trim()).filter(Boolean) : [];
    const updated = current.includes(interest) ? current.filter((i) => i !== interest) : [...current, interest];
    setProfileForm({ ...profileForm, interests: updated.join(', ') });
  };

  const handlePrefInterestToggle = (interest: string) => {
    const current = profileForm.preferences.interests || [];
    const updated = current.includes(interest) ? current.filter((i) => i !== interest) : [...current, interest];
    setProfileForm({ ...profileForm, preferences: { ...profileForm.preferences, interests: updated } });
  };

  const handleStartMatch = async () => {
    try {
      setError(null);

      // 1. Validate Gender
      if (!profileForm.gender) {
        setError('Please select your gender first 👫');
        addToast('Please select your gender', 'error');
        return;
      }

      // 2. Validate My Age
      const myAge = parseInt(profileForm.age);
      if (!myAge || myAge < 1) {
        setError('Please enter your age 🎂');
        addToast('Please enter your age', 'error');
        return;
      }
      if (myAge < 18) {
        setError('You must be 18+ to join 🔞');
        addToast('Minimum age is 18', 'error');
        return;
      }

      // 3. Validate Preferences
      const minAge = profileForm.preferences.min_age;
      const maxAge = profileForm.preferences.max_age;
      if (!minAge || !maxAge) {
        setError('Please set your age range preference 🎯');
        addToast('Set age range preference', 'error');
        return;
      }
      if (minAge > maxAge) {
        setError('Min age cannot be greater than Max age 📏');
        addToast('Invalid age range', 'error');
        return;
      }

      setSearching(true);
      const res = await api.post('/match/start');
      if (res.data?.room_id) {
        setMatch(res.data.room_id);
        router.push('/chat');
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
    } catch {
      setSearching(false);
    }
  };

  if (!user) {
    return (
      <div className="flex-1 flex items-center justify-center" style={{ background: 'var(--background)' }}>
        <div className="flex items-center gap-2">
          {[0, 1, 2].map((i) => (
            <span key={i} className="w-3 h-3 rounded-full"            style={{
              background: '#7C6EF0',
              animation: 'bounceDot 1.2s ease-in-out infinite',
              animationDelay: `${i * 0.18}s`,
            }} />
          ))}
        </div>
      </div>
    );
  }

  const myInterestList = profileForm.interests
    ? profileForm.interests.split(',').map((i) => i.trim()).filter(Boolean)
    : [];

  return (
    <div className="flex-1 flex flex-col" style={{ background: 'var(--background)', minHeight: '100dvh' }}>
      {/* ── Header ── */}
      <header
        className="sticky top-0 z-20 flex items-center justify-between px-5 py-3"
        style={{
          background: 'rgba(255,255,255,0.82)',
          backdropFilter: 'blur(16px)',
          borderBottom: '1.5px solid #EDE8E1',
          boxShadow: '0 2px 12px rgba(0,0,0,0.04)',
        }}
      >
        <div className="flex items-center gap-3">
          {/* Avatar */}
          <div
            className="w-10 h-10 rounded-full flex items-center justify-center shrink-0 font-black text-base"
            style={{ background: 'linear-gradient(135deg,#A89BFF,#7C6EF0)', color: '#fff', boxShadow: '0 2px 8px rgba(124,110,240,0.3)' }}
          >
            {user.name?.charAt(0)?.toUpperCase() || <UserIcon className="w-5 h-5" />}
          </div>
          <div>
            <p className="text-sm font-black leading-tight" style={{ color: '#1E1C2E' }}>{user.name}</p>
            <p className="text-xs font-semibold" style={{ color: '#7C6EF0' }}>Ready to explore ✦</p>
          </div>
        </div>

        <Button variant="ghost" onClick={logout} className="!px-3 !py-2 rounded-full text-xs gap-1.5">
          <LogOut className="w-4 h-4" />
          <span className="hidden sm:inline">Log out</span>
        </Button>
      </header>

      {/* ── Main ── */}
      <main className="flex-1 overflow-y-auto">
        <div className="max-w-5xl mx-auto px-4 py-6 flex flex-col gap-5">

          {/* ── Find Match Hero Card ── */}
          <Card className="items-center text-center gap-6">
            {/* Lottie in subtle animated ring */}
            <div className="relative">
              {isSearching && (
                <div
                  className="absolute inset-[-12px] rounded-full animate-search-pulse"
                  style={{ background: 'rgba(124,110,240,0.15)' }}
                />
              )}
              <div className="w-28 h-28 relative z-10">
                <Lottie animationData={funnyDogAnimation} loop autoplay />
              </div>
            </div>

            <div className="space-y-2">
              <h2 className="text-2xl font-black" style={{ color: '#1E1C2E', letterSpacing: '-0.3px' }}>
                {isSearching ? 'Finding your match…' : 'Meet Someone New! 👋'}
              </h2>
              <p className="text-sm font-semibold leading-relaxed" style={{ color: '#8A8A8A' }}>
                {isSearching
                  ? 'Hang tight, we\'re searching the world for you 🌍'
                  : 'Press the button below and start a friendly conversation!'}
              </p>
            </div>

            {error && (
              <p className="text-xs font-bold px-4 py-2 rounded-full animate-shake"
                style={{ background: '#FDE8E8', color: '#D96060' }}>
                {error}
              </p>
            )}

            {isSearching ? (
              <Button
                variant="danger"
                className="w-full max-w-xs h-13 text-base"
                onClick={handleStopMatch}
              >
                Stop Searching
              </Button>
            ) : (
              <Button
                variant="primary"
                className="w-full max-w-xs h-13 text-base"
                onClick={handleStartMatch}
              >
                <Sparkles className="w-4 h-4" /> Find a Match
              </Button>
            )}
          </Card>

          {/* ── Profile & Preferences Grid ── */}
          <div className="grid grid-cols-1 lg:grid-cols-2 gap-5">

            {/* ── Profile ── */}
            <Card>
              <SectionHeading icon={<UserIcon className="w-4 h-4 text-sage-600" />}>
                Your Profile
              </SectionHeading>

              {/* Gender */}
              <div className="space-y-2">
                <label className="text-xs font-black uppercase tracking-widest" style={{ color: '#A8A6C0' }}>Gender</label>
                <div className="flex gap-2">
                  {['male', 'female', 'other'].map((g) => (
                    <GenderBtn
                      key={g}
                      label={g}
                      active={profileForm.gender === g}
                      onClick={() => setProfileForm({ ...profileForm, gender: g })}
                    />
                  ))}
                </div>
              </div>

              {/* Age */}
              <Input
                type="number"
                inputMode="numeric"
                label="Your Age"
                placeholder="e.g. 22"
                value={profileForm.age}
                onChange={(e) => setProfileForm({ ...profileForm, age: e.target.value })}
              />

              {/* Language */}
              <Select
                label="Your Language"
                options={prefLanguages}
                value={profileForm.language}
                onChange={(val) => setProfileForm({ ...profileForm, language: val })}
              />

              {/* Interests */}
              <div className="space-y-2">
                <div className="flex items-center justify-between">
                  <label className="text-xs font-black uppercase tracking-widest" style={{ color: '#A8A6C0' }}>Interests</label>
                  <span className="text-xs font-bold px-2 py-0.5 rounded-full" style={{ background: '#E4E1FF', color: '#6451D8' }}>
                    {myInterestList.length} selected
                  </span>
                </div>
                <div className="flex flex-wrap gap-2">
                  {(showAllMyInterests ? interestOptions : interestOptions.slice(0, 6)).map((opt) => (
                    <Chip
                      key={opt.label}
                      active={myInterestList.includes(opt.label)}
                      onClick={() => handleInterestToggle(opt.label)}
                    >
                      {opt.icon} {opt.label}
                    </Chip>
                  ))}
                  <button
                    type="button"
                    onClick={() => setShowAllMyInterests(!showAllMyInterests)}
                    className="px-3.5 py-1.5 rounded-full text-xs font-bold border-2 border-dashed transition-all cursor-pointer"
                    style={{ borderColor: '#A89BFF', color: '#6451D8' }}
                  >
                    {showAllMyInterests
                      ? <><ChevronUp className="w-3 h-3 inline mr-0.5" />Less</>
                      : <><ChevronDown className="w-3 h-3 inline mr-0.5" />+{interestOptions.length - 6} more</>}
                  </button>
                </div>
              </div>
            </Card>

            {/* ── Preferences ── */}
            <Card>
              <SectionHeading icon={<Heart className="w-4 h-4 text-sage-600" />}>
                Who You Want to Meet
              </SectionHeading>

              {/* Preferred Language */}
              <Select
                label="Preferred Language"
                options={prefLanguages}
                value={profileForm.preferences.language}
                onChange={(val) => setProfileForm({ ...profileForm, preferences: { ...profileForm.preferences, language: val } })}
              />

              {/* Preferred Gender */}
              <div className="space-y-2">
                <label className="text-xs font-black uppercase tracking-widest" style={{ color: '#A8A6C0' }}>Preferred Gender</label>
                <div className="grid grid-cols-2 gap-2">
                  {['any', 'male', 'female', 'other'].map((g) => (
                    <GenderBtn
                      key={g}
                      label={g}
                      active={profileForm.preferences.gender === g}
                      onClick={() => setProfileForm({ ...profileForm, preferences: { ...profileForm.preferences, gender: g } })}
                    />
                  ))}
                </div>
              </div>

              {/* Age Range */}
              <div className="space-y-2">
                <label className="text-xs font-black uppercase tracking-widest" style={{ color: '#A8A6C0' }}>Age Range</label>
                <div className="grid grid-cols-2 gap-3">
                  <Input
                    type="number"
                    inputMode="numeric"
                    label="Min Age"
                    placeholder="18"
                    value={profileForm.preferences.min_age.toString()}
                    onChange={(e) => setProfileForm({ ...profileForm, preferences: { ...profileForm.preferences, min_age: parseInt(e.target.value) || 0 } })}
                  />
                  <Input
                    type="number"
                    inputMode="numeric"
                    label="Max Age"
                    placeholder="99"
                    value={profileForm.preferences.max_age.toString()}
                    onChange={(e) => setProfileForm({ ...profileForm, preferences: { ...profileForm.preferences, max_age: parseInt(e.target.value) || 0 } })}
                  />
                </div>
              </div>

              {/* Preferred Interests */}
              <div className="space-y-2">
                <div className="flex items-center justify-between">
                  <label className="text-xs font-black uppercase tracking-widest" style={{ color: '#A8A6C0' }}>Shared Interests</label>
                  <Sparkles className="w-3.5 h-3.5" style={{ color: '#F4A261' }} />
                </div>
                <div className="flex flex-wrap gap-2">
                  {(showAllPrefInterests ? interestOptions : interestOptions.slice(0, 6)).map((opt) => (
                    <Chip
                      key={opt.label}
                      active={profileForm.preferences.interests?.includes(opt.label)}
                      onClick={() => handlePrefInterestToggle(opt.label)}
                    >
                      {opt.icon} {opt.label}
                    </Chip>
                  ))}
                  <button
                    type="button"
                    onClick={() => setShowAllPrefInterests(!showAllPrefInterests)}
                    className="px-3.5 py-1.5 rounded-full text-xs font-bold border-2 border-dashed transition-all cursor-pointer"
                    style={{ borderColor: '#8DD1B9', color: '#5A9E87' }}
                  >
                    {showAllPrefInterests
                      ? <><ChevronUp className="w-3 h-3 inline mr-0.5" />Less</>
                      : <><ChevronDown className="w-3 h-3 inline mr-0.5" />+{interestOptions.length - 6} more</>}
                  </button>
                </div>
              </div>

              <p className="text-xs font-semibold italic text-center mt-auto" style={{ color: '#A8A6C0' }}>
                ✨ We'll do our best to find a great match!
              </p>
            </Card>
          </div>

          <div className="flex flex-col items-center gap-2 pb-10">
            <Button
              variant="secondary"
              className="w-full max-w-xs h-13 text-base font-black"
              onClick={handleUpdateProfile}
              isLoading={isSaving}
              disabled={isSearching}
            >
              Save Changes 💾
            </Button>
          </div>

        </div>
      </main>
    </div>
  );
}
