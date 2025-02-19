"use client";

import {
  Credenza,
  CredenzaBody,
  CredenzaClose,
  CredenzaContent,
  CredenzaFooter,
  CredenzaHeader,
  CredenzaTitle,
} from "@/components/ui/responsive-modal";
import { useOpenComposeModal } from "@/hooks/use-open-compose-modal";
import { VisuallyHidden } from "@radix-ui/react-visually-hidden";
import { MailCompose } from "./mail-compose";

export default function MailComposeModal() {
  const { isOpen, setIsOpen, close } = useOpenComposeModal();

  return (
    <Credenza open={isOpen} onOpenChange={setIsOpen}>
      <CredenzaContent className="p-0 md:min-w-[500px]">
        <VisuallyHidden>
          <CredenzaHeader>
            <CredenzaTitle>Compose</CredenzaTitle>
          </CredenzaHeader>
        </VisuallyHidden>
        <CredenzaBody>
          <MailCompose onClose={close} />
        </CredenzaBody>
      </CredenzaContent>
    </Credenza>
  );
}
