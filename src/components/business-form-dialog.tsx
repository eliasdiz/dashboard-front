"use client"

import { useState } from "react"
import { useForm, useFieldArray } from "react-hook-form"
import { zodResolver } from "@hookform/resolvers/zod"
import * as z from "zod"
import { Plus, Trash2, MapPin, Phone, Briefcase, Target, Globe, TagIcon, KeyRound } from "lucide-react"

import { Button } from "@/components/ui/button"
import {
  Dialog,
  DialogContent,
  DialogDescription,
  DialogFooter,
  DialogHeader,
  DialogTitle,
  DialogTrigger,
} from "@/components/ui/dialog"
import { Form, FormControl, FormDescription, FormField, FormItem, FormLabel, FormMessage } from "@/components/ui/form"
import { Input } from "@/components/ui/input"
import { Tabs, TabsContent, TabsList, TabsTrigger } from "@/components/ui/tabs"
import { ScrollArea } from "@/components/ui/scroll-area"
import { Separator } from "@/components/ui/separator"
// import { toast } from "@/components/ui/use-toast"

// Define the validation schema using zod
const businessFormSchema = z.object({
  name: z.string().min(2, { message: "Business name must be at least 2 characters." }),
  location: z.string().min(3, { message: "Location is required." }),
  phones: z
    .array(
      z.object({
        number: z.string().regex(/^\+?[0-9\s\-()]+$/, { message: "Please enter a valid phone number." }),
      }),
    )
    .optional()
    .default([]),
  services: z
    .array(
      z.object({
        name: z.string().min(1, { message: "Service name is required." }),
      }),
    )
    .optional()
    .default([]),
  keywords: z
    .array(
      z.object({
        text: z.string().min(1, { message: "Keyword is required." }),
      }),
    )
    .optional()
    .default([]),
  targetLocations: z
    .array(
      z.object({
        name: z.string().min(1, { message: "Target location is required." }),
      }),
    )
    .optional()
    .default([]),
  tags: z
    .array(
      z.object({
        name: z.string().min(1, { message: "Tags are required." }),
      }),
    )
    .optional()
    .default([]),
  website: z.string().url({ message: "Please enter a valid URL." }).optional().or(z.literal("")),
  coordinates: z
    .object({
      latitude: z
        .string()
        .regex(/^-?[0-9]\d*(\.\d+)?$/, { message: "Please enter a valid latitude." })
        .optional()
        .or(z.literal("")),
      longitude: z
        .string()
        .regex(/^-?[0-9]\d*(\.\d+)?$/, { message: "Please enter a valid longitude." })
        .optional()
        .or(z.literal("")),
    })
    .optional()
    .default({ latitude: "", longitude: "" }),
  cid: z.string().optional(),
  imagePrompt: z.string().optional(),
})

// Infer the type from the schema
export type BusinessFormValues = z.infer<typeof businessFormSchema>

// Default values for the form
const defaultValues: Partial<BusinessFormValues> = {
  name: "",
  location: "",
  phones: [{ number: "" }],
  services: [{ name: "" }],
  keywords: [{ text: "" }],
  targetLocations: [{ name: "" }],
  tags: [{ name: "" }],
  website: "",
  coordinates: {
    latitude: "",
    longitude: "",
  },
  cid: "",
  imagePrompt: "",
}

interface BusinessFormDialogProps {
  business?: BusinessFormValues
  onSave?: (data: BusinessFormValues) => void
  variant?: "outline" | "ghost" | "default"
}

