import { Suspense } from "react";
import LoginPage from "../login";

export default function Login() {
  return (
    <div
      className="min-h-screen font-sans bg-cover bg-center bg-no-repeat"
      style={{ backgroundImage: "url('/login-bg.png')" }}
    >
      {/* blue wash over the background */}
      <div className="min-h-screen bg-blue-600/25">
        <Suspense fallback={<div className="p-8">Loading...</div>}>
          <LoginPage />
        </Suspense>
      </div>
    </div>
  );
}
