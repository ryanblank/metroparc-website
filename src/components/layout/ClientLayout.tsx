"use client";

import { useState } from "react";
import Navbar from "./Navbar";
import Footer from "./Footer";
import FixedCTA from "./FixedCTA";
import BookTourModal from "./BookTourModal";
import { BookTourContext } from "@/context/BookTourContext";

export default function ClientLayout({
  children,
}: {
  children: React.ReactNode;
}) {
  const [isBookTourOpen, setIsBookTourOpen] = useState(false);

  const openBookTour = () => setIsBookTourOpen(true);
  const closeBookTour = () => setIsBookTourOpen(false);

  return (
    <BookTourContext.Provider value={{ openBookTour }}>
      <Navbar onBookTourClick={openBookTour} />
      <main className="flex-1">{children}</main>
      <Footer />
      <FixedCTA onBookTourClick={openBookTour} />
      <BookTourModal isOpen={isBookTourOpen} onClose={closeBookTour} />
    </BookTourContext.Provider>
  );
}
