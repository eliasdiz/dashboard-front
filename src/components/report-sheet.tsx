import { useState } from "react";
import {
  Dialog,
  DialogContent,
  DialogHeader,
  DialogTitle,
  DialogFooter,
} from "@/components/ui/dialog";
import {
  Form,
  FormField,
  FormItem,
  FormControl,
  FormMessage,
} from "@/components/ui/form";
import { Input } from "@/components/ui/input";
import { Button } from "@/components/ui/button";
import { useForm } from "react-hook-form";
import { Label } from "@/components/ui/label";

interface ReportSheetProps {
  isModalOpen: boolean;
  setIsModalOpen: (open: boolean) => void;
}

interface FormValues {
  startDate: string;
  endDate: string;
}

const ReportSheet: React.FC<ReportSheetProps> = ({
  isModalOpen,
  setIsModalOpen,
}) => {
  const [startDate, setStartDate] = useState<string>("");
  const [endDate, setEndDate] = useState<string>("");

  const form = useForm<FormValues>({
    defaultValues: {
      startDate: startDate,
      endDate: endDate,
    },
  });

  const isDownloadEnabled = Boolean(startDate && endDate);

  const handleDownload = () => {
    console.log(form.getValues());
    window.open('/reports', '_blank')
    setIsModalOpen(false)
  };

  return (
    <Dialog open={isModalOpen} onOpenChange={setIsModalOpen}>
      <DialogContent className="max-w-md w-full bg-white rounded-lg p-6 shadow-lg">
        <DialogHeader className="text-center">
          <DialogTitle>Generate Report</DialogTitle>
        </DialogHeader>

        <div className="space-y-4">
          <Form {...form}>
            <div className="flex gap-4">
              {/* Input de Start Date */}
              <FormField
                control={form.control}
                name="startDate"
                render={({ field }) => (
                  <FormItem className="w-1/2">
                    <Label htmlFor="startDate">Start Date</Label>
                    <FormControl>
                      <Input
                        id="startDate"
                        type="date"
                        {...field}
                        onChange={(e) => {
                          field.onChange(e.target.value);
                          setStartDate(e.target.value);
                        }}
                      />
                    </FormControl>
                    <FormMessage />
                  </FormItem>
                )}
              />

              {/* Input de End Date */}
              <FormField
                control={form.control}
                name="endDate"
                render={({ field }) => (
                  <FormItem className="w-1/2">
                    <Label htmlFor="endDate">End Date</Label>
                    <FormControl>
                      <Input
                        id="endDate"
                        type="date"
                        {...field}
                        onChange={(e) => {
                          field.onChange(e.target.value);
                          setEndDate(e.target.value);
                        }}
                      />
                    </FormControl>
                    <FormMessage />
                  </FormItem>
                )}
              />
            </div>
          </Form>
        </div>

        <DialogFooter className="flex justify-between mt-4">
          <Button variant="outline" onClick={() => setIsModalOpen(false)}>
            Cancel
          </Button>
          <Button disabled={!isDownloadEnabled} onClick={handleDownload}>
            View Report
          </Button>
        </DialogFooter>
      </DialogContent>
    </Dialog>
  );
};

export default ReportSheet;
