```js
const express = require("express");
const cors = require("cors");

const app = express();

app.use(cors({
  origin: [
    "https://zahraazni944.github.io"
  ]
}));

app.use(express.json());

const PORT = process.env.PORT || 3000;
const AI_API_URL = "https://www.abella.icu/gpt-3.5";

app.get("/", (req, res) => {
  res.json({ status: "AI SENDY backend aktif" });
});

app.post("/api/chat", async (req, res) => {
  try {
    const message = req.body.message;

    if (!message || typeof message !== "string") {
      return res.status(400).json({
        error: "Pesan tidak boleh kosong"
      });
    }

    const response = await fetch(AI_API_URL, {
      method: "POST",
      headers: {
        "Content-Type": "application/json",
        "Accept": "application/json"
      },
      body: JSON.stringify({ message }),
      signal: AbortSignal.timeout(60000)
    });

    const raw = await response.text();

    if (!response.ok) {
      console.error("API error:", response.status, raw);
      return res.status(502).json({
        error: "API AI gagal",
        status: response.status
      });
    }

    let data;

    try {
      data = JSON.parse(raw);
    } catch {
      data = raw;
    }

    const answer =
      typeof data === "string" ? data :
      data.answer ??
      data.response ??
      data.reply ??
      data.message ??
      data.text ??
      data.choices?.[0]?.message?.content;

    if (typeof answer !== "string" || !answer.trim()) {
      console.error("Format respons tidak dikenali:", data);
      return res.status(502).json({
        error: "Format jawaban dari API tidak dikenali"
      });
    }

    res.json({ answer });

  } catch (error) {
    console.error("Backend error:", error.message);

    res.status(500).json({
      error: "Backend AI SENDY mengalami kesalahan"
    });
  }
});

app.listen(PORT, "0.0.0.0", () => {
  console.log(`AI SENDY berjalan di port ${PORT}`);
});
```
