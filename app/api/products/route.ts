export async function POST(req: Request) {
  const body = await req.json();
  try {
    const resp = await fetch('http://deisishop.pythonanywhere.com/buy/', {
      method: "POST",
      body: JSON.stringify(body), // Enviar o corpo da requisição recebido
      headers: {
        "Content-Type": "application/json",
      },
    });

    if (!resp.ok) {
      return Response.json({ error: resp.statusText }, { status: resp.status });
    }

    const data = await resp.json(); // Obter resposta da API externa

    if (data.hasOwnProperty("error")) {
      return Response.json({ error: data.error }, { status: 500 });
    }

    return Response.json(data); // Retornar a resposta da API externa
  } catch (error) {
    console.error("Erro na comunicação com a API externa:", error);
    return Response.json({ error: "Erro interno ao processar a compra." }, { status: 500 });
  }
}
