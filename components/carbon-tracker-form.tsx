"use client"

import type React from "react"

import { useState } from "react"
import { Plus } from "lucide-react"
import { Button } from "@/components/ui/button"
import { Input } from "@/components/ui/input"
import { Label } from "@/components/ui/label"
import {
  Select,
  SelectContent,
  SelectItem,
  SelectTrigger,
  SelectValue,
} from "@/components/ui/select"
import { Checkbox } from "@/components/ui/checkbox";
import { toast } from "sonner"

const optionsRecycling = [
  { label: "Paper", value: "Paper" },
  { label: "Plastic", value: "Plastic" },
  { label: "Glass", value: "Glass" },
  { label: "Metal", value: "Metal" },
]


export function CarbonTrackerForm() {
  const [isLoading, setIsLoading] = useState(false)
  const [activityType, setActivityType] = useState("");
  const [formData, setFormData] = useState<Record<string, any>>({});    


  const handleChange = (field: string, value: any) => {
    setFormData((prev: any) => ({
      ...prev,
      [field]: value,
    }));
  };

  const renderActivityTypeOptions = () => {
    switch (activityType) {
      case "transportation":
        return (
          <>
          <div className="grid gap-2">
            <Label htmlFor="vehicle_monthly_distance_km">Details</Label>
          </div>
            <Input
              id="vehicle_monthly_distance_km"
              type="number"
              placeholder="Distance (km)"
              onChange={(e) => handleChange('vehicle_monthly_distance_km', parseFloat(e.target.value))}
            />
            <Select onValueChange={(value) => handleChange('vehicle_type', value)}>
              <SelectTrigger>
                <SelectValue placeholder="Select vehicle type" />
              </SelectTrigger>
              <SelectContent>
                <SelectItem value="petrol">Petrol</SelectItem>
                <SelectItem value="diesel">Diesel</SelectItem>
                <SelectItem value="electric">Electric</SelectItem>
                <SelectItem value="None">None</SelectItem>
              </SelectContent>
            </Select>
            <Select onValueChange={(value) => handleChange('transport', value)}>
              <SelectTrigger>
                <SelectValue placeholder="Select transport type" />
              </SelectTrigger>
              <SelectContent>
                <SelectItem value="private">Private</SelectItem>
                <SelectItem value="public">Public</SelectItem>
                <SelectItem value="walk/bicycle">Walk/Bicycle</SelectItem>
              </SelectContent>
            </Select>
            <Select onValueChange={(value) => handleChange('frequency_of_traveling_by_air', value)}>
              <SelectTrigger>
                <SelectValue placeholder="Select frequency of traveling by air" />
              </SelectTrigger>
              <SelectContent>
                <SelectItem value="never">Never</SelectItem>
                <SelectItem value="rarely">Rarely</SelectItem>
                <SelectItem value="frequently">Frequently</SelectItem>
                <SelectItem value="very frequently">Very Frequently</SelectItem>
              </SelectContent>
            </Select>
          </>
        )
      case "home_energy":
        return (
          <>
            <div className="grid gap-2">
              <Label htmlFor="heating_energy_source">Details</Label>
            </div>
            <Select onValueChange={(value) => handleChange('heating_energy_source', value)}>
              <SelectTrigger>
                <SelectValue placeholder="Select heating energy source" />
              </SelectTrigger>
              <SelectContent>
                <SelectItem value="electricity">Electricity</SelectItem>
                <SelectItem value="natural gas">Natural Gas</SelectItem>
                <SelectItem value="wood">Wood</SelectItem>
                <SelectItem value="coal">Coal</SelectItem>
                <SelectItem value="None">None</SelectItem>
              </SelectContent>
            </Select>
            <Select onValueChange={(value) => handleChange('energy_efficiency', value)}>
              <SelectTrigger>
                <SelectValue placeholder="Select energy efficiency" />
              </SelectTrigger>
              <SelectContent>
                <SelectItem value="No">No</SelectItem>
                <SelectItem value="Sometimes">Sometimes</SelectItem>
                <SelectItem value="Yes">Yes</SelectItem>
              </SelectContent>
            </Select>
            <Input
              id="how_long_tv_pc_daily_hour"
              type="number"
              placeholder="TV/PC hours per day"
              onChange={(e) => handleChange('how_long_tv_pc_daily_hour', parseInt(e.target.value))}
            />
          </>
        )
      case "food_diet":
        return (
          <>
            <div className="grid gap-2">
              <Label htmlFor="diet">Details</Label>
            </div>
            <Select onValueChange={(value) => handleChange('diet', value)}>
              <SelectTrigger>
                <SelectValue placeholder="Select diet" />
              </SelectTrigger>
              <SelectContent>
                <SelectItem value="vegan">Vegan</SelectItem>
                <SelectItem value="vegetarian">Vegetarian</SelectItem>
                <SelectItem value="pescetarian">Pescetarian</SelectItem>
                <SelectItem value="omnivore">Omnivore</SelectItem>
              </SelectContent>
            </Select>
            <Input
              id="monthly_grocery_bill"
              type="number"
              placeholder="Monthly grocery bill ($)"
              onChange={(e) => handleChange('monthly_grocery_bill', parseInt(e.target.value))}
            />  
          </>
        )
      case "shopping":
        return (
          <>
            <div className="grid gap-2">
              <Label htmlFor="how_many_new_clothes_monthly">Details</Label>
            </div>
            <Input
              id="how_many_new_clothes_monthly"
              type="number"
              placeholder="New clothes per month"
              onChange={(e) => handleChange('how_many_new_clothes_monthly', parseInt(e.target.value))}
            />
            <Select onValueChange={(value) => handleChange('waste_bag_size', value)}>
              <SelectTrigger>
                <SelectValue placeholder="Select waste bag size" />
              </SelectTrigger>
              <SelectContent>
                <SelectItem value="small">Small</SelectItem>
                <SelectItem value="medium">Medium</SelectItem>
                <SelectItem value="large">Large</SelectItem>
                <SelectItem value="extra large">Extra Large</SelectItem>
                <SelectItem value="None">None</SelectItem>
              </SelectContent>
            </Select>
            <Input
              id="waste_bag_weekly_count"
              type="number"
              placeholder="Waste bag weekly count"
              onChange={(e) => handleChange('waste_bag_weekly_count', parseInt(e.target.value))}
            />
            <div className="grid gap-2">
              <Label htmlFor="recycling">Recycling:</Label>
            </div>
            {optionsRecycling.map((option) => (
              <div key={option.value} className="flex items-center space-x-2">
                <Checkbox
                  id={option.value}
                  checked={formData.recycling?.includes(option.value) || false}
                  onCheckedChange={(checked: boolean) => {
                    const prev = formData.recycling || [];
                    const updated = checked
                      ? [...prev, option.value]
                      : prev.filter((item: string) => item !== option.value);
                    handleChange("recycling", updated);
                  }}
                />
                <Label htmlFor={option.value}>{option.label}</Label>
              </div>
            ))}
          </>
        )
      case "digital_usage":
        return (
          <>
            <div className="grid gap-2">
              <Label htmlFor="how_long_internet_daily_hour">Details</Label>
            </div>
            <Input
              id="how_long_internet_daily_hour"
              type="number"
              placeholder="Internet hours per day"
              onChange={(e) => handleChange('how_long_internet_daily_hour', parseInt(e.target.value))}
            />  
          </>
        )
      default:
        return null;
    }
  };

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault()
    setIsLoading(true)

    if (activityType === "transportation") {
      if (formData.vehicle_monthly_distance_km < 0) {
        toast.error("Distance cannot be negative")
        setIsLoading(false)
        return
      }
      if (formData.vehicle_type === "None") {
        toast.error("Vehicle type is required")
        setIsLoading(false)
        return
      }
      if (formData.transport_type === "None") {
        toast.error("Transport type is required")
        setIsLoading(false)
        return
      }
      if (formData.frequency_of_traveling_by_air === "None") {
        toast.error("Frequency of traveling by air is required")
        setIsLoading(false)
        return
      }
    }

    if (activityType === "home_energy") {
      if (formData.heating_energy_source === "None") {
        toast.error("Heating energy source is required")
        setIsLoading(false)
        return
      }
      if (formData.energy_efficiency === "None") {
        toast.error("Energy efficiency is required")
        setIsLoading(false)
        return
      }
      if (formData.how_long_tv_pc_daily_hour < 0) {
        toast.error("TV/PC hours per day cannot be negative")
        setIsLoading(false)
        return
      }
    }

    if (activityType === "food_diet") {
      if (formData.diet === "None") {
        toast.error("Diet is required")
        setIsLoading(false)
        return
      }
      if (formData.monthly_grocery_bill < 0) {
        toast.error("Monthly grocery bill cannot be negative")
        setIsLoading(false)
        return
      }
    }

    if (activityType === "shopping") {
      if (formData.how_many_new_clothes_monthly < 0) {
        toast.error("New clothes per month cannot be negative")
        setIsLoading(false)
        return
      }
      if (formData.waste_bag_weekly_count < 0) {
        toast.error("Waste bag weekly count cannot be negative")
        setIsLoading(false)
        return
      }
      if (!formData.recycling || formData.recycling.length === 0) {
        toast.error("Please select at least one recycling option")
        setIsLoading(false)
        return
      }
    }

    if (activityType === "digital_usage") {
      if (formData.how_long_internet_daily_hour < 0) {
        toast.error("Internet hours per day cannot be negative")
        setIsLoading(false)
        return
      }
    }

    console.log(formData)

    let processedInput = { ...formData };
    if (activityType === "shopping" && Array.isArray(processedInput.recycling)) {
      processedInput.recycling = JSON.stringify(processedInput.recycling);
    }
    // Called API to add activity
    const response = await fetch("/api/activity-tracker", {
      method: "POST",
      headers: {
        "Content-Type": "application/json",
      },
      body: JSON.stringify(
        {
          activityType : activityType,
          input : processedInput,
          notes : formData.notes,
          date : formData.date
        }
      ),
    })
    if (response.ok) {
      toast.success("Activity added successfully")
      // Reset form after successful submission
      setActivityType("");
      setFormData({});
    } else {
      toast.error("Failed to add activity")
    }
    setIsLoading(false)
  }

  return (
    <form onSubmit={handleSubmit} className="space-y-4">
      <div className="grid gap-2">
        <Label htmlFor="activity-type">Activity Type</Label>
        <select
          id="activity-type"
          value={activityType}
          onChange={(e) => {
            setActivityType(e.target.value);
            setFormData({});
          }}
          className="flex h-10 w-full rounded-md border border-input bg-background px-3 py-2 text-sm ring-offset-background file:border-0 file:bg-transparent file:text-sm file:font-medium placeholder:text-muted-foreground focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-ring focus-visible:ring-offset-2 disabled:cursor-not-allowed disabled:opacity-50"
        >
          <option value="">Select activity type</option>
          <option value="transportation">Transportation</option>
          <option value="home_energy">Home Energy</option>
          <option value="food_diet">Food & Diet</option>
          <option value="shopping">Shopping</option>
          <option value="digital_usage">Digital Usage</option>
        </select>

        {renderActivityTypeOptions()}

      </div>

      <div className="grid gap-2">
        <Label htmlFor="activity-details">Notes</Label>
        <Input id="activity-details" placeholder="Optional notes" value={formData.notes || ""} 
        onChange={(e) => handleChange("notes", e.target.value)}/>
      </div>

      <div className="grid gap-2">
        <Label htmlFor="activity-date">Date</Label>
        <Input id="activity-date" type="date" value={formData.date || new Date().toISOString().split("T")[0]}
        onChange={(e) => handleChange("date", e.target.value)} />
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
