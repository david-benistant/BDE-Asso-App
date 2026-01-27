import { useState, useRef, useEffect } from "react"

type Notification = {
  id: string
  title: string
  description: string
  time: string
}

const fakeNotifications: Notification[] = [
  { id: "1", title: "New invoice", description: "Invoice #192 has been paid", time: "2m ago" },
  { id: "2", title: "Deployment", description: "Backend successfully deployed", time: "10m ago" },
  { id: "3", title: "New user", description: "Alex joined your workspace", time: "1h ago" }
]

export default function NotificationPopover() {
  const [open, setOpen] = useState(false)
  const [hasNotification, setHasNotification] = useState(true)

  const buttonRef = useRef<HTMLButtonElement>(null)
  const popoverRef = useRef<HTMLDivElement>(null)

  useEffect(() => {
    function handleClick(e: MouseEvent) {
      if (
        popoverRef.current &&
        !popoverRef.current.contains(e.target as Node) &&
        buttonRef.current &&
        !buttonRef.current.contains(e.target as Node)
      ) {
        setOpen(false)
      }
    }

    document.addEventListener("mousedown", handleClick)
    return () => document.removeEventListener("mousedown", handleClick)
  }, [])

  return (
    <div className="relative">
      <button
        ref={buttonRef}
        onClick={() => {
          setOpen(v => !v)
          setHasNotification(false)
        }}
        className="cursor-pointer relative w-9 h-9 ml-3 flex items-center justify-center rounded-full bg-white/15 hover:bg-white/25 text-white"
      >
        {hasNotification && (
          <span className="absolute top-1 right-1 w-2 h-2 bg-red-500 rounded-full" />
        )}
        <svg className="w-5 h-5" fill="none" stroke="currentColor" strokeWidth="2" viewBox="0 0 24 24">
          <path d="M15 17h5l-1.4-1.4A2 2 0 0 1 18 14.2V11a6 6 0 1 0-12 0v3.2a2 2 0 0 1-.6 1.4L4 17h5m6 0a3 3 0 1 1-6 0" />
        </svg>
      </button>

      {open && (
        <div
          ref={popoverRef}
          className="
            fixed inset-x-4 top-16
            sm:absolute sm:inset-auto sm:right-0 sm:top-full sm:mt-3
            w-[calc(100vw-2rem)] sm:w-80
            max-h-[70vh]
            bg-white rounded-xl shadow-xl border border-gray-100 z-100 overflow-hidden
          "
        >
          <div className="px-4 py-3 border-b font-semibold text-sm sticky top-0 bg-white">
            Notifications
          </div>

          <div className="overflow-y-auto">
            {fakeNotifications.map(n => (
              <div
                key={n.id}
                className="px-4 py-4 hover:bg-gray-50 cursor-pointer border-b last:border-b-0"
              >
                <div className="flex justify-between gap-2">
                  <p className="font-medium text-sm">{n.title}</p>
                  <span className="text-xs text-gray-400 whitespace-nowrap">
                    {n.time}
                  </span>
                </div>
                <p className="text-sm text-gray-500 mt-1">
                  {n.description}
                </p>
              </div>
            ))}
          </div>
        </div>
      )}
    </div>
  )
}
