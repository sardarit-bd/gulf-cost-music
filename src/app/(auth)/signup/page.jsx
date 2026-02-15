// app/signup/page.jsx
"use client";

import { Building2, Camera, Check, ChevronDown, Lock, Mail, MapPin, Mic2, Newspaper, User, Users } from "lucide-react";
import Link from "next/link";
import { useRouter } from "next/navigation";
import { useEffect, useRef, useState } from "react";
import toast, { Toaster } from "react-hot-toast";

// Custom Dropdown Component (unchanged)
const CustomDropdown = ({
  options,
  value,
  onChange,
  placeholder,
  disabled = false,
  icon,
  className = "",
  required = false
}) => {
  const [isOpen, setIsOpen] = useState(false);
  const dropdownRef = useRef(null);

  useEffect(() => {
    const handleClickOutside = (event) => {
      if (dropdownRef.current && !dropdownRef.current.contains(event.target)) {
        setIsOpen(false);
      }
    };

    document.addEventListener("mousedown", handleClickOutside);
    return () => document.removeEventListener("mousedown", handleClickOutside);
  }, []);

  const selectedOption = options.find(opt => opt.value === value);

  return (
    <div className={`relative ${className}`} ref={dropdownRef}>
      <button
        type="button"
        onClick={() => !disabled && setIsOpen(!isOpen)}
        disabled={disabled}
        className={`w-full flex items-center justify-between border border-gray-300 rounded-lg px-4 py-3 focus:outline-none focus:ring-2 focus:ring-yellow-500 focus:border-yellow-500 transition-all duration-200 ${disabled ? "bg-gray-100 text-gray-400 cursor-not-allowed" : "bg-white text-gray-700 hover:border-gray-400"
          }`}
      >
        <div className="flex items-center space-x-3">
          {icon && <span className="text-gray-400">{icon}</span>}
          <span className={!selectedOption ? "text-gray-400" : ""}>
            {selectedOption ? selectedOption.label : placeholder}
          </span>
        </div>
        <ChevronDown className={`h-5 w-5 text-gray-400 transition-transform duration-200 ${isOpen ? "transform rotate-180" : ""}`} />
      </button>

      {isOpen && !disabled && (
        <div className="absolute z-50 w-full mt-1 bg-white border border-gray-200 rounded-lg shadow-lg max-h-60 overflow-y-auto">
          {options.map((option) => (
            <button
              key={option.value}
              type="button"
              onClick={() => {
                onChange(option.value);
                setIsOpen(false);
              }}
              className={`w-full flex items-center justify-between px-4 py-3 text-left hover:bg-yellow-50 transition-colors duration-150 ${value === option.value ? "bg-yellow-50 text-yellow-700" : "text-gray-700"
                }`}
            >
              <div className="flex items-center space-x-3">
                {option.icon && <span className="text-gray-500">{option.icon}</span>}
                <span>{option.label}</span>
              </div>
              {value === option.value && (
                <Check className="h-4 w-4 text-yellow-600" />
              )}
            </button>
          ))}
        </div>
      )}
    </div>
  );
};

// Custom Input Component (unchanged)
const CustomInput = ({
  type = "text",
  name,
  value,
  onChange,
  placeholder,
  required = false,
  minLength,
  maxLength,
  disabled = false,
  icon
}) => {
  return (
    <div className="relative">
      {icon && (
        <div className="absolute left-3 top-1/2 transform -translate-y-1/2 text-gray-400">
          {icon}
        </div>
      )}
      <input
        type={type}
        name={name}
        value={value}
        onChange={onChange}
        placeholder={placeholder}
        required={required}
        minLength={minLength}
        maxLength={maxLength}
        disabled={disabled}
        className={`w-full border border-gray-300 rounded-lg px-4 py-3 focus:outline-none focus:ring-2 focus:ring-yellow-500 focus:border-yellow-500 placeholder:text-gray-400 text-gray-700 transition-all duration-200 ${icon ? "pl-10" : ""
          } ${disabled ? "bg-gray-100 cursor-not-allowed" : ""}`}
      />
    </div>
  );
};

