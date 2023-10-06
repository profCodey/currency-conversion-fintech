import { PageHeader } from "@/components/admin/page-header";
import { AppLayout } from "@/layout/common/app-layout";
import {
  Button,
  Modal,
  PasswordInput,
  Select,
  Skeleton,
  Stack,
  TextInput,
  clsx,
} from "@mantine/core";
import { ReactElement, useMemo, useState } from "react";
import { useAdminsList } from "@/api/hooks/admin/users";
import { createColumnHelper } from "@tanstack/react-table";
import { User } from "@/utils/validators/interfaces";
import Table from "@/components/table";
import { USER_CATEGORIES } from "@/utils/constants";
import { signupFormValidator } from "@/utils/validators";
import { useForm, zodResolver } from "@mantine/form";
import { SelectItem } from "../sign-up";
import { _allCountries } from "@/utils/countries";
import { z } from "zod";
import { useRegisterAdmin } from "@/api/hooks/auth";

export default function Admins() {
  const { data: users, isLoading } = useAdminsList();
  const { mutate: registerAdmin, isLoading: registerAdminLoading } =
    useRegisterAdmin(() => setShowAdminCreateModal(false));
  const [showAdminCreateModal, setShowAdminCreateModal] = useState(false);
  const ColumnHelper = createColumnHelper<User>();

  const columns = useMemo(
    function () {
      return [
        ColumnHelper.accessor("id", {
          header: "S/N",
          cell: (props) => props.row.index + 1,
        }),
        ColumnHelper.accessor("id", {
          header: "Name",
          cell: (props) =>
            `${props.row.original.first_name} ${props.row.original.last_name}`,
        }),
        ColumnHelper.accessor("email", {
          header: "Email",
        }),
        ColumnHelper.accessor("phone_number", {
          header: "Phone number",
        }),
        ColumnHelper.accessor("is_approved", {
          header: "Status",
          cell: (props) => (
            <span
              className={clsx(
                props.cell.getValue() ? "text-[#13A500]" : "text-gray-70"
              )}
            >
              {props.cell.getValue() ? "Approved" : "Unapproved"}
            </span>
          ),
        }),
      ];
    },
    [ColumnHelper]
  );

  const signupForm = useForm({
    initialValues: {
      first_name: "",
      last_name: "",
      email: "",
      password: "",
      confirm_password: "",
      phone_number: "",
      phone_code: "+234",
      category: USER_CATEGORIES.API_CLIENT,
    },
    validate: zodResolver(signupFormValidator),
  });

  function handleSignup(values: z.infer<typeof signupFormValidator>) {
    const { phone_code, ...payload } = values;
    payload.phone_number = phone_code + payload.phone_number;

    registerAdmin(payload);
  }

  return (
    <section className="flex flex-col gap-6 h-full">
      <PageHeader
        header="Admins"
        subheader="View and create admins"
        meta={
          <Button
            className="bg-primary-100"
            onClick={() => setShowAdminCreateModal(true)}
          >
            Create admin
          </Button>
        }
      />
      <Skeleton visible={isLoading}>
        <Table
          columns={columns}
          data={
            users?.data.filter(
              (user) => user.category === USER_CATEGORIES.ADMIN
            ) || []
          }
        />
      </Skeleton>

      <Modal
        title="Create new admin"
        onClose={() => setShowAdminCreateModal(false)}
        opened={showAdminCreateModal}
      >
        <form className="w-full" onSubmit={signupForm.onSubmit(handleSignup)}>
          <Stack spacing="lg">
            <div className="flex gap-2">
              <Select
                placeholder=""
                searchable
                data={_allCountries}
                itemComponent={SelectItem}
                filter={(value, item) =>
                  item
                    .label!.toLowerCase()
                    .includes(value.toLowerCase().trim()) ||
                  item.description
                    .toLowerCase()
                    .includes(value.toLowerCase().trim())
                }
                size="lg"
                classNames={{
                  input: "w-[140px]",
                }}
                {...signupForm.getInputProps("phone_code")}
              />
              <TextInput
                placeholder="Phone number"
                size="lg"
                className="flex-grow"
                {...signupForm.getInputProps("phone_number")}
              />
            </div>
            <TextInput
              placeholder="First Name"
              size="lg"
              {...signupForm.getInputProps("first_name")}
            />
            <TextInput
              placeholder="Last Name"
              size="lg"
              {...signupForm.getInputProps("last_name")}
            />
            <TextInput
              type="email"
              placeholder="Enter email address"
              size="lg"
              {...signupForm.getInputProps("email")}
            />

            <PasswordInput
              placeholder="Password"
              size="lg"
              {...signupForm.getInputProps("password")}
            />
            <PasswordInput
              placeholder="Confirm Password"
              size="lg"
              {...signupForm.getInputProps("confirm_password")}
            />
            <Button
              type="submit"
              size="lg"
              className="mt-1 bg-[#132144] hover:bg-[#132144] font-secondary"
              loading={registerAdminLoading}
            >
              Create Admin
            </Button>
          </Stack>
        </form>
      </Modal>
    </section>
  );
}

Admins.getLayout = function getLayout(page: ReactElement) {
  return <AppLayout>{page}</AppLayout>;
};
