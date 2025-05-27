import { useActiveConnection, useConnections } from '@/hooks/use-connections';
import { Dialog, DialogClose } from '@/components/ui/dialog';
import { useEmailAliases } from '@/hooks/use-email-aliases';
import { cleanEmailAddresses } from '@/lib/email-utils';
import { useHotkeysContext } from 'react-hotkeys-hook';
import { useTRPC } from '@/providers/query-provider';
import { useEffect, useMemo, useState } from 'react';
import { useMutation } from '@tanstack/react-query';
import { EmailComposer } from './email-composer';
import { useSession } from '@/lib/auth-client';
import { serializeFiles } from '@/lib/schemas';
import { useDraft } from '@/hooks/use-drafts';
import { useNavigate } from 'react-router';
import { useTranslations } from 'use-intl';
import { useQueryState } from 'nuqs';
import { X } from '../icons/icons';
import posthog from 'posthog-js';
import { toast } from 'sonner';
import './prosemirror.css';

// Define the draft type to include CC and BCC fields
type DraftType = {
  id: string;
  content?: string;
  subject?: string;
  to?: string[];
  cc?: string[];
  bcc?: string[];
};

// Define the connection type
type Connection = {
  id: string;
  email: string;
  name: string | null;
  picture: string | null;
  createdAt: Date;
};

export function CreateEmail({
  initialTo = '',
  initialSubject = '',
  initialBody = '',
  initialCc = '',
  initialBcc = '',
  draftId: propDraftId,
}: {
  initialTo?: string;
  initialSubject?: string;
  initialBody?: string;
  initialCc?: string;
  initialBcc?: string;
  draftId?: string | null;
}) {
  const { data: session } = useSession();
  const { data: connections } = useConnections();
  const { data: aliases } = useEmailAliases();
  const [draftId, setDraftId] = useQueryState('draftId');
  const {
    data: draft,
    isLoading: isDraftLoading,
    error: draftError,
  } = useDraft(draftId ?? propDraftId ?? null);
  const t = useTranslations();
  const navigate = useNavigate();
  const { enableScope, disableScope } = useHotkeysContext();
  const [isDraftFailed, setIsDraftFailed] = useState(false);
  const trpc = useTRPC();
  const { mutateAsync: sendEmail } = useMutation(trpc.mail.send.mutationOptions());
  const [isComposeOpen, setIsComposeOpen] = useQueryState('isComposeOpen');
  const { data: activeConnection } = useActiveConnection();

  // If there was an error loading the draft, set the failed state
  useEffect(() => {
    if (draftError) {
      console.error('Error loading draft:', draftError);
      setIsDraftFailed(true);
      toast.error('Failed to load draft');
    }
  }, [draftError]);

  const activeAccount = useMemo(() => {
    if (!session) return null;
    if (!connections) return null;

    // Properly access the connections array from the data structure
    const connectionsList = connections.connections as Connection[];
    if (!connectionsList || !Array.isArray(connectionsList)) return null;

    return connectionsList.find((connection) => connection.id === activeConnection?.id);
  }, [session, connections, activeConnection]);

  const userEmail = activeAccount?.email || activeConnection?.email || session?.user?.email || '';
  const userName = activeAccount?.name || activeConnection?.name || session?.user?.name || '';
  
  const handleSendEmail = async (data: {
    to: string[];
    cc?: string[];
    bcc?: string[];
    subject: string;
    message: string;
    attachments: File[];
  }) => {
    // Use the selected from email or the first alias (or default user email)
    const fromEmail = aliases?.[0]?.email ?? userEmail;

    await sendEmail({
      to: data.to.map((email) => ({ email, name: email.split('@')[0] || email })),
      cc: data.cc?.map((email) => ({ email, name: email.split('@')[0] || email })),
      bcc: data.bcc?.map((email) => ({ email, name: email.split('@')[0] || email })),
      subject: data.subject,
      message: data.message,
      attachments: await serializeFiles(data.attachments),
      fromEmail: userName.trim() 
      ? `${userName.replace(/[<>]/g, '')} <${fromEmail}>` 
      : fromEmail,
      draftId: draftId ?? undefined,
    });

    // Clear draft ID from URL
    await setDraftId(null);

    // Track different email sending scenarios
    if (data.cc && data.cc.length > 0 && data.bcc && data.bcc.length > 0) {
      posthog.capture('Create Email Sent with CC and BCC');
    } else if (data.cc && data.cc.length > 0) {
      posthog.capture('Create Email Sent with CC');
    } else if (data.bcc && data.bcc.length > 0) {
      posthog.capture('Create Email Sent with BCC');
    } else {
      posthog.capture('Create Email Sent');
    }

    toast.success(t('pages.createEmail.emailSentSuccessfully'));
  };

  useEffect(() => {
    if (propDraftId && !draftId) {
      setDraftId(propDraftId);
    }
  }, [propDraftId, draftId, setDraftId]);

  // Process initial email addresses
  const processInitialEmails = (emailStr: string) => {
    if (!emailStr) return [];
    const cleanedAddresses = cleanEmailAddresses(emailStr);
    return cleanedAddresses || [];
  };

  // Cast draft to our extended type that includes CC and BCC
  const typedDraft = draft as unknown as DraftType;

  const handleDialogClose = (open: boolean) => {
    setIsComposeOpen(open ? 'true' : null);
  };

  return (
    <>
      <Dialog open={!!isComposeOpen} onOpenChange={handleDialogClose}>
        <div className="flex min-h-screen flex-col items-center justify-center gap-1">
          <div className="flex w-[750px] justify-start">
            <DialogClose asChild className="flex">
              <button className="flex items-center gap-1 rounded-lg bg-[#F0F0F0] px-2 py-1.5 dark:bg-[#1A1A1A]">
                <X className="mt-0.5 h-3.5 w-3.5 fill-[#6D6D6D] dark:fill-[#929292]" />
                <span className="text-sm font-medium text-[#6D6D6D] dark:text-white">esc</span>
              </button>
            </DialogClose>
          </div>
          {isDraftLoading ? (
            <div className="flex h-[600px] w-[750px] items-center justify-center rounded-2xl border">
              <div className="text-center">
                <div className="mx-auto mb-4 h-6 w-6 animate-spin rounded-full border-2 border-gray-300 border-t-blue-600"></div>
                <p>Loading draft...</p>
              </div>
            </div>
          ) : (
            <EmailComposer
              key={typedDraft?.id || 'composer'}
              className="mb-12 rounded-2xl border"
              onSendEmail={handleSendEmail}
              initialMessage={typedDraft?.content || initialBody}
              initialTo={
                typedDraft?.to?.map((e: string) => e.replace(/[<>]/g, '')) ||
                processInitialEmails(initialTo)
              }
              initialCc={
                typedDraft?.cc?.map((e: string) => e.replace(/[<>]/g, '')) ||
                processInitialEmails(initialCc)
              }
              initialBcc={
                typedDraft?.bcc?.map((e: string) => e.replace(/[<>]/g, '')) ||
                processInitialEmails(initialBcc)
              }
              initialSubject={typedDraft?.subject || initialSubject}
              autofocus={true}
            />
          )}
        </div>
      </Dialog>
    </>
  );
}
