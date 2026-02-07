import React, { useState } from 'react';
import { Link } from 'react-router-dom';

const ForgetPassword = () => {
    const [email, setEmail] = useState('');
    const [error, setError] = useState('');
    const [showToast, setShowToast] = useState(false);
    const [toastAnimation, setToastAnimation] = useState('translate-y-10 opacity-0');

    const handleSendResetLink = (e) => {
        e.preventDefault();
        setError('');

        const emailPattern = /^[^\s@]+@[^\s@]+\.[^\s@]+$/;

        if (email.trim() === "") {
            setError("Email field cannot be empty.");
            return;
        }

        if (!emailPattern.test(email)) {
            setError("Please enter a valid email address.");
            return;
        }

        // Simulate successful email sending
        setShowToast(true);
        // Trigger animation
        setTimeout(() => {
            setToastAnimation('');
        }, 10);

        setTimeout(() => {
            setToastAnimation('translate-y-10 opacity-0');
            setTimeout(() => {
                setShowToast(false);
            }, 300);
        }, 3000);

        setEmail("");
    };

    return (
        <div className="font-display bg-background-light dark:bg-background-dark min-h-screen flex items-center justify-center p-4 relative overflow-hidden">
            {/* Subtle Background Pattern */}
            <div className="absolute inset-0 bg-grid-pattern dark:bg-grid-pattern-dark pointer-events-none z-0"></div>
            {/* Main Container */}
            <div className="w-full max-w-md bg-white dark:bg-[#1a2e1f] rounded-xl shadow-2xl relative z-10 border border-[#dbe6de] dark:border-[#2a4531]">
                {/* Header Image Area */}
                <div className="w-full h-32 bg-primary/10 rounded-t-xl flex items-center justify-center relative overflow-hidden">
                    {/* Abstract tech background representation */}
                    <div className="absolute inset-0 opacity-20 bg-[radial-gradient(ellipse_at_top,_var(--tw-gradient-stops))] from-primary via-transparent to-transparent">
                    </div>
                    {/* Logo Container */}
                    <div className="relative z-10 p-4 bg-white dark:bg-[#1a2e1f] rounded-full shadow-lg">
                        <span className="material-symbols-outlined text-primary text-4xl">lock_reset</span>
                    </div>
                </div>
                <div className="px-8 py-8 flex flex-col gap-6">
                    {/* Titles */}
                    <div className="text-center">
                        <h1 className="text-[#111813] dark:text-white text-2xl font-bold tracking-tight mb-2">Reset Password</h1>
                        <p className="text-[#61896b] dark:text-[#a0cfa5] text-sm">Enter your email to receive a reset link.</p>
                    </div>

                    {/* Reset Form */}
                    <form className="flex flex-col gap-5" onSubmit={handleSendResetLink}>
                        {/* Email Field */}
                        <div className="flex flex-col gap-1.5">
                            <label className="text-[#111813] dark:text-[#e0e7e1] text-sm font-semibold" htmlFor="email">Email Address</label>
                            <div className="relative">
                                <span className="absolute left-4 top-1/2 -translate-y-1/2 text-[#61896b] flex items-center pointer-events-none">
                                    <span className="material-symbols-outlined text-[20px]">mail</span>
                                </span>
                                <input
                                    className="form-input w-full rounded-lg border border-[#dbe6de] dark:border-[#3a5840] bg-white dark:bg-[#15251a] text-[#111813] dark:text-white pl-11 pr-4 py-3 focus:border-primary focus:ring-primary dark:focus:border-primary dark:focus:ring-primary placeholder-[#61896b]/60 dark:placeholder-[#61896b]"
                                    id="email"
                                    name="email"
                                    placeholder="example@gmail.com"
                                    type="email"
                                    value={email}
                                    onChange={(e) => setEmail(e.target.value)}
                                />
                            </div>
                            <div className="text-red-500 text-xs mt-1">{error}</div>
                        </div>

                        {/* Note Box */}
                        <div className="p-4 rounded-lg bg-primary/5 border border-primary/20 text-xs text-[#61896b] dark:text-[#a0cfa5] flex gap-2">
                            <span className="material-symbols-outlined text-sm shrink-0 mt-0.5">info</span>
                            <span>The system will verify whether the entered email exists before sending the link.</span>
                        </div>

                        {/* Submit Button */}
                        <button
                            className="mt-2 w-full bg-primary hover:bg-primary-dark text-[#111813] font-bold py-3.5 px-4 rounded-lg shadow-md hover:shadow-lg transition-all duration-200 flex items-center justify-center gap-2 group"
                            type="submit">
                            <span>Send Reset Link</span>
                            <span className="material-symbols-outlined text-lg group-hover:translate-x-1 transition-transform">send</span>
                        </button>
                    </form>

                    {/* Footer / Secondary Actions */}
                    <div className="pt-2 flex flex-col items-center gap-4 border-t border-[#f0f4f1] dark:border-[#2a4531]">
                        <p className="text-sm text-[#61896b] dark:text-[#8ab895]">
                            Remember your password? <Link
                                className="text-[#111813] dark:text-white font-semibold hover:text-primary dark:hover:text-primary hover:underline transition-colors"
                                to="/login">Sign In</Link>
                        </p>
                    </div>
                </div>
            </div>

            {/* Mobile Notification (Toast) */}
            {showToast && (
                <div id="toast"
                    className={`fixed bottom-8 left-1/2 -translate-x-1/2 bg-[#111813] text-white px-6 py-3 rounded-xl border-l-4 border-primary shadow-2xl flex items-center gap-3 z-50 transition-all duration-300 transform ${toastAnimation}`}>
                    <span className="material-symbols-outlined text-primary">check_circle</span>
                    <span>Password reset link sent!</span>
                </div>
            )}
        </div>
    );
};

export default ForgetPassword;
