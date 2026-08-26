import { useState } from "react";
import { useNavigate } from "react-router-dom";
import AuthLayout from "../../components/auth/AuthLayout";
import { register } from "../../api/auth.api";

export default function Register() {
    const navigate = useNavigate();

    const [rollNumber, setRollNumber] = useState("");
    const [loading, setLoading] = useState(false);
    const [error, setError] = useState("");

    async function handleSubmit(
        event: React.SubmitEvent<HTMLFormElement>
    ) {
        event.preventDefault();

        setError("");

        if (!rollNumber.trim()) {
            setError("Please enter your roll number.");
            return;
        }

        setLoading(true);

        try {
            const result = await register(rollNumber.trim());

            console.log("Registration response:", result);

            if (result.status === 'Success') {
                navigate("/verify-otp", {
                    replace: true,
                    state: {
                        rollNumber: rollNumber.trim(),
                    },
                });
            } else {
                setError(result.message);
            }

        } catch (error) {
            console.error("Registration failed:", error);

            setError(
                "Unable to register with this roll number. Please try again."
            );
        } finally {
            setLoading(false);
        }
    }

    return (
        <AuthLayout
            title="Create your account"
            subtitle="Register using your university roll number"
        >
            <form
                className="space-y-6"
                onSubmit={handleSubmit}
            >
                {/* Roll Number */}
                <div>
                    <label
                        htmlFor="rollNumber"
                        className="block text-sm font-medium text-gray-700 mb-2"
                    >
                        Roll Number
                    </label>

                    <input
                        id="rollNumber"
                        name="rollNumber"
                        type="text"
                        value={rollNumber}
                        onChange={(event) =>
                            setRollNumber(event.target.value)
                        }
                        placeholder="Enter your roll number"
                        disabled={loading}
                        className="w-full px-4 py-3 border border-gray-300 rounded-lg outline-none focus:ring-2 focus:ring-slate-900 focus:border-transparent disabled:bg-gray-100 disabled:cursor-not-allowed"
                    />

                    <p className="mt-2 text-sm text-gray-500">
                        Use the roll number registered with the university.
                    </p>

                    {error && (
                        <p className="mt-2 text-sm text-red-600">
                            {error}
                        </p>
                    )}
                </div>

                {/* Submit */}
                <button
                    type="submit"
                    disabled={loading}
                    className="w-full py-3 px-4 bg-slate-900 text-white font-medium rounded-lg hover:bg-slate-800 transition disabled:opacity-50 disabled:cursor-not-allowed"
                >
                    {loading ? "Checking..." : "Continue"}
                </button>
            </form>

            {/* Login */}
            <div className="mt-6 text-center text-sm text-gray-500">
                Already have an account?{" "}

                <button
                    type="button"
                    className="font-medium text-slate-900 hover:underline"
                >
                    Sign in
                </button>
            </div>
        </AuthLayout>
    );
}