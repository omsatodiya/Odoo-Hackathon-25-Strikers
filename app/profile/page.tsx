"use client";
import { useState, useEffect, useRef } from "react";
import { auth } from "@/lib/firebase";
import {
  getFirestore,
  doc,
  getDoc,
  updateDoc,
  deleteDoc,
} from "firebase/firestore";
import { deleteUser, signOut } from "firebase/auth";
import { useRouter } from "next/navigation";
import { Input } from "@/components/ui/input";
import { Button } from "@/components/ui/button";
import { Label } from "@/components/ui/label";
import { Avatar, AvatarFallback, AvatarImage } from "@/components/ui/avatar";
import { Progress } from "@/components/ui/progress";
import { Badge } from "@/components/ui/badge";
import { Switch } from "@/components/ui/switch";
import { Checkbox } from "@/components/ui/checkbox";
import {
  ArrowLeft,
  Loader2,
  Camera,
  Plus,
  X,
  Clock,
  Calendar,
} from "lucide-react";
import { useTheme } from "next-themes";
import { getCityFromPincode } from "@/lib/utils/pincode";
import { uploadToCloudinary } from "@/lib/cloudinary";
import { CloudinaryUploadResponse } from "@/types";
import gsap from "gsap";

interface UserData {
  firstName: string;
  lastName: string;
  email: string;
  mobile: string;
  city: string;
  state: string;
  pincode: string;
  avatarUrl?: string;
  skillsOffered: string[];
  skillsWanted: string[];
  isProfilePublic: boolean;
  availability: {
    days: string[];
    timeSlots: {
      start: string;
      end: string;
    }[];
  };
}

const DAYS_OF_WEEK = [
  { id: "monday", label: "Monday" },
  { id: "tuesday", label: "Tuesday" },
  { id: "wednesday", label: "Wednesday" },
  { id: "thursday", label: "Thursday" },
  { id: "friday", label: "Friday" },
  { id: "saturday", label: "Saturday" },
  { id: "sunday", label: "Sunday" },
];

