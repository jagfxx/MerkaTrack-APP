import logoWhite from "./mercatrack-white.svg";
import logoFull from "./mercatrack-color.svg";

export function Welcome() {
  return (
    <div className="flex flex-col bg-white w-100">
      <nav className="flex justify-center align-center bg-gray-50 p-4">
        <img className="w-32" src={logoFull} alt="MerkaTrack" />
      </nav>
    </div>
  );
}

