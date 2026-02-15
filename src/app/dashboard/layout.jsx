
// export default function DashboardRootLayout({ children }) {
//   return <DashboardLayout>{children}</DashboardLayout>
// }


export default function DashboardRootLayout({ children }) {
  return (
    <div className="min-h-screen bg-black">
      {children}
    </div>
  );
}
