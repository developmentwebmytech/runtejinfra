"use client"

import * as React from "react"
import { useForm } from "react-hook-form"
import { zodResolver } from "@hookform/resolvers/zod"
import * as z from "zod"
import {
  Dialog,
  DialogContent,
  DialogDescription,
  DialogHeader,
  DialogTitle,
  DialogTrigger,
} from "@/components/ui/dialog"
import { Form, FormControl, FormField, FormItem, FormLabel, FormMessage } from "@/components/ui/form"
import { Input } from "@/components/ui/input"
import { Button } from "@/components/ui/button"
import { Textarea } from "@/components/ui/textarea"
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from "@/components/ui/select"
import { Checkbox } from "@/components/ui/checkbox"
import { toast } from "@/hooks/use-toast"
import { Loader2, Upload } from "lucide-react"

const formSchema = z.object({
  fullName: z.string().min(2, "Full Name is required"),
  organization: z.string().optional(),
  mobile: z.string().min(10, "Valid mobile number is required"),
  email: z.string().email("Invalid email address"),
  location: z.string().min(2, "Location is required"),
  requirementType: z.enum([
    "Residential",
    "Commercial",
    "Industrial",
    "Road / Infrastructure",
    "Renovation",
    "Govt / Tender Project",
  ]),
  area: z.string().optional(),
  budget: z.string().optional(),
  startDate: z.string().optional(),
  description: z.string().min(10, "Please provide more details"),
  consent: z.boolean().refine((val) => val === true, "Consent is mandatory"),
})

