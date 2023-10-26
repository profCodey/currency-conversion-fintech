export function LocalProceedModal({})
{
    const SendMoneyForm = (
    <form
    // @ts-ignore
      onSubmit={payRecipientForm.onSubmit(handleSubmit)}
      className="flex flex-col gap-4 relative"
    >
      {/* <LoadingOverlay visible={fetchingNameEnquiryDetails} overlayBlur={2} /> */}
      <p>Enter recipient details</p>
      {/* <Select
        size="md"
        label="Bank"
        placeholder="Select Bank"
        withAsterisk
        data={banks}
        {...payRecipientForm.getInputProps("bank")}
        // disabled={!!recipientDetails?.account_name}
      /> */}
      <TextInput
        size="md"
        label="Bank"
        placeholder="Bank Name"
        withAsterisk
        // data={banks}
        // {...payRecipientForm.getInputProps("bank")}
        {...payRecipientForm.getInputProps("bank_name")}
      />
      {/* <Select
        size="md"
        label="Currency"
        withAsterisk
        data={currencies}
        {...payRecipientForm.getInputProps("currency")}
        disabled
      /> */}

      <TextInput
        size="md"
        // withAsterisk
        label="Account number"
        placeholder="Enter account number"
        // {...payRecipientForm.getInputProps("account_number")}
        // disabled={!!recipientDetails?.account_number}
        onChange={handleAccountNumberChange}
      />

      <TextInput
        size="md"
        withAsterisk
        placeholder="Enter account name"
        label="Account name"
        {...payRecipientForm.getInputProps("account_name")}
        // disabled
      />
      <TextInput
        size="md"
        // withAsterisk
        placeholder="Sort Code"
        label="Sort Code"
        {...payRecipientForm.getInputProps("sort_code")}
        // disabled
      />
      {/* <TextInput
        size="md"
        // withAsterisk
        placeholder="Bank address"
        label="Bank address"
        {...payRecipientForm.getInputProps("bank_address")}
        // disabled
      /> */}
           <Select
        data={purposes}
        label="Purpose of Payment"
        placeholder="Select Purpose of Payment"

        {...payRecipientForm.getInputProps("purpose_of_payment")}
      />

      <Select
        data={allCountries}
        label="Country"
        placeholder="Select Country"
        onChange={(val) => {
          // console.log({ value }, "country val");
          payRecipientForm.setFieldValue("country", val as string);
        }}
        // {...payRecipientForm.getInputProps("country")}
      />
      <TextInput
        size="md"
        // withAsterisk
        placeholder="State"
        label="State"
        {...payRecipientForm.getInputProps("state")}
        // disabled
      />
      <TextInput
        size="md"
        // withAsterisk
        placeholder="City"
        label="City"
        {...payRecipientForm.getInputProps("city")}
        // disabled
      />
      <TextInput
        size="md"
        // withAsterisk
        placeholder="Recipient Address"
        label="Recipient Address"
        {...payRecipientForm.getInputProps("recipient_address")}
        // disabled
      />
      <TextInput
        size="md"
        // withAsterisk
        placeholder="BIC"
        label="BIC"
        {...payRecipientForm.getInputProps("bic")}
        // disabled
      />
      <TextInput
        size="md"
        // withAsterisk
        placeholder="Zipcode"
        label="Zipcode"
        {...payRecipientForm.getInputProps("zipcode")}
        // disabled
      />
      <TextInput
        size="md"
        // withAsterisk
        placeholder="Swift Code"
        label="Swift Code"
        {...payRecipientForm.getInputProps("swift_code")}

        // disabled
      />

      <FileInput
        label="Source Of Funds"
        // description=""
        placeholder="Upload 'Source Of Funds'"
        // accept="image/png,image/jpeg"
        required
        // leftIcon={<IconAt style={{ width: rem(18), height: rem(18) }} />}
        onChange={(file) => {
          handleFileChange("source_of_funds", file!);
        }}
      />

      <FileInput
        label="Invoice Document"
        // description=""
        required
        placeholder="Upload 'Invoice Document'"
        // leftIcon={<IconAt style={{ width: rem(18), height: rem(18) }} />}
        onChange={(file) => {
          handleFileChange("invoice", file!);
        }}
      />

      <Textarea
        label="Narration"
        required
        placeholder="Enter narration"
        {...payRecipientForm.getInputProps("narration")}
      />

      <Button
        className="bg-primary-100"
        rightIcon={<ArrowRight />}
        size="md"
        type="submit"
      >
        Continue
      </Button>
    </form>
  );
    };