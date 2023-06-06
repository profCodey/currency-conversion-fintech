import { Button, FileButton, FileInput, Loader } from "@mantine/core";
import { useState } from "react";
import { FormFile } from "./form-file";
import {
  useGetBusinessDocuments,
  useUpdateOnboardingDocuments,
} from "@/api/hooks/onboarding";
import { useGetCurrentUser } from "@/api/hooks/user";

export function DocumentUpload() {
  const { data } = useGetCurrentUser();
  const { mutate: updateDocuments, isLoading } = useUpdateOnboardingDocuments(
    data?.data.id
  );
  const { data: documents, isLoading: documentLoading } =
    useGetBusinessDocuments(data?.data.id);

  const [certificateOfRegistration, setCertificateOfRegistration] =
    useState<File | null>(null);
  const [utilityBill, setUtilityBill] = useState<File | null>(null);
  const [articleOfAssociation, setArticleOfAssociation] = useState<File | null>(
    null
  );
  const [documentDirectors, setDocumentDirectors] = useState<File | null>(null);
  const [documentShareholders, setDocumentShareholders] = useState<File | null>(
    null
  );
  const [regulatoryLicenses, setRegulatoryLicenses] = useState<File | null>(
    null
  );

  function handleSubmit(e: any) {
    e.preventDefault();
    const payload = {
      certificate_of_registration: certificateOfRegistration,
      utility_bill: utilityBill,
      aricle_of_association: articleOfAssociation,
      document_directors: documentDirectors,
      document_shareholders: documentShareholders,
      regulatory_licenses: regulatoryLicenses,
    };

    updateDocuments(payload);
  }

  if (isLoading) {
    return (
      <span>
        Loading <Loader color="green" />
      </span>
    );
  }

  return (
    <section>
      <div className="text-gray-90 mb-4">
        All Document must be in <strong>JPEG / PNG /PDF</strong> format and Max
        file size - <strong>50MB</strong>
      </div>
      <form
        className="grid grid-cols-2 gap-4 max-w-[1000px]"
        onSubmit={handleSubmit}
      >
        <div className="flex flex-col gap-3">
          <span className="text-gray-90 font-semibold">Required</span>

          <FormFile
            docName="Certificate of Business Registration"
            file={certificateOfRegistration}
            setFile={setCertificateOfRegistration}
            fileUrl={documents?.data.certificate_of_registration}
          />

          <FormFile
            docName="Utility Bill for Business Address"
            file={utilityBill}
            setFile={setUtilityBill}
            fileUrl={documents?.data.utility_bill}
          />

          <FormFile
            docName="Article of Association"
            file={articleOfAssociation}
            setFile={setArticleOfAssociation}
            fileUrl={documents?.data.article_of_association}
          />
          <FormFile
            docName="Document stating directors"
            file={documentDirectors}
            setFile={setDocumentDirectors}
            fileUrl={documents?.data.document_directors}
          />
          <FormFile
            docName="Document stating shareholders"
            file={documentShareholders}
            setFile={setDocumentShareholders}
            fileUrl={documents?.data.document_shareholders}
          />
        </div>
        <div className="flex flex-col gap-3">
          <span className="text-gray-90 font-semibold">Optional</span>

          <FormFile
            docName="Applicable Regulatory Licenses"
            file={regulatoryLicenses}
            setFile={setRegulatoryLicenses}
            fileUrl={documents?.data.regulatory_licenses}
          />
          <Button
            className="bg-accent font-semibold w-3/4"
            size="lg"
            type="submit"
            loading={isLoading}
          >
            Next
          </Button>
        </div>
      </form>
    </section>
  );
}
