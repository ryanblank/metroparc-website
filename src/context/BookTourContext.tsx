"use client";

import { createContext, useContext } from "react";

interface BookTourContextType {
  openBookTour: () => void;
}

export const BookTourContext = createContext<BookTourContextType>({
  openBookTour: () => {},
});

export function useBookTour() {
  return useContext(BookTourContext);
}