export function EnquiryModal() {
  const [isOpen, setIsOpen] = React.useState(false)
  const [isSubmitting, setIsSubmitting] = React.useState(false)

  const form = useForm<z.infer<typeof formSchema>>({
    resolver: zodResolver(formSchema),
    defaultValues: {
      fullName: "",
      organization: "",
      mobile: "",
      email: "",
      location: "",
      requirementType: "Residential",
      area: "",
      budget: "",
      startDate: "",
      description: "",
      consent: false,
    },
  })

  async function onSubmit(values: z.infer<typeof formSchema>) {
    setIsSubmitting(true)
    try {
      const response = await fetch("/api/enquiry", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify(values),
      })

      if (!response.ok) throw new Error("Failed to submit")

      toast({
        title: "Enquiry Submitted",
        description: "Our team will contact you shortly.",
      })
      setIsOpen(false)
      form.reset()
    } catch (error) {
      toast({
        title: "Error",
        description: "Something went wrong. Please try again.",
        variant: "destructive",
      })
    } finally {
      setIsSubmitting(false)
    }
  }

  return (
    <Dialog open={isOpen} onOpenChange={setIsOpen}>
      <DialogTrigger asChild>
        <Button className="bg-accent hover:bg-accent/90 text-white px-8 py-6 text-lg font-bold uppercase tracking-wider rounded-none shadow-[4px_4px_0px_0px_rgba(0,0,0,1)] active:translate-x-1 active:translate-y-1 active:shadow-none transition-all">
          👉 Request a Quotation
        </Button>
      </DialogTrigger>
      <DialogContent className="max-w-4xl max-h-[90vh] overflow-y-auto border-4 border-primary p-0 bg-background rounded-none">
        <div className="bg-primary text-primary-foreground p-8">
          <DialogHeader>
            <DialogTitle className="text-4xl font-black uppercase tracking-tighter italic leading-none">
              CLIENT / ENQUIRY FORM
            </DialogTitle>
            <DialogDescription className="text-primary-foreground/80 font-bold uppercase tracking-widest text-sm mt-2">
              Runtej Infra Infrastructure Specialists
            </DialogDescription>
          </DialogHeader>
        </div>

        <div className="p-8">
          <Form {...form}>
            <form onSubmit={form.handleSubmit(onSubmit)} className="space-y-10">
              <section className="space-y-6">
                <h3 className="text-xl font-black uppercase tracking-tight italic border-b-4 border-primary pb-2 flex items-center gap-2">
                  <span className="bg-primary text-white px-2 py-0.5 not-italic">01</span> CLIENT INFORMATION
                </h3>
                <div className="grid grid-cols-1 md:grid-cols-2 gap-8">
                  <FormField
                    control={form.control}
                    name="fullName"
                    render={({ field }) => (
                      <FormItem>
                        <FormLabel className="font-bold uppercase tracking-tight">Full Name *</FormLabel>
                        <FormControl>
                          <Input
                            placeholder="Enter your full name"
                            className="border-2 border-primary focus-visible:ring-0 rounded-none h-12"
                            {...field}
                          />
                        </FormControl>
                        <FormMessage />
                      </FormItem>
                    )}
                  />
                  <FormField
                    control={form.control}
                    name="organization"
                    render={({ field }) => (
                      <FormItem>
                        <FormLabel className="font-bold uppercase tracking-tight">Organization</FormLabel>
                        <FormControl>
                          <Input
                            placeholder="Company name (optional)"
                            className="border-2 border-primary focus-visible:ring-0 rounded-none h-12"
                            {...field}
                          />
                        </FormControl>
                        <FormMessage />
                      </FormItem>
                    )}
                  />
                  <FormField
                    control={form.control}
                    name="mobile"
                    render={({ field }) => (
                      <FormItem>
                        <FormLabel className="font-bold uppercase tracking-tight">Mobile Number *</FormLabel>
                        <FormControl>
                          <Input
                            placeholder="+91"
                            className="border-2 border-primary focus-visible:ring-0 rounded-none h-12"
                            {...field}
                          />
                        </FormControl>
                        <FormMessage />
                      </FormItem>
                    )}
                  />
                  <FormField
                    control={form.control}
                    name="email"
                    render={({ field }) => (
                      <FormItem>
                        <FormLabel className="font-bold uppercase tracking-tight">Email Address *</FormLabel>
                        <FormControl>
                          <Input
                            placeholder="email@example.com"
                            className="border-2 border-primary focus-visible:ring-0 rounded-none h-12"
                            {...field}
                          />
                        </FormControl>
                        <FormMessage />
                      </FormItem>
                    )}
                  />
                  <FormField
                    control={form.control}
                    name="location"
                    render={({ field }) => (
                      <FormItem className="md:col-span-2">
                        <FormLabel className="font-bold uppercase tracking-tight">
                          Project Location (City / State) *
                        </FormLabel>
                        <FormControl>
                          <Input
                            placeholder="e.g. Mumbai, Maharashtra"
                            className="border-2 border-primary focus-visible:ring-0 rounded-none h-12"
                            {...field}
                          />
                        </FormControl>
                        <FormMessage />
                      </FormItem>
                    )}
                  />
                </div>
              </section>

              <section className="space-y-6">
                <h3 className="text-xl font-black uppercase tracking-tight italic border-b-4 border-primary pb-2 flex items-center gap-2">
                  <span className="bg-primary text-white px-2 py-0.5 not-italic">02</span> PROJECT DETAILS
                </h3>
                <div className="grid grid-cols-1 md:grid-cols-2 gap-8">
                  <FormField
                    control={form.control}
                    name="requirementType"
                    render={({ field }) => (
                      <FormItem>
                        <FormLabel className="font-bold uppercase tracking-tight">Nature of Requirement *</FormLabel>
                        <Select onValueChange={field.onChange} defaultValue={field.value}>
                          <FormControl>
                            <SelectTrigger className="border-2 border-primary focus:ring-0 rounded-none h-12">
                              <SelectValue placeholder="Select requirement type" />
                            </SelectTrigger>
                          </FormControl>
                          <SelectContent className="rounded-none border-2 border-primary">
                            <SelectItem value="Residential">Residential</SelectItem>
                            <SelectItem value="Commercial">Commercial</SelectItem>
                            <SelectItem value="Industrial">Industrial</SelectItem>
                            <SelectItem value="Road / Infrastructure">Road / Infrastructure</SelectItem>
                            <SelectItem value="Renovation">Renovation</SelectItem>
                            <SelectItem value="Govt / Tender Project">Govt / Tender Project</SelectItem>
                          </SelectContent>
                        </Select>
                        <FormMessage />
                      </FormItem>
                    )}
                  />
                  <FormField
                    control={form.control}
                    name="area"
                    render={({ field }) => (
                      <FormItem>
                        <FormLabel className="font-bold uppercase tracking-tight">Approximate Area</FormLabel>
                        <FormControl>
                          <Input
                            placeholder="sq. ft. / acres"
                            className="border-2 border-primary focus-visible:ring-0 rounded-none h-12"
                            {...field}
                          />
                        </FormControl>
                        <FormMessage />
                      </FormItem>
                    )}
                  />
                </div>
              </section>

              <section className="space-y-4">
                <FormField
                  control={form.control}
                  name="description"
                  render={({ field }) => (
                    <FormItem>
                      <FormLabel className="font-bold uppercase tracking-tight">Brief Description *</FormLabel>
                      <FormControl>
                        <Textarea
                          placeholder="Tell us more about your project requirements..."
                          className="min-h-[120px] border-2 border-primary focus-visible:ring-0 rounded-none"
                          {...field}
                        />
                      </FormControl>
                      <FormMessage />
                    </FormItem>
                  )}
                />
              </section>

              <section className="p-6 border-2 border-dashed border-primary/40 bg-accent/5 space-y-2">
                <p className="font-bold uppercase tracking-tight text-sm">Attachments (Optional)</p>
                <div className="flex items-center justify-center w-full">
                  <label className="flex flex-col items-center justify-center w-full h-32 border-2 border-primary border-dashed cursor-pointer hover:bg-primary/5">
                    <div className="flex flex-col items-center justify-center pt-5 pb-6">
                      <Upload className="w-8 h-8 mb-4 text-primary" />
                      <p className="mb-2 text-sm font-bold uppercase">Drag & Drop drawings / BOQ</p>
                    </div>
                    <input type="file" className="hidden" />
                  </label>
                </div>
              </section>

              <section className="flex flex-row items-start space-x-3 space-y-0 p-4 bg-primary/5 border-l-4 border-primary">
                <FormField
                  control={form.control}
                  name="consent"
                  render={({ field }) => (
                    <FormControl>
                      <Checkbox
                        checked={field.value}
                        onCheckedChange={field.onChange}
                        className="border-2 border-primary data-[state=checked]:bg-primary rounded-none"
                      />
                    </FormControl>
                  )}
                />
                <div className="space-y-1 leading-none">
                  <FormLabel className="text-sm font-medium">
                    I authorize Runtej Infra to contact me for further discussion regarding this enquiry.
                  </FormLabel>
                </div>
              </section>

              <Button
                type="submit"
                disabled={isSubmitting}
                className="w-full bg-accent hover:bg-accent/90 text-white py-8 text-xl font-black uppercase tracking-widest rounded-none shadow-[4px_4px_0px_0px_rgba(0,0,0,1)] active:translate-x-1 active:translate-y-1 active:shadow-none transition-all"
              >
                {isSubmitting ? (
                  <>
                    <Loader2 className="mr-2 h-6 w-6 animate-spin" />
                    Processing...
                  </>
                ) : (
                  "👉 Submit Enquiry"
                )}
              </Button>

              <p className="text-[10px] text-muted-foreground text-center uppercase tracking-widest leading-relaxed">
                🔐 This enquiry is for information purposes only and does not constitute a binding offer, quotation, or
                contract.
              </p>
            </form>
          </Form>
        </div>
      </DialogContent>
    </Dialog>
  )
}
