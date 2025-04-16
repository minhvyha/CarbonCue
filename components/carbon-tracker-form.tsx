"use client"

import type React from "react"

import { useState } from "react"
import { Plus } from "lucide-react"

import { Button } from "@/components/ui/button"
import { Input } from "@/components/ui/input"
import { Label } from "@/components/ui/label"

export function CarbonTrackerForm() {
  const [isLoading, setIsLoading] = useState(false)

  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault()
    setIsLoading(true)

    // Simulate API call
    setTimeout(() => {
      setIsLoading(false)
    }, 1000)
  }

  return (
    <form onSubmit={handleSubmit} className="space-y-4">
      <div className="grid gap-2">
        <Label htmlFor="activity-type">Activity Type</Label>
        <select
          id="activity-type"
          className="flex h-10 w-full rounded-md border border-input bg-background px-3 py-2 text-sm ring-offset-background file:border-0 file:bg-transparent file:text-sm file:font-medium placeholder:text-muted-foreground focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-ring focus-visible:ring-offset-2 disabled:cursor-not-allowed disabled:opacity-50"
        >
          <option value="">Select activity type</option>
          <option value="transportation">Transportation</option>
          <option value="home-energy">Home Energy</option>
          <option value="food">Food & Diet</option>
          <option value="shopping">Shopping</option>
          <option value="digital">Digital Usage</option>
        </select>
      </div>

      <div className="grid gap-2">
        <Label htmlFor="activity-details">Details</Label>
        <Input id="activity-details" placeholder="e.g., 10 miles by car" />
      </div>

      <div className="grid gap-2">
        <Label htmlFor="activity-date">Date</Label>
        <Input id="activity-date" type="date" defaultValue={new Date().toISOString().split("T")[0]} />
      </div>

      <Button type="submit" disabled={isLoading} className="w-full bg-carbon-red hover:bg-carbon-deep-red">
        {isLoading ? (
          <div className="flex items-center gap-2">
            <div className="h-4 w-4 animate-spin rounded-full border-2 border-current border-t-transparent" />
            <span>Adding...</span>
          </div>
        ) : (
          <div className="flex items-center gap-2">
            <Plus className="h-4 w-4" />
            <span>Add Activity</span>
          </div>
        )}
      </Button>
    </form>
  )
}
