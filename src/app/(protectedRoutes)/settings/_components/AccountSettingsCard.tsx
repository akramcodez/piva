'use client';

import React, { useState, useEffect } from 'react';
import { Button } from '@/components/ui/button';
import {
  Dialog,
  DialogContent,
  DialogDescription,
  DialogFooter,
  DialogHeader,
  DialogTitle,
  DialogTrigger,
  DialogClose,
} from '@/components/ui/dialog';
import {
  HoverCard,
  HoverCardContent,
  HoverCardTrigger,
} from '@/components/ui/hover-card';
import { LucideLogOut, LucideTrash2, LucideUser } from 'lucide-react';
import Link from 'next/link';
import { User } from '@prisma/client';
import { useAuth } from '@clerk/nextjs';
import { toast } from 'sonner';
import { deleteAccount } from '@/actions/auth';

type Props = {
  user: User;
};

export const AccountSettingsCard = ({ user }: Props) => {
  const { signOut } = useAuth();

  const [isSmallScreen, setIsSmallScreen] = useState(false);

  useEffect(() => {
    const checkScreenSize = () => {
      setIsSmallScreen(window.innerWidth < 1024);
    };
    checkScreenSize();

    window.addEventListener('resize', checkScreenSize);

    return () => window.removeEventListener('resize', checkScreenSize);
  }, []);

  const onLogout = async () => {
    await signOut({ redirectUrl: '/' });
  };

  const onDelete = async () => {
    try {
      const result = await deleteAccount();
      if (result.success) {
        toast.success(`${user.name.toUpperCase()} Account Deleted`);
        await signOut({ redirectUrl: '/' });
      } else {
        toast.error(result.message || 'Failed to Delete Account');
      }
    } catch (error) {
      console.error('Failed to Delete Account: ', error);
      toast.error('Server Failed to Delete Account');
    }
  };

  return (
    <div className="p-4 border rounded-lg bg-background shadow-sm">
      <h2 className="text-lg font-semibold mb-4">Account Settings</h2>
      <div className="space-y-3">
        <div className="flex items-center justify-between text-sm">
          <span className="text-muted-foreground">Email</span>
          <span className="font-medium">{user.email}</span>
        </div>
        <div className="flex items-center justify-between text-sm">
          <span className="text-muted-foreground">Subscription</span>
          <span
            className={`font-medium px-2 py-0.5 rounded-full text-xs ${
              user.subscription
                ? 'bg-green-100 text-green-800'
                : 'bg-gray-100 text-gray-800'
            }`}
          >
            {user.subscription ? 'Active' : 'Inactive'}
          </span>
        </div>
        <div className="pt-3 border-t flex flex-col sm:flex-row gap-2">
          {isSmallScreen ? (
            <HoverCard>
              <HoverCardTrigger asChild>
                <Button variant="outline" className="flex-1">
                  <LucideUser className="w-4 h-4 mr-2" /> Edit Profile
                </Button>
              </HoverCardTrigger>
              <HoverCardContent className="glassBackground border-[2px] border-border px-2 py-1 [word-spacing:0.1em] text-sm">
                This feature is available only on larger screens.
              </HoverCardContent>
            </HoverCard>
          ) : (
            <Button asChild variant="outline" className="flex-1">
              <Link href="/profile/edit">
                <LucideUser className="w-4 h-4 mr-2" /> Edit Profile
              </Link>
            </Button>
          )}

          <Button
            variant="outline"
            className="w-full flex-1"
            onClick={onLogout}
          >
            <LucideLogOut className="w-4 h-4 mr-2" /> Logout
          </Button>
        </div>
        <div className="pt-3 border-t">
          <Dialog>
            <DialogTrigger asChild>
              <Button
                variant="destructive"
                className="w-full justify-center cursor-pointer"
              >
                <LucideTrash2 className="w-4 h-4 mr-2" />
                Delete Account
              </Button>
            </DialogTrigger>
            <DialogContent>
              <DialogHeader>
                <DialogTitle>Are you absolutely sure?</DialogTitle>
                <DialogDescription>
                  This action cannot be undone. This will permanently delete
                  your account and remove all your data from our servers.
                </DialogDescription>
              </DialogHeader>
              <DialogFooter className="gap-2">
                <DialogClose asChild>
                  <Button variant="outline">Cancel</Button>
                </DialogClose>
                <Button
                  variant="destructive"
                  className="cursor-pointer"
                  onClick={onDelete}
                >
                  Confirm Deletion
                </Button>
              </DialogFooter>
            </DialogContent>
          </Dialog>
          <p className="text-xs text-muted-foreground mt-2 text-center">
            This action is permanent and cannot be undone.
          </p>
        </div>
      </div>
    </div>
  );
};
