import { format } from "date-fns";
import { enUS } from "date-fns/locale";
 export function formatDateTime(dateTime: string | number | Date) {
    // Use date-fns library to format the date and time
    return format(new Date(dateTime), "dd/MM/yyyy HH:mm:ss", { locale: enUS });
  }