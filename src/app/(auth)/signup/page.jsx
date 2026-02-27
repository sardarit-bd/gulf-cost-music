"use client";

import { CustomDropdown } from "@/components/shared/CustomDropdown";
import { CustomInput } from "@/components/shared/CustomInput";
import { PlanCard } from "@/components/shared/PlanCard";
import { Building2, Camera, Crown, Lock, Mail, MapPin, Mic2, Newspaper, Sparkles, User, Users } from "lucide-react";
import Link from "next/link";
import { useRouter } from "next/navigation";
import { useState } from "react";
import toast, { Toaster } from "react-hot-toast";

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
    plan: "free",
  });

  const [loading, setLoading] = useState(false);
  const [stripeCheckoutUrl, setStripeCheckoutUrl] = useState(null);

  // State-city mapping
  const stateCityMapping = {
    Louisiana: ["new orleans", "baton rouge", "lafayette", "shreveport", "lake charles", "monroe"],
    Mississippi: ["jackson", "biloxi", "gulfport", "oxford", "hattiesburg"],
    Alabama: ["birmingham", "mobile", "huntsville", "tuscaloosa"],
    Florida: ["tampa", "st. petersburg", "clearwater", "pensacola", "panama city", "fort myers"],
  };

  // Genre options
  const genreOptions = [
    { value: "rap", label: "Rap", icon: <Mic2 className="h-4 w-4" /> },
    { value: "country", label: "Country", icon: <Mic2 className="h-4 w-4" /> },
    { value: "pop", label: "Pop", icon: <Mic2 className="h-4 w-4" /> },
    { value: "rock", label: "Rock", icon: <Mic2 className="h-4 w-4" /> },
    { value: "jazz", label: "Jazz", icon: <Mic2 className="h-4 w-4" /> },
    { value: "reggae", label: "Reggae", icon: <Mic2 className="h-4 w-4" /> },
    { value: "edm", label: "EDM", icon: <Mic2 className="h-4 w-4" /> },
    { value: "classical", label: "Classical", icon: <Mic2 className="h-4 w-4" /> },
    { value: "other", label: "Other", icon: <Mic2 className="h-4 w-4" /> },
  ];

  // User type options
  const userTypeOptions = [
    { value: "artist", label: "Artist", icon: <Mic2 className="h-4 w-4" /> },
    { value: "venue", label: "Venue", icon: <Building2 className="h-4 w-4" /> },
    { value: "journalist", label: "Journalist", icon: <Newspaper className="h-4 w-4" /> },
    { value: "photographer", label: "Photographer", icon: <Camera className="h-4 w-4" /> },
    { value: "studio", label: "Studio", icon: <Building2 className="h-4 w-4" /> },
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

  const canSubscribeToPro = ["artist", "venue", "journalist", "photographer", "studio"].includes(formData.userType);

  // Plan features
  const freePlanFeatures = [
    "10% fee on marketplace sales",
  ];

  const proPlanFeatures = [
    "✨ 0% fee on marketplace sales",
  ];

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
        // Reset plan if user type is not eligible for Pro
        if (!["artist", "venue", "photographer", "studio"].includes(value)) {
          newData.plan = "free";
        }
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

  const requiresLocation = ["artist", "venue", "journalist", "photographer", "studio"].includes(formData.userType);

  // Handle Pro Plan payment redirect
  const handleProPlanPayment = (checkoutUrl) => {
    setStripeCheckoutUrl(checkoutUrl);
    toast.success("Redirecting to payment page...", { duration: 3000 });
    setTimeout(() => {
      window.location.href = checkoutUrl;
    }, 1000);
  };

  // handle submit
  const handleSubmit = async (e) => {
    e.preventDefault();
    setLoading(true);
    setStripeCheckoutUrl(null);

    const toastId = toast.loading("Creating your account...");

    try {
      const submissionData = {
        username: formData.username,
        email: formData.email,
        password: formData.password,
        userType: formData.userType,
        plan: formData.plan,
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

      // Add state and city for non-fan users
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
          headers: { "Content-Type": "application/json" },
          body: JSON.stringify(submissionData),
        }
      );

      const data = await res.json();

      if (res.ok && data.success) {
        toast.success(data.message || "Registration successful!", { id: toastId });

        if (formData.plan === "pro" && data.requiresPayment && data.data?.stripeCheckoutUrl) {
          handleProPlanPayment(data.data.stripeCheckoutUrl);
        } else {
          setTimeout(() => router.push("/signin"), 1500);
        }

        setFormData({
          username: "",
          email: "",
          password: "",
          userType: "artist",
          genre: "",
          state: "",
          city: "",
          plan: "free",
        });
      }
      else if (data.errors?.details && Array.isArray(data.errors.details)) {
        toast.dismiss(toastId);
        data.errors.details.forEach((err) => {
          toast.error(`${err.field ? `${err.field}: ` : ""}${err.message}`);
        });
      }
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
      <div className="min-h-[calc(100vh-4rem)] bg-gradient-to-br from-gray-50 via-white to-yellow-50 mt-20 py-8 md:py-12 px-4 sm:px-6 lg:px-8">
        <Toaster />

        <div className="max-w-7xl mx-auto">
          <div className="bg-white rounded-2xl shadow-xl border border-gray-200 p-6 md:p-8">
            <div className="mb-8 border-b border-gray-200 pb-6">
              <h2 className="text-2xl text-center font-bold text-gray-900">
                Create Your Account
              </h2>
              <p className="text-gray-600 text-center mt-1">
                Join the Gulf Coast music community today
              </p>
            </div>

            <form onSubmit={handleSubmit}>
              {/* Two Column Layout */}
              <div className="grid grid-cols-1 lg:grid-cols-2 gap-8 lg:gap-12">
                {/* LEFT COLUMN - Basic Information */}
                <div className="space-y-5">
                  {/* <div className="border-b border-gray-200 pb-2 mb-4">
                    <h3 className="text-lg font-semibold text-gray-800">Basic Information</h3>
                  </div> */}

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
                </div>

                {/* RIGHT COLUMN - Plan & Location Information */}
                <div className="space-y-5">
                  {/* <div className="border-b border-gray-200 pb-2 mb-4">
                    <h3 className="text-lg font-semibold text-gray-800">Plan & Location</h3>
                  </div> */}

                  {/* PLAN SELECTION SECTION */}
                  <div>
                    <div className="flex items-center gap-2 mb-4">
                      <Crown className="h-5 w-5 text-yellow-600" />
                      <label className="text-lg font-semibold text-gray-900">
                        Choose Your Plan
                      </label>
                    </div>

                    <div className="flex flex-col sm:flex-row gap-4">
                      {/* Free Plan */}
                      <PlanCard
                        plan="free"
                        selected={formData.plan === "free"}
                        onSelect={(plan) => handleDropdownChange("plan", plan)}
                        price="$0/month"
                        features={freePlanFeatures}
                        icon={User}
                      />

                      {canSubscribeToPro ? (
                        <PlanCard
                          plan="pro"
                          selected={formData.plan === "pro"}
                          onSelect={(plan) => handleDropdownChange("plan", plan)}
                          price="$10/month"
                          features={proPlanFeatures}
                          icon={Crown}
                          recommended={true}
                        />
                      ) : (
                        <PlanCard
                          plan="pro"
                          selected={false}
                          onSelect={() => { }}
                          price="$10/month"
                          features={proPlanFeatures}
                          icon={Crown}
                          disabled={true}
                        />
                      )}
                    </div>

                    {/* Pro Plan Info */}
                    {formData.plan === "pro" && canSubscribeToPro && (
                      <div className="mt-4 p-4 bg-gradient-to-r from-yellow-500/10 to-orange-500/10 rounded-lg border border-yellow-500/30">
                        <div className="flex items-start gap-3">
                          <Sparkles className="h-5 w-5 text-yellow-600 flex-shrink-0 mt-0.5" />
                          <div>
                            <p className="text-sm font-medium text-yellow-800">
                              ⚡ You'll be redirected to Stripe for payment after registration.
                            </p>
                            <p className="text-xs text-gray-600 mt-1">
                              Your Pro plan will be activated immediately after successful payment.
                              You'll pay <span className="font-semibold">$10/month</span> with 0% marketplace fees.
                            </p>
                          </div>
                        </div>
                      </div>
                    )}

                    {/* Pro Plan Not Available */}
                    {!canSubscribeToPro && formData.userType !== "fan" && (
                      <div className="mt-4 p-3 bg-gray-100 rounded-lg">
                        <p className="text-sm text-gray-600">
                          ⚠️ Pro plan is not available for {formData.userType}s.
                          You'll automatically use the Free plan.
                        </p>
                      </div>
                    )}
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

                  {/* State & City */}
                  {requiresLocation && (
                    <div className="grid grid-cols-1 sm:grid-cols-2 gap-5">
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
                </div>
              </div>

              {/* Submit Button - Full Width Below Columns */}
              <div className="mt-8 pt-6 border-t border-gray-200">
                <button
                  type="submit"
                  disabled={loading}
                  className="w-full bg-gradient-to-r from-yellow-500 to-orange-500 hover:from-yellow-600 hover:to-orange-600 text-white font-bold py-3.5 rounded-lg transition-all duration-200 disabled:opacity-50 shadow-lg hover:shadow-xl transform hover:-translate-y-0.5 flex items-center justify-center"
                >
                  {loading ? (
                    <>
                      <div className="w-5 h-5 border-t-2 border-white border-solid rounded-full animate-spin mr-2"></div>
                      {formData.plan === "pro" ? "Creating Account & Redirecting..." : "Creating Account..."}
                    </>
                  ) : (
                    formData.plan === "pro" ? "Create Account & Pay $10/month" : "Create Free Account"
                  )}
                </button>
              </div>
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
    </>
  );
}