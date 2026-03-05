"use client";

import Link from "next/link";
import { usePathname } from "next/navigation";
import Image from "next/image";
import { useTranslations } from "next-intl";
import {
    IoCarSportSharp,
    IoSettingsSharp
} from "react-icons/io5";
import {
    MdOutlineGpsFixed,
    MdOutlineMonitorHeart,
    MdSpaceDashboard
} from "react-icons/md";
import { FaEarthAsia } from "react-icons/fa6";
import { TbReportAnalytics } from "react-icons/tb";

export default function Sidebar() {
    const t = useTranslations("Sidebar");
    const pathname = usePathname();

    const locale = pathname.split("/")[1];

    const links = [
        { href: "/dashboard", label: t("dashboard"), icon: MdSpaceDashboard },
        { href: "/monitoring", label: t("monitoring"), icon: MdOutlineMonitorHeart },
        { href: "/tracking", label: t("tracking"), icon: MdOutlineGpsFixed },
        { href: "/geofence", label: t("geofence"), icon: FaEarthAsia },
        { href: "/report", label: t("report"), icon: TbReportAnalytics },
        { href: "/cars", label: t("car-park"), icon: IoCarSportSharp },
        { href: "/settings", label: t("settings"), icon: IoSettingsSharp }
    ];

    const isActive = (href: string) => {
        const fullPath = `/${locale}${href}`;
        return pathname === fullPath || pathname.startsWith(`${fullPath}/`);
    };

    return (
        <aside className="w-64 sidebar-color border-r h-screen shadow-md fixed left-0 top-0">
            <div className="p-4 space-y-4">
                <Link href={`/${locale}/`} className="flex items-center space-x-2">
                    <Image src="/logo.svg" alt="logo" width={50} height={50} />
                    <p className="text-xs text-white">{t("company-name")}</p>
                </Link>

                {links.map(({ href, label, icon: Icon }) => (
                    <Link
                        key={href}
                        href={`/${locale}${href}`}
                        className={`flex items-center p-2 rounded-md text-sm font-medium transition text-white
                        ${isActive(href) ? "sidebar-active" : "hover:bg-[#178868]"}`}
                    >
                        <Icon className="size-5" />
                        <span className="ml-3">{label}</span>
                    </Link>
                ))}
            </div>
        </aside>
    );
}
