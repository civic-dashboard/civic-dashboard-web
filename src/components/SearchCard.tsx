import { Link } from "lucide-react"
import { Badge } from "@/components/ui/badge"
import { Button } from "@/components/ui/button"
import { Card, CardContent, CardFooter } from "@/components/ui/card"
import { Separator } from "@/components/ui/separator"

export default function SearchCard() {
  return (
    <Card className="w-full rounded-xl border shadow-sm">
      <CardContent className="p-0">
        <div className="flex items-center justify-between p-4">
          <Badge
            variant="outline"
            className="bg-green-100 text-green-800 hover:bg-green-100 border-0 px-4 py-1.5 rounded-full"
          >
            Dec 14 2024
          </Badge>
          <Badge
            variant="outline"
            className="bg-white hover:bg-gray-50 border border-gray-200 px-4 py-1.5 rounded-full flex items-center gap-2"
          >
            <Link className="h-4 w-4" />
            2024.MM23.1
          </Badge>
        </div>

        <Separator />

        <div className="p-4">
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

          <h2 className="text-xl font-bold mb-4">
            Application to Remove a Tree in a Protected Ravine, 124 Sandringham Dr.
          </h2>

          <p className="mb-6">
            Allow the tree at 124 Sandringham Drive to be cut down, it must replace it with six new trees, either by
            planting them nearby or giving money to help plant trees elsewhere.
          </p>

          <h3 className="text-lg font-bold mb-2">The decision</h3>

          <p className="mb-6">
            Urban Forestry determined that the tree is healthy and maintainable. The North York Community Council denied
            an appeal to remove a healthy honey locust tree.
          </p>
        </div>

        <Separator />

        <div className="p-4">
          <div className="grid grid-cols-4 gap-2 mb-4">
            <div className="font-semibold">Date</div>
            <div className="col-span-3">Nov-14-2024 9:37 PM</div>

            <div className="font-semibold">Motion</div>
            <div className="col-span-3">To adopt</div>

            <div className="font-semibold">Vote</div>
            <div className="flex items-center gap-2">
              <div className="bg-blue-500 rounded-full p-2 flex items-center justify-center">
                <svg
                  xmlns="http://www.w3.org/2000/svg"
                  width="20"
                  height="20"
                  viewBox="0 0 24 24"
                  fill="none"
                  stroke="white"
                  strokeWidth="2"
                  strokeLinecap="round"
                  strokeLinejoin="round"
                >
                  <path d="M7 10v12" />
                  <path d="M15 5.88 14 10h5.83a2 2 0 0 1 1.92 2.56l-2.33 8A2 2 0 0 1 17.5 22H4a2 2 0 0 1-2-2v-8a2 2 0 0 1 2-2h2.76a2 2 0 0 0 1.79-1.11L12 2h0a3.13 3.13 0 0 1 3 3.88Z" />
                </svg>
              </div>
              <span>No</span>
            </div>

            <div className="font-semibold">Votes Needed</div>
            <div>Two-thirds required</div>

            <div className="font-semibold">Total</div>
            <div>24—10</div>

            <div className="font-semibold">Status</div>
            <div>Carried</div>
          </div>
        </div>

        <Separator />

        <div className="p-4">
          <div className="grid grid-cols-4 gap-2 mb-4">
            <div className="font-semibold">Date</div>
            <div className="col-span-3">Nov-14-2024 2:47 PM</div>

            <div className="font-semibold">Motion</div>
            <div className="col-span-3">Waive referral</div>

            <div className="font-semibold">Vote</div>
            <div className="flex items-center gap-2">
              <div className="bg-blue-500 rounded-full p-2 flex items-center justify-center">
                <svg
                  xmlns="http://www.w3.org/2000/svg"
                  width="20"
                  height="20"
                  viewBox="0 0 24 24"
                  fill="none"
                  stroke="white"
                  strokeWidth="2"
                  strokeLinecap="round"
                  strokeLinejoin="round"
                >
                  <path d="M7 10v12" />
                  <path d="M15 5.88 14 10h5.83a2 2 0 0 1 1.92 2.56l-2.33 8A2 2 0 0 1 17.5 22H4a2 2 0 0 1-2-2v-8a2 2 0 0 1 2-2h2.76a2 2 0 0 0 1.79-1.11L12 2h0a3.13 3.13 0 0 1 3 3.88Z" />
                </svg>
              </div>
              <span>No</span>
            </div>

            <div className="font-semibold">Votes Needed</div>
            <div>Two-thirds required</div>

            <div className="font-semibold">Total</div>
            <div>24—10</div>

            <div className="font-semibold">Status</div>
            <div>Carried</div>
          </div>
        </div>
      </CardContent>

      <CardFooter className="p-4">
        <Button className="w-full bg-blue-500 hover:bg-blue-600 text-white rounded-full py-6">Learn more</Button>
      </CardFooter>
    </Card>
  )
}

