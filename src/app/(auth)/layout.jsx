import Footer from "../footer/page";

export default function AuthLayout({
  children,
}) {
  return (
    <>
      <main className="min-h-dvh">{children}</main>
      <Footer/>
    </>
  );
}