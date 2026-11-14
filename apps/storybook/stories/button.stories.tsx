import {
  ArrowRight01Icon,
  Delete02Icon,
  Loading03Icon,
  PlusSignIcon,
} from "@hugeicons/core-free-icons";
import { HugeiconsIcon } from "@hugeicons/react";
import type { Meta, StoryObj } from "@storybook/react-vite";
import { Button, type ButtonSize, type ButtonVariant } from "@your-scope/lab-ds";
import { expect, fn, userEvent, within } from "storybook/test";

// Keep in sync with ButtonVariant / ButtonSize in src/components/button/button.tsx.
const variants = [
  "default",
  "outline",
  "secondary",
  "ghost",
  "destructive",
  "link",
] as const satisfies readonly ButtonVariant[];
const textSizes = ["xs", "sm", "default", "lg"] as const satisfies readonly ButtonSize[];
const iconSizes = [
  "icon-xs",
  "icon-sm",
  "icon",
  "icon-lg",
] as const satisfies readonly ButtonSize[];

const meta = {
  title: "Components/Button",
  component: Button,
  tags: ["autodocs"],
  args: {
    children: "Button",
    variant: "default",
    size: "default",
    disabled: false,
    onClick: fn(),
  },
  argTypes: {
    variant: { control: "select", options: variants, table: { category: "Appearance" } },
    size: {
      control: "select",
      options: [...textSizes, ...iconSizes],
      table: { category: "Appearance" },
    },
    disabled: { control: "boolean", table: { category: "State" } },
    focusableWhenDisabled: { control: "boolean", table: { category: "State" } },
    "aria-invalid": { control: "boolean", table: { category: "State" } },
    "aria-expanded": { control: "boolean", table: { category: "State" } },
    className: { control: "text" },
    children: { control: "text" },
    render: { control: false },
    nativeButton: { control: false },
  },
} satisfies Meta<typeof Button>;

export default meta;
type Story = StoryObj<typeof meta>;

/** Every prop is wired to a control: use this story to try combinations. */
export const Playground: Story = {};

// ---------- Props ----------

export const Variants: Story = {
  parameters: { controls: { include: ["size", "disabled"] } },
  render: (args) => (
    <div className="flex flex-wrap items-center gap-3">
      {variants.map((variant) => (
        <Button key={variant} {...args} variant={variant}>
          {variant}
        </Button>
      ))}
    </div>
  ),
};

export const Sizes: Story = {
  parameters: { controls: { include: ["variant", "disabled"] } },
  render: (args) => (
    <div className="flex flex-col gap-4">
      <div className="flex flex-wrap items-center gap-3">
        {textSizes.map((size) => (
          <Button key={size} {...args} size={size}>
            {size}
          </Button>
        ))}
      </div>
      <div className="flex flex-wrap items-center gap-3">
        {iconSizes.map((size) => (
          <Button key={size} {...args} size={size} aria-label={`Add (${size})`}>
            <HugeiconsIcon icon={PlusSignIcon} strokeWidth={2} />
          </Button>
        ))}
      </div>
    </div>
  ),
};

/** `data-icon="inline-start" | "inline-end"` on the icon tightens the padding on that side. */
export const WithIcon: Story = {
  render: (args) => (
    <div className="flex flex-wrap items-center gap-3">
      <Button {...args}>
        <HugeiconsIcon icon={PlusSignIcon} strokeWidth={2} data-icon="inline-start" />
        New item
      </Button>
      <Button {...args} variant="outline">
        Continue
        <HugeiconsIcon icon={ArrowRight01Icon} strokeWidth={2} data-icon="inline-end" />
      </Button>
      <Button {...args} variant="destructive">
        <HugeiconsIcon icon={Delete02Icon} strokeWidth={2} data-icon="inline-start" />
        Delete
      </Button>
    </div>
  ),
};

/** Consumer classes are merged after `.ui-button` and win over component styles. */
export const CustomClassName: Story = {
  args: { className: "bg-success text-primary-foreground hover:bg-success/80" },
};

/** Base UI `render` prop: Button styling on another element. */
export const AsLink: Story = {
  args: {
    nativeButton: false,
    render: <a href="#button" />,
    children: "I am an <a>",
  },
};

// ---------- States ----------

/** Every variant across its interactive states. Hover/focus are forced via the pseudo classes below. */
export const StateMatrix: Story = {
  parameters: { controls: { include: ["size"] } },
  render: (args) => {
    const states = [
      { label: "rest", props: {} },
      { label: "disabled", props: { disabled: true } },
      { label: "focusable disabled", props: { disabled: true, focusableWhenDisabled: true } },
      { label: "aria-invalid", props: { "aria-invalid": true } },
      { label: "aria-expanded", props: { "aria-expanded": true } },
    ];
    return (
      <table className="border-separate border-spacing-3 text-left text-xs text-muted-foreground">
        <thead>
          <tr>
            <th />
            {states.map((s) => (
              <th key={s.label} className="font-medium">
                {s.label}
              </th>
            ))}
          </tr>
        </thead>
        <tbody>
          {variants.map((variant) => (
            <tr key={variant}>
              <th className="font-medium">{variant}</th>
              {states.map((s) => (
                <td key={s.label}>
                  <Button {...args} {...s.props} variant={variant}>
                    Button
                  </Button>
                </td>
              ))}
            </tr>
          ))}
        </tbody>
      </table>
    );
  },
};

export const Disabled: Story = {
  args: { disabled: true },
  play: async ({ args, canvasElement }) => {
    const button = within(canvasElement).getByRole("button");
    await expect(button).toBeDisabled();
    await userEvent.click(button, { pointerEventsCheck: 0 });
    await expect(args.onClick).not.toHaveBeenCalled();
  },
};

/** Stays in the tab order while disabled (Base UI sets `aria-disabled` instead of `disabled`). */
export const FocusableWhenDisabled: Story = {
  args: { disabled: true, focusableWhenDisabled: true },
  play: async ({ canvasElement }) => {
    const button = within(canvasElement).getByRole("button");
    await userEvent.tab();
    await expect(button).toHaveFocus();
    await expect(button).toHaveAttribute("aria-disabled", "true");
  },
};

export const Invalid: Story = {
  args: { "aria-invalid": true, variant: "outline" },
};

export const Loading: Story = {
  args: { disabled: true },
  render: (args) => (
    <Button {...args}>
      <HugeiconsIcon
        icon={Loading03Icon}
        strokeWidth={2}
        data-icon="inline-start"
        className="animate-spin"
      />
      Saving…
    </Button>
  ),
};

export const KeyboardFocus: Story = {
  play: async ({ canvasElement }) => {
    const button = within(canvasElement).getByRole("button");
    await userEvent.tab();
    await expect(button).toHaveFocus();
  },
};

// ---------- Behaviour ----------

export const ClickHandler: Story = {
  play: async ({ args, canvasElement }) => {
    const button = within(canvasElement).getByRole("button");
    await expect(button).toHaveAttribute("data-slot", "button");
    await expect(button).toHaveAttribute("data-variant", "default");
    await expect(button).toHaveAttribute("data-size", "default");
    await userEvent.click(button);
    await expect(args.onClick).toHaveBeenCalledOnce();
  },
};
