import { NextRequest, NextResponse } from 'next/server';
import { cookies } from 'next/headers';

export async function POST(request: NextRequest) {
    try {
        const body = await request.json();
        const backendUrl = process.env.BACKEND_API_URL;

        const res = await fetch(`${backendUrl}/api/v1/auth/login`, {
            method: 'POST',
            headers: { 'Content-Type': 'application/json' },
            body: JSON.stringify(body),
        });

        const data = await res.json();

        if (!res.ok) {
            return NextResponse.json({ message: data.message }, { status: res.status });
        }

        const token = data.data?.accessToken || data.accessToken;
        if (!token) {
            return NextResponse.json({ message: 'Токен не получен' }, { status: 500 });
        }

        (await cookies()).set('token', token, {
            httpOnly: true,
            secure: process.env.NODE_ENV === 'production',
            sameSite: 'lax',
            path: '/',
            maxAge: 60 * 60 * 24 * 7,
        });

        return NextResponse.json({ success: true });
    } catch (error) {
        console.error(error);
        return NextResponse.json({ message: 'Ошибка сервера' }, { status: 500 });
    }
}