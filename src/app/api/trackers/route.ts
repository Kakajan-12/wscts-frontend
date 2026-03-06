import { NextRequest, NextResponse } from 'next/server';
import { cookies } from 'next/headers';

export async function GET(request: NextRequest) {
    const token = (await cookies()).get('token')?.value;
    if (!token) {
        return NextResponse.json({ error: 'Unauthorized' }, { status: 401 });
    }

    const searchParams = request.nextUrl.searchParams;
    const registered = searchParams.get('registered'); // может быть 'false' или 'true'

    const backendUrl = process.env.BACKEND_API_URL;
    let url = `${backendUrl}/api/v1/trackers`;
    if (registered !== null) {
        url += `?registered=${registered}`;
    }

    const res = await fetch(url, {
        headers: {
            Authorization: `Bearer ${token}`,
        },
    });

    const data = await res.json();
    return NextResponse.json(data, { status: res.status });
}