import type { Meta, StoryObj } from '@storybook/nextjs-vite';
import SidebarMenuItem from '../SidebarMenuItem/SidebarMenuItem';
import Sidebar from './Sidebar';
import { sidebarMenuItems } from './SidebarWrapper';

// More on how to set up stories at: https://storybook.js.org/docs/writing-stories#default-export
const meta = {
    title: 'Components/Sidebar/Sidebar',
    component: Sidebar,
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
} satisfies Meta<typeof Sidebar>;

export default meta;
type Story = StoryObj<typeof meta>;

// More on writing stories with args: https://storybook.js.org/docs/writing-stories/args
export const Normal: Story = {
    args: {
        children: sidebarMenuItems.map((item, index) => (
            <SidebarMenuItem key={index} title={item.title} link={item.link} icon={item.icon} selected={item.selected} />
        ))
    },
};

export const Primary: Story = {
    args: {
        variant: 'primary',
        children: sidebarMenuItems.map((item, index) => (
            <SidebarMenuItem key={index} title={item.title} link={item.link} icon={item.icon} selected={item.selected} />
        ))
    },
};

export const Collapsed: Story = {
    args: {
        children: sidebarMenuItems.map((item, index) => (
            <SidebarMenuItem key={index} title={item.title} link={item.link} icon={item.icon} selected={item.selected} />
        )),
        isCollapsed: true
    },
};

