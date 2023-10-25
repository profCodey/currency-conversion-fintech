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
  TextInput
} from "@mantine/core";
import { useForm, zodResolver } from "@mantine/form";
import { useEffect } from "react";
import { z } from "zod";

export const AddNewSettingsValidator = z.object({
  use_fx_wallet: z.boolean(),
  hide_wallet_at: z.number().min(1, { message: "Set time" }),
  default_gateway: z.number().min(1, { message: "Set default gateway" }),
});

export function SiteSettingsInitiate() {
  const { data: siteSettings, isLoading: siteSettingsLoading } =
    useGetSiteSettings();

  const settings: ISiteSettings | undefined = siteSettings?.data;

  // console.log("settings", settings);

  const addNewSettings = useForm({
    
    initialValues: {
        use_fx_wallet: settings?.use_fx_wallet || false,
        hide_wallet_at: settings?.hide_wallet_at || 0,
        default_gateway: settings?.default_gateway || 0,

    },
    validate: zodResolver(AddNewSettingsValidator),
  });
  useEffect(() => {
    if (settings) {
      // Set initial values after API data is available
      addNewSettings.setValues({
        use_fx_wallet: settings.use_fx_wallet,
        hide_wallet_at: settings.hide_wallet_at,
        default_gateway: settings.default_gateway,
      });
    }
  }, [addNewSettings, settings]);
  

  const { mutate: updateSiteSettings, isLoading: isUpdating } =
    useUpdateSiteSettings();

  return (
    <Box className="flex items-center justify-center h-fit relative mt-4">
      <Skeleton visible={siteSettingsLoading} className="w-2/5">
        <LoadingOverlay visible={siteSettingsLoading || isUpdating} />
        {/* <Table verticalSpacing="md">
          <thead>
            <tr>
              <th>Use Fx Wllet</th>
              <th>Hide Wallet (hr)</th>
            </tr>
          </thead>
          <tbody>
            <tr>
              <td>
                <Switch
                  checked={addNewSettings.values.use_fx_wallet}
                  onChange={(event) => {
                    const useFxWallet = event.currentTarget.checked;
                    if (useFxWallet || addNewSettings.values.hide_wallet_at !== 0) {
                      // Only update if use_fx_wallet is true or hide_wallet_at is not 0
                      updateSiteSettings({
                        hide_wallet_at: addNewSettings.values.hide_wallet_at,
                        use_fx_wallet: useFxWallet,
                        id: 1,
                        created_by: "",
                        created_on: "",
                      });
                    }
                    addNewSettings.setFieldValue("use_fx_wallet", useFxWallet);
                  }}
                />
              </td>
              <td>
                <TextInput
                  type="number"
                  className="w-[20%]"
                  value={addNewSettings.values.hide_wallet_at}
                  onChange={(event) => {
                    const hideWalletAt = parseInt(event.currentTarget.value);
                    if (hideWalletAt >= 1 && hideWalletAt <= 24 && (hideWalletAt !== 0 || addNewSettings.values.use_fx_wallet)) {
                      // Only update if hide_wallet_at is between 1 and 24, or use_fx_wallet is true
                      updateSiteSettings({
                        hide_wallet_at: hideWalletAt,
                        use_fx_wallet: addNewSettings.values.use_fx_wallet,
                        id: 1,
                        created_by: "",
                        created_on: "",
                      });
                    }
                    addNewSettings.setFieldValue("hide_wallet_at", hideWalletAt);
                  }}
                />
              </td>
            </tr>
          </tbody>
        </Table> */}
        <Paper radius="lg" className="h-[500px] p-10 border-gray-90 border">
          <div className="flex items-center justify-between mb-3">
            <p>
              Use FX Wallet
            </p>
            <div>
              <Switch
                  checked={addNewSettings.values.use_fx_wallet}
                  onChange={(event) => {
                    const useFxWallet = event.currentTarget.checked;
                    if (useFxWallet || addNewSettings.values.hide_wallet_at !== 0) {
                      // Only update if use_fx_wallet is true or hide_wallet_at is not 0
                      updateSiteSettings({
                        hide_wallet_at: addNewSettings.values.hide_wallet_at,
                        use_fx_wallet: useFxWallet,
                        id: 1,
                        default_gateway: addNewSettings.values.default_gateway,
                        created_by: "",
                        created_on: "",
                      });
                    }
                    addNewSettings.setFieldValue("use_fx_wallet", useFxWallet);
                  }}
                />
            </div>
          </div>
          <Divider/>
          <div className="flex items-center justify-between mt-3 mb-3">
            <p>
              Hide wallet
            </p>
            <div>
              <TextInput
                  type="number"
                  className=""
                  value={addNewSettings.values.hide_wallet_at}
                  onChange={(event) => {
                    const hideWalletAt = parseInt(event.currentTarget.value);
                    if (hideWalletAt >= 1 && hideWalletAt <= 24 && (hideWalletAt !== 0 || addNewSettings.values.use_fx_wallet)) {
                      // Only update if hide_wallet_at is between 1 and 24, or use_fx_wallet is true
                      updateSiteSettings({
                        hide_wallet_at: hideWalletAt,
                        use_fx_wallet: addNewSettings.values.use_fx_wallet,
                        id: 1,
                        default_gateway: addNewSettings.values.default_gateway,
                        created_by: "",
                        created_on: "",
                      });
                    }
                    addNewSettings.setFieldValue("hide_wallet_at", hideWalletAt);
                  }}
                />
            </div>
          </div>
          <Divider/>
          <div className="flex items-center justify-between mt-3">
            <p>
              Default Gateway
            </p>
            <div>
              <TextInput
                  type="number"
                  className=""
                  value={addNewSettings.values.default_gateway}
                  onChange={(event) => {
                    const defaultGateway = parseInt(event.currentTarget.value);
                    if (defaultGateway >= 1 && (defaultGateway !== 0 || addNewSettings.values.use_fx_wallet || addNewSettings.values.hide_wallet_at !== 0)) {
                      // Only update if hide_wallet_at is between 1 and 24, or use_fx_wallet is true
                      updateSiteSettings({
                        hide_wallet_at: addNewSettings.values.hide_wallet_at,
                        use_fx_wallet: addNewSettings.values.use_fx_wallet,
                        id: 1,
                        default_gateway: defaultGateway,
                        created_by: "",
                        created_on: "",
                      });
                    }
                    addNewSettings.setFieldValue("default_gateway", defaultGateway);
                  }}
                />
            </div>
          </div>
        </Paper>
      </Skeleton>
    </Box>
  );
}

