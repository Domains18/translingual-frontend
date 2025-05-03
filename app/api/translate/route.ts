import { NextResponse } from "next/server"

// In a real app, you would use a translation API or service
const mockTranslations: Record<string, Record<string, string>> = {
  english: {
    hello: "Hello",
    goodbye: "Goodbye",
    welcome: "Welcome",
  },
  swahili: {
    hello: "Jambo",
    goodbye: "Kwaheri",
    welcome: "Karibu",
  },
  kisii: {
    hello: "Bwakire",
    goodbye: "Genda buya",
    welcome: "Karibu",
  },
  maasai: {
    hello: "Sopa",
    goodbye: "Sere",
    welcome: "Karibu",
  },
}

export async function POST(request: Request) {
  try {
    const { text, sourceLanguage, targetLanguage } = await request.json()

    // Validate input
    if (!text || !sourceLanguage || !targetLanguage) {
      return NextResponse.json({ message: "Missing required fields" }, { status: 400 })
    }

    // In a real app, you would call a translation API
    // This is a simple mock implementation
    const words = text.toLowerCase().split(/\s+/)
    const translatedWords = words.map((word: string) => {
      const basicWord = word.replace(/[^\w]/g, "")
      const translation =
        mockTranslations[targetLanguage]?.[basicWord] || mockTranslations[targetLanguage]?.[basicWord.toLowerCase()]

      return translation || word
    })

    const translatedText = translatedWords.join(" ")

    return NextResponse.json({ translatedText })
  } catch (error) {
    console.error("Translation error:", error)
    return NextResponse.json({ message: "Internal server error" }, { status: 500 })
  }
}
