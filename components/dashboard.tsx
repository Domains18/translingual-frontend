"use client"

import { useState, useEffect } from "react"
import { useSession } from "next-auth/react"
import { Button } from "@/components/ui/button"
import { Textarea } from "@/components/ui/textarea"
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from "@/components/ui/select"
import { Sidebar } from "@/components/sidebar"
import { ThemeToggle } from "@/components/theme-toggle"
import { UserNav } from "@/components/user-nav"
import { ArrowRightLeft, Menu } from "lucide-react"

export default function Dashboard() {
  const { data: session } = useSession()
  const [sidebarOpen, setSidebarOpen] = useState(true)
  const [isMobile, setIsMobile] = useState(false)
  const [sourceText, setSourceText] = useState("")
  const [translatedText, setTranslatedText] = useState("")
  const [sourceLanguage, setSourceLanguage] = useState("english")
  const [targetLanguage, setTargetLanguage] = useState("swahili")
  const [recentTranslations, setRecentTranslations] = useState<
    Array<{
      id: string
      source: string
      sourceLanguage: string
      target: string
      targetLanguage: string
      timestamp: Date
    }>
  >([])

  // Check if on mobile
  useEffect(() => {
    const checkIfMobile = () => {
      setIsMobile(window.innerWidth < 768)
      if (window.innerWidth < 768) {
        setSidebarOpen(false)
      }
    }

    checkIfMobile()
    window.addEventListener("resize", checkIfMobile)

    return () => {
      window.removeEventListener("resize", checkIfMobile)
    }
  }, [])

  const handleTranslate = async () => {
    if (!sourceText.trim()) return

    // Simulate translation (in a real app, you would call an API)
    const mockTranslation = `Translated from ${sourceLanguage} to ${targetLanguage}: ${sourceText}`
    setTranslatedText(mockTranslation)

    // Add to recent translations
    const newTranslation = {
      id: Date.now().toString(),
      source: sourceText,
      sourceLanguage,
      target: mockTranslation,
      targetLanguage,
      timestamp: new Date(),
    }

    setRecentTranslations([newTranslation, ...recentTranslations].slice(0, 10))
  }

  const swapLanguages = () => {
    const temp = sourceLanguage
    setSourceLanguage(targetLanguage)
    setTargetLanguage(temp)
    setSourceText(translatedText)
    setTranslatedText(sourceText)
  }

  const loadTranslation = (translation: (typeof recentTranslations)[0]) => {
    setSourceLanguage(translation.sourceLanguage)
    setTargetLanguage(translation.targetLanguage)
    setSourceText(translation.source)
    setTranslatedText(translation.target)

    if (isMobile) {
      setSidebarOpen(false)
    }
  }

  return (
    <div className="flex h-screen bg-white dark:bg-gray-950">
      <Sidebar
        isOpen={sidebarOpen}
        onClose={() => setSidebarOpen(false)}
        recentTranslations={recentTranslations}
        onSelectTranslation={loadTranslation}
      />

      <div className="flex-1 flex flex-col h-full overflow-hidden">
        <header className="border-b border-gray-200 dark:border-gray-800">
          <div className="flex items-center justify-between p-4">
            <div className="flex items-center">
              <Button variant="ghost" size="icon" onClick={() => setSidebarOpen(!sidebarOpen)} className="mr-2">
                <Menu className="h-5 w-5" />
              </Button>
              <h1 className="text-xl font-bold text-purple-700 dark:text-purple-400">Kenyan Languages Translator</h1>
            </div>
            <div className="flex items-center space-x-2">
              <ThemeToggle />
              <UserNav user={session?.user} />
            </div>
          </div>
        </header>

        <main className="flex-1 overflow-auto p-4 md:p-6">
          <div className="max-w-4xl mx-auto space-y-6">
            <div className="flex flex-col md:flex-row gap-4 items-center">
              <div className="w-full md:w-5/12">
                <Select value={sourceLanguage} onValueChange={setSourceLanguage}>
                  <SelectTrigger className="w-full border-purple-200 focus:border-purple-400 dark:border-purple-900">
                    <SelectValue placeholder="Select language" />
                  </SelectTrigger>
                  <SelectContent>
                    <SelectItem value="english">English</SelectItem>
                    <SelectItem value="kisii">Kisii</SelectItem>
                    <SelectItem value="swahili">Swahili</SelectItem>
                    <SelectItem value="maasai">Maasai</SelectItem>
                  </SelectContent>
                </Select>
              </div>

              <Button
                variant="ghost"
                size="icon"
                onClick={swapLanguages}
                className="rounded-full bg-purple-100 dark:bg-purple-900/30 text-purple-700 dark:text-purple-400"
              >
                <ArrowRightLeft className="h-5 w-5" />
              </Button>

              <div className="w-full md:w-5/12">
                <Select value={targetLanguage} onValueChange={setTargetLanguage}>
                  <SelectTrigger className="w-full border-purple-200 focus:border-purple-400 dark:border-purple-900">
                    <SelectValue placeholder="Select language" />
                  </SelectTrigger>
                  <SelectContent>
                    <SelectItem value="english">English</SelectItem>
                    <SelectItem value="kisii">Kisii</SelectItem>
                    <SelectItem value="swahili">Swahili</SelectItem>
                    <SelectItem value="maasai">Maasai</SelectItem>
                  </SelectContent>
                </Select>
              </div>
            </div>

            <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
              <div className="space-y-2">
                <label className="text-sm font-medium text-gray-700 dark:text-gray-300">Source Text</label>
                <Textarea
                  value={sourceText}
                  onChange={(e) => setSourceText(e.target.value)}
                  placeholder="Enter text to translate"
                  className="h-40 resize-none border-purple-200 focus:border-purple-400 dark:border-purple-900"
                />
              </div>

              <div className="space-y-2">
                <label className="text-sm font-medium text-gray-700 dark:text-gray-300">Translated Text</label>
                <Textarea
                  value={translatedText}
                  readOnly
                  placeholder="Translation will appear here"
                  className="h-40 resize-none bg-gray-50 dark:bg-gray-900 border-purple-200 dark:border-purple-900"
                />
              </div>
            </div>

            <Button
              onClick={handleTranslate}
              className="w-full bg-purple-600 hover:bg-purple-700 text-white"
              disabled={!sourceText.trim()}
            >
              Translate
            </Button>
          </div>
        </main>
      </div>
    </div>
  )
}
