"use client";

import { IoClose } from "react-icons/io5";
import {CgProfile} from "react-icons/cg";
import Link from "next/link";

type Props = {
    open: boolean;
    onClose: () => void;
};


export default function Settings({ open, onClose }: Props) {

    if (!open) return null;

    return (
        <div className="fixed inset-0 z-[1000]">
            <div
                className="absolute inset-0 bg-black/40"
                onClick={onClose}
            />

            <div className="absolute top-20 right-6 w-[420px] rounded-xl bg-[#065F46] p-6 shadow-xl">
                <button
                    onClick={onClose}
                    className="absolute right-3 top-3 text-white"
                >
                    <IoClose size={24} />
                </button>

                <div className="bg-white rounded-xl p-4 flex items-center justify-between mt-4">
                    <Link href="/profile" className="w-full">
                        <div className="flex items-center gap-3">
                            <CgProfile size={44} color="#065F46"/>
                            <p className="font-medium text-gray-900">
                            Мурад Аширов
                        </p>
                        </div>
                    </Link>

                    <span className="text-gray-400">›</span>
                </div>
            </div>
        </div>
    );
}