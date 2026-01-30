import LoginPage from "../login";

export default function Login() {
  return (
    <div className="min-h-screen flex">
      {/* LEFT SECTION — Background + Info */}
      <div className="hidden md:flex w-1/2 bg-gradient-to-br from-brand-400 to-brand-600 text-white flex-col justify-center px-16 relative">

            <div className="bg-gray-300 items-center justify-center rounded-lg ">
       
      </div>
      </div>

      {/* RIGHT SECTION — LOGIN FORM */}
      <div className="w-full min-h-screen md:w-1/2 ">
       <LoginPage/>
      </div>
    </div>
  );
}