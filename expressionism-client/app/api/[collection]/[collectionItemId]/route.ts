export async function GET(
    request: Request,
    { params }: { params: { collection: string; collectionItemId: number } },
) {
    const res = await fetch(
        `http://127.0.0.1:5000/${params.collection}/${params.collectionItemId}`,
        {
            method: "GET",
            headers: {
                "Content-Type": "application/json",
            },
            cache: "no-store",
        },
    );

    const data = await res.json();

    return Response.json(data);
}
