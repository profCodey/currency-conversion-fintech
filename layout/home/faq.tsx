import { Accordion, createStyles, rem } from "@mantine/core";

const FAQs = [
  {
    question: "What is a multi-currency account and how does it work?",
    answer:
      "Lorem ipsum dolor sit amet, consectetur adipiscing elit, sed do eiusmod tempor incididunt ut labore et dolore magna aliqua. Ut enim ad minim veniam, quis nostrud exercitation ullamco laboris nisi ut aliquip ex ea commodo consequat. Duis aute irure dolor in reprehenderit in voluptate velit esse cillum dolore eu fugiat nulla pariatur. Excepteur sint occaecat cupidatat non proident, sunt in culpa qui officia deserunt mollit anim id est laborum.",
  },
  {
    question: "How is the account different from a bank account",
    answer:
      "Lorem ipsum dolor sit amet, consectetur adipiscing elit, sed do eiusmod tempor incididunt ut labore et dolore magna aliqua. Ut enim ad minim veniam, quis nostrud exercitation ullamco laboris nisi ut aliquip ex ea commodo consequat. Duis aute irure dolor in reprehenderit in voluptate velit esse cillum dolore eu fugiat nulla pariatur. Excepteur sint occaecat cupidatat non proident, sunt in culpa qui officia deserunt mollit anim id est laborum.",
  },
  {
    question: "Can I hold multiple currencies in my account",
    answer:
      "Lorem ipsum dolor sit amet, consectetur adipiscing elit, sed do eiusmod tempor incididunt ut labore et dolore magna aliqua. Ut enim ad minim veniam, quis nostrud exercitation ullamco laboris nisi ut aliquip ex ea commodo consequat. Duis aute irure dolor in reprehenderit in voluptate velit esse cillum dolore eu fugiat nulla pariatur. Excepteur sint occaecat cupidatat non proident, sunt in culpa qui officia deserunt mollit anim id est laborum.",
  },
  {
    question: "What is a multi-currency card?",
    answer:
      "Lorem ipsum dolor sit amet, consectetur adipiscing elit, sed do eiusmod tempor incididunt ut labore et dolore magna aliqua. Ut enim ad minim veniam, quis nostrud exercitation ullamco laboris nisi ut aliquip ex ea commodo consequat. Duis aute irure dolor in reprehenderit in voluptate velit esse cillum dolore eu fugiat nulla pariatur. Excepteur sint occaecat cupidatat non proident, sunt in culpa qui officia deserunt mollit anim id est laborum.",
  },
  {
    question: "What happened to the borderless account",
    answer:
      "Lorem ipsum dolor sit amet, consectetur adipiscing elit, sed do eiusmod tempor incididunt ut labore et dolore magna aliqua. Ut enim ad minim veniam, quis nostrud exercitation ullamco laboris nisi ut aliquip ex ea commodo consequat. Duis aute irure dolor in reprehenderit in voluptate velit esse cillum dolore eu fugiat nulla pariatur. Excepteur sint occaecat cupidatat non proident, sunt in culpa qui officia deserunt mollit anim id est laborum.",
  },
];

const useStyles = createStyles((theme) => ({
  root: {
    backgroundColor: theme.colors.gray[0],
    borderRadius: theme.radius.sm,
  },

  item: {
    backgroundColor: theme.colors.gray[0],
    border: `${rem(1)} solid transparent`,
    position: "relative",
    zIndex: 0,
    transition: "transform 150ms ease",

    "&[data-active]": {
      transform: "scale(1.03)",
      backgroundColor:
        theme.colorScheme === "dark" ? theme.colors.dark[7] : theme.white,
      boxShadow: theme.shadows.md,
      borderColor: theme.colors.gray[2],
      borderRadius: theme.radius.md,
      zIndex: 1,
    },
  },

  chevron: {
    "&[data-rotate]": {
      transform: "rotate(-90deg)",
    },
  },
}));

export function Faq() {
  // const { classes } = useStyles();
  return (
    <section className="py-24">
      <div className={`text-center max-w-[1000px] mx-auto`}>
        <h2 className={"font-secondary text-4xl font-bold"}>
          Let’s Answer Some Of Your Questions.
        </h2>
        <h4 className="text-gray-700 text-2xl mt-5">
          Frequently Asked Questions.
        </h4>
      </div>

      <section className="max-w-7xl mx-auto mt-20 flex flex-col gap-10">
        <Accordion
          variant="separated"
          defaultValue="0"
          transitionDuration={500}
        >
          {FAQs.map((faq, idx) => (
            <Accordion.Item key={idx} value={idx.toString()}>
              <Accordion.Control>
                <div className="font-secondary text-gray-800">
                  {faq.question}
                </div>
              </Accordion.Control>
              <Accordion.Panel>
                <div className="text-gray-600">{faq.answer}</div>
              </Accordion.Panel>
            </Accordion.Item>
          ))}
        </Accordion>
      </section>
    </section>
  );
}
