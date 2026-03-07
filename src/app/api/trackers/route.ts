import { NextRequest, NextResponse } from 'next/server';
import { cookies } from 'next/headers';

export async function GET(request: NextRequest) {
    const token = (await cookies()).get('token')?.value;
    if (!token) {
        return NextResponse.json({ error: 'Unauthorized' }, { status: 401 });
    }

    const backendUrl = process.env.BACKEND_API_URL;
    const url = new URL(request.url);
    const query = url.searchParams.toString();
    const fetchUrl = `${backendUrl}/api/v1/trackers${query ? '?' + query : ''}`;

    const res = await fetch(fetchUrl, {
        headers: {
            Authorization: `Bearer ${token}`,
        },
    });

    const data = await res.json();
    return NextResponse.json(data, { status: res.status });
}