export function BusinessFormDialog({ business, onSave, variant }: BusinessFormDialogProps) {
  const [open, setOpen] = useState(false)
  const [activeTab, setActiveTab] = useState("basic")

  // Initialize the form with react-hook-form
  const form = useForm<BusinessFormValues>({
    resolver: zodResolver(businessFormSchema),
    defaultValues: business || defaultValues,
  })

  // Set up field arrays for list fields
  const {
    fields: phoneFields,
    append: appendPhone,
    remove: removePhone,
  } = useFieldArray({
    control: form.control,
    name: "phones",
  })

  const {
    fields: serviceFields,
    append: appendService,
    remove: removeService,
  } = useFieldArray({
    control: form.control,
    name: "services",
  })

  const {
    fields: keywordFields,
    append: appendKeyword,
    remove: removeKeyword,
  } = useFieldArray({
    control: form.control,
    name: "keywords",
  })

  const {
    fields: targetLocationFields,
    append: appendTargetLocation,
    remove: removeTargetLocation,
  } = useFieldArray({
    control: form.control,
    name: "targetLocations",
  })

  const {
    fields: tagFields,
    append: appendTag,
    remove: removeTag,
  } = useFieldArray({
    control: form.control,
    name: "tags",
  })

  // Form submission handler
  function onSubmit(data: BusinessFormValues) {
    // Call the onSave callback if provided
    if (onSave) {
      onSave(data)
    }

    // Show success toast
    // toast({
    //   title: "Business saved",
    //   description: `Successfully saved business: ${data.name}`,
    // })

    // Close the dialog
    setOpen(false)
  }

  return (
    <Dialog open={open} onOpenChange={setOpen}>
      <DialogTrigger asChild>
        <Button variant={variant} className="border-primary hover:bg-primary text-primary hover:text-white">Add Business</Button>
      </DialogTrigger>
      <DialogContent title="Hello" className="sm:max-w-[600px]">
        <DialogHeader>
          <DialogTitle>Add Business</DialogTitle>
          <DialogDescription>
            {business
              ? "Update the business information in the form below."
              : "Fill in the business details to add it to your account."}
          </DialogDescription>
        </DialogHeader>

        <Form {...form}>
          <form onSubmit={form.handleSubmit(onSubmit)} className="space-y-4">
            <Tabs value={activeTab} onValueChange={setActiveTab}>
              <TabsList className="grid grid-cols-2 w-full">
                <TabsTrigger value="basic">Basic Info</TabsTrigger>
                <TabsTrigger value="advanced">Advanced</TabsTrigger>
              </TabsList>

              <ScrollArea className="h-[400px] pr-4 mt-2">
                <TabsContent value="basic" className="space-y-4 pt-2">
                  {/* Basic Information */}
                  <div className="space-y-4">
                    <FormField
                      control={form.control}
                      name="name"
                      render={({ field }) => (
                        <FormItem>
                          <FormLabel>Business Name*</FormLabel>
                          <FormControl>
                            <Input disabled placeholder="Enter business name" {...field} />
                          </FormControl>
                          <FormMessage />
                        </FormItem>
                      )}
                    />

                    <FormField
                      control={form.control}
                      name="location"
                      render={({ field }) => (
                        <FormItem>
                          <FormLabel>Location*</FormLabel>
                          <FormControl>
                            <div className="flex items-center space-x-2">
                              <MapPin className="h-4 w-4 text-muted-foreground" />
                              <Input disabled placeholder="Enter business address" {...field} />
                            </div>
                          </FormControl>
                          <FormMessage />
                        </FormItem>
                      )}
                    />

                    <FormField
                      control={form.control}
                      name="website"
                      render={({ field }) => (
                        <FormItem>
                          <FormLabel>Website</FormLabel>
                          <FormControl>
                            <div className="flex items-center space-x-2">
                              <Globe className="h-4 w-4 text-muted-foreground" />
                              <Input disabled placeholder="https://example.com" {...field} />
                            </div>
                          </FormControl>
                          <FormDescription>Enter the full URL including https://</FormDescription>
                          <FormMessage />
                        </FormItem>
                      )}
                    />

                    {/* Phone Numbers */}
                    <div className="space-y-2">
                      <div className="flex items-center justify-between">
                        <FormLabel>Phone Numbers</FormLabel>
                        <Button type="button" variant="outline" size="sm" onClick={() => appendPhone({ number: "" })}>
                          <Plus className="h-3.5 w-3.5 mr-1" />
                          Add Phone
                        </Button>
                      </div>

                      {phoneFields.map((field, index) => (
                        <div key={field.id} className="flex items-center space-x-2">
                          <Phone className="h-4 w-4 text-muted-foreground" />
                          <FormField
                            control={form.control}
                            name={`phones.${index}.number`}
                            render={({ field }) => (
                              <FormItem className="flex-1">
                                <FormControl>
                                  <Input placeholder="Enter phone number" {...field} />
                                </FormControl>
                                <FormMessage />
                              </FormItem>
                            )}
                          />
                          {index > 0 && (
                            <Button
                              type="button"
                              variant="ghost"
                              size="sm"
                              onClick={() => removePhone(index)}
                              className="h-8 w-8 p-0 text-destructive"
                            >
                              <Trash2 className="h-4 w-4" />
                            </Button>
                          )}
                        </div>
                      ))}
                    </div>

                    {/* Services */}
                    <div className="space-y-2">
                      <div className="flex items-center justify-between">
                        <FormLabel>Services</FormLabel>
                        <Button type="button" variant="outline" size="sm" onClick={() => appendService({ name: "" })}>
                          <Plus className="h-3.5 w-3.5 mr-1" />
                          Add Service
                        </Button>
                      </div>

                      {serviceFields.map((field, index) => (
                        <div key={field.id} className="flex items-center space-x-2">
                          <Briefcase className="h-4 w-4 text-muted-foreground" />
                          <FormField
                            control={form.control}
                            name={`services.${index}.name`}
                            render={({ field }) => (
                              <FormItem className="flex-1">
                                <FormControl>
                                  <Input placeholder="Enter service name" {...field} />
                                </FormControl>
                                <FormMessage />
                              </FormItem>
                            )}
                          />
                          {index > 0 && (
                            <Button
                              type="button"
                              variant="ghost"
                              size="sm"
                              onClick={() => removeService(index)}
                              className="h-8 w-8 p-0 text-destructive"
                            >
                              <Trash2 className="h-4 w-4" />
                            </Button>
                          )}
                        </div>
                      ))}
                    </div>
                  </div>
                </TabsContent>

                <TabsContent value="advanced" className="space-y-4 pt-2">
                  {/* Keywords */}
                  <div className="space-y-2">
                    <div className="flex items-center justify-between">
                      <FormLabel>Keywords</FormLabel>
                      <Button type="button" variant="outline" size="sm" onClick={() => appendKeyword({ text: "" })}>
                        <Plus className="h-3.5 w-3.5 mr-1" />
                        Add Keyword
                      </Button>
                    </div>

                    {keywordFields.map((field, index) => (
                      <div key={field.id} className="flex items-center space-x-2">
                        <KeyRound className="h-4 w-4 text-muted-foreground" />
                        <FormField
                          control={form.control}
                          name={`keywords.${index}.text`}
                          render={({ field }) => (
                            <FormItem className="flex-1">
                              <FormControl>
                                <Input placeholder="Enter keyword" {...field} />
                              </FormControl>
                              <FormMessage />
                            </FormItem>
                          )}
                        />
                        {index > 0 && (
                          <Button
                            type="button"
                            variant="ghost"
                            size="sm"
                            onClick={() => removeKeyword(index)}
                            className="h-8 w-8 p-0 text-destructive"
                          >
                            <Trash2 className="h-4 w-4" />
                          </Button>
                        )}
                      </div>
                    ))}
                  </div>

                  {/* Target Locations */}
                  <div className="space-y-2">
                    <div className="flex items-center justify-between">
                      <FormLabel>Target Locations</FormLabel>
                      <Button
                        type="button"
                        variant="outline"
                        size="sm"
                        onClick={() => appendTargetLocation({ name: "" })}
                      >
                        <Plus className="h-3.5 w-3.5 mr-1" />
                        Add Location
                      </Button>
                    </div>

                    {targetLocationFields.map((field, index) => (
                      <div key={field.id} className="flex items-center space-x-2">
                        <Target className="h-4 w-4 text-muted-foreground" />
                        <FormField
                          control={form.control}
                          name={`targetLocations.${index}.name`}
                          render={({ field }) => (
                            <FormItem className="flex-1">
                              <FormControl>
                                <Input placeholder="Enter target location" {...field} />
                              </FormControl>
                              <FormMessage />
                            </FormItem>
                          )}
                        />
                        {index > 0 && (
                          <Button
                            type="button"
                            variant="ghost"
                            size="sm"
                            onClick={() => removeTargetLocation(index)}
                            className="h-8 w-8 p-0 text-destructive"
                          >
                            <Trash2 className="h-4 w-4" />
                          </Button>
                        )}
                      </div>
                    ))}
                  </div>
                  {/* Tags */}
                  <div className="space-y-2">
                    <div className="flex items-center justify-between">
                      <FormLabel>Tags</FormLabel>
                      <Button
                        type="button"
                        variant="outline"
                        size="sm"
                        onClick={() => appendTag({ name: "" })}
                      >
                        <Plus className="h-3.5 w-3.5 mr-1" />
                        Add Tags
                      </Button>
                    </div>

                    {tagFields.map((field, index) => (
                      <div key={field.id} className="flex items-center space-x-2">
                        <TagIcon className="h-4 w-4 text-muted-foreground" />
                        <FormField
                          control={form.control}
                          name={`tags.${index}.name`}
                          render={({ field }) => (
                            <FormItem className="flex-1">
                              <FormControl>
                                <Input placeholder="Enter tag" {...field} />
                              </FormControl>
                              <FormMessage />
                            </FormItem>
                          )}
                        />
                        {index > 0 && (
                          <Button
                            type="button"
                            variant="ghost"
                            size="sm"
                            onClick={() => removeTag(index)}
                            className="h-8 w-8 p-0 text-destructive"
                          >
                            <Trash2 className="h-4 w-4" />
                          </Button>
                        )}
                      </div>
                    ))}
                  </div>

                  <Separator className="my-4" />
                </TabsContent>
              </ScrollArea>
            </Tabs>

            <DialogFooter className="pt-4">
              <Button type="button" variant="outline" onClick={() => setOpen(false)}>
                Cancel
              </Button>
              <Button type="submit">Add Business</Button>
            </DialogFooter>
          </form>
        </Form>
      </DialogContent>
    </Dialog>
  )
}

