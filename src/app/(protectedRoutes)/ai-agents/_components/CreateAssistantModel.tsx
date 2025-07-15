'use client';

import { createAssistant } from '@/actions/vapi';
import { Button } from '@/components/ui/button';
import {
  Dialog,
  DialogContent,
  DialogHeader,
  DialogTitle,
  DialogFooter,
} from '@/components/ui/dialog';
import { Input } from '@/components/ui/input';
import { Loader2 } from 'lucide-react';
import { useRouter } from 'next/navigation';
import React, { useState } from 'react';
import { toast } from 'sonner';

type Props = {
  isOpen: boolean;
  onClose: () => void;
};

const CreateAssistantModel = ({ isOpen, onClose }: Props) => {
  const [name, setName] = useState('');
  const [loading, setLoading] = useState(false);
  const router = useRouter();

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    setLoading(true);
    try {
      const res = await createAssistant(name);
      if (!res.success) {
        throw new Error(res.message);
      }
      router.refresh();
      setName('');
      onClose();
      toast.success('Assistant created successfully');
    } catch (error) {
      toast.error('failed to create Assistant');
    } finally {
      setLoading(false);
    }
  };

  return (
    <Dialog open={isOpen} onOpenChange={onClose}>
      <DialogContent className="sm:max-w-md bg-card text-foreground border border-input shadow-xl p-4">
        <DialogHeader>
          <DialogTitle className="text-xl font-semibold">
            Create Assistant
          </DialogTitle>
        </DialogHeader>
        <form onSubmit={handleSubmit}>
          <div className="mb-6">
            <label className="block font-medium mb-2">Assistant Name</label>
            <Input
              value={name}
              onChange={(e) => setName(e.target.value)}
              placeholder="Enter Assistant Name"
              className="bg-neutral-800 border-neutral-700"
              required
            />
            <p className="text-sm text-neutral-400 mt-2">
              This name will be used to identify your assistant
            </p>
          </div>
          <div className="flex justify-end gap-3">
            <Button
              type="button"
              onClick={onClose}
              className="bg-red-900 hover:bg-red-700 text-accent-foreground cursor-pointer"
            >
              Cancel
            </Button>
            <Button
              type="submit"
              disabled={!name.trim() || loading}
              className="cursor-pointer"
            >
              {loading ? (
                <>
                  <Loader2 className="mr-2 animate-spin" />
                  Creating...
                </>
              ) : (
                'Create Assistant'
              )}
            </Button>
          </div>
        </form>
        <DialogFooter></DialogFooter>
      </DialogContent>
    </Dialog>
  );
};

export default CreateAssistantModel;
