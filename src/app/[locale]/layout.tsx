import { ReactNode } from "react";
import { NextIntlClientProvider } from "next-intl";
import { getMessages, setRequestLocale } from "next-intl/server";
import { routing, type Locale } from "@/i18n/routing";
import Sidebar from "@/components/Sidebar";
import Panel from "@/components/Panel/Panel";
import { notFound } from "next/navigation";

type Props = {
    children: ReactNode;
    params: Promise<{ locale: string }>;
};

export function generateStaticParams() {
    return routing.locales.map((locale) => ({ locale }));
}

export default async function LocaleLayout({ children, params }: Props) {
    const resolvedParams = await params;
    const paramLocale = resolvedParams.locale;

    if (!routing.locales.includes(paramLocale as Locale)) {
        notFound();
    }

    const locale = paramLocale as Locale;
    setRequestLocale(locale);

    const messages = await getMessages({ locale });

    return (
        <NextIntlClientProvider locale={locale} messages={messages}>
                <div className="flex h-screen overflow-hidden">
                    <Sidebar />
                    <div className="flex-1 ml-64 flex flex-col">
                        <Panel />
                        <main
                            className="bg-gray-50 overflow-auto p-6"
                            style={{ height: 'calc(100vh - 64px)' }}
                        >
                            {children}
                        </main>
                    </div>
                </div>
        </NextIntlClientProvider>
    );
}