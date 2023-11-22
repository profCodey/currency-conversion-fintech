import {
    useGetSiteSettings,
    useUpdateSiteSettings,
} from "@/api/hooks/admin/sitesettings";
import { ISiteSettings } from "@/utils/validators/interfaces";
import {
    Box,
    Divider,
    LoadingOverlay,
    Paper,
    Skeleton,
    Switch,
    TextInput,
    ColorInput,
    FileInput,
    Textarea,
    Button,
} from "@mantine/core";
import { useForm, zodResolver } from "@mantine/form";
import { useEffect, useState } from "react";
import { z } from "zod";
import Cookies from "js-cookie";

export const AddNewSettingsValidator = z.object({
    use_fx_wallet: z.boolean(),
    hide_wallet_at: z.number().min(1, { message: "Set time" }),
    default_gateway: z.number().min(1, { message: "Set default gateway" }),
    company_name: z.string(),
    company_address: z.string(),
    logo: z.string(),
    primary_color: z.string(),
    secondary_color: z.string(),
    background_color: z.string(),
});

export function SiteSettingsInitiate() {
    const { data: siteSettings, isLoading: siteSettingsLoading } =
        useGetSiteSettings();

    const settings: ISiteSettings | undefined = siteSettings?.data;
    const [logoFile, setLogoFile] = useState<File | null>(null);
    const [logoFileName, setLogoFileName] = useState<string>("");

    const addNewSettings = useForm({
        initialValues: {
            use_fx_wallet: settings?.use_fx_wallet || false,
            hide_wallet_at: settings?.hide_wallet_at || 0,
            default_gateway: settings?.default_gateway || 0,
            company_name: settings?.company_name || "",
            company_address: settings?.company_address || "",
            logo: settings?.logo || "",
            primary_color: settings?.primary_color || "",
            secondary_color: settings?.secondary_color || "",
            background_color: settings?.background_color || "",
        },
        validate: zodResolver(AddNewSettingsValidator),
    });
    useEffect(() => {
        if (settings) {
            addNewSettings.setValues({
                use_fx_wallet: settings.use_fx_wallet,
                hide_wallet_at: settings.hide_wallet_at,
                default_gateway: settings.default_gateway,
                company_name: settings.company_name,
                company_address: settings.company_address,
                logo: settings.logo, // Set logo value as obtained from the backend
                primary_color: settings.primary_color,
                secondary_color: settings.secondary_color,
                background_color: settings.background_color,
            });
    
            // Set logo file name in the state
            if (typeof settings.logo === 'string') {
                const url = new URL(settings.logo as string);
                const logoFileName = url.pathname.split('/').pop();
                setLogoFile(new File([], logoFileName || ""));
                setLogoFileName(logoFileName || "");
            }
        }
        // eslint-disable-next-line react-hooks/exhaustive-deps
    }, [settings]);
    

    const { mutate: updateSiteSettings, isLoading: isUpdating } =
        useUpdateSiteSettings();

        let colorBackground = Cookies.get("background_color") ? Cookies.get("background_color") : "#132144";

    function handleSubmit(
        addNewSettings: z.infer<typeof AddNewSettingsValidator>
    ) {
        const formData = new FormData();
        formData.append("logo", logoFile || "");
        const payload = {
            hide_wallet_at: addNewSettings.hide_wallet_at,
            use_fx_wallet: addNewSettings.use_fx_wallet,
            id: 1,
            default_gateway: addNewSettings.default_gateway,
            created_by: "",
            created_on: "",
            primary_color: addNewSettings.primary_color,
            secondary_color: addNewSettings.secondary_color,
            background_color: addNewSettings.background_color,
            logo: formData.get("logo") as File, // Retrieve the file from FormData
          };

        updateSiteSettings(payload);

            //ts-ignore 
    Cookies.set("primary_color", payload.primary_color);
    Cookies.set("secondary_color", payload.secondary_color);
    Cookies.set("background_color", payload.background_color);
    }

    return (
        <>
            <Box className="flex items-center justify-center h-fit relative mt-4">
                <Skeleton visible={siteSettingsLoading} className="w-2/5">
                    <LoadingOverlay
                        visible={siteSettingsLoading || isUpdating}
                    />

                    <div>
                        <Paper
                            radius="lg"
                            className="p-10 border-gray-90 border h-fit">
                            <div className="flex items-center justify-between mb-3">
                                <p>Use FX Wallet</p>
                                <div>
                                    <Switch
                                        checked={
                                            addNewSettings.values.use_fx_wallet
                                        }
                                        onChange={(event) => {
                                            const useFxWallet =
                                                event.currentTarget.checked;
                                            if (
                                                useFxWallet ||
                                                addNewSettings.values
                                                    .hide_wallet_at !== 0
                                            ) {
                                                // Only update if use_fx_wallet is true or hide_wallet_at is not 0
                                                updateSiteSettings({
                                                    hide_wallet_at:
                                                        addNewSettings.values
                                                            .hide_wallet_at,
                                                    use_fx_wallet: useFxWallet,
                                                    id: 1,
                                                    default_gateway:
                                                        addNewSettings.values
                                                            .default_gateway,
                                                    created_by: "",
                                                    created_on: "",
                                                    primary_color:
                                                        addNewSettings.values
                                                            .primary_color,
                                                    secondary_color:
                                                        addNewSettings.values
                                                            .secondary_color,
                                                    background_color:
                                                        addNewSettings.values
                                                            .background_color,
                                                    // logo: addNewSettings.values.logo,
                                                    company_name:
                                                        addNewSettings.values
                                                            .company_name,
                                                    company_address:
                                                        addNewSettings.values
                                                            .company_address,
                                                });
                                            }
                                            addNewSettings.setFieldValue(
                                                "use_fx_wallet",
                                                useFxWallet
                                            );
                                        }}
                                    />
                                </div>
                            </div>
                            <Divider />
                            <form
                                onSubmit={addNewSettings.onSubmit(
                                    handleSubmit
                                )}>
                                <div className="flex flex-col items-center justify-between mt-3 mb-3">
                                    <div className="mb-3 w-full">
                                        <p>Hide wallet at</p>
                                        <TextInput
                                            type="number"
                                            className=""
                                            value={
                                                addNewSettings.values
                                                    .hide_wallet_at
                                            }
                                            onChange={(event) => {
                                                const hideWalletAt = parseInt(
                                                    event.currentTarget.value
                                                );
                                                addNewSettings.setFieldValue(
                                                    "hide_wallet_at",
                                                    hideWalletAt
                                                );
                                            }}
                                        />
                                    </div>

                                    <Divider />
                                    <div className="mb-3 w-full">
                                        <p>Default Gateway</p>
                                        <div>
                                            <TextInput
                                                type="number"
                                                className=""
                                                value={
                                                    addNewSettings.values
                                                        .default_gateway
                                                }
                                                onChange={(event) => {
                                                    const defaultGateway =
                                                        parseInt(
                                                            event.currentTarget
                                                                .value
                                                        );
                                                    addNewSettings.setFieldValue(
                                                        "default_gateway",
                                                        defaultGateway
                                                    );
                                                }}
                                            />
                                        </div>
                                    </div>
                                    <Divider />
                                    <div className="mb-3 w-full">
                                        <p>Company Name</p>
                                        <div>
                                            <TextInput
                                                className=""
                                                value={
                                                    addNewSettings.values
                                                        .company_name
                                                }
                                                onChange={(event) => {
                                                    addNewSettings.setFieldValue(
                                                        "company_name",
                                                        event.currentTarget
                                                            .value
                                                    );
                                                }}
                                            />
                                        </div>
                                    </div>
                                    <Divider />
                                    <div className="mb-3 w-full">
                                        <p>Company Logo</p>
                                        <div>
                                            <FileInput
                                                accept="image/*"
                                                placeholder="Select file"
                                                onChange={(file) => {
                                                    if (file) {
                                                      setLogoFile(file);
                                                        addNewSettings.setFieldValue(
                                                            "logo",
                                                            file.name
                                                        );
                                                    }
                                                }}
                                            />
                                        </div>
                                        {logoFileName && (
                                                <div
                                                        className="hover-message cursor-pointer"
                                                        onClick={handleLogoFileNameClick}
                                                    >
                                                       <span className="text-sm italic">
                                                        {logoFileName}
                                                        </span> 
                                                        <span className="tooltip-text">
                                                            Click to view in another window
                                                        </span>
                                                    </div>
                                                )}                 
                                            </div>
                                    <Divider />
                                    <div className="mb-3 w-full">
                                        <p>Primary Color</p>
                                        <div>
                                            <ColorInput
                                                value={
                                                    addNewSettings.values
                                                        .primary_color
                                                }
                                                onChange={(value) =>
                                                    addNewSettings.setFieldValue(
                                                        "primary_color",
                                                        value
                                                    )
                                                }
                                            />
                                        </div>
                                    </div>
                                    <Divider />
                                    <div className="mb-3 w-full">
                                        <p>Secondary Color</p>
                                        <div>
                                            <ColorInput
                                                value={
                                                    addNewSettings.values
                                                        .secondary_color
                                                }
                                                onChange={(value) =>
                                                    addNewSettings.setFieldValue(
                                                        "secondary_color",
                                                        value
                                                    )
                                                }
                                            />
                                        </div>
                                    </div>
                                    <Divider />
                                    <div className="mb-3 w-full">
                                        <p>Background Color</p>
                                        <div>
                                            <ColorInput
                                                value={
                                                    addNewSettings.values
                                                        .background_color
                                                }
                                                onChange={(value) =>
                                                    addNewSettings.setFieldValue(
                                                        "background_color",
                                                        value
                                                    )
                                                }
                                            />
                                        </div>
                                    </div>
                                    <Divider />
                                    <div className="mb-3 w-full">
                                        <p>Address</p>
                                        <div>
                                            <Textarea
                                                autosize
                                                className=""
                                                value={
                                                    addNewSettings.values
                                                        .company_address
                                                }
                                                onChange={(event) => {
                                                    addNewSettings.setFieldValue(
                                                        "company_address",
                                                        event.currentTarget
                                                            .value
                                                    );
                                                }}
                                            />
                                        </div>
                                    </div>
                                   
                                    <Button
                                        style={{backgroundColor: colorBackground}}
                                        className="hover:bg-primary-100"
                                        size="md"
                                        type="submit"
                                        loaderPosition="right">
                                        Submit
                                    </Button>
                                </div>
                            </form>
                        </Paper>
                    </div>
                </Skeleton>
            </Box>
        </>
    );
}
