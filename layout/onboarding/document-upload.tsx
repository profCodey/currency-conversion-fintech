import { Button, Loader } from "@mantine/core";
import { useState } from "react";
import { FormFile } from "./form-file";
import { useUpdateOnboardingDocuments } from "@/api/hooks/onboarding";
import { useGetCurrentUser } from "@/api/hooks/user";
import Cookies from "js-cookie";

export interface DocumentsValidator {
  certificate_of_registration: string;
  utility_bill: string;
  article_of_association: string;
  document_directors: string;
  document_shareholders: string;
  regulatory_licenses: string;
  logo: string;
  status: string;
}

export function DocumentUpload({
  formData,
  disableDocumentNextButton,
  nextTab,
}: {
  formData: DocumentsValidator;
  disableDocumentNextButton: boolean;
  nextTab(arg0: string): void;
}) {
  const { data } = useGetCurrentUser();
  const { mutate: updateDocuments, isLoading } = useUpdateOnboardingDocuments(
    data?.data.id
  );
  let colorPrimary = Cookies.get("primary_color") ? Cookies.get("primary_color") : "#132144";
  let colorSecondary = Cookies.get("secondary_color") ? Cookies.get("secondary_color") : "#132144";
  let colorBackground = Cookies.get("background_color") ? Cookies.get("background_color") : "#132144";
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
  const [companyLogo, setCompanyLogo] = useState<File | null>(null);

  function handleSubmit(e: any) {
    e.preventDefault();
    const payload = {
      certificate_of_registration: certificateOfRegistration,
      utility_bill: utilityBill,
      article_of_association: articleOfAssociation,
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
            fileUrl={formData?.certificate_of_registration}
            fieldName="certificate_of_registration"
          />

          <FormFile
            docName="Utility Bill for Business Address"
            file={utilityBill}
            setFile={setUtilityBill}
            fileUrl={formData?.utility_bill}
            fieldName="utility_bill"
          />

          <FormFile
            docName="Article of Association"
            file={articleOfAssociation}
            setFile={setArticleOfAssociation}
            fileUrl={formData?.article_of_association}
            fieldName="article_of_association"
          />
          <FormFile
            docName="Document stating directors"
            file={documentDirectors}
            setFile={setDocumentDirectors}
            fileUrl={formData?.document_directors}
            fieldName="document_directors"
          />
          <FormFile
            docName="Document stating shareholders"
            file={documentShareholders}
            setFile={setDocumentShareholders}
            fileUrl={formData?.document_shareholders}
            fieldName="document_shareholders"
          />
        </div>
        <div className="flex flex-col gap-3">
          <span className="text-gray-90 font-semibold">Optional</span>

          <FormFile
            docName="Applicable Regulatory Licenses"
            file={regulatoryLicenses}
            setFile={setRegulatoryLicenses}
            fileUrl={formData?.regulatory_licenses}
            fieldName="regulatory_licenses"
          />

          <FormFile
            docName="Company logo"
            file={companyLogo}
            setFile={setCompanyLogo}
            fileUrl={formData?.logo}
            fieldName="logo"
            acceptFormat="image/png,image/jpeg"
          />
          <Button
            className=" font-semibold w-3/4"
            style={{ backgroundColor: colorSecondary }}
            size="lg"
            type="button"
            loading={isLoading}
            disabled={disableDocumentNextButton}
            // onClick={() => nextTab("gateway-options")}
            onClick={() => nextTab("account-detail")} 
          >
            Next
          </Button>
        </div>
      </form>
    </section>
  );
}
