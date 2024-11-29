import Link from "next/link";

export default async function HomePage() {
  return (
    <div>
      <h1>Welcome to Methods Wiki</h1>
      <p>Explore our collection of scientific methods.</p>
      <Link href="/wiki">Browse Methods</Link>
    </div>
  );
}
