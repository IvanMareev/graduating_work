export async function DELETE(request: Request, { params }: { params: { object: string, id: string } }) {
    const res = await fetch(`http://127.0.0.1:5000/delete/${params.object}/${params.id}`, {
        method: "DELETE",
    });

    const responseData = await res.json();

    return Response.json(responseData);
}
