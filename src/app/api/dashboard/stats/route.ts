import { NextResponse } from 'next/server';
import { cookies } from 'next/headers';

export async function GET() {
    const token = (await cookies()).get('token')?.value;
    if (!token) {
        return NextResponse.json({ error: 'Unauthorized' }, { status: 401 });
    }

    const backendUrl = process.env.BACKEND_API_URL;
    const res = await fetch(`${backendUrl}/api/v1/dashboard/stats`, {
        headers: {
            Authorization: `Bearer ${token}`,
        },
    });

    const data = await res.json();
    return NextResponse.json(data, { status: res.status });
}