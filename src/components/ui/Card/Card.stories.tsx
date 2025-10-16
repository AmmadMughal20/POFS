import type { Meta, StoryObj } from '@storybook/nextjs-vite';
import Card from './Card';
import Button from '../Button/Button';
// More on how to set up stories at: https://storybook.js.org/docs/writing-stories#default-export

const meta = {
    title: 'Components/Card',
    component: Card,
    parameters: {
        // Optional parameter to center the component in the Canvas. More info: https://storybook.js.org/docs/configure/story-layout
        layout: 'centered',
    },
    // This component will have an automatically generated Autodocs entry: https://storybook.js.org/docs/writing-docs/autodocs
    tags: ['autodocs'],
    // More on argTypes: https://storybook.js.org/docs/api/argtypes
    argTypes: {

    },
    // Use `fn` to spy on the onClick arg, which will appear in the actions panel once invoked: https://storybook.js.org/docs/essentials/actions#action-args
    // args: { onClick: fn() },
} satisfies Meta<typeof Card>;

export default meta;
type Story = StoryObj<typeof meta>;

// More on writing stories with args: https://storybook.js.org/docs/writing-stories/args
export const Normal: Story = {
    args: {
        className: 'max-w-100',
        children: [<h3 key={1}>Card Title</h3>,
        <p className='py-5' key={2}>This is description.This is description.This is description.This is description.This is description.This is description.This is description.</p>
            , <Button type='reset' key={3}>Sample</Button>
        ]
    },
};

