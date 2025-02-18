"use client";

import {
  Credenza,
  CredenzaBody,
  CredenzaContent,
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
      <CredenzaContent className="p-0">
        <VisuallyHidden>
          <CredenzaHeader>
            <CredenzaTitle>Compose</CredenzaTitle>
          </CredenzaHeader>
        </VisuallyHidden>
        <CredenzaBody className="hide-scrollbar overflow-y-auto px-0 py-0">
          <MailCompose onClose={close} />
        </CredenzaBody>
      </CredenzaContent>
    </Credenza>
  );
}
