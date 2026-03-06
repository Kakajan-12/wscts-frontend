import { NextRequest, NextResponse } from 'next/server';
import { cookies } from 'next/headers';

export async function DELETE(
    request: NextRequest,
    { params }: { params: Promise<{ id: string }> }
) {
    const token = (await cookies()).get('token')?.value;
    if (!token) {
        return NextResponse.json({ error: 'Unauthorized' }, { status: 401 });
    }

    const { id } = await params;
    const backendUrl = process.env.BACKEND_API_URL;

    const res = await fetch(`${backendUrl}/api/v1/vehicles/${id}`, {
        method: 'DELETE',
        headers: {
            Authorization: `Bearer ${token}`,
        },
    });

    const data = await res.json();
    return NextResponse.json(data, { status: res.status });
}