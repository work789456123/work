import Link from "next/link";

export default function NotFound() {
  return (
    <div className="flex flex-col items-center justify-center min-h-[50vh] px-6 py-20 text-center">
      <h1 className="text-3xl font-semibold text-[#333] mb-4">404 — Page not found</h1>
      <p className="text-[#6F6F6F] mb-8">The page you are looking for does not exist or has moved.</p>
      <Link href="/" className="text-[#1F6559] font-medium hover:underline">
        Back to home
      </Link>
    </div>
  );
}
