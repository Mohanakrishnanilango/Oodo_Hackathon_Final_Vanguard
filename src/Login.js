import React, { useState } from 'react';
import { Link, useNavigate } from 'react-router-dom';
import './Login.css';

const Login = () => {
    const [isRightPanelActive, setIsRightPanelActive] = useState(false);
    const [loginEmail, setLoginEmail] = useState('');
    const [loginPassword, setLoginPassword] = useState('');
    const navigate = useNavigate();

    const handleSignUpClick = () => {
        setIsRightPanelActive(true);
    };

    const handleSignInClick = () => {
        setIsRightPanelActive(false);
    };

    const handleLoginSubmit = (e) => {
        e.preventDefault();

        // Simple mock authentication logic
        if (loginEmail.toLowerCase() === 'internal@test.com') {
            navigate('/', { state: { userRole: 'internal' } });
        } else if (loginEmail.toLowerCase() === 'portal@test.com') {
            navigate('/portal/home', { state: { userRole: 'portal' } });
        } else {
            // Default behavior for other users (e.g. admin or customers)
            navigate('/', { state: { userRole: 'admin' } });
        }
    };

    return (
        <div className="font-display bg-background-light dark:bg-background-dark min-h-screen flex items-center justify-center p-4 relative overflow-hidden">
            {/* Subtle Background Pattern */}
            <div className="absolute inset-0 bg-grid-pattern dark:bg-grid-pattern-dark pointer-events-none z-0"></div>

            {/* Main Container */}
            <div className={`container-custom bg-white dark:bg-[#1a2e1f] rounded-xl shadow-2xl relative z-10 border border-[#dbe6de] dark:border-[#2a4531] ${isRightPanelActive ? 'right-panel-active' : ''}`} id="container">

                {/* Sign Up Form */}
                <div className="form-container sign-up-container">
                    <form action="#" className="bg-white dark:bg-[#1a2e1f] flex flex-col items-center justify-center h-full px-12 text-center">
                        <h1 className="text-[#111813] dark:text-white text-2xl font-bold tracking-tight mb-4">Start Subscription</h1>
                        <div className="flex gap-4 my-4">
                            <button type="button" className="w-10 h-10 rounded-full border border-[#dbe6de] bg-white flex items-center justify-center text-[#61896b] transition-all hover:bg-primary hover:text-[#111813] hover:border-primary">
                                <i className="bx bxl-facebook text-xl"></i>
                            </button>
                            <button type="button" className="w-10 h-10 rounded-full border border-[#dbe6de] bg-white flex items-center justify-center text-[#61896b] transition-all hover:bg-primary hover:text-[#111813] hover:border-primary">
                                <i className="bx bxl-google text-xl"></i>
                            </button>
                            <button type="button" className="w-10 h-10 rounded-full border border-[#dbe6de] bg-white flex items-center justify-center text-[#61896b] transition-all hover:bg-primary hover:text-[#111813] hover:border-primary">
                                <i className="bx bxl-linkedin text-xl"></i>
                            </button>
                        </div>
                        <span className="text-sm text-[#61896b] dark:text-[#a0cfa5] mb-4">or use your email for registration</span>

                        <input type="text" placeholder="Full Name" className="form-input w-full rounded-lg border border-[#dbe6de] dark:border-[#3a5840] bg-background-light dark:bg-[#15251a] text-[#111813] dark:text-white px-4 py-3 mb-2 focus:border-primary focus:ring-primary placeholder-[#61896b]/60" />
                        <input type="email" placeholder="Email Address" className="form-input w-full rounded-lg border border-[#dbe6de] dark:border-[#3a5840] bg-background-light dark:bg-[#15251a] text-[#111813] dark:text-white px-4 py-3 mb-2 focus:border-primary focus:ring-primary placeholder-[#61896b]/60" />
                        <input type="password" placeholder="Create Password" className="form-input w-full rounded-lg border border-[#dbe6de] dark:border-[#3a5840] bg-background-light dark:bg-[#15251a] text-[#111813] dark:text-white px-4 py-3 mb-2 focus:border-primary focus:ring-primary placeholder-[#61896b]/60" />

                        <button className="mt-4 bg-primary hover:bg-primary-dark text-[#111813] font-bold py-3 px-12 rounded-lg shadow-md hover:shadow-lg transition-all duration-200 transform active:scale-95 uppercase text-xs tracking-wider">
                            Get Started
                        </button>

                        <button
                            className="mobile-toggle mt-4 text-primary font-bold md:hidden"
                            id="signInMobile"
                            onClick={(e) => { e.preventDefault(); handleSignInClick(); }}
                        >
                            Already have an account? Sign In
                        </button>
                    </form>
                </div>

                {/* Sign In Form */}
                <div className="form-container sign-in-container">
                    <form onSubmit={handleLoginSubmit} className="bg-white dark:bg-[#1a2e1f] flex flex-col items-center justify-center h-full px-12 text-center">
                        <h1 className="text-[#111813] dark:text-white text-2xl font-bold tracking-tight mb-4">Subscriber Login</h1>
                        <div className="flex gap-4 my-4">
                            <button type="button" className="w-10 h-10 rounded-full border border-[#dbe6de] bg-white flex items-center justify-center text-[#61896b] transition-all hover:bg-primary hover:text-[#111813] hover:border-primary">
                                <i className="bx bxl-facebook text-xl"></i>
                            </button>
                            <button type="button" className="w-10 h-10 rounded-full border border-[#dbe6de] bg-white flex items-center justify-center text-[#61896b] transition-all hover:bg-primary hover:text-[#111813] hover:border-primary">
                                <i className="bx bxl-google text-xl"></i>
                            </button>
                            <button type="button" className="w-10 h-10 rounded-full border border-[#dbe6de] bg-white flex items-center justify-center text-[#61896b] transition-all hover:bg-primary hover:text-[#111813] hover:border-primary">
                                <i className="bx bxl-linkedin text-xl"></i>
                            </button>
                        </div>
                        <span className="text-sm text-[#61896b] dark:text-[#a0cfa5] mb-4">or use your account</span>

                        <input
                            type="email"
                            placeholder="Email"
                            className="form-input w-full rounded-lg border border-[#dbe6de] dark:border-[#3a5840] bg-background-light dark:bg-[#15251a] text-[#111813] dark:text-white px-4 py-3 mb-2 focus:border-primary focus:ring-primary placeholder-[#61896b]/60"
                            value={loginEmail}
                            onChange={(e) => setLoginEmail(e.target.value)}
                        />
                        <input
                            type="password"
                            placeholder="Password"
                            className="form-input w-full rounded-lg border border-[#dbe6de] dark:border-[#3a5840] bg-background-light dark:bg-[#15251a] text-[#111813] dark:text-white px-4 py-3 mb-2 focus:border-primary focus:ring-primary placeholder-[#61896b]/60"
                            value={loginPassword}
                            onChange={(e) => setLoginPassword(e.target.value)}
                        />

                        <Link to="/forget-password" className="text-[#61896b] hover:text-primary text-xs font-medium my-2 transition-colors">
                            Forgot your password?
                        </Link>

                        <button type="submit" className="mt-4 bg-primary hover:bg-primary-dark text-[#111813] font-bold py-3 px-12 rounded-lg shadow-md hover:shadow-lg transition-all duration-200 transform active:scale-95 uppercase text-xs tracking-wider">
                            Sign In
                        </button>

                        <button
                            className="mobile-toggle mt-4 text-primary font-bold md:hidden"
                            id="signUpMobile"
                            onClick={(e) => { e.preventDefault(); handleSignUpClick(); }}
                        >
                            Don't have an account? Sign Up
                        </button>
                    </form>
                </div>

                {/* Overlay Container */}
                <div className="overlay-container">
                    <div className="overlay">
                        <div className="overlay-panel overlay-left">
                            <img src="https://cdni.iconscout.com/illustration/premium/thumb/subscription-model-8854930-7212170.png" alt="Manage Subscription" className="w-40 mb-4 brightness-0 invert opacity-90 drop-shadow-md" />
                            <h1 className="text-white text-2xl font-bold mb-2">Welcome Back!</h1>
                            <p className="text-[#e0e7e1] text-sm mb-6">Manage specific subscriptions, invoices, and usage easily.</p>
                            <button className="bg-transparent border-2 border-white text-white font-bold py-3 px-12 rounded-lg transition-all duration-200 hover:bg-white hover:text-[#0ea633] uppercase text-xs tracking-wider" id="signIn" onClick={handleSignInClick}>
                                Sign In
                            </button>
                        </div>
                        <div className="overlay-panel overlay-right">
                            <img src="https://cdni.iconscout.com/illustration/premium/thumb/subscription-model-8854930-7212170.png" alt="New Subscription" className="w-40 mb-4 brightness-0 invert opacity-90 drop-shadow-md" />
                            <h1 className="text-white text-2xl font-bold mb-2">New Here?</h1>
                            <p className="text-[#e0e7e1] text-sm mb-6">Join us and automate your recurring payments.</p>
                            <button className="bg-transparent border-2 border-white text-white font-bold py-3 px-12 rounded-lg transition-all duration-200 hover:bg-white hover:text-[#0ea633] uppercase text-xs tracking-wider" id="signUp" onClick={handleSignUpClick}>
                                Sign Up
                            </button>
                        </div>
                    </div>
                </div>
            </div>
        </div>
    );
};

export default Login;
