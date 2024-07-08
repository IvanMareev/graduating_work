export async function PATCH(request: Request, { params }: { params: { id: string, object: string } }) {
    const requestData = await request.json();
    
    const res = await fetch(`http://127.0.0.1:5000/edit/${params.object}/${params.id}`, {
        method: "PATCH",
        headers: {
            "Content-Type": "application/json",
        },
        body: JSON.stringify(requestData),
    });

    const responseData = await res.json();

    return Response.json(responseData);
}
