import type { Meta, StoryObj } from '@storybook/nextjs-vite';
import RadioGroup from './RadioGroup';
import RadioInput from '../RadioInput/RadioInput';

// More on how to set up stories at: https://storybook.js.org/docs/writing-stories#default-export
const meta = {
    title: 'Components/RadioGroup',
    component: RadioGroup,
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
} satisfies Meta<typeof RadioGroup>;

export default meta;
type Story = StoryObj<typeof meta>;

// More on writing stories with args: https://storybook.js.org/docs/writing-stories/args
export const Normal: Story = {
    args: {
        title: "Normal",
        name: "normal",
        direction: 'vertical',
        children: [
            <RadioInput name='normal' value='Option1' title='Option1' id={1} />,
            <RadioInput name='normal' value='Option2' title='Option2' id={2} />,
        ],
    },
};

export const Horizontal: Story = {
    args: {
        title: "Horizontal",
        name: "Horizontal",
        direction: 'horizontal',
        children: [
            <RadioInput name='Horizontal' value='Option1' title='Option1' id={1} />,
            <RadioInput name='Horizontal' value='Option2' title='Option2' id={2} />,
        ],
    },
};