export default function SignUp() {
  const router = useRouter();

  const [formData, setFormData] = useState({
    username: "",
    email: "",
    password: "",
    userType: "artist",
    genre: "",
    state: "",
    city: "",
  });

  const [loading, setLoading] = useState(false);

  // State-city mapping (exact same as backend)
  const stateCityMapping = {
    Louisiana: ["new orleans", "baton rouge", "lafayette", "shreveport", "lake charles", "monroe"],
    Mississippi: ["jackson", "biloxi", "gulfport", "oxford", "hattiesburg"],
    Alabama: ["birmingham", "mobile", "huntsville", "tuscaloosa"],
    Florida: ["tampa", "st. petersburg", "clearwater", "pensacola", "panama city", "fort myers"],
  };

  // Genre options
  const genreOptions = [
    { value: "rap", label: "Rap" },
    { value: "country", label: "Country" },
    { value: "pop", label: "Pop" },
    { value: "rock", label: "Rock" },
    { value: "jazz", label: "Jazz" },
    { value: "reggae", label: "Reggae" },
    { value: "edm", label: "EDM" },
    { value: "classical", label: "Classical" },
    { value: "other", label: "Other" },
  ];

  // User type options - STUDIO যোগ হয়েছে
  const userTypeOptions = [
    { value: "artist", label: "Artist", icon: <Mic2 className="h-4 w-4" /> },
    { value: "venue", label: "Venue", icon: <Building2 className="h-4 w-4" /> },
    { value: "journalist", label: "Journalist", icon: <Newspaper className="h-4 w-4" /> },
    { value: "photographer", label: "Photographer", icon: <Camera className="h-4 w-4" /> },
    { value: "studio", label: "Studio", icon: <Building2 className="h-4 w-4" /> }, // ✅ Studio যোগ হয়েছে
    { value: "fan", label: "Fan", icon: <Users className="h-4 w-4" /> },
  ];

  // State options
  const stateOptions = Object.keys(stateCityMapping).map(state => ({
    value: state,
    label: state,
    icon: <MapPin className="h-4 w-4" />
  }));

  // City options for selected state
  const cityOptions = formData.state
    ? stateCityMapping[formData.state].map(city => ({
      value: city.toLowerCase(),
      label: city.charAt(0).toUpperCase() + city.slice(1),
      icon: <MapPin className="h-4 w-4" />
    }))
    : [];

  // handle change for custom dropdowns
  const handleDropdownChange = (name, value) => {
    setFormData((prev) => {
      const newData = {
        ...prev,
        [name]: value,
      };

      // Reset fields when user type changes
      if (name === "userType") {
        newData.genre = "";
        newData.state = "";
        newData.city = "";
      }

      // Reset city when state changes
      if (name === "state") {
        newData.city = "";
      }

      return newData;
    });
  };

  // handle change for regular inputs
  const handleInputChange = (e) => {
    const { name, value } = e.target;
    setFormData((prev) => ({
      ...prev,
      [name]: value,
    }));
  };

  // Check if user type requires location - STUDIO যোগ হয়েছে
  const requiresLocation = ["artist", "venue", "journalist", "photographer", "studio"].includes(formData.userType);
  // ✅ Studio যোগ হয়েছে

  // handle submit
  const handleSubmit = async (e) => {
    e.preventDefault();
    setLoading(true);

    const toastId = toast.loading("Creating your account...");

    try {
      const submissionData = {
        username: formData.username,
        email: formData.email,
        password: formData.password,
        userType: formData.userType,
      };

      // Add genre for artists
      if (formData.userType === "artist") {
        if (!formData.genre) {
          toast.error("Please select a genre", { id: toastId });
          setLoading(false);
          return;
        }
        submissionData.genre = formData.genre.toLowerCase();
      }

      // Add state and city for non-fan users (Studio সহ)
      if (requiresLocation) {
        if (!formData.state || !formData.city) {
          toast.error("Please select both state and city", { id: toastId });
          setLoading(false);
          return;
        }
        submissionData.state = formData.state;
        submissionData.city = formData.city.toLowerCase();
      }

      const res = await fetch(
        `${process.env.NEXT_PUBLIC_BASE_URL}/api/auth/register`,
        {
          method: "POST",
          headers: {
            "Content-Type": "application/json",
          },
          body: JSON.stringify(submissionData),
        }
      );

      const data = await res.json();

      // SUCCESS
      if (res.ok && data.success) {
        toast.success(data.message || "Registration successful!", {
          id: toastId,
        });

        setTimeout(() => {
          router.push("/signin");
        }, 1200);

        setFormData({
          username: "",
          email: "",
          password: "",
          userType: "artist",
          genre: "",
          state: "",
          city: "",
        });
      }

      // VALIDATION ERROR (field-wise)
      else if (data.errors?.details && Array.isArray(data.errors.details)) {
        toast.dismiss(toastId);
        data.errors.details.forEach((err) => {
          toast.error(`${err.field ? `${err.field}: ` : ""}${err.message}`);
        });
      }

      // GENERIC ERROR
      else {
        toast.error(data.message || "Something went wrong!", { id: toastId });
      }
    } catch (error) {
      console.error("Error:", error);
      toast.error("Server error! Please try again later.", { id: toastId });
    } finally {
      setLoading(false);
    }
  };

  return (
    <>
      {/* Main Content */}
      <div className="min-h-[calc(100vh-4rem)] bg-gradient-to-br from-gray-50 via-white to-yellow-50 mt-20 py-8 md:py-12 px-4 sm:px-6 lg:px-8">
        <Toaster />

        <div className="max-w-6xl mx-auto flex justify-center">
          <div className="w-full max-w-xl">
            <div className="bg-white rounded-2xl shadow-xl border border-gray-200 p-6 md:p-8">
              <div className="mb-6">
                <h2 className="text-2xl font-bold text-gray-900">
                  Create Your Account
                </h2>
                <p className="text-gray-600 mt-1">
                  Start your musical journey today
                </p>
              </div>

              <form onSubmit={handleSubmit} className="space-y-5">
                {/* Username */}
                <div>
                  <label className="block text-sm font-medium text-gray-700 mb-2 flex items-center">
                    <User className="h-4 w-4 mr-2" />
                    Username *
                  </label>
                  <CustomInput
                    type="text"
                    name="username"
                    value={formData.username}
                    onChange={handleInputChange}
                    placeholder="Enter your username"
                    required
                    minLength={3}
                    maxLength={50}
                    disabled={loading}
                    icon={<User className="h-4 w-4" />}
                  />
                </div>

                {/* Email */}
                <div>
                  <label className="block text-sm font-medium text-gray-700 mb-2 flex items-center">
                    <Mail className="h-4 w-4 mr-2" />
                    Email *
                  </label>
                  <CustomInput
                    type="email"
                    name="email"
                    value={formData.email}
                    onChange={handleInputChange}
                    placeholder="Enter your email"
                    required
                    disabled={loading}
                    icon={<Mail className="h-4 w-4" />}
                  />
                </div>

                {/* Password */}
                <div>
                  <label className="block text-sm font-medium text-gray-700 mb-2 flex items-center">
                    <Lock className="h-4 w-4 mr-2" />
                    Password *
                  </label>
                  <CustomInput
                    type="password"
                    name="password"
                    value={formData.password}
                    onChange={handleInputChange}
                    placeholder="Enter your password"
                    required
                    minLength={6}
                    disabled={loading}
                    icon={<Lock className="h-4 w-4" />}
                  />
                </div>

                {/* User Type */}
                <div>
                  <label className="block text-sm font-medium text-gray-700 mb-2">
                    I am a *
                  </label>
                  <CustomDropdown
                    options={userTypeOptions}
                    value={formData.userType}
                    onChange={(value) => handleDropdownChange("userType", value)}
                    placeholder="Select user type"
                    disabled={loading}
                    required
                  />
                </div>

                {/* Genre (Only for Artists) */}
                {formData.userType === "artist" && (
                  <div>
                    <label className="block text-sm font-medium text-gray-700 mb-2">
                      Music Genre *
                    </label>
                    <CustomDropdown
                      options={genreOptions}
                      value={formData.genre}
                      onChange={(value) => handleDropdownChange("genre", value)}
                      placeholder="Select your music genre"
                      disabled={loading}
                      required
                    />
                  </div>
                )}

                {/* State & City (For non-fan users - Studio সহ) */}
                {requiresLocation && (
                  <div className="grid grid-cols-1 md:grid-cols-2 gap-5">
                    <div>
                      <label className="block text-sm font-medium text-gray-700 mb-2 flex items-center">
                        <MapPin className="h-4 w-4 mr-2" />
                        State *
                      </label>
                      <CustomDropdown
                        options={stateOptions}
                        value={formData.state}
                        onChange={(value) => handleDropdownChange("state", value)}
                        placeholder="Select your state"
                        disabled={loading}
                        required
                      />
                    </div>

                    <div>
                      <label className="block text-sm font-medium text-gray-700 mb-2">
                        City *
                      </label>
                      <CustomDropdown
                        options={cityOptions}
                        value={formData.city}
                        onChange={(value) => handleDropdownChange("city", value)}
                        placeholder={formData.state ? "Select your city" : "Select state first"}
                        disabled={loading || !formData.state}
                        required
                      />
                    </div>
                  </div>
                )}

                {/* Submit Button */}
                <button
                  type="submit"
                  disabled={loading}
                  className="w-full bg-gradient-to-r from-yellow-500 to-orange-500 hover:from-yellow-600 hover:to-orange-600 text-white font-bold py-3.5 rounded-lg transition-all duration-200 disabled:opacity-50 shadow-lg hover:shadow-xl transform hover:-translate-y-0.5 mt-6 flex items-center justify-center"
                >
                  {loading ? (
                    <>
                      <div className="w-5 h-5 border-t-2 border-white border-solid rounded-full animate-spin mr-2"></div>
                      Creating Account...
                    </>
                  ) : (
                    "Create Account"
                  )}
                </button>
              </form>

              <div className="mt-8 pt-6 border-t border-gray-200 text-center">
                <p className="text-gray-600">
                  Already have an account?{" "}
                  <Link
                    href="/signin"
                    className="text-yellow-600 hover:text-yellow-700 font-semibold hover:underline transition-colors duration-200"
                  >
                    Sign In
                  </Link>
                </p>
                <p className="text-xs text-gray-500 mt-4">
                  By signing up, you agree to our Terms of Service and Privacy Policy
                </p>
              </div>
            </div>
          </div>
        </div>
      </div>
    </>
  );
}