export default function ProfilePage() {
  const { theme, setTheme } = useTheme();
  const router = useRouter();
  const [mounted, setMounted] = useState(false);
  const [loading, setLoading] = useState(true);
  const [uploadingAvatar, setUploadingAvatar] = useState(false);
  const [userData, setUserData] = useState<UserData>({
    firstName: "",
    lastName: "",
    email: "",
    mobile: "",
    city: "",
    state: "",
    pincode: "",
    avatarUrl: "",
    skillsOffered: [],
    skillsWanted: [],
    isProfilePublic: true,
    availability: {
      days: [],
      timeSlots: [{ start: "09:00", end: "17:00" }],
    },
  });
  const [isEditing, setIsEditing] = useState(false);
  const [showDeleteDialog, setShowDeleteDialog] = useState(false);
  const [newSkillOffered, setNewSkillOffered] = useState("");
  const [newSkillWanted, setNewSkillWanted] = useState("");

  const loadingRef = useRef<HTMLDivElement>(null);
  const headerRef = useRef<HTMLDivElement>(null);
  const infoCardRef = useRef<HTMLDivElement>(null);
  const deleteDialogRef = useRef<HTMLDivElement>(null);
  const fileInputRef = useRef<HTMLInputElement>(null);

  // Calculate profile completion percentage
  const calculateProfileCompletion = () => {
    const fields = [
      userData.firstName,
      userData.lastName,
      userData.email,
      userData.mobile,
      userData.city,
      userData.state,
      userData.pincode,
      userData.avatarUrl,
      userData.skillsOffered.length > 0,
      userData.skillsWanted.length > 0,
      userData.availability.days.length > 0,
    ];

    const completedFields = fields.filter(Boolean).length;
    return Math.round((completedFields / fields.length) * 100);
  };

  const profileCompletion = calculateProfileCompletion();

  // Security check: redirect if not logged in
  useEffect(() => {
    const unsubscribe = auth.onAuthStateChanged((user) => {
      if (!user) {
        router.replace("/auth/login");
      }
    });
    return () => unsubscribe();
  }, [router]);

  useEffect(() => {
    setMounted(true);
    const savedTheme = localStorage.getItem("theme") || "dark";
    setTheme(savedTheme);
  }, [setTheme]);

  useEffect(() => {
    const fetchUserData = async () => {
      const user = auth.currentUser;
      if (!user) {
        router.push("/auth/login");
        return;
      }
      try {
        const db = getFirestore();
        const userDoc = await getDoc(doc(db, "users", user.uid));
        if (userDoc.exists()) {
          const data = userDoc.data();
          setUserData({
            firstName: data.firstName || "",
            lastName: data.lastName || "",
            email: data.email || "",
            mobile: data.mobile || "",
            city: data.city || "",
            state: data.state || "",
            pincode: data.pincode || "",
            avatarUrl: data.avatarUrl || "",
            skillsOffered: data.skillsOffered || [],
            skillsWanted: data.skillsWanted || [],
            isProfilePublic: data.isProfilePublic !== false, // Default to true
            availability: data.availability || {
              days: [],
              timeSlots: [{ start: "09:00", end: "17:00" }],
            },
          });
        }
      } catch {
        // setError("Failed to fetch user data"); // Original code had this line commented out
      } finally {
        setLoading(false);
      }
    };
    const unsubscribe = auth.onAuthStateChanged((currentUser) => {
      if (!currentUser) {
        router.push("/auth/login");
      } else {
        fetchUserData();
      }
    });
    return () => unsubscribe();
  }, [router]);

  useEffect(() => {
    if (loading || !mounted) {
      if (loadingRef.current) {
        gsap.fromTo(
          loadingRef.current,
          { opacity: 0, scale: 0.9 },
          { opacity: 1, scale: 1, duration: 0.5, ease: "power3.out" }
        );
      }
    } else {
      if (headerRef.current) {
        gsap.fromTo(
          headerRef.current,
          { y: -20, opacity: 0 },
          { y: 0, opacity: 1, duration: 0.5, ease: "power3.out" }
        );
      }
      if (infoCardRef.current) {
        gsap.fromTo(
          infoCardRef.current,
          { y: 30, opacity: 0 },
          { y: 0, opacity: 1, duration: 0.6, ease: "power3.out" }
        );
      }
    }
  }, [loading, mounted]);

  const handleInputChange = async (
    name: keyof UserData,
    value:
      | string
      | boolean
      | string[]
      | { days: string[]; timeSlots: { start: string; end: string }[] }
  ) => {
    setUserData((prev) => ({ ...prev, [name]: value }));
    if (name === "pincode" && typeof value === "string" && value.length === 6) {
      const data = await getCityFromPincode(value);
      if (data) {
        setUserData((prev) => ({
          ...prev,
          city: data.city,
          state: data.state,
        }));
      }
    }
  };

  const handleAvatarUpload = async (file: File) => {
    setUploadingAvatar(true);
    try {
      const result: CloudinaryUploadResponse = await uploadToCloudinary(file, {
        folder: "avatars",
        tags: ["profile", "avatar"],
      });

      // Update user data with new avatar URL
      setUserData((prev) => ({ ...prev, avatarUrl: result.secure_url }));

      // Save to Firestore
      const user = auth.currentUser;
      if (user) {
        const db = getFirestore();
        await updateDoc(doc(db, "users", user.uid), {
          avatarUrl: result.secure_url,
          updatedAt: new Date().toISOString(),
        });
      }
    } catch (error) {
      console.error("Error uploading avatar:", error);
      alert("Failed to upload avatar. Please try again.");
    } finally {
      setUploadingAvatar(false);
    }
  };

  const handleFileSelect = (event: React.ChangeEvent<HTMLInputElement>) => {
    const file = event.target.files?.[0];
    if (file) {
      // Validate file type
      if (!file.type.startsWith("image/")) {
        alert("Please select an image file");
        return;
      }
      // Validate file size (max 5MB)
      if (file.size > 5 * 1024 * 1024) {
        alert("Image size must be less than 5MB");
        return;
      }
      handleAvatarUpload(file);
    }
  };

  const triggerFileInput = () => {
    fileInputRef.current?.click();
  };

  const getUserInitials = () => {
    const firstName = userData.firstName || "";
    const lastName = userData.lastName || "";
    const email = userData.email || "";

    if (firstName && lastName) {
      return `${firstName[0]}${lastName[0]}`.toUpperCase();
    }
    if (firstName) {
      return firstName[0].toUpperCase();
    }
    if (email) {
      return email[0].toUpperCase();
    }
    return "U";
  };

  const addSkillOffered = () => {
    if (
      newSkillOffered.trim() &&
      !userData.skillsOffered.includes(newSkillOffered.trim())
    ) {
      setUserData((prev) => ({
        ...prev,
        skillsOffered: [...prev.skillsOffered, newSkillOffered.trim()],
      }));
      setNewSkillOffered("");
    }
  };

  const removeSkillOffered = (skill: string) => {
    setUserData((prev) => ({
      ...prev,
      skillsOffered: prev.skillsOffered.filter((s) => s !== skill),
    }));
  };

  const addSkillWanted = () => {
    if (
      newSkillWanted.trim() &&
      !userData.skillsWanted.includes(newSkillWanted.trim())
    ) {
      setUserData((prev) => ({
        ...prev,
        skillsWanted: [...prev.skillsWanted, newSkillWanted.trim()],
      }));
      setNewSkillWanted("");
    }
  };

  const removeSkillWanted = (skill: string) => {
    setUserData((prev) => ({
      ...prev,
      skillsWanted: prev.skillsWanted.filter((s) => s !== skill),
    }));
  };

  const handleDayToggle = (dayId: string) => {
    setUserData((prev) => ({
      ...prev,
      availability: {
        ...prev.availability,
        days: prev.availability.days.includes(dayId)
          ? prev.availability.days.filter((d) => d !== dayId)
          : [...prev.availability.days, dayId],
      },
    }));
  };

  const addTimeSlot = () => {
    setUserData((prev) => ({
      ...prev,
      availability: {
        ...prev.availability,
        timeSlots: [
          ...prev.availability.timeSlots,
          { start: "09:00", end: "17:00" },
        ],
      },
    }));
  };

  const removeTimeSlot = (index: number) => {
    setUserData((prev) => ({
      ...prev,
      availability: {
        ...prev.availability,
        timeSlots: prev.availability.timeSlots.filter((_, i) => i !== index),
      },
    }));
  };

  const updateTimeSlot = (
    index: number,
    field: "start" | "end",
    value: string
  ) => {
    setUserData((prev) => ({
      ...prev,
      availability: {
        ...prev.availability,
        timeSlots: prev.availability.timeSlots.map((slot, i) =>
          i === index ? { ...slot, [field]: value } : slot
        ),
      },
    }));
  };

  const handleUpdate = async () => {
    setLoading(true);
    try {
      const user = auth.currentUser;
      if (!user) throw new Error("No authenticated user");
      const db = getFirestore();
      await updateDoc(doc(db, "users", user.uid), {
        ...userData,
        updatedAt: new Date().toISOString(),
      });
      setIsEditing(false);
    } catch {
      // setError("Failed to update profile"); // Original code had this line commented out
    } finally {
      setLoading(false);
    }
  };

  const handleDeleteAccount = async () => {
    setLoading(true);
    try {
      const user = auth.currentUser;
      if (!user) throw new Error("No authenticated user");
      const db = getFirestore();
      await deleteDoc(doc(db, "users", user.uid));
      await deleteUser(user);
      router.push("/");
    } catch {
      // setError("Failed to delete account"); // Original code had this line commented out
    } finally {
      setLoading(false);
      setShowDeleteDialog(false);
    }
  };

  if (loading || !mounted) {
    return (
      <main className="min-h-screen flex items-center justify-center">
        <div ref={loadingRef} className="relative z-10 w-full max-w-7xl">
          <div
            className={`
            rounded-xl bg-background/95 backdrop-blur-xl p-8
            ${
              theme === "dark"
                ? "border border-white/10"
                : "border border-black/10"
            }
            shadow-2xl flex flex-col items-center justify-center gap-4
          `}
          >
            <div className="relative">
              <Loader2 className="h-8 w-8 animate-spin text-primary" />
              <div className="absolute inset-0 h-8 w-8 animate-ping opacity-20 rounded-full bg-primary" />
            </div>
            <p className="text-base text-muted-foreground animate-pulse">
              Loading your profile...
            </p>
          </div>
        </div>
      </main>
    );
  }

  return (
    <main className="min-h-screen flex items-start justify-center px-0 sm:px-4 pt-16 sm:pt-24 pb-8">
      <div className="relative z-10 w-full max-w-4xl space-y-4 sm:space-y-6">
        {/* Header Card */}
        <div
          ref={headerRef}
          className={`
            rounded-none sm:rounded-xl bg-background/95 backdrop-blur-xl px-4 py-4 sm:p-6
            ${
              theme === "dark"
                ? "border-b sm:border border-white/10"
                : "border-b sm:border border-black/10"
            }
            shadow-lg sm:shadow-2xl
          `}
        >
          <div className="flex items-center justify-between">
            <div className="flex items-center gap-3 sm:gap-4">
              <Button
                variant="ghost"
                size="icon"
                className="h-8 w-8"
                onClick={() => router.push("/")}
              >
                <ArrowLeft className="h-4 w-4" />
                <span className="sr-only">Back to home</span>
              </Button>
              <div>
                <h1 className="text-xl sm:text-2xl font-bold">My Profile</h1>
                <p className="text-xs sm:text-sm text-muted-foreground">
                  Manage your account and preferences
                </p>
              </div>
            </div>
            <Button
              variant="outline"
              size="sm"
              className="h-8 sm:h-9 text-xs sm:text-sm px-2 sm:px-4"
              onClick={async () => {
                try {
                  await signOut(auth);
                  router.push("/");
                } catch {
                  // setError("Failed to sign out"); // Original code had this line commented out
                }
              }}
            >
              Sign Out
            </Button>
          </div>
        </div>

        {/* Profile Completion Card */}
        <div className="rounded-xl bg-background/95 backdrop-blur-xl border border-border shadow-lg">
          <div className="p-4 sm:p-6">
            <div className="flex items-center justify-between mb-4">
              <h2 className="text-lg font-semibold">Profile Completion</h2>
              <Badge
                variant={profileCompletion === 100 ? "default" : "secondary"}
              >
                {profileCompletion}% Complete
              </Badge>
            </div>
            <Progress value={profileCompletion} className="h-2" />
            <p className="text-sm text-muted-foreground mt-2">
              {profileCompletion === 100
                ? "🎉 Your profile is complete!"
                : `Complete ${
                    100 - profileCompletion
                  } more fields to reach 100%`}
            </p>
          </div>
        </div>

        {/* Avatar Section */}
        <div className="flex justify-center">
          <div className="relative group">
            <Avatar className="h-24 w-24 sm:h-32 sm:w-32 border-4 border-background shadow-lg">
              <AvatarImage
                src={userData.avatarUrl}
                alt={`${userData.firstName} ${userData.lastName}`}
              />
              <AvatarFallback className="text-2xl sm:text-3xl font-semibold bg-primary text-primary-foreground">
                {getUserInitials()}
              </AvatarFallback>
            </Avatar>

            {/* Upload Overlay */}
            <div className="absolute inset-0 flex items-center justify-center">
              <Button
                variant="secondary"
                size="icon"
                className="h-10 w-10 rounded-full opacity-0 group-hover:opacity-100 transition-opacity shadow-lg"
                onClick={triggerFileInput}
                disabled={uploadingAvatar}
              >
                {uploadingAvatar ? (
                  <Loader2 className="h-4 w-4 animate-spin" />
                ) : (
                  <Camera className="h-4 w-4" />
                )}
              </Button>
            </div>
          </div>
        </div>

        {/* Hidden file input */}
        <input
        title="files"
          ref={fileInputRef}
          type="file"
          accept="image/*"
          onChange={handleFileSelect}
          className="hidden"
        />

        {/* Personal Information Card */}
        <div
          ref={infoCardRef}
          className={`
            rounded-xl bg-background/95 backdrop-blur-xl
            ${
              theme === "dark"
                ? "border border-white/10"
                : "border border-black/10"
            }
            shadow-lg sm:shadow-2xl
          `}
        >
          <div className="p-4 sm:p-6 border-b flex items-center justify-between">
            <h2 className="text-base sm:text-lg font-semibold">
              Personal Information
            </h2>
            <Button
              variant={isEditing ? "default" : "outline"}
              size="sm"
              className="h-8 sm:h-9 text-xs sm:text-sm"
              onClick={() => (isEditing ? handleUpdate() : setIsEditing(true))}
              disabled={loading}
            >
              {loading ? (
                <div className="flex items-center gap-2">
                  <div className="w-4 h-4 border-2 border-current border-t-transparent rounded-full animate-spin" />
                  <span>Saving...</span>
                </div>
              ) : isEditing ? (
                "Save Changes"
              ) : (
                "Edit Profile"
              )}
            </Button>
          </div>
          <div className="p-4 sm:p-6">
            <div className="grid grid-cols-1 md:grid-cols-2 gap-4 sm:gap-6">
              <div className="space-y-4">
                <div className="space-y-1.5 sm:space-y-2">
                  <Label className="text-xs sm:text-sm text-muted-foreground">
                    Full Name
                  </Label>
                  {isEditing ? (
                    <div className="grid grid-cols-2 gap-2 sm:gap-3">
                      <Input
                        value={userData.firstName}
                        onChange={(e) =>
                          handleInputChange("firstName", e.target.value)
                        }
                        placeholder="First Name"
                        className="h-9 sm:h-10 text-sm"
                      />
                      <Input
                        value={userData.lastName}
                        onChange={(e) =>
                          handleInputChange("lastName", e.target.value)
                        }
                        placeholder="Last Name"
                        className="h-9 sm:h-10 text-sm"
                      />
                    </div>
                  ) : (
                    <p className="text-base sm:text-lg font-medium">
                      {userData.firstName} {userData.lastName}
                    </p>
                  )}
                </div>
                <div className="space-y-1.5 sm:space-y-2">
                  <Label className="text-xs sm:text-sm text-muted-foreground">
                    Email Address
                  </Label>
                  <p className="text-base sm:text-lg font-medium break-all">
                    {userData.email}
                  </p>
                </div>
                <div className="space-y-1.5 sm:space-y-2">
                  <Label className="text-xs sm:text-sm text-muted-foreground">
                    Mobile Number
                  </Label>
                  {isEditing ? (
                    <Input
                      value={userData.mobile}
                      onChange={(e) =>
                        handleInputChange("mobile", e.target.value)
                      }
                      placeholder="Mobile Number"
                      className="h-9 sm:h-10 text-sm"
                    />
                  ) : (
                    <p className="text-base sm:text-lg font-medium">
                      {userData.mobile}
                    </p>
                  )}
                </div>
              </div>
              <div className="space-y-4">
                <div className="space-y-1.5 sm:space-y-2">
                  <Label className="text-xs sm:text-sm text-muted-foreground">
                    Pincode
                  </Label>
                  {isEditing ? (
                    <Input
                      value={userData.pincode}
                      onChange={(e) =>
                        handleInputChange("pincode", e.target.value)
                      }
                      placeholder="Pincode"
                      className="h-9 sm:h-10 text-sm"
                    />
                  ) : (
                    <p className="text-base sm:text-lg font-medium">
                      {userData.pincode}
                    </p>
                  )}
                </div>
                <div className="space-y-1.5 sm:space-y-2">
                  <Label className="text-xs sm:text-sm text-muted-foreground">
                    City
                  </Label>
                  <p className="text-base sm:text-lg font-medium">
                    {userData.city}
                  </p>
                </div>
                <div className="space-y-1.5 sm:space-y-2">
                  <Label className="text-xs sm:text-sm text-muted-foreground">
                    State
                  </Label>
                  <p className="text-base sm:text-lg font-medium">
                    {userData.state}
                  </p>
                </div>
              </div>
            </div>
          </div>
        </div>

        {/* Skills Section */}
        <div className="grid grid-cols-1 lg:grid-cols-2 gap-6">
          {/* Skills Offered */}
          <div className="rounded-xl bg-background/95 backdrop-blur-xl border border-border shadow-lg">
            <div className="p-4 sm:p-6 border-b">
              <h3 className="text-lg font-semibold">Skills You Offer</h3>
              <p className="text-sm text-muted-foreground">
                What skills can you teach others?
              </p>
            </div>
            <div className="p-4 sm:p-6">
              {isEditing ? (
                <div className="space-y-4">
                  <div className="flex gap-2">
                    <Input
                      value={newSkillOffered}
                      onChange={(e) => setNewSkillOffered(e.target.value)}
                      placeholder="Add a skill (e.g., JavaScript, Cooking)"
                      className="flex-1"
                      onKeyPress={(e) => e.key === "Enter" && addSkillOffered()}
                    />
                    <Button onClick={addSkillOffered} size="sm">
                      <Plus className="h-4 w-4" />
                    </Button>
                  </div>
                  <div className="flex flex-wrap gap-2">
                    {userData.skillsOffered.map((skill, index) => (
                      <Badge key={index} variant="secondary" className="gap-1">
                        {skill}
                        <button
                        title="skill-remove"
                          onClick={() => removeSkillOffered(skill)}
                          className="ml-1 hover:text-destructive"
                        >
                          <X className="h-3 w-3" />
                        </button>
                      </Badge>
                    ))}
                  </div>
                </div>
              ) : (
                <div className="flex flex-wrap gap-2">
                  {userData.skillsOffered.length > 0 ? (
                    userData.skillsOffered.map((skill, index) => (
                      <Badge key={index} variant="secondary">
                        {skill}
                      </Badge>
                    ))
                  ) : (
                    <p className="text-muted-foreground">No skills added yet</p>
                  )}
                </div>
              )}
            </div>
          </div>

          {/* Skills Wanted */}
          <div className="rounded-xl bg-background/95 backdrop-blur-xl border border-border shadow-lg">
            <div className="p-4 sm:p-6 border-b">
              <h3 className="text-lg font-semibold">
                Skills You Want to Learn
              </h3>
              <p className="text-sm text-muted-foreground">
                What skills do you want to acquire?
              </p>
            </div>
            <div className="p-4 sm:p-6">
              {isEditing ? (
                <div className="space-y-4">
                  <div className="flex gap-2">
                    <Input
                      value={newSkillWanted}
                      onChange={(e) => setNewSkillWanted(e.target.value)}
                      placeholder="Add a skill (e.g., Python, Guitar)"
                      className="flex-1"
                      onKeyPress={(e) => e.key === "Enter" && addSkillWanted()}
                    />
                    <Button onClick={addSkillWanted} size="sm">
                      <Plus className="h-4 w-4" />
                    </Button>
                  </div>
                  <div className="flex flex-wrap gap-2">
                    {userData.skillsWanted.map((skill, index) => (
                      <Badge key={index} variant="outline" className="gap-1">
                        {skill}
                        <button
                        title="skill-wanted"
                          onClick={() => removeSkillWanted(skill)}
                          className="ml-1 hover:text-destructive"
                        >
                          <X className="h-3 w-3" />
                        </button>
                      </Badge>
                    ))}
                  </div>
                </div>
              ) : (
                <div className="flex flex-wrap gap-2">
                  {userData.skillsWanted.length > 0 ? (
                    userData.skillsWanted.map((skill, index) => (
                      <Badge key={index} variant="outline">
                        {skill}
                      </Badge>
                    ))
                  ) : (
                    <p className="text-muted-foreground">No skills added yet</p>
                  )}
                </div>
              )}
            </div>
          </div>
        </div>

        {/* Profile Visibility */}
        <div className="rounded-xl bg-background/95 backdrop-blur-xl border border-border shadow-lg">
          <div className="p-4 sm:p-6 border-b">
            <h3 className="text-lg font-semibold">Profile Visibility</h3>
            <p className="text-sm text-muted-foreground">
              Control who can see your profile
            </p>
          </div>
          <div className="p-4 sm:p-6">
            <div className="flex items-center justify-between">
              <div>
                <Label className="text-base font-medium">Public Profile</Label>
                <p className="text-sm text-muted-foreground">
                  {userData.isProfilePublic
                    ? "Your profile is visible to other users"
                    : "Your profile is private and hidden from other users"}
                </p>
              </div>
              {isEditing ? (
                <Switch
                  checked={userData.isProfilePublic}
                  onCheckedChange={(checked: boolean) =>
                    handleInputChange("isProfilePublic", checked)
                  }
                />
              ) : (
                <Badge
                  variant={userData.isProfilePublic ? "default" : "secondary"}
                >
                  {userData.isProfilePublic ? "Public" : "Private"}
                </Badge>
              )}
            </div>
          </div>
        </div>

        {/* Availability Section */}
        <div className="rounded-xl bg-background/95 backdrop-blur-xl border border-border shadow-lg">
          <div className="p-4 sm:p-6 border-b">
            <h3 className="text-lg font-semibold flex items-center gap-2">
              <Calendar className="h-5 w-5" />
              Availability
            </h3>
            <p className="text-sm text-muted-foreground">
              When are you available for skill exchanges?
            </p>
          </div>
          <div className="p-4 sm:p-6 space-y-6">
            {/* Days Selection */}
            <div>
              <Label className="text-base font-medium mb-3 block">
                Available Days
              </Label>
              <div className="grid grid-cols-2 sm:grid-cols-4 gap-3">
                {DAYS_OF_WEEK.map((day) => (
                  <div key={day.id} className="flex items-center space-x-2">
                    {isEditing ? (
                      <Checkbox
                        id={day.id}
                        checked={userData.availability.days.includes(day.id)}
                        onCheckedChange={() => handleDayToggle(day.id)}
                      />
                    ) : (
                      <div
                        className={`w-4 h-4 rounded border-2 ${
                          userData.availability.days.includes(day.id)
                            ? "bg-primary border-primary"
                            : "border-muted-foreground"
                        }`}
                      />
                    )}
                    <Label htmlFor={day.id} className="text-sm font-normal">
                      {day.label}
                    </Label>
                  </div>
                ))}
              </div>
            </div>

            {/* Time Slots */}
            <div>
              <div className="flex items-center justify-between mb-3">
                <Label className="text-base font-medium flex items-center gap-2">
                  <Clock className="h-4 w-4" />
                  Available Times
                </Label>
                {isEditing && (
                  <Button onClick={addTimeSlot} size="sm" variant="outline">
                    <Plus className="h-4 w-4 mr-1" />
                    Add Time
                  </Button>
                )}
              </div>
              <div className="space-y-3">
                {userData.availability.timeSlots.map((slot, index) => (
                  <div key={index} className="flex items-center gap-3">
                    {isEditing ? (
                      <>
                        <Input
                          type="time"
                          value={slot.start}
                          onChange={(e) =>
                            updateTimeSlot(index, "start", e.target.value)
                          }
                          className="w-32"
                        />
                        <span className="text-muted-foreground">to</span>
                        <Input
                          type="time"
                          value={slot.end}
                          onChange={(e) =>
                            updateTimeSlot(index, "end", e.target.value)
                          }
                          className="w-32"
                        />
                        {userData.availability.timeSlots.length > 1 && (
                          <Button
                            variant="ghost"
                            size="sm"
                            onClick={() => removeTimeSlot(index)}
                            className="text-destructive hover:text-destructive"
                          >
                            <X className="h-4 w-4" />
                          </Button>
                        )}
                      </>
                    ) : (
                      <Badge variant="outline" className="text-sm">
                        {slot.start} - {slot.end}
                      </Badge>
                    )}
                  </div>
                ))}
              </div>
            </div>
          </div>
        </div>

        {/* Action Buttons */}
        {isEditing && (
          <div className="flex justify-end gap-3">
            <Button variant="outline" onClick={() => setIsEditing(false)}>
              Cancel
            </Button>
            <Button onClick={handleUpdate} disabled={loading}>
              {loading ? (
                <div className="flex items-center gap-2">
                  <Loader2 className="h-4 w-4 animate-spin" />
                  Saving...
                </div>
              ) : (
                "Save Changes"
              )}
            </Button>
          </div>
        )}

        {/* Delete Account Dialog */}
        <div className="flex justify-end">
          <Button
            variant="destructive"
            className="h-9 sm:h-10 text-sm mt-4"
            onClick={() => setShowDeleteDialog(true)}
          >
            Delete Account
          </Button>
        </div>
        {showDeleteDialog && (
          <div
            ref={deleteDialogRef}
            className="fixed inset-0 z-50 flex items-center justify-center bg-black/40"
          >
            <div className="bg-background rounded-lg p-6 max-w-sm w-full shadow-xl">
              <h2 className="text-lg font-semibold mb-2">Delete Account</h2>
              <p className="text-sm mb-4">
                Are you sure you want to delete your account? This action cannot
                be undone.
              </p>
              <div className="flex gap-2 justify-end">
                <Button
                  variant="outline"
                  size="sm"
                  onClick={() => setShowDeleteDialog(false)}
                >
                  Cancel
                </Button>
                <Button
                  variant="destructive"
                  size="sm"
                  onClick={handleDeleteAccount}
                  disabled={loading}
                >
                  {loading ? "Deleting..." : "Delete Account"}
                </Button>
              </div>
            </div>
          </div>
        )}
      </div>
    </main>
  );
}
