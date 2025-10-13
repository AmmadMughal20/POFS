import type { Meta, StoryObj } from '@storybook/nextjs-vite';
import SidebarMenuItem from './SidebarMenuItem';
import { MenuIcon } from 'lucide-react';

// More on how to set up stories at: https://storybook.js.org/docs/writing-stories#default-export
const meta = {
    title: 'Components/Sidebar/SidebarMenuItem',
    component: SidebarMenuItem,
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
} satisfies Meta<typeof SidebarMenuItem>;

export default meta;
type Story = StoryObj<typeof meta>;

// More on writing stories with args: https://storybook.js.org/docs/writing-stories/args
export const Normal: Story = {
    args: {
        title: 'Menu Title',
        link: '#',
        icon: <MenuIcon />,
    },
};


export const MenuWithImageIcon: Story = {
    args: {
        title: 'Menu Title',
        link: '#',
        icon: 'file.svg',
    },
};

export const MenuWithFunction: Story = {
    args: {
        title: 'Menu Title',
        link: () => { alert('Menu with function') },
        icon: <MenuIcon />,
    },
};

export const SelectedMenuItem: Story = {
    args: {
        title: 'Menu Title',
        link: () => { alert('Menu with function') },
        icon: <MenuIcon />,
        selected: true
    },
};
