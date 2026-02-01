import RoleSidebarLayout from "@/components/modules/dashboard/RoleSidebarLayout";

export default function JournalistLayout({ children }) {
    return <RoleSidebarLayout role="journalist">{children}</RoleSidebarLayout>;
}
