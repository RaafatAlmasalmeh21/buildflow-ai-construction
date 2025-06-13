
import { useState } from 'react';
import { useNavigate } from 'react-router-dom';
import { useForm } from 'react-hook-form';
import { zodResolver } from '@hookform/resolvers/zod';
import * as z from 'zod';
import { SidebarTrigger } from '@/components/ui/sidebar';
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card';
import { Button } from '@/components/ui/button';
import { Input } from '@/components/ui/input';
import { Textarea } from '@/components/ui/textarea';
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from '@/components/ui/select';
import { Form, FormControl, FormField, FormItem, FormLabel, FormMessage } from '@/components/ui/form';
import { AlertTriangle, Upload, X } from 'lucide-react';
import { supabase } from '@/integrations/supabase/client';
import { useAuth } from '@/contexts/AuthContext';
import { toast } from 'sonner';

const incidentSchema = z.object({
  title: z.string().min(1, 'Title is required').max(255, 'Title too long'),
  severity: z.enum(['low', 'medium', 'high'], {
    required_error: 'Please select a severity level',
  }),
  description: z.string().min(10, 'Description must be at least 10 characters'),
});

type IncidentFormData = z.infer<typeof incidentSchema>;

const NewIncident = () => {
  const { user, profile } = useAuth();
  const navigate = useNavigate();
  const [isSubmitting, setIsSubmitting] = useState(false);
  const [selectedFile, setSelectedFile] = useState<File | null>(null);
  const [filePreview, setFilePreview] = useState<string | null>(null);

  const form = useForm<IncidentFormData>({
    resolver: zodResolver(incidentSchema),
    defaultValues: {
      title: '',
      severity: undefined,
      description: '',
    },
  });

  const handleFileChange = (event: React.ChangeEvent<HTMLInputElement>) => {
    const file = event.target.files?.[0];
    if (file) {
      setSelectedFile(file);
      
      // Create preview for images
      if (file.type.startsWith('image/')) {
        const reader = new FileReader();
        reader.onload = () => {
          setFilePreview(reader.result as string);
        };
        reader.readAsDataURL(file);
      } else {
        setFilePreview(null);
      }
    }
  };

  const removeFile = () => {
    setSelectedFile(null);
    setFilePreview(null);
  };

  const uploadFile = async (file: File): Promise<string | null> => {
    try {
      const fileExt = file.name.split('.').pop();
      const fileName = `${Date.now()}-${Math.random().toString(36).substring(2)}.${fileExt}`;
      const filePath = `incidents/${fileName}`;

      const { error: uploadError } = await supabase.storage
        .from('incident-media')
        .upload(filePath, file);

      if (uploadError) {
        console.error('Upload error:', uploadError);
        throw uploadError;
      }

      return filePath;
    } catch (error) {
      console.error('Error uploading file:', error);
      throw error;
    }
  };

  const sendEmailNotification = async (incidentData: any) => {
    try {
      // This would typically be handled by an edge function or API route
      // For now, we'll just log it
      console.log('Email notification would be sent to safety@company.com', {
        incident: incidentData,
        reporter: profile,
      });
      
      // In a real implementation, you'd call a Supabase Edge Function or API route here
      // that handles the Resend API integration
      
    } catch (error) {
      console.error('Error sending email notification:', error);
      // Don't throw here as the incident was already saved
    }
  };

  const onSubmit = async (data: IncidentFormData) => {
    if (!user || !profile) {
      toast.error('You must be logged in to submit an incident report');
      return;
    }

    setIsSubmitting(true);

    try {
      let attachmentUrl = null;

      // Upload file if selected
      if (selectedFile) {
        attachmentUrl = await uploadFile(selectedFile);
      }

      // Insert incident record
      const { data: incident, error: insertError } = await supabase
        .from('incidents')
        .insert({
          title: data.title,
          severity: data.severity,
          description: data.description,
          attachment_url: attachmentUrl,
          reported_by: user.id,
          incident_date: new Date().toISOString(),
        })
        .select()
        .single();

      if (insertError) {
        console.error('Error inserting incident:', insertError);
        throw insertError;
      }

      // Send email notification
      await sendEmailNotification({
        ...incident,
        reporter_name: `${profile.first_name} ${profile.last_name}`,
        reporter_email: profile.email,
      });

      toast.success('Incident report submitted successfully');
      navigate('/incidents/mine');
    } catch (error) {
      console.error('Error submitting incident:', error);
      toast.error('Failed to submit incident report. Please try again.');
    } finally {
      setIsSubmitting(false);
    }
  };

  return (
    <div className="p-6">
      {/* Header */}
      <div className="flex items-center gap-4 mb-6">
        <SidebarTrigger />
        <div>
          <h1 className="text-3xl font-bold">New Incident Report</h1>
          <p className="text-muted-foreground">Report a safety incident or near miss</p>
        </div>
      </div>

      {/* Form */}
      <Card className="max-w-2xl">
        <CardHeader>
          <CardTitle className="flex items-center gap-2">
            <AlertTriangle className="h-5 w-5 text-orange-500" />
            Incident Details
          </CardTitle>
        </CardHeader>
        <CardContent>
          <Form {...form}>
            <form onSubmit={form.handleSubmit(onSubmit)} className="space-y-6">
              {/* Title */}
              <FormField
                control={form.control}
                name="title"
                render={({ field }) => (
                  <FormItem>
                    <FormLabel>Title</FormLabel>
                    <FormControl>
                      <Input 
                        placeholder="Brief description of the incident" 
                        {...field} 
                      />
                    </FormControl>
                    <FormMessage />
                  </FormItem>
                )}
              />

              {/* Severity */}
              <FormField
                control={form.control}
                name="severity"
                render={({ field }) => (
                  <FormItem>
                    <FormLabel>Severity Level</FormLabel>
                    <Select onValueChange={field.onChange} defaultValue={field.value}>
                      <FormControl>
                        <SelectTrigger>
                          <SelectValue placeholder="Select severity level" />
                        </SelectTrigger>
                      </FormControl>
                      <SelectContent>
                        <SelectItem value="low">Low - Minor incident, no injury</SelectItem>
                        <SelectItem value="medium">Medium - Potential for injury</SelectItem>
                        <SelectItem value="high">High - Serious injury or major incident</SelectItem>
                      </SelectContent>
                    </Select>
                    <FormMessage />
                  </FormItem>
                )}
              />

              {/* Description */}
              <FormField
                control={form.control}
                name="description"
                render={({ field }) => (
                  <FormItem>
                    <FormLabel>Description</FormLabel>
                    <FormControl>
                      <Textarea 
                        placeholder="Detailed description of what happened, when, where, and any contributing factors..."
                        className="min-h-[100px]"
                        {...field} 
                      />
                    </FormControl>
                    <FormMessage />
                  </FormItem>
                )}
              />

              {/* Media Upload */}
              <div className="space-y-4">
                <label className="block text-sm font-medium">
                  Media (Optional)
                </label>
                
                {!selectedFile ? (
                  <div className="border-2 border-dashed border-gray-300 rounded-lg p-6 text-center">
                    <Upload className="h-8 w-8 mx-auto mb-2 text-gray-400" />
                    <p className="text-sm text-gray-600 mb-2">
                      Upload photos or audio recordings
                    </p>
                    <input
                      type="file"
                      accept="image/*,audio/*"
                      onChange={handleFileChange}
                      className="hidden"
                      id="media-upload"
                    />
                    <Button
                      type="button"
                      variant="outline"
                      onClick={() => document.getElementById('media-upload')?.click()}
                    >
                      Choose File
                    </Button>
                  </div>
                ) : (
                  <div className="border rounded-lg p-4">
                    <div className="flex items-center justify-between mb-2">
                      <span className="text-sm font-medium">{selectedFile.name}</span>
                      <Button
                        type="button"
                        variant="ghost"
                        size="sm"
                        onClick={removeFile}
                      >
                        <X className="h-4 w-4" />
                      </Button>
                    </div>
                    
                    {filePreview && (
                      <img 
                        src={filePreview} 
                        alt="Preview" 
                        className="max-w-full h-32 object-cover rounded"
                      />
                    )}
                    
                    <p className="text-xs text-gray-500 mt-2">
                      {(selectedFile.size / 1024 / 1024).toFixed(2)} MB
                    </p>
                  </div>
                )}
              </div>

              {/* Submit Button */}
              <div className="flex gap-4">
                <Button 
                  type="submit" 
                  disabled={isSubmitting}
                  className="flex-1"
                >
                  {isSubmitting ? 'Submitting...' : 'Submit Report'}
                </Button>
                <Button 
                  type="button" 
                  variant="outline"
                  onClick={() => navigate('/dashboard')}
                >
                  Cancel
                </Button>
              </div>
            </form>
          </Form>
        </CardContent>
      </Card>
    </div>
  );
};

export default NewIncident;
