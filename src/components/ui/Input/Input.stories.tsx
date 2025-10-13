import type { Meta, StoryObj } from '@storybook/nextjs-vite';


import Input from './Input';

// More on how to set up stories at: https://storybook.js.org/docs/writing-stories#default-export
const meta = {
    title: 'Components/Input',
    component: Input,
    parameters: {
        // Optional parameter to center the component in the Canvas. More info: https://storybook.js.org/docs/configure/story-layout
        layout: 'centered',
    },
    // This component will have an automatically generated Autodocs entry: https://storybook.js.org/docs/writing-docs/autodocs
    tags: ['autodocs'],
    // More on argTypes: https://storybook.js.org/docs/api/argtypes
    argTypes: {
        // backgroundColor: { control: 'color' },
    },
    // Use `fn` to spy on the onClick arg, which will appear in the actions panel once invoked: https://storybook.js.org/docs/essentials/actions#action-args
    // args: { onClick: fn() },
} satisfies Meta<typeof Input>;

export default meta;
type Story = StoryObj<typeof meta>;

// More on writing stories with args: https://storybook.js.org/docs/writing-stories/args
export const Normal: Story = {
    args: {
        name: 'Normal',
        placeholder: 'Enter sample',
        required: true,
        autoFocus: true,
        type: "text",
        className: ""
    },
};

export const Small: Story = {
    args: {
        name: 'Small',
        placeholder: 'Enter Small sample',
        required: true,
        autoFocus: true,
        type: "text",
        className: "small"
    },
};

export const Medium: Story = {
    args: {
        name: 'Medium',
        placeholder: 'Enter Medium sample',
        required: true,
        autoFocus: true,
        type: "text",
        className: "medium"
    },
};

export const Large: Story = {
    args: {
        name: 'Large',
        placeholder: 'Enter Large sample',
        required: true,
        autoFocus: true,
        type: "text",
        className: "large"
    },
};

export const Disabled: Story = {
    args: {
        name: 'Disabled',

        // variant: 'primary',
        // children: 'Primary Button',
        placeholder: 'Disabled Input',
        type: "text",
        disabled: true,
        value: '',
        className: ""
    },
};



