import React from "react";
import { useUserStore } from "../store/user";
import { useNavigate, useLocation, Link } from "react-router-dom";

export default function Auth() {
  const login = useUserStore((s) => s.login);
  const register = useUserStore((s) => s.register);
  const user = useUserStore((s) => s.user);
  const navigate = useNavigate();
  const location = useLocation();

  const isAdminMode = new URLSearchParams(location.search).get("admin") === "1";

  const [mode, setMode] = React.useState("login");
  const [email, setEmail] = React.useState(isAdminMode ? "admin@nova.com" : "");
  const [name, setName] = React.useState("");
  const [password, setPassword] = React.useState(isAdminMode ? "" : "");
  const [confirmPassword, setConfirmPassword] = React.useState("");
  const [error, setError] = React.useState("");
  const [success, setSuccess] = React.useState("");
  const [loading, setLoading] = React.useState(false);

  React.useEffect(() => {
    if (isAdminMode) {
      setMode("login");
      setEmail("admin@nova.com");
      setPassword("");
      setConfirmPassword("");
      setError("");
      setSuccess("");
    } else {
      setEmail("");
      setPassword("");
      setConfirmPassword("");
      setError("");
      setSuccess("");
    }
  }, [isAdminMode]);

  React.useEffect(() => {
    if (user) {
      if (user.email === "admin@nova.com") navigate("/admin");
      else navigate("/profile");
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
        if (isAdminMode) {
          setSuccess("Admin access granted. Redirecting to dashboard...");
          setTimeout(() => navigate("/admin"), 800);
        } else {
          setSuccess("Authentication successful. Loading index node...");
          setTimeout(() => navigate("/profile"), 800);
        }
      } else {
        if (password !== confirmPassword) {
          setError("Passwords do not match.");
          setLoading(false);
          return;
        }
        await register(name || email.split("@")[0], email, password);
        setSuccess("Identity profile configured. Welcome to NOVA ✦");
        setTimeout(() => navigate("/profile"), 800);
      }
    } catch (err) {
      setError(err.message);
    } finally {
      setLoading(false);
    }
  };

  /* ── Admin Login Mode ── */
  if (isAdminMode) {
    return (
      <div className="min-h-[calc(100vh-80px)] bg-[#080808] text-white flex items-center justify-center px-5 py-12 relative overflow-hidden">
        {/* Subtle grid bg */}
        <div className="absolute inset-0 pointer-events-none" style={{
          backgroundImage: "linear-gradient(rgba(212,175,55,0.04) 1px, transparent 1px), linear-gradient(90deg, rgba(212,175,55,0.04) 1px, transparent 1px)",
          backgroundSize: "40px 40px"
        }} />
        {/* Top accent beam */}
        <div className="absolute top-0 left-0 right-0 h-[2px] bg-gradient-to-r from-transparent via-[#d4af37] to-transparent" />

        <div className="w-full max-w-md relative z-10">
          {/* Back to store */}
          <Link
            to="/"
            className="inline-flex items-center gap-1.5 text-white/30 hover:text-white/70 font-mono text-[10px] uppercase tracking-widest mb-8 transition-colors"
          >
            ← Back to store
          </Link>

          {/* Logo area */}
          <div className="mb-8">
            <div className="flex items-center gap-3 mb-1">
              <div className="w-8 h-8 rounded-lg bg-[#d4af37] flex items-center justify-center flex-shrink-0">
                <svg width="14" height="14" viewBox="0 0 24 24" fill="none" stroke="#000" strokeWidth="2.5">
                  <rect x="3" y="11" width="18" height="11" rx="2" /><path d="M7 11V7a5 5 0 0 1 10 0v4" />
                </svg>
              </div>
              <div>
                <div className="font-display text-2xl tracking-wider text-white leading-none">NOVA</div>
                <div className="font-mono text-[9px] text-white/30 uppercase tracking-[0.2em]">Admin Console</div>
              </div>
            </div>
          </div>

          {/* Card */}
          <div className="bg-white/[0.04] border border-white/10 rounded-2xl p-8 backdrop-blur-sm">
            <div className="mb-6">
              <h2 className="font-display text-3xl tracking-wide text-white mb-1">Admin Sign In</h2>
              <p className="font-mono text-[11px] text-white/35 uppercase tracking-wider">Restricted access — authorized personnel only</p>
            </div>

            {error && (
              <div className="p-3 bg-red-900/30 border border-red-500/30 text-red-400 font-mono text-[11px] mb-5 rounded-lg uppercase tracking-wide flex items-center gap-2">
                <span className="text-red-400">⚠</span> {error}
              </div>
            )}
            {success && (
              <div className="p-3 bg-[#d4af37]/10 border border-[#d4af37]/30 text-[#d4af37] font-mono text-[11px] mb-5 rounded-lg uppercase tracking-widest flex items-center gap-2 animate-pulse">
                <span>✓</span> {success}
              </div>
            )}

            <form onSubmit={onSubmit} className="space-y-4">
              <div className="space-y-1.5">
                <label className="font-mono text-[10px] uppercase tracking-widest text-white/40 font-bold block">
                  Admin Email
                </label>
                <input
                  className="w-full bg-white/[0.06] border border-white/10 focus:border-[#d4af37]/60 p-3 font-mono text-sm rounded-xl outline-none transition-colors text-white placeholder-white/20"
                  placeholder="admin@nova.com"
                  type="email"
                  value={email}
                  onChange={(e) => setEmail(e.target.value)}
                  required
                />
              </div>

              <div className="space-y-1.5">
                <label className="font-mono text-[10px] uppercase tracking-widest text-white/40 font-bold block">
                  Password
                </label>
                <input
                  className="w-full bg-white/[0.06] border border-white/10 focus:border-[#d4af37]/60 p-3 font-mono text-sm rounded-xl outline-none transition-colors text-white placeholder-white/20"
                  placeholder="••••••••"
                  type="password"
                  value={password}
                  onChange={(e) => setPassword(e.target.value)}
                  required
                />
              </div>

              <button
                type="submit"
                disabled={loading}
                className="w-full bg-[#d4af37] text-black py-3.5 text-xs font-mono uppercase tracking-widest font-bold rounded-xl transition-all hover:bg-[#e8c84a] disabled:opacity-40 mt-2"
              >
                {loading ? "VERIFYING ACCESS..." : "ACCESS ADMIN PANEL →"}
              </button>
            </form>

            {/* Quick fill hint */}
            <div className="mt-6 pt-5 border-t border-white/[0.07]">
              <div className="font-mono text-[9px] uppercase tracking-widest text-white/20 mb-2">Demo credentials</div>
              <button
                onClick={() => { setEmail("admin@nova.com"); setPassword("password"); }}
                className="w-full text-left bg-white/[0.03] border border-white/[0.07] rounded-xl p-3 hover:bg-white/[0.07] transition-colors group"
              >
                <div className="font-mono text-[10px] text-[#d4af37]/70 group-hover:text-[#d4af37] transition-colors">admin@nova.com / password</div>
                <div className="font-mono text-[9px] text-white/20 mt-0.5">Click to autofill →</div>
              </button>
            </div>
          </div>

          {/* Switch to regular login */}
          <div className="mt-5 text-center">
            <Link
              to="/auth"
              className="font-mono text-[10px] text-white/25 hover:text-white/50 uppercase tracking-wider transition-colors"
            >
              Regular user login →
            </Link>
          </div>
        </div>
      </div>
    );
  }

  /* ── Regular Login Mode ── */
  return (
    <div className="min-h-[calc(100vh-80px)] bg-white text-black flex items-center justify-center px-5 py-12 relative overflow-hidden">
      {/* Background Graphic Framework */}
      <div className="absolute inset-0 grid-lines-bg opacity-[0.15] pointer-events-none" />

      <div className="w-full max-w-4xl bg-white border border-black grid md:grid-cols-[1.2fr,1fr] relative z-10 shadow-[8px_8px_0px_0px_rgba(0,0,0,1)]">

        {/* Left Side: Dynamic Core Interface */}
        <div className="p-8 md:p-12 flex flex-col justify-between border-b md:border-b-0 md:border-r border-black">
          <div>
            {/* Header Identity */}
            <div className="flex items-center gap-2 mb-8">
              <span className="w-2 h-2 bg-black rotate-45 block" />
              <span className="font-mono text-[10px] uppercase tracking-[0.25em] text-black/50 font-bold">
                CORE GATEWAY // [02]
              </span>
            </div>

            <h2 className="font-display text-5xl tracking-tighter uppercase mb-2">
              {mode === "login" ? "Sign In" : "Register"}
            </h2>
            <p className="text-xs font-mono text-black/40 uppercase tracking-wider mb-8">
              {mode === "login" ? "Access established user arrays" : "Initialize new system identity parameters"}
            </p>

            {/* Notification Slates */}
            {error && (
              <div className="p-3 bg-red-50 border-l-2 border-red-600 text-red-700 font-mono text-[11px] mb-6 uppercase tracking-wide">
                ⚠️ Error: {error}
              </div>
            )}
            {success && (
              <div className="p-3 bg-black text-white border-l-2 border-white font-mono text-[11px] mb-6 uppercase tracking-widest animate-pulse">
                ✓ {success}
              </div>
            )}

            {/* Form Fields Matrix */}
            <form onSubmit={onSubmit} className="space-y-5">
              {mode === "register" && (
                <div className="space-y-1.5">
                  <label className="font-mono text-[10px] uppercase tracking-widest text-black/50 font-bold block">
                    Public Handle Name
                  </label>
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
                <label className="font-mono text-[10px] uppercase tracking-widest text-black/50 font-bold block">
                  Electronic Mail Node
                </label>
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
                <label className="font-mono text-[10px] uppercase tracking-widest text-black/50 font-bold block">
                  Secure Security Pass
                </label>
                <input
                  className="w-full bg-white border border-black/20 focus:border-black p-3 font-mono text-xs rounded-none outline-none transition-colors"
                  placeholder="••••••••"
                  type="password"
                  value={password}
                  onChange={(e) => setPassword(e.target.value)}
                  required
                />
              </div>

              {mode === "register" && (
                <div className="space-y-1.5">
                  <label className="font-mono text-[10px] uppercase tracking-widest text-black/50 font-bold block">
                    Confirm Password
                  </label>
                  <input
                    className="w-full bg-white border border-black/20 focus:border-black p-3 font-mono text-xs rounded-none outline-none transition-colors"
                    placeholder="••••••••"
                    type="password"
                    value={confirmPassword}
                    onChange={(e) => setConfirmPassword(e.target.value)}
                    required={mode === "register"}
                  />
                </div>
              )}

              <button
                type="submit"
                disabled={loading}
                className="w-full bg-black text-white py-4 text-xs font-mono uppercase tracking-widest font-bold border border-black transition-all hover:bg-white hover:text-black disabled:opacity-40"
              >
                {loading ? "PROCESSING MATRIX..." : mode === "login" ? "INITIALIZE SESSION →" : "EXECUTE SIGN-UP →"}
              </button>
            </form>
          </div>

          {/* Toggle Controls */}
          <div className="mt-8 pt-6 border-t border-black/10 flex items-center justify-between">
            <span className="text-[11px] font-sans text-black/40">
              {mode === "login" ? "New client connection?" : "Existing operative profile?"}
            </span>
            <button
              onClick={() => { setMode(mode === "login" ? "register" : "login"); setError(""); setSuccess(""); }}
              className="text-xs font-mono font-bold uppercase tracking-wider underline underline-offset-4 hover:text-black/60"
            >
              {mode === "login" ? "Create Account" : "Access Login"}
            </button>
          </div>
        </div>

        {/* Right Side: Brutalist Sandbox Info Panel */}
        <div className="p-8 md:p-12 bg-black/[0.02] flex flex-col justify-between">
          <div className="space-y-6">
            <div>
              <div className="font-mono text-[9px] uppercase tracking-widest text-black/40 mb-1 font-bold">
                // SYSTEM VERIFICATION
              </div>
              <div className="text-[11px] font-mono text-black/60 uppercase tracking-wide leading-relaxed">
                NOVA interfaces are configured with secure identity tokens. Select an entry vector to check runtime behavior instantly.
              </div>
            </div>

            <div className="border-t border-black/10 pt-6">
              <span className="font-mono text-[10px] uppercase tracking-wider text-black/40 font-bold block mb-3">
                INTEGRATED DEMO ENGINES:
              </span>
              <div className="grid gap-2">
                <button
                  onClick={() => { setEmail("admin@nova.com"); setPassword("password"); setMode("login"); }}
                  className="w-full border border-black bg-white text-black p-3 font-mono text-xs text-left flex justify-between items-center hover:bg-black hover:text-white transition-all shadow-[2px_2px_0px_0px_rgba(0,0,0,1)] hover:shadow-none"
                >
                  <span>[01] ADMIN DEV MATRIX</span>
                  <span>→</span>
                </button>
                <button
                  onClick={() => { setEmail("user@nova.com"); setPassword("password"); setMode("login"); }}
                  className="w-full border border-black bg-white text-black p-3 font-mono text-xs text-left flex justify-between items-center hover:bg-black hover:text-white transition-all shadow-[2px_2px_0px_0px_rgba(0,0,0,1)] hover:shadow-none"
                >
                  <span>[02] PUBLIC CLIENT NODE</span>
                  <span>→</span>
                </button>
              </div>
            </div>

            {/* Admin Login CTA */}
            <div className="border-t border-black/10 pt-6">
              <div className="font-mono text-[9px] uppercase tracking-widest text-black/30 mb-3">Admin Access</div>
              <Link
                to="/auth?admin=1"
                className="flex items-center justify-between w-full bg-black text-white p-3 font-mono text-xs hover:bg-black/80 transition-colors group"
              >
                <span className="flex items-center gap-2">
                  <svg width="11" height="11" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2">
                    <rect x="3" y="11" width="18" height="11" rx="2"/><path d="M7 11V7a5 5 0 0 1 10 0v4"/>
                  </svg>
                  ADMIN PANEL LOGIN
                </span>
                <span className="text-white/40 group-hover:text-white transition-colors">→</span>
              </Link>
            </div>
          </div>

          <div className="pt-8 border-t border-black/5 space-y-2">
            <div className="flex items-center gap-2 text-black/40 font-mono text-[9px] uppercase tracking-widest">
              <span>🔒 ENCRYPTION SECURE STATUS</span>
            </div>
            <div className="text-[9px] font-mono text-black/30 tracking-tight leading-none uppercase">
              CREDENTIAL_REF // ADMIN: admin@nova.com · PASS: password
            </div>
          </div>
        </div>

      </div>
    </div>
  );
}