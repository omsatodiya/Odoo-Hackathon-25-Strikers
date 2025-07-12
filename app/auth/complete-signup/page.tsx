"use client";
import { useState, useCallback } from "react";
import { useRouter } from "next/navigation";
import { getFirestore, doc, setDoc, getDoc } from "firebase/firestore";
import { auth } from "@/lib/firebase";
import {
  Card,
  CardHeader,
  CardTitle,
  CardContent,
  CardFooter,
} from "@/components/ui/card";
import { Input } from "@/components/ui/input";
import { Button } from "@/components/ui/button";
import { Alert, AlertDescription } from "@/components/ui/alert";
import { Label } from "@/components/ui/label";
import { getCityFromPincode } from "@/lib/utils/pincode";
import { ApiError } from "@/types";

export default function CompleteSignup() {
  const router = useRouter();
  const [mobile, setMobile] = useState("");
  const [pincode, setPincode] = useState("");
  const [city, setCity] = useState("");
  const [state, setState] = useState("");
  const [error, setError] = useState("");
  const [loading, setLoading] = useState(false);

  const handlePincodeChange = useCallback(async (value: string) => {
    setPincode(value);
    if (value.length === 6) {
      try {
        const data = await getCityFromPincode(value);
        if (data) {
          setCity(data.city);
          setState(data.state);
        } else {
          setCity("");
          setState("");
          setError("Invalid pincode");
        }
      } catch {
        setCity("");
        setState("");
        setError("Invalid pincode");
      }
    } else {
      setCity("");
      setState("");
    }
  }, []);

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    setError("");
    setLoading(true);
    try {
      const user = auth.currentUser;
      if (!user) {
        setError("You must be signed in to complete signup.");
        setLoading(false);
        return;
      }
      if (!mobile || !pincode || !city || !state) {
        setError("Please fill in all required fields.");
        setLoading(false);
        return;
      }
      const db = getFirestore();
      const userDoc = doc(db, "users", user.uid);
      const existing = await getDoc(userDoc);
      const baseData = existing.exists() ? existing.data() : {};
      await setDoc(
        userDoc,
        {
          ...baseData,
          mobile,
          pincode,
          city,
          state,
          updatedAt: new Date().toISOString(),
        },
        { merge: true }
      );
      router.push("/");
    } catch (error: unknown) {
      let message = "Failed to complete signup";
      if (
        error &&
        typeof error === "object" &&
        "message" in error &&
        typeof (error as ApiError).message === "string"
      ) {
        message = (error as ApiError).message;
      }
      setError(message);
    } finally {
      setLoading(false);
    }
  };

  return (
    <main className="min-h-screen flex items-center justify-center bg-gradient-to-br from-blue-50 to-indigo-100">
      <Card className="max-w-md w-full mx-auto border-0 shadow-xl bg-background/95 backdrop-blur-xl ring-1 ring-black/5 dark:ring-white/10">
        <CardHeader>
          <CardTitle className="text-2xl font-bold text-center">
            Complete Your Signup
          </CardTitle>
        </CardHeader>
        <CardContent>
          <form onSubmit={handleSubmit} className="space-y-6">
            <div className="space-y-4">
              <div className="space-y-2">
                <Label htmlFor="mobile">
                  Mobile Number<span className="text-destructive">*</span>
                </Label>
                <Input
                  id="mobile"
                  type="tel"
                  value={mobile}
                  onChange={(e) => setMobile(e.target.value)}
                  placeholder="Enter your mobile number"
                  required
                />
              </div>
              <div className="space-y-2">
                <Label htmlFor="pincode">
                  Pincode<span className="text-destructive">*</span>
                </Label>
                <Input
                  id="pincode"
                  type="text"
                  value={pincode}
                  onChange={(e) => {
                    if (
                      e.target.value.length <= 6 &&
                      /^\d*$/.test(e.target.value)
                    ) {
                      handlePincodeChange(e.target.value);
                    }
                  }}
                  placeholder="Enter 6-digit pincode"
                  required
                />
              </div>
              <div className="space-y-2">
                <Label className="text-xs sm:text-sm text-muted-foreground">
                  City (Auto-filled)
                </Label>
                <p className="h-10 px-3 py-2 rounded-md border bg-muted/50 text-base">
                  {city}
                </p>
              </div>
              <div className="space-y-2">
                <Label className="text-xs sm:text-sm text-muted-foreground">
                  State (Auto-filled)
                </Label>
                <p className="h-10 px-3 py-2 rounded-md border bg-muted/50 text-base">
                  {state}
                </p>
              </div>
            </div>
            {error && (
              <Alert variant="destructive">
                <AlertDescription>{error}</AlertDescription>
              </Alert>
            )}
            <Button type="submit" className="w-full h-11" disabled={loading}>
              {loading ? "Saving..." : "Complete Signup"}
            </Button>
          </form>
        </CardContent>
        <CardFooter className="flex justify-center border-t pt-6">
          <p className="text-xs sm:text-sm text-muted-foreground">
            Already have an account?{" "}
            <a
              href="/auth/login"
              className="text-primary hover:underline font-medium"
            >
              Sign in
            </a>
          </p>
        </CardFooter>
      </Card>
    </main>
  );
}
