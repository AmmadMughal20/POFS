import type { Meta, StoryObj } from '@storybook/nextjs-vite';
import Select from './Select';
import Option from '../Option/Option';

// More on how to set up stories at: https://storybook.js.org/docs/writing-stories#default-export
const meta = {
    title: 'Components/Select',
    component: Select,
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
} satisfies Meta<typeof Select>;

export default meta;
type Story = StoryObj<typeof meta>;

// More on writing stories with args: https://storybook.js.org/docs/writing-stories/args
export const Normal: Story = {
    args: {
        name: 'Select',
        children: [<Option key={1} />, <Option key={2} value={1} title='Option 1' />, <Option key={3} value={2} title='Option 2' />],
    },
};

export const Small: Story = {
    args: {
        name: 'Small Select',
        className: 'small',
        children: [<Option key={1} />, <Option key={2} value={1} title='Option 1' />, <Option key={3} value={2} title='Option 2' />],
    },
};

export const Medium: Story = {
    args: {
        name: 'Medium Select',
        className: 'medium',
        children: [<Option key={1} />, <Option key={2} value={1} title='Option 1' />, <Option key={3} value={2} title='Option 2' />],
    },
};

export const Large: Story = {
    args: {
        name: 'Large Select',
        className: 'large',
        children: [<Option key={1} />, <Option key={2} value={1} title='Option 1' />, <Option key={3} value={2} title='Option 2' />],
    },
};

export const Disabled: Story = {
    args: {
        name: 'Disabled',
        disabled: true,
        children: [<Option key={1} />, <Option key={2} value={1} />, <Option key={3} value={2} />],
    },
};
