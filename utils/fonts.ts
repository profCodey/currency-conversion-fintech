import localFont from "next/font/local";

const sora = localFont({
  src: "../fonts/Sora/Sora-VariableFont_wght.ttf",
  variable: "--font-sora",
});

const montserrat = localFont({
  src: "../fonts/Montserrat/Montserrat-VariableFont_wght.ttf",
  variable: "--font-montserrat",
});

const openSans = localFont({
  src: "../fonts/OpenSans/OpenSans-VariableFont.ttf",
  variable: "--font-opensans",
});

export { sora, montserrat, openSans };
