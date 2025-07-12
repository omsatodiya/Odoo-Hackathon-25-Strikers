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
import { ArrowLeft, Loader2 } from "lucide-react";
import { useTheme } from "next-themes";
import { getCityFromPincode } from "@/lib/utils/pincode";
import gsap from "gsap";

interface UserData {
  firstName: string;
  lastName: string;
  email: string;
  mobile: string;
  city: string;
  state: string;
  pincode: string;
}

export default function ProfilePage() {
  const { theme, setTheme } = useTheme();
  const router = useRouter();
  const [mounted, setMounted] = useState(false);
  const [loading, setLoading] = useState(true);
  const [userData, setUserData] = useState<UserData>({
    firstName: "",
    lastName: "",
    email: "",
    mobile: "",
    city: "",
    state: "",
    pincode: "",
  });
  const [isEditing, setIsEditing] = useState(false);
  const [showDeleteDialog, setShowDeleteDialog] = useState(false);

  const loadingRef = useRef<HTMLDivElement>(null);
  const headerRef = useRef<HTMLDivElement>(null);
  const infoCardRef = useRef<HTMLDivElement>(null);
  const deleteDialogRef = useRef<HTMLDivElement>(null);

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

  const handleInputChange = async (name: keyof UserData, value: string) => {
    setUserData((prev) => ({ ...prev, [name]: value }));
    if (name === "pincode" && value.length === 6) {
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
      <div className="relative z-10 w-full max-w-2xl space-y-4 sm:space-y-6">
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
            {/* error && ( // Original code had this line commented out */}
            {/*   <Alert // Original code had this line commented out */}
            {/*     variant="destructive" // Original code had this line commented out */}
            {/*     className="mt-4 sm:mt-6 animate-shake" // Original code had this line commented out */}
            {/*   > // Original code had this line commented out */}
            {/*     <AlertCircle className="h-4 w-4" /> // Original code had this line commented out */}
            {/*     <AlertDescription className="text-sm">{error}</AlertDescription> // Original code had this line commented out */}
            {/*   </Alert> // Original code had this line commented out */}
            {/* ) // Original code had this line commented out */}
            {isEditing && (
              <div className="mt-4 sm:mt-6 flex justify-end">
                <Button
                  variant="outline"
                  size="sm"
                  onClick={() => setIsEditing(false)}
                  className="h-8 sm:h-9 text-xs sm:text-sm mr-3"
                >
                  Cancel
                </Button>
              </div>
            )}
          </div>
        </div>
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
