import { useState } from "react";
import { useNavigate } from "react-router-dom";
import AuthLayout from "../../components/auth/AuthLayout";
import { login } from "../../api/auth.api";

export default function Login() {
    const navigate = useNavigate();

    const [userId, setUserId] = useState("");
    const [password, setPassword] = useState("");

    const [showPassword, setShowPassword] = useState(false);

    const [loading, setLoading] = useState(false);
    const [error, setError] = useState("");

    async function handleLogin(
        event: React.SubmitEvent<HTMLFormElement>
    ) {
        event.preventDefault();

        setError("");

        const trimmedUserId = userId.trim();

        if (!trimmedUserId) {
            setError("Please enter your roll number.");
            return;
        }

        if (!password) {
            setError("Please enter your password.");
            return;
        }

        setLoading(true);

        try {
            const result = await login(
                trimmedUserId,
                password
            );

            console.log("Login response:", result);

            if (result.status === "Success") {
                switch (result.data.role) {
                    case "student":
                        navigate("/student/dashboard", {
                            replace: true,
                        });
                        break;

                    case "librarian":
                        navigate("/librarian/dashboard", {
                            replace: true,
                        });
                        break;

                    case "admin":
                        navigate("/admin/dashboard", {
                            replace: true,
                        });
                        break;

                    default:
                        setError("Invalid user role.");
                }
            } else {
                setError(
                    result.message || "Login failed. Please try again."
                );
            }

        } catch (error) {
            console.error("Login failed:", error);

            setError(
                "Unable to log in. Please check your credentials and try again."
            );
        } finally {
            setLoading(false);
        }
    }

    return (
        <AuthLayout
            title="Welcome back"
            subtitle="Sign in to access your library account"
        >
            <form
                className="space-y-6"
                onSubmit={handleLogin}
            >
                {/* User ID */}
                <div>
                    <label
                        htmlFor="userId"
                        className="block text-sm font-medium text-gray-700 mb-2"
                    >
                        User Id
                    </label>

                    <input
                        id="userId"
                        name="userId"
                        type="text"
                        value={userId}
                        onChange={(event) =>
                            setUserId(event.target.value)
                        }
                        placeholder="Enter your User Id"
                        disabled={loading}
                        autoComplete="username"
                        className="w-full px-4 py-3 border border-gray-300 rounded-lg outline-none focus:ring-2 focus:ring-slate-900 focus:border-transparent disabled:bg-gray-100 disabled:cursor-not-allowed"
                    />
                </div>

                {/* Password */}
                <div>
                    <div className="flex items-center justify-between mb-2">
                        <label
                            htmlFor="password"
                            className="block text-sm font-medium text-gray-700"
                        >
                            Password
                        </label>

                        <button
                            type="button"
                            className="text-sm font-medium text-slate-900 hover:underline"
                            onClick={() => {
                                // Forgot password functionality
                                // will be added later.
                            }}
                        >
                            Forgot password?
                        </button>
                    </div>

                    <div className="relative">
                        <input
                            id="password"
                            name="password"
                            type={showPassword ? "text" : "password"}
                            value={password}
                            onChange={(event) =>
                                setPassword(event.target.value)
                            }
                            placeholder="Enter your password"
                            disabled={loading}
                            autoComplete="current-password"
                            className="w-full px-4 py-3 pr-20 border border-gray-300 rounded-lg outline-none focus:ring-2 focus:ring-slate-900 focus:border-transparent disabled:bg-gray-100 disabled:cursor-not-allowed"
                        />

                        <button
                            type="button"
                            onClick={() =>
                                setShowPassword((previous) => !previous)
                            }
                            disabled={loading}
                            className="absolute right-3 top-1/2 -translate-y-1/2 text-sm font-medium text-gray-500 hover:text-gray-900 disabled:cursor-not-allowed"
                        >
                            {showPassword ? "Hide" : "Show"}
                        </button>
                    </div>
                </div>

                {/* Error */}
                {error && (
                    <div
                        className="rounded-lg bg-red-50 border border-red-200 px-4 py-3"
                        role="alert"
                    >
                        <p className="text-sm text-red-700">
                            {error}
                        </p>
                    </div>
                )}

                {/* Login */}
                <button
                    type="submit"
                    disabled={loading}
                    className="w-full py-3 px-4 bg-slate-900 text-white font-medium rounded-lg hover:bg-slate-800 transition disabled:opacity-50 disabled:cursor-not-allowed"
                >
                    {loading ? "Signing in..." : "Sign in"}
                </button>

                {/* Register */}
                <div className="text-center text-sm text-gray-500">
                    Don't have an account?{" "}

                    <button
                        type="button"
                        onClick={() => navigate("/")}
                        disabled={loading}
                        className="font-medium text-slate-900 hover:underline disabled:cursor-not-allowed"
                    >
                        Create an account
                    </button>
                </div>
            </form>
        </AuthLayout>
    );
}