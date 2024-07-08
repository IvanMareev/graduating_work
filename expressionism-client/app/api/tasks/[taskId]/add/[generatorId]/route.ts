export async function POST(
    request: Request,
    { params }: { params: { taskId: number; generatorId: number;} },
) {
    const requestData = await request.json();

    const res = await fetch(`http://127.0.0.1:5000/tasks/${params.taskId}/add/${params.generatorId}`, {
        method: "POST",
        headers: {
            "Content-Type": "application/json",
        },
        body: JSON.stringify(requestData),
    });

    const data = await res.json();

    return Response.json(data);
}
