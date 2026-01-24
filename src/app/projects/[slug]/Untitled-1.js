import { useState, useEffect } from "react";
import Link from "next/link";
import { usePathname } from "next/navigation";

const Navbar = ({ navLinks }) => {
  const pathname = usePathname();
  const [toolsError, setToolsError] = useState(null);
  const [toolsUnlocked, setToolsUnlocked] = useState(false);

  useEffect(() => {
    setToolsUnlocked(typeof window !== "undefined" && localStorage.getItem("tools_unlocked") === "1");
  }, []);

  const handleUnlockTools = async () => {
    const password = prompt("Enter password to unlock Tools:");
    if (password && password.trim().toLowerCase() === "omarahmed") {
      localStorage.setItem("tools_unlocked", "1");
      setToolsUnlocked(true);
      setToolsError(null);
    } else {
      setToolsError("Incorrect password.");
      setTimeout(() => setToolsError(null), 2000);
    }
  };

  return (
    <nav>
      <button
        onClick={handleUnlockTools}
        className="ml-2 p-2 rounded-md text-gray-700 dark:text-gray-300 hover:bg-gray-100 dark:hover:bg-gray-800 transition-colors"
        aria-label="Unlock Tools"
      >
        🔓 Unlock Tools
      </button>
      {toolsError && (
        <span className="ml-2 text-xs text-red-600">{toolsError}</span>
      )}
      {navLinks
        .filter((link) => link.href !== "/tools" || toolsUnlocked)
        .map((link) => (
          <Link
            key={link.href}
            href={link.href}
            className={`px-3 py-2 rounded-md text-sm font-medium transition-colors ${
              pathname === link.href
                ? "bg-blue-100 dark:bg-blue-900/50 text-blue-700 dark:text-blue-300"
                : "text-gray-700 dark:text-gray-300 hover:bg-gray-100 dark:hover:bg-gray-800"
            }`}
          >
            {link.label}
          </Link>
        ))}
    </nav>
  );
};

export default Navbar;