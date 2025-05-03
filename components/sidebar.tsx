"use client"

import { useEffect, useRef } from "react"
import { Button } from "@/components/ui/button"
import { ScrollArea } from "@/components/ui/scroll-area"
import { X, Clock } from "lucide-react"

type Translation = {
  id: string
  source: string
  sourceLanguage: string
  target: string
  targetLanguage: string
  timestamp: Date
}

interface SidebarProps {
  isOpen: boolean
  onClose: () => void
  recentTranslations: Translation[]
  onSelectTranslation: (translation: Translation) => void
}

export function Sidebar({ isOpen, onClose, recentTranslations, onSelectTranslation }: SidebarProps) {
  const sidebarRef = useRef<HTMLDivElement>(null)

  // Handle click outside to close sidebar on mobile
  useEffect(() => {
    const handleClickOutside = (event: MouseEvent) => {
      if (
        sidebarRef.current &&
        !sidebarRef.current.contains(event.target as Node) &&
        window.innerWidth < 768 &&
        isOpen
      ) {
        onClose()
      }
    }

    document.addEventListener("mousedown", handleClickOutside)
    return () => {
      document.removeEventListener("mousedown", handleClickOutside)
    }
  }, [isOpen, onClose])

  // Format timestamp
  const formatTime = (date: Date) => {
    return new Intl.DateTimeFormat("en-US", {
      hour: "numeric",
      minute: "numeric",
      hour12: true,
    }).format(date)
  }

  return (
    <div
      ref={sidebarRef}
      className={`fixed md:relative z-30 h-full bg-white dark:bg-gray-900 border-r border-gray-200 dark:border-gray-800 transition-all duration-300 ease-in-out ${
        isOpen ? "w-72 translate-x-0" : "w-0 -translate-x-full md:translate-x-0"
      } overflow-hidden`}
    >
      <div className="flex items-center justify-between p-4 border-b border-gray-200 dark:border-gray-800">
        <h2 className="text-lg font-semibold text-purple-700 dark:text-purple-400 flex items-center">
          <Clock className="h-5 w-5 mr-2" />
          Recent Translations
        </h2>
        <Button variant="ghost" size="icon" onClick={onClose} className="md:hidden">
          <X className="h-5 w-5" />
        </Button>
      </div>

      <ScrollArea className="h-[calc(100vh-64px)]">
        <div className="p-4 space-y-4">
          {recentTranslations.length === 0 ? (
            <div className="text-center py-8 text-gray-500 dark:text-gray-400">
              <p>No recent translations</p>
              <p className="text-sm mt-2">Your translation history will appear here</p>
            </div>
          ) : (
            recentTranslations.map((translation) => (
              <div
                key={translation.id}
                onClick={() => onSelectTranslation(translation)}
                className="p-3 rounded-lg border border-gray-200 dark:border-gray-800 hover:bg-purple-50 dark:hover:bg-purple-900/20 cursor-pointer transition-colors"
              >
                <div className="flex justify-between items-start mb-2">
                  <div className="text-xs font-medium text-purple-600 dark:text-purple-400">
                    {translation.sourceLanguage} → {translation.targetLanguage}
                  </div>
                  <div className="text-xs text-gray-500 dark:text-gray-400">{formatTime(translation.timestamp)}</div>
                </div>
                <div className="text-sm line-clamp-2 text-gray-700 dark:text-gray-300">{translation.source}</div>
              </div>
            ))
          )}
        </div>
      </ScrollArea>
    </div>
  )
}
