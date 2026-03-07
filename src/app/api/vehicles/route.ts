// src/app/api/vehicles/route.ts
import { NextRequest, NextResponse } from 'next/server';
import { cookies } from 'next/headers';

// GET - получение списка машин
export async function GET() {
    const token = (await cookies()).get('token')?.value;
    if (!token) {
        return NextResponse.json({ error: 'Unauthorized' }, { status: 401 });
    }

    const backendUrl = process.env.BACKEND_API_URL;
    const res = await fetch(`${backendUrl}/api/v1/vehicles`, {
        headers: {
            Authorization: `Bearer ${token}`,
        },
    });

    const data = await res.json();
    return NextResponse.json(data, { status: res.status });
}

// POST - создание новой машины (уже есть)
export async function POST(request: NextRequest) {
    const token = (await cookies()).get('token')?.value;
    if (!token) {
        return NextResponse.json({ error: 'Unauthorized' }, { status: 401 });
    }

    const body = await request.json();
    const backendUrl = process.env.BACKEND_API_URL;

    const res = await fetch(`${backendUrl}/api/v1/vehicles`, {
        method: 'POST',
        headers: {
            'Content-Type': 'application/json',
            Authorization: `Bearer ${token}`,
        },
        body: JSON.stringify(body),
    });

    const data = await res.json();
    return NextResponse.json(data, { status: res.status });
}