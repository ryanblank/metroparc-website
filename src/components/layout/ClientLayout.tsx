"use client";

import { useState } from "react";
import Navbar from "./Navbar";
import AnnouncementBar from "./AnnouncementBar";
import Footer from "./Footer";
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
      <AnnouncementBar />
      <Navbar onBookTourClick={openBookTour} />
      <main className="flex-1">{children}</main>
      <Footer />
      <BookTourModal isOpen={isBookTourOpen} onClose={closeBookTour} />
    </BookTourContext.Provider>
  );
}