// import {
//   useGetSiteSettings,
//   useUpdateSiteSettings,
// } from "@/api/hooks/admin/sitesettings";
// import { ISiteSettings } from "@/utils/validators/interfaces";
// import {
//   Box,
//   Divider,
//   LoadingOverlay,
//   Paper,
//   Switch,
//   TextInput,
// } from "@mantine/core";
// import { useForm, zodResolver } from "@mantine/form";
// import { z } from "zod";

// export const AddNewSettingsValidator = z.object({
//   use_fx_wallet: z.boolean(),
//   hide_wallet_at: z.number().min(1, { message: "Set time" }),
//   default_gateway: z.number().min(1, { message: "Set default gateway" }),
// });

// export function SiteSettingsInitiate() {
//   const { data: siteSettings, isLoading: siteSettingsLoading } =
//     useGetSiteSettings();

//   const settings: ISiteSettings | undefined = siteSettings?.data;

//   const addNewSettings = useForm({
//     initialValues: {
//       use_fx_wallet: settings?.use_fx_wallet || false,
//       hide_wallet_at: settings?.hide_wallet_at || 0,
//       default_gateway: settings?.default_gateway || 0,
//     },
//     validate: zodResolver(AddNewSettingsValidator),
//   });

//   const { mutate: updateSiteSettings, isLoading: isUpdating } =
//     useUpdateSiteSettings();

//   return (
//     <Box className="flex items-center justify-center h-fit relative mt-4">
//       <Paper radius="lg" className="h-[500px] p-10 border-gray-90 border">
//         <div className="flex items-center justify-between mb-3">
//           <p>Use FX Wallet</p>
//           <div>
//             <Switch
//               checked={addNewSettings.values.use_fx_wallet}
//               onChange={(event) => {
//                 const useFxWallet = event.currentTarget.checked;
//                 if (useFxWallet || addNewSettings.values.hide_wallet_at !== 0) {
//                   updateSiteSettings({
//                     hide_wallet_at: addNewSettings.values.hide_wallet_at,
//                     use_fx_wallet: useFxWallet,
//                     id: 1,
//                     default_gateway: addNewSettings.values.default_gateway,
//                     created_by: "",
//                     created_on: "",
//                   });
//                 }
//                 addNewSettings.setFieldValue("use_fx_wallet", useFxWallet);
//               }}
//             />
//           </div>
//         </div>
//         <Divider />
//         <div className="flex items-center justify-between mt-3">
//           <p>Hide wallet</p>
//           <div>
//             <TextInput
//               type="number"
//               className=""
//               value={addNewSettings.values.hide_wallet_at}
//               onChange={(event) => {
//                 const hideWalletAt = parseInt(event.currentTarget.value);
//                 if (
//                   hideWalletAt >= 1 &&
//                   hideWalletAt <= 24 &&
//                   (hideWalletAt !== 0 || addNewSettings.values.use_fx_wallet)
//                 ) {
//                   updateSiteSettings({
//                     hide_wallet_at: hideWalletAt,
//                     use_fx_wallet: addNewSettings.values.use_fx_wallet,
//                     id: 1,
//                     default_gateway: addNewSettings.values.default_gateway,
//                     created_by: "",
//                     created_on: "",
//                   });
//                 }
//                 addNewSettings.setFieldValue("hide_wallet_at", hideWalletAt);
//               }}
//             />
//           </div>
//         </div>
//         <Divider />
//         <div className="flex items-center justify-between mt-3">
//           <p>Default Gateway</p>
//           <div>
//             <TextInput
//               type="number"
//               className=""
//               value={addNewSettings.values.default_gateway}
//               onChange={(event) => {
//                 const defaultGateway = parseInt(event.currentTarget.value);
//                 if (
//                   defaultGateway >= 1 &&
//                   (defaultGateway !== 0 ||
//                     addNewSettings.values.use_fx_wallet ||
//                     addNewSettings.values.hide_wallet_at !== 0)
//                 ) {
//                   updateSiteSettings({
//                     hide_wallet_at: addNewSettings.values.hide_wallet_at,
//                     use_fx_wallet: addNewSettings.values.use_fx_wallet,
//                     id: 1,
//                     default_gateway: defaultGateway,
//                     created_by: "",
//                     created_on: "",
//                   });
//                 }
//                 addNewSettings.setFieldValue("default_gateway", defaultGateway);
//               }}
//             />
//           </div>
//         </div>
//       </Paper>
//     </Box>
//   );
// }

