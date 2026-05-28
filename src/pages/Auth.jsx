import React from "react";
import { useUserStore } from "../store/user";
import { useNavigate } from "react-router-dom";

export default function Auth() {
  const login    = useUserStore((s) => s.login);
  const register = useUserStore((s) => s.register);
  const user     = useUserStore((s) => s.user);
  const navigate = useNavigate();

  const [mode,            setMode]            = React.useState("login");
  const [email,           setEmail]           = React.useState("");
  const [name,            setName]            = React.useState("");
  const [password,        setPassword]        = React.useState("");
  const [confirmPassword, setConfirmPassword] = React.useState("");
  const [error,           setError]           = React.useState("");
  const [success,         setSuccess]         = React.useState("");
  const [loading,         setLoading]         = React.useState(false);
  const [showPassword,    setShowPassword]    = React.useState(false);
  const [showConfirm,     setShowConfirm]     = React.useState(false);

  React.useEffect(() => {
    if (user) {
      const isAdmin = user.role === "admin" || user.email === "admin@nova.com";
      navigate(isAdmin ? "/admin" : "/profile", { replace: true });
    }
  }, [user, navigate]);

  const onSubmit = async (e) => {
    e.preventDefault();
    setError("");
    setSuccess("");
    setLoading(true);
    try {
      if (mode === "login") {
        await login(email, password);
      } else {
        if (password !== confirmPassword) {
          setError("Passwords do not match.");
          setLoading(false);
          return;
        }
        await register(name || email.split("@")[0], email, password);
      }
    } catch (err) {
      setError(err.message);
    } finally {
      setLoading(false);
    }
  };

  return (
    <div className="min-h-[calc(100vh-80px)] bg-white text-black flex items-center justify-center px-5 py-12 relative overflow-hidden">
      <div className="absolute inset-0 grid-lines-bg opacity-[0.15] pointer-events-none" />

      <div className="w-full max-w-4xl bg-white border border-black grid md:grid-cols-[1.2fr,1fr] relative z-10 shadow-[8px_8px_0px_0px_rgba(0,0,0,1)]">

        {/* Left — form */}
        <div className="p-8 md:p-12 flex flex-col justify-between border-b md:border-b-0 md:border-r border-black">
          <div>
            <div className="flex items-center gap-2 mb-8">
              <span className="w-2 h-2 bg-black rotate-45 block" />
              <span className="font-mono text-[10px] uppercase tracking-[0.25em] text-black/50 font-bold">
                NOVA — Member Access
              </span>
            </div>

            <h2 className="font-display text-5xl tracking-tighter uppercase mb-2">
              {mode === "login" ? "Sign In" : "Register"}
            </h2>
            <p className="text-xs font-mono text-black/40 uppercase tracking-wider mb-8">
              {mode === "login" ? "Welcome back" : "Create your account"}
            </p>

            {error && (
              <div className="p-3 bg-red-50 border-l-2 border-red-600 text-red-700 font-mono text-[11px] mb-6 uppercase tracking-wide">
                ⚠️ {error}
              </div>
            )}
            {success && (
              <div className="p-3 bg-black text-white font-mono text-[11px] mb-6 uppercase tracking-widest animate-pulse">
                ✓ {success}
              </div>
            )}

            <form onSubmit={onSubmit} className="space-y-5">
              {mode === "register" && (
                <div className="space-y-1.5">
                  <label className="font-mono text-[10px] uppercase tracking-widest text-black/50 font-bold block">Full Name</label>
                  <input
                    className="w-full bg-white border border-black/20 focus:border-black p-3 font-sans text-sm rounded-none outline-none transition-colors"
                    placeholder="e.g. Alex"
                    type="text"
                    value={name}
                    onChange={(e) => setName(e.target.value)}
                  />
                </div>
              )}

              <div className="space-y-1.5">
                <label className="font-mono text-[10px] uppercase tracking-widest text-black/50 font-bold block">Email</label>
                <input
                  className="w-full bg-white border border-black/20 focus:border-black p-3 font-mono text-xs rounded-none outline-none transition-colors"
                  placeholder="name@domain.com"
                  type="email"
                  value={email}
                  onChange={(e) => setEmail(e.target.value)}
                  required
                />
              </div>

              <div className="space-y-1.5">
                <label className="font-mono text-[10px] uppercase tracking-widest text-black/50 font-bold block">Password</label>
                <div className="relative">
                  <input
                    className="w-full bg-white border border-black/20 focus:border-black p-3 pr-10 font-mono text-xs rounded-none outline-none transition-colors"
                    placeholder="••••••••"
                    type={showPassword ? "text" : "password"}
                    value={password}
                    onChange={(e) => setPassword(e.target.value)}
                    required
                  />
                  <button type="button" onClick={() => setShowPassword(!showPassword)}
                    className="absolute right-3 top-1/2 -translate-y-1/2 text-black/30 hover:text-black transition-colors">
                    {showPassword
                      ? <svg width="15" height="15" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2"><path d="M17.94 17.94A10.07 10.07 0 0 1 12 20c-7 0-11-8-11-8a18.45 18.45 0 0 1 5.06-5.94M9.9 4.24A9.12 9.12 0 0 1 12 4c7 0 11 8 11 8a18.5 18.5 0 0 1-2.16 3.19m-6.72-1.07a3 3 0 1 1-4.24-4.24"/><line x1="1" y1="1" x2="23" y2="23"/></svg>
                      : <svg width="15" height="15" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2"><path d="M1 12s4-8 11-8 11 8 11 8-4 8-11 8-11-8-11-8z"/><circle cx="12" cy="12" r="3"/></svg>
                    }
                  </button>
                </div>
              </div>

              {mode === "register" && (
                <div className="space-y-1.5">
                  <label className="font-mono text-[10px] uppercase tracking-widest text-black/50 font-bold block">Confirm Password</label>
                  <div className="relative">
                    <input
                      className="w-full bg-white border border-black/20 focus:border-black p-3 pr-10 font-mono text-xs rounded-none outline-none transition-colors"
                      placeholder="••••••••"
                      type={showConfirm ? "text" : "password"}
                      value={confirmPassword}
                      onChange={(e) => setConfirmPassword(e.target.value)}
                      required
                    />
                    <button type="button" onClick={() => setShowConfirm(!showConfirm)}
                      className="absolute right-3 top-1/2 -translate-y-1/2 text-black/30 hover:text-black transition-colors">
                      {showConfirm
                        ? <svg width="15" height="15" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2"><path d="M17.94 17.94A10.07 10.07 0 0 1 12 20c-7 0-11-8-11-8a18.45 18.45 0 0 1 5.06-5.94M9.9 4.24A9.12 9.12 0 0 1 12 4c7 0 11 8 11 8a18.5 18.5 0 0 1-2.16 3.19m-6.72-1.07a3 3 0 1 1-4.24-4.24"/><line x1="1" y1="1" x2="23" y2="23"/></svg>
                        : <svg width="15" height="15" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2"><path d="M1 12s4-8 11-8 11 8 11 8-4 8-11 8-11-8-11-8z"/><circle cx="12" cy="12" r="3"/></svg>
                      }
                    </button>
                  </div>
                </div>
              )}

              <button
                type="submit"
                disabled={loading}
                className="w-full bg-black text-white py-4 text-xs font-mono uppercase tracking-widest font-bold border border-black transition-all hover:bg-white hover:text-black disabled:opacity-40"
              >
                {loading ? "Please wait..." : mode === "login" ? "Sign In →" : "Create Account →"}
              </button>
            </form>
          </div>

          <div className="mt-8 pt-6 border-t border-black/10 flex items-center justify-between">
            <span className="text-[11px] font-sans text-black/40">
              {mode === "login" ? "Don't have an account?" : "Already have an account?"}
            </span>
            <button
              onClick={() => { setMode(mode === "login" ? "register" : "login"); setError(""); setSuccess(""); }}
              className="text-xs font-mono font-bold uppercase tracking-wider underline underline-offset-4 hover:text-black/60"
            >
              {mode === "login" ? "Create Account" : "Sign In"}
            </button>
          </div>
        </div>

        {/* Right — branding */}
        <div className="p-8 md:p-12 bg-black flex flex-col justify-between">
          <div className="space-y-8">
            <div>
              <div className="font-display text-5xl text-white tracking-tighter uppercase leading-none">NOVA</div>
              <div className="font-mono text-[10px] text-white/30 uppercase tracking-widest mt-1">KH × VN Streetwear</div>
            </div>
            <div className="space-y-4">
              {["Free shipping over $50", "Bakong KHQR payment", "Track your orders", "Exclusive drops"].map((item) => (
                <div key={item} className="flex items-center gap-3">
                  <span className="w-1 h-1 bg-white/40 rounded-full flex-shrink-0" />
                  <span className="font-mono text-xs text-white/50 uppercase tracking-wider">{item}</span>
                </div>
              ))}
            </div>
          </div>
          <div className="border-t border-white/10 pt-6">
            <div className="font-mono text-[9px] text-white/20 uppercase tracking-widest">🔒 Secured by Firebase Auth</div>
          </div>
        </div>

      </div>
    </div>
  );
}
