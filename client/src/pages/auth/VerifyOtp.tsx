import { useState } from "react";
import { useLocation, useNavigate } from "react-router-dom";
import AuthLayout from "../../components/auth/AuthLayout";
import { verifyOtp } from "../../api/auth.api";

export default function VerifyOtp() {
    const location = useLocation();
    const navigate = useNavigate();

    const rollNumber = location.state?.rollNumber;

    const [emailOtp, setEmailOtp] = useState("");
    const [phoneOtp, setPhoneOtp] = useState("");

    const [loading, setLoading] = useState(false);
    const [error, setError] = useState("");

    async function handleVerification() {
        setError("");

        // Make sure roll number exists
        if (!rollNumber) {
            setError("Registration information is missing. Please register again.");
            return;
        }

        // Validate email OTP
        if (emailOtp.length !== 6) {
            setError("Please enter a valid 6-digit email OTP.");
            return;
        }

        // Validate phone OTP
        if (phoneOtp.length !== 6) {
            setError("Please enter a valid 6-digit phone OTP.");
            return;
        }

        setLoading(true);

        try {
            const response = await verifyOtp(
                rollNumber,
                emailOtp,
                phoneOtp
            );

            console.log(response);

            // Verification successful
            if (response.success) {
                navigate("/login");
            } else {
                setError(response.message);
            }

        } catch (error) {
            console.error(error);

            setError(
                "Unable to verify OTP. Please check the codes and try again."
            );
        } finally {
            setLoading(false);
        }
    }

    return (
        <AuthLayout
            title="Verify your account"
            subtitle="Enter the verification codes sent to your registered email and phone"
        >
            <div className="space-y-8">

                {/* Email OTP */}
                <div>
                    <label
                        htmlFor="emailOtp"
                        className="block text-sm font-medium text-gray-700 mb-2"
                    >
                        Email OTP
                    </label>

                    <p className="text-sm text-gray-500 mb-3">
                        Enter the 6-digit code sent to your university email.
                    </p>

                    <input
                        id="emailOtp"
                        name="emailOtp"
                        type="text"
                        inputMode="numeric"
                        maxLength={6}
                        value={emailOtp}
                        onChange={(event) =>
                            setEmailOtp(
                                event.target.value.replace(/\D/g, "")
                            )
                        }
                        disabled={loading}
                        placeholder="Enter email OTP"
                        className="w-full px-4 py-3 border border-gray-300 rounded-lg outline-none focus:ring-2 focus:ring-slate-900 focus:border-transparent disabled:bg-gray-100 disabled:cursor-not-allowed"
                    />
                </div>

                {/* Phone OTP */}
                <div>
                    <label
                        htmlFor="phoneOtp"
                        className="block text-sm font-medium text-gray-700 mb-2"
                    >
                        Phone OTP
                    </label>

                    <p className="text-sm text-gray-500 mb-3">
                        Enter the 6-digit code sent to your registered phone.
                    </p>

                    <input
                        id="phoneOtp"
                        name="phoneOtp"
                        type="text"
                        inputMode="numeric"
                        maxLength={6}
                        value={phoneOtp}
                        onChange={(event) =>
                            setPhoneOtp(
                                event.target.value.replace(/\D/g, "")
                            )
                        }
                        disabled={loading}
                        placeholder="Enter phone OTP"
                        className="w-full px-4 py-3 border border-gray-300 rounded-lg outline-none focus:ring-2 focus:ring-slate-900 focus:border-transparent disabled:bg-gray-100 disabled:cursor-not-allowed"
                    />
                </div>

                {/* Error */}
                {error && (
                    <p className="text-sm text-red-600">
                        {error}
                    </p>
                )}

                {/* Verify */}
                <button
                    type="button"
                    onClick={handleVerification}
                    disabled={loading}
                    className="w-full py-3 px-4 bg-slate-900 text-white font-medium rounded-lg hover:bg-slate-800 transition disabled:opacity-50 disabled:cursor-not-allowed"
                >
                    {loading ? "Verifying..." : "Verify Account"}
                </button>

                {/* Information */}
                <p className="text-center text-sm text-gray-500">
                    Didn't receive the code?{" "}
                    <button
                        type="button"
                        className="font-medium text-slate-900 hover:underline"
                    >
                        Resend OTP
                    </button>
                </p>

            </div>
        </AuthLayout>
    );
}