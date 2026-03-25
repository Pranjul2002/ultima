"use client";

import { usePathname } from "next/navigation";
import Header from "./header/header";
import Footer from "./footer/footer";

export default function ClientLayout({ children }) {

  const pathname = usePathname();
  const isTestPage = pathname.startsWith("/test");

  return (
    <>
      {!isTestPage && <Header />}

      {children}

      {!isTestPage && <Footer />}
    </>
  );
}