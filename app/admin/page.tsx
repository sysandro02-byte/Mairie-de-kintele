import AdminDashboard from "../../components/AdminDashboard";

export const metadata = {
  title: "Backoffice",
  robots: { index: false, follow: false },
};

export default function AdminPage() {
  return <AdminDashboard />;
}
