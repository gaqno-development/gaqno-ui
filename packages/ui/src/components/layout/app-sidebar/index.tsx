'use client'

import React, { useState } from 'react'
import Link from 'next/link'
import { ChevronDown } from 'lucide-react'
import {
    Sidebar,
    SidebarContent,
    SidebarGroup,
    SidebarGroupContent,
    SidebarGroupLabel,
    SidebarMenu,
    SidebarMenuButton,
    SidebarMenuItem,
    useSidebar,
} from '../../ui/sidebar'
import {
    Collapsible,
    CollapsibleContent,
    CollapsibleTrigger,
} from '../../ui/collapsible'
import {
    DropdownMenu,
    DropdownMenuContent,
    DropdownMenuItem,
    DropdownMenuTrigger,
} from '../../ui/dropdown-menu'
import { useAppSidebar } from './hooks/useAppSidebar'
import { ISidebarItem } from './types'
import { useWhiteLabel } from '@repo/core/hooks/useWhiteLabel'

export const AppSidebar: React.FC = () => {
    const { menuItems, isActive } = useAppSidebar()
    const { config: whiteLabel } = useWhiteLabel()
    const { state } = useSidebar()
    const isCollapsed = state === 'collapsed'

    const CollapsedMenuItemWithDropdown: React.FC<{ item: ISidebarItem }> = ({ item }) => {
        const [open, setOpen] = useState(false)
        const timeoutRef = React.useRef<NodeJS.Timeout | null>(null)
        const Icon = item.icon

        const handleMouseEnter = () => {
            if (timeoutRef.current) {
                clearTimeout(timeoutRef.current)
                timeoutRef.current = null
            }
            setOpen(true)
        }

        const handleMouseLeave = () => {
            timeoutRef.current = setTimeout(() => {
                setOpen(false)
            }, 150)
        }

        React.useEffect(() => {
            return () => {
                if (timeoutRef.current) {
                    clearTimeout(timeoutRef.current)
                }
            }
        }, [])

        return (
            <SidebarMenuItem key={item.label}>
                <DropdownMenu open={open} onOpenChange={setOpen}>
                    <DropdownMenuTrigger asChild>
                        <div
                            onMouseEnter={handleMouseEnter}
                            onMouseLeave={handleMouseLeave}
                            className="w-full"
                        >
                            <SidebarMenuButton tooltip={open ? undefined : item.label}>
                                <Icon />
                                <span>{item.label}</span>
                            </SidebarMenuButton>
                        </div>
                    </DropdownMenuTrigger>
                    <DropdownMenuContent
                        side="right"
                        align="start"
                        className="w-56"
                        onMouseEnter={handleMouseEnter}
                        onMouseLeave={handleMouseLeave}
                    >
                        {item.children?.map((child) => {
                            const ChildIcon = child.icon
                            return (
                                <DropdownMenuItem key={child.href || child.label} asChild>
                                    <Link
                                        href={child.href || '#'}
                                        className="flex items-center gap-2 cursor-pointer"
                                    >
                                        {ChildIcon && <ChildIcon className="h-4 w-4" />}
                                        <span>{child.label}</span>
                                    </Link>
                                </DropdownMenuItem>
                            )
                        })}
                    </DropdownMenuContent>
                </DropdownMenu>
            </SidebarMenuItem>
        )
    }

    const renderMenuItem = (item: ISidebarItem) => {
        const Icon = item.icon

        if (item.isCollapsible && item.children) {
            if (isCollapsed) {
                return <CollapsedMenuItemWithDropdown item={item} />
            }

            return (
                <Collapsible key={item.label} defaultOpen className="group/collapsible">
                    <SidebarGroup className="p-0">
                        <SidebarGroupLabel asChild className="px-2">
                            <CollapsibleTrigger
                                className="flex w-full items-center justify-between min-h-[44px] touch-manipulation"
                                aria-label={`${item.label} menu`}
                            >
                                <span className="flex items-center gap-2">
                                    <Icon className="h-5 w-5" />
                                    {item.label}
                                </span>
                                <ChevronDown className="h-4 w-4 transition-transform group-data-[state=open]/collapsible:rotate-180" />
                            </CollapsibleTrigger>
                        </SidebarGroupLabel>
                        <CollapsibleContent>
                            <SidebarGroupContent className="px-2">
                                <SidebarMenu>
                                    {item.children.map((child) => {
                                        const ChildIcon = child.icon
                                        return (
                                            <SidebarMenuItem key={child.href || child.label}>
                                                <SidebarMenuButton
                                                    asChild
                                                    isActive={child.href ? isActive(child.href) : false}
                                                    className="min-h-[44px] touch-manipulation"
                                                >
                                                    <Link
                                                        href={child.href || '#'}
                                                        className="flex items-center gap-2"
                                                        aria-label={child.label}
                                                    >
                                                        {ChildIcon && <ChildIcon className="h-5 w-5" />}
                                                        <span>{child.label}</span>
                                                    </Link>
                                                </SidebarMenuButton>
                                            </SidebarMenuItem>
                                        )
                                    })}
                                </SidebarMenu>
                            </SidebarGroupContent>
                        </CollapsibleContent>
                    </SidebarGroup>
                </Collapsible>
            )
        }

        return (
            <SidebarMenuItem key={item.href || item.label}>
                <SidebarMenuButton
                    asChild
                    isActive={item.href ? isActive(item.href) : false}
                    tooltip={item.label}
                    className="min-h-[44px] touch-manipulation"
                >
                    <Link
                        href={item.href || '#'}
                        className="flex items-center gap-2"
                        aria-label={item.label}
                    >
                        <Icon className="h-5 w-5" />
                        <span>{item.label}</span>
                    </Link>
                </SidebarMenuButton>
            </SidebarMenuItem>
        )
    }

    return (
        <Sidebar collapsible="icon">
            <SidebarContent>
                <SidebarGroup>
                    <SidebarGroupLabel>
                        <h1 className="text-xl font-bold mb-4">
                            {whiteLabel?.company_name || 'Sistema'}
                        </h1>
                    </SidebarGroupLabel>
                    <SidebarGroupContent>
                        <SidebarMenu>
                            {menuItems.map((item, index) => (
                                <React.Fragment key={item.label || item.href || `menu-item-${index}`}>
                                    {renderMenuItem(item)}
                                </React.Fragment>
                            ))}
                        </SidebarMenu>
                    </SidebarGroupContent>
                </SidebarGroup>
            </SidebarContent>
        </Sidebar>
    )
}

AppSidebar.displayName = 'AppSidebar'
