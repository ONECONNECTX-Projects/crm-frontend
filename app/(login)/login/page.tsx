import LoginPage from "../login";

export default function Login() {
  return (
    <div className="min-h-screen flex font-sans">
      {/* LEFT SECTION — Branding & Dashboard Preview */}
      <div className="hidden md:flex w-1/2 bg-gradient-to-br from-blue-600 via-blue-500 to-purple-600 text-white flex-col justify-center px-20 relative overflow-hidden">
        {/* Decorative Background Circles */}
        <div className="absolute -bottom-20 -left-20 w-80 h-80 bg-white/10 rounded-full blur-3xl" />
        <div className="absolute -top-20 -right-20 w-80 h-80 bg-blue-400/20 rounded-full blur-3xl" />

        {/* Dashboard "Glass" Card Preview */}
        <div className="relative z-10 mb-12">
          <div className="bg-white/10 backdrop-blur-md border border-white/20 rounded-2xl p-6 shadow-2xl w-full max-w-md">
            <div className="flex justify-between items-center mb-6">
              <span className="font-semibold opacity-90">Invoices</span>
              <div className="flex gap-2 text-[10px]">
                <span className="bg-white/20 px-2 py-1 rounded">Weekly</span>
                <span className="opacity-50">Monthly</span>
                <span className="opacity-50">Yearly</span>
              </div>
            </div>

            {/* Simple Bar Chart Mockup */}
            <div className="flex items-end gap-3 h-32 mb-4">
              {[40, 70, 45, 90, 65, 80, 50].map((height, i) => (
                <div
                  key={i}
                  style={{ height: `${height}%` }}
                  className="flex-1 bg-white/30 rounded-t-sm hover:bg-white/50 transition-all"
                />
              ))}
            </div>
            <div className="flex justify-between text-[10px] opacity-60 uppercase tracking-widest">
              <span>Mon</span>
              <span>Wed</span>
              <span>Fri</span>
              <span>Sun</span>
            </div>

            {/* "Total" Floating Circle Badge */}
            <div className="absolute -top-10 -right-6 bg-white/20 backdrop-blur-lg border border-white/30 p-4 rounded-xl shadow-xl">
              <div className="w-12 h-12 rounded-full border-4 border-white/20 border-t-white flex items-center justify-center text-xs font-bold">
                42%
              </div>
              <p className="text-[10px] mt-1 text-center opacity-80">Total</p>
            </div>
          </div>
        </div>

        {/* Text Content */}
        <div className="relative z-10">
          <h1 className="text-4xl font-bold leading-tight mb-4">
            Effortlessly manage your <br /> customer and operations
          </h1>
          <p className="text-blue-100 text-lg max-w-md leading-relaxed opacity-90">
            Welcome to Quest CRM! Streamline customer relationships, boost
            sales, and drive business growth effortlessly.
          </p>
        </div>
      </div>

      {/* RIGHT SECTION — LOGIN FORM */}
      <div className="w-full min-h-screen md:w-1/2 ">
        <LoginPage />
      </div>
    </div>
  );
}
