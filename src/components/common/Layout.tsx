import React from "react";
import Header from "./Header";
import Footer from "./Footer";

export interface LayoutProps {
  children?: React.ReactNode;
}

const Layout: React.FC<LayoutProps> = ({ children }) => {
  return (
    <>
      <Header />
      <div style={{ marginBottom: "40px" }}>{children}</div>
      <Footer />
    </>
  );
};

export default Layout;
