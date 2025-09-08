document.addEventListener("DOMContentLoaded", function() {
    const longUrlInput = document.getElementById("longUrl");
    const customAliasInput = document.getElementById("customAlias");
    const shortenBtn = document.getElementById("shortenBtn");
    const shortenedUrlDisplay = document.getElementById("shortenedUrlDisplay");
    const copyBtn = document.getElementById("copyBtn");

    shortenBtn.addEventListener("click", async function() {
        const longUrl = longUrlInput.value.trim();
        const customAlias = customAliasInput.value.trim();

        // Reset messages and buttons
        shortenedUrlDisplay.textContent = "";
        shortenedUrlDisplay.style.color = "";
        copyBtn.style.display = "none";

        if (longUrl === "") {
            shortenedUrlDisplay.textContent = "Por favor, insira uma URL longa.";
            shortenedUrlDisplay.style.color = "red";
            return;
        }

        // Basic URL validation (can be improved)
        try {
            new URL(longUrl);
        } catch (e) {
            shortenedUrlDisplay.textContent = "Por favor, insira uma URL válida.";
            shortenedUrlDisplay.style.color = "red";
            return;
        }

        // Construir o corpo da requisição
        const requestBody = {
            url: longUrl
        };
        if (customAlias !== "") {
            requestBody.alias = customAlias;
        }

        try {
            // Fazer a requisição para o backend Flask
            // Assumindo que o backend estará rodando em http://localhost:5000
            const response = await fetch("https://nadinael.pythonanywhere.com/api/shorten", {
                method: "POST",
                headers: {
                    "Content-Type": "application/json"
                },
                body: JSON.stringify(requestBody)
            });

            const data = await response.json();

            if (response.ok) {
                shortenedUrlDisplay.innerHTML = `Seu link encurtado: <a href="${data.short_url}" target="_blank">${data.short_url}</a>`;
                shortenedUrlDisplay.style.color = "#28a745";
                copyBtn.style.display = "block";
                
                copyBtn.onclick = function() {
                    navigator.clipboard.writeText(data.short_url).then(function() {
                        alert("Link copiado para a área de transferência!");
                    }, function(err) {
                        console.error("Erro ao copiar o link: ", err);
                        alert("Erro ao copiar o link. Por favor, copie manualmente.");
                    });
                };
            } else {
                shortenedUrlDisplay.textContent = `Erro: ${data.error || "Ocorreu um erro ao encurtar o link."}`;
                shortenedUrlDisplay.style.color = "red";
            }
        } catch (error) {
            console.error("Erro na requisição ao backend:", error);
            shortenedUrlDisplay.textContent = "Erro de conexão com o servidor. Verifique se o backend está rodando.";
            shortenedUrlDisplay.style.color = "red";
        }
    });
});

