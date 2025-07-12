// Firebase Auth Error Types
export interface FirebaseAuthError {
  code: string;
  message: string;
  email?: string;
  credential?: any;
  tenantId?: string;
}

// Pincode API Response Types
export interface PincodeResponse {
  Message: string;
  Status: string;
  PostOffice: PostOffice[];
}

export interface PostOffice {
  Name: string;
  Description: string;
  BranchType: string;
  DeliveryStatus: string;
  Circle: string;
  District: string;
  Division: string;
  Region: string;
  State: string;
  Country: string;
  Pincode: string;
}

// Zippopotam API Response Types
export interface ZippopotamResponse {
  post_code: string;
  country: string;
  country_abbreviation: string;
  places: Place[];
}

export interface Place {
  place_name: string;
  longitude: string;
  state: string;
  state_abbreviation: string;
  latitude: string;
}

// User Profile Types
export interface UserProfile {
  uid: string;
  email: string;
  name: string;
  mobile?: string;
  pincode?: string;
  city?: string;
  state?: string;
  createdAt: string;
  updatedAt: string;
}

// Form Data Types
export interface SignupFormData {
  name: string;
  email: string;
  password: string;
  mobile?: string;
  pincode?: string;
  city?: string;
  state?: string;
}

export interface CompleteSignupFormData {
  mobile: string;
  pincode: string;
  city?: string;
  state?: string;
}

// Location Data Types
export interface LocationData {
  city: string;
  state: string;
}

// Error Types
export interface ApiError {
  message: string;
  code?: string;
} 