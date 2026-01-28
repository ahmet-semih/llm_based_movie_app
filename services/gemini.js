const GEMINI_API_KEY = "AIzaSyDO261BwCKZDdX7yRuuMKhNLUemrVbWRag";

/**
 * Send a prompt to Gemini using REST API
 */
export async function askGemini(prompt) {
  const url = "https://generativelanguage.googleapis.com/v1/models/gemini-2.5-flash:generateContent";
  
  try {
    const response = await fetch(url, {
      method: "POST",
      headers: {
        "Content-Type": "application/json",
        "x-goog-api-key": GEMINI_API_KEY,
      },
      body: JSON.stringify({
        contents: [
          {
            parts: [{ text: prompt }]
          }
        ]
      })
    });

    const data = await response.json();
    
    // Log full response for debugging
    console.log("Gemini API response:", data);

    if (!response.ok) {
      console.error("Gemini API error:", data);
      throw new Error(data.error?.message || "API request failed");
    }

    // Extract text from response
    const text = data.candidates?.[0]?.content?.parts?.[0]?.text;
    if (text) {
      return text;
    } else {
      console.error("No text in response:", data);
      return "Sorry, I received an empty response.";
    }
  } catch (error) {
    console.error("Gemini fetch error:", error);
    throw error;
  }
}

/**
 * Ask Gemini with user's favorite movies as context (RAG-style)
 */
export async function askGeminiWithContext(question, favorites = []) {
  let context = "";
  
  if (favorites.length > 0) {
    context = "User's favorite movies:\n";
    favorites.forEach((movie, i) => {
      context += `${i + 1}. ${movie.title} (${movie.release_date?.split("-")[0] || "N/A"})\n`;
    });
    context += "\n";
  }

  const prompt = `${context}User question: ${question}

You are a helpful movie assistant. Answer based on the user's favorites if relevant. Be concise and friendly.`;

  return await askGemini(prompt);
}