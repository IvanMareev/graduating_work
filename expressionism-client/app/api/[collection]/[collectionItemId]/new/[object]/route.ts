export async function POST(
    request: Request,
    { params }: { params: { collection: string; collectionItemId: number; object: string } },
) {
    const requestData = await request.json();

    const res = await fetch(`http://127.0.0.1:5000/${params.collection}/${params.collectionItemId}/new/${params.object}`, {
        method: "POST",
        headers: {
            "Content-Type": "application/json",
        },
        body: JSON.stringify(requestData),
    });

    const data = await res.json();

    return Response.json(data);
}
