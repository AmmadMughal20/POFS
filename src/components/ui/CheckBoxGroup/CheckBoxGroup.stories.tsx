import type { Meta, StoryObj } from '@storybook/nextjs-vite';
import CheckBoxGroup from './CheckBoxGroup';
import CheckBoxInput from '../CheckBoxInput/CheckBoxInput';
// More on how to set up stories at: https://storybook.js.org/docs/writing-stories#default-export
const meta = {
    title: 'Components/CheckBoxGroup',
    component: CheckBoxGroup,
    parameters: {
        // Optional parameter to center the component in the Canvas. More info: https://storybook.js.org/docs/configure/story-layout
        layout: 'centered',
    },
    // This component will have an automatically generated Autodocs entry: https://storybook.js.org/docs/writing-docs/autodocs
    tags: ['autodocs'],
    // More on argTypes: https://storybook.js.org/docs/api/argtypes
    argTypes: {
        mode: {
            control: { type: 'radio' },
            options: ['single', 'multiple'],
        },
        direction: {
            control: { type: 'radio' },
            options: ['vertical', 'horizontal'],
        },
    },
    // Use `fn` to spy on the onClick arg, which will appear in the actions panel once invoked: https://storybook.js.org/docs/essentials/actions#action-args
    // args: { onClick: fn() },
} satisfies Meta<typeof CheckBoxGroup>;

export default meta;
type Story = StoryObj<typeof meta>;

// More on writing stories with args: https://storybook.js.org/docs/writing-stories/args
export const Normal: Story = {
    args: {
        name: 'fruits',
        mode: 'multiple',
        direction: 'vertical',
        children: [
            <CheckBoxInput key='apple' title='Apple' value='apple' name='fruits' />,
            <CheckBoxInput key='banana' title='Banana' value='banana' name='fruits' />,
            <CheckBoxInput key='orange' title='Orange' value='orange' name='fruits' />,
        ],
    },
};


export const SingleSelect: Story = {
    args: {
        name: 'fruits',
        mode: 'single',
        direction: 'vertical',
        children: [
            <CheckBoxInput key='apple' title='Apple' value='apple' name='fruits' />,
            <CheckBoxInput key='banana' title='Banana' value='banana' name='fruits' />,
            <CheckBoxInput key='orange' title='Orange' value='orange' name='fruits' />,
        ],
    },
};

export const HorizontalSelect: Story = {
    args: {
        name: 'fruits',
        mode: 'single',
        direction: 'horizontal',
        children: [
            <CheckBoxInput key='apple' title='Apple' value='apple' name='fruits' />,
            <CheckBoxInput key='banana' title='Banana' value='banana' name='fruits' />,
            <CheckBoxInput key='orange' title='Orange' value='orange' name='fruits' />,
        ],
    },
};
