import { Bell } from "lucide-react"
import { Badge } from "@/components/ui/badge"
import { Button } from "@/components/ui/button"
import { Card, CardContent, CardFooter } from "@/components/ui/card"
import { Separator } from "@/components/ui/separator"
import { Avatar, AvatarFallback, AvatarImage } from "@/components/ui/avatar"

export default function CouncillorCard() {
  return (
    <Card className="w-full rounded-xl border shadow-sm">
      <CardContent className="p-0">
        <div className="p-4">
          <Badge
            variant="outline"
            className="bg-blue-100 text-blue-800 hover:bg-blue-100 border-0 px-4 py-1.5 rounded-full"
          >
            Current Councillor
          </Badge>
        </div>

        <Separator />

        <div className="p-4">
          <div className="flex items-start justify-between">
            <div className="flex gap-4">
              <Avatar className="h-24 w-24 border-2 border-gray-100">
                <AvatarImage src="/placeholder.svg?height=96&width=96" alt="Lily Cheng" />
                <AvatarFallback>LC</AvatarFallback>
              </Avatar>

              <div>
                <h2 className="text-2xl font-bold mb-1">Lily Cheng</h2>
                <p className="text-gray-600 mb-4">Ward 18, Willowdale</p>

                <div className="grid grid-cols-[80px_1fr] gap-y-2">
                  <div className="font-semibold">Email</div>
                  <a href="mailto:councillor_cheng@toronto.ca" className="text-blue-500 hover:underline">
                    councillor_cheng@toronto.ca
                  </a>

                  <div className="font-semibold">Phone</div>
                  <a href="tel:416-392-0210" className="text-blue-500 hover:underline">
                    416-392-0210
                  </a>
                </div>
              </div>
            </div>

            <Button variant="ghost" size="icon" className="rounded-full">
              <Bell className="h-5 w-5" />
            </Button>
          </div>
        </div>

        <div className="p-4">
          <h3 className="text-lg font-bold mb-3">Key Issues</h3>

          <div className="flex flex-wrap gap-2 mb-4">
            <Badge variant="outline" className="bg-gray-100 hover:bg-gray-100 border-0 px-4 py-1.5 rounded-full">
              Environment
            </Badge>
            <Badge variant="outline" className="bg-gray-100 hover:bg-gray-100 border-0 px-4 py-1.5 rounded-full">
              Conservation
            </Badge>
            <Badge variant="outline" className="bg-gray-100 hover:bg-gray-100 border-0 px-4 py-1.5 rounded-full">
              Trees
            </Badge>
          </div>
        </div>

        <div className="p-4">
          <h3 className="text-lg font-bold mb-3">Profile</h3>

          <p className="text-gray-800 mb-4">
            Lily Cheng is the Councillor for Ward 18 Willowdale, taking office on November 15, 2022. A Willowdale
            resident for over a dozen years, Lily is a passionate, visionary leader in the community...
          </p>
        </div>

        <div className="bg-gray-50 p-4 rounded-lg mx-4 mb-4">
          <div className="flex justify-between">
            <div className="flex items-center gap-2">
              <div className="bg-gray-300 rounded-full p-2">
                <svg
                  xmlns="http://www.w3.org/2000/svg"
                  width="20"
                  height="20"
                  viewBox="0 0 24 24"
                  fill="none"
                  stroke="currentColor"
                  strokeWidth="2"
                  strokeLinecap="round"
                  strokeLinejoin="round"
                >
                  <path d="m9 14 6-6" />
                  <circle cx="14" cy="9" r="1" />
                  <circle cx="10" cy="14" r="1" />
                  <path d="M5 5v14h14V5H5z" />
                </svg>
              </div>
              <span>Voted (479)</span>
            </div>

            <div className="flex items-center gap-2">
              <div className="bg-gray-300 rounded-full p-2">
                <svg
                  xmlns="http://www.w3.org/2000/svg"
                  width="20"
                  height="20"
                  viewBox="0 0 24 24"
                  fill="none"
                  stroke="currentColor"
                  strokeWidth="2"
                  strokeLinecap="round"
                  strokeLinejoin="round"
                >
                  <circle cx="12" cy="12" r="10" />
                  <path d="M8 14s1.5 2 4 2 4-2 4-2" />
                  <line x1="9" x2="9.01" y1="9" y2="9" />
                  <line x1="15" x2="15.01" y1="9" y2="9" />
                </svg>
              </div>
              <span>Moved (220)</span>
            </div>

            <div className="flex items-center gap-2">
              <div className="bg-gray-300 rounded-full p-2">
                <svg
                  xmlns="http://www.w3.org/2000/svg"
                  width="20"
                  height="20"
                  viewBox="0 0 24 24"
                  fill="none"
                  stroke="currentColor"
                  strokeWidth="2"
                  strokeLinecap="round"
                  strokeLinejoin="round"
                >
                  <path d="M9 12l2 2 4-4" />
                  <path d="M5 7c0-1.1.9-2 2-2h10a2 2 0 0 1 2 2v12H5V7Z" />
                  <path d="M22 19H2" />
                </svg>
              </div>
              <span>Seconded (113)</span>
            </div>
          </div>
        </div>
      </CardContent>

      <CardFooter className="p-4">
        <Button className="w-full bg-blue-500 hover:bg-blue-600 text-white rounded-full py-6">Learn more</Button>
      </CardFooter>
    </Card>
  )
}

