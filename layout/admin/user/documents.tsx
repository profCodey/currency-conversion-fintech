import { useClientDocuments } from "@/api/hooks/admin/users";
import { useGetBusinessDocuments } from "@/api/hooks/onboarding";
import { Anchor, Box, Button, Group, Stack, Table } from "@mantine/core";
import { useRouter } from "next/router";

export function ClientDocuments() {
  const router = useRouter();
  const { data: clientDocuments, isLoading: clientDocumentsLoading } =
    useClientDocuments(router?.query.id as string);

  return (
    <section>
      <Box p={20}>
        <Table withBorder>
          <thead>
            <tr>
              <th>Document name</th>
              <th>View</th>
            </tr>
          </thead>
          <tbody>
            <DocumentRow
              title="Certificate of registration"
              link={clientDocuments?.data.certificate_of_registration}
            />
            <DocumentRow
              title="Utility bill for business address"
              link={clientDocuments?.data.utility_bill}
            />
            <DocumentRow
              title="Article of Association"
              link={clientDocuments?.data.article_of_association}
            />
            <DocumentRow
              title="Document of directors"
              link={clientDocuments?.data.document_directors}
            />
            <DocumentRow
              title="Document of shareholders"
              link={clientDocuments?.data.document_shareholders}
            />
            <DocumentRow
              title="Applicable Regulatory licences"
              link={clientDocuments?.data.regulatory_licenses}
            />
          </tbody>
        </Table>
      </Box>

      <Group p={20}>
        <Button className="bg-primary-100 hover:bg-primary-100">
          Approve documents
        </Button>
        <Button variant="white" className="text-red-600 border">
          Reject documents
        </Button>
      </Group>
    </section>
  );
}

function DocumentRow({
  title,
  link,
}: {
  title: string;
  link: string | undefined;
}) {
  return (
    <tr>
      <td>{title}</td>
      <td>
        {link ? (
          <Anchor href={link} target="_blank" className="text-accent">
            View
          </Anchor>
        ) : (
          <span className="text-gray-70">Not uploaded</span>
        )}
      </td>
    </tr>
  );
}
