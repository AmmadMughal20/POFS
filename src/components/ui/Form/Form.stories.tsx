import type { Meta, StoryObj } from '@storybook/nextjs-vite';


import Button from '../Button/Button';
import Input from '../Input/Input';
import Form from './Form';
import Label from '../Label/Label';

// More on how to set up stories at: https://storybook.js.org/docs/writing-stories#default-export
const meta = {
    title: 'Components/Form',
    component: Form,
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
} satisfies Meta<typeof Form>;

export default meta;
type Story = StoryObj<typeof meta>;

// More on writing stories with args: https://storybook.js.org/docs/writing-stories/args
export const Simple: Story = {
    args: {
        title: 'Simple Form',
        children: [
            <div className='flex flex-col gap-2'>
                <Label htmlFor='sample'>Sample Label</Label>
                <Input name='sample' autoFocus />
            </div>,
            <div className='flex justify-center items-center gap-2'>
                <Button onClick={() => { return '' }} type='reset'>Submit</Button>
                <Button onClick={() => { return '' }} type='reset' variant='secondary'>Cancel</Button>
            </div>
        ]

        // variant: 'primary',
        // children: 'Primary Button',
    },
};
