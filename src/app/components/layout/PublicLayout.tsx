import { Outlet, ScrollRestoration } from "react-router";
import Navbar from "./Navbar";
import Footer from "./Footer";

export default function PublicLayout() {
  return (
    <div className="min-h-screen flex flex-col" style={{ backgroundColor: "#F8F7F4" }}>
      <ScrollRestoration />
      <Navbar />
      <main className="flex-1">
        <Outlet />
      </main>
      <Footer />
    </div>
  );
}
