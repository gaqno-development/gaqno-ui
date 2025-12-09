import React from 'react'
import { LogOut, User } from 'lucide-react'
import Image from 'next/image'
import { Button } from '../../ui/button'
import { Avatar, AvatarFallback, AvatarImage } from '../../ui/avatar'
import { Separator } from '../../ui/separator'
import { SidebarTrigger } from '../../ui/sidebar'
import { useHeader } from './hooks/useHeader'
import { IHeaderProps } from './types'
import { usePathname } from 'next/navigation'
import { ThemeToggle } from './components/ThemeToggle'

export const Header: React.FC<IHeaderProps> = () => {
  const { profile, handleSignOut, whiteLabelConfig } = useHeader()
  const pathname = usePathname()

  const isTenantDetailsPage = pathname.includes('/admin/tenants/') && pathname.split('/').length > 4

  return (
    <header className="sticky top-0 z-50 w-full border-b bg-background/95 backdrop-blur supports-[backdrop-filter]:bg-background/60">
      <div className="flex h-16 items-center px-4 gap-4">
        <SidebarTrigger />

        <div className="flex items-center gap-2">
          {whiteLabelConfig?.logo_url ? (
            <Image
              src={whiteLabelConfig.logo_url}
              alt={whiteLabelConfig.company_name || 'Logo'}
              width={120}
              height={40}
              className="whitelabel-logo h-8 w-auto object-contain"
              priority
            />
          ) : (
            <h1 className="text-xl font-bold">
              {whiteLabelConfig?.app_name || 'Dashboard'}
            </h1>
          )}
        </div>

        <div className="flex-1" />

        {/* Show tenant branding info when on tenant details page */}
        {isTenantDetailsPage && whiteLabelConfig && (
          <div className="flex items-center gap-3 px-4 py-2 bg-muted/50 rounded-lg">
            {whiteLabelConfig.logo_url ? (
              <img
                src={whiteLabelConfig.logo_url}
                alt={whiteLabelConfig.company_name || 'Tenant Logo'}
                className="w-8 h-8 object-contain rounded"
              />
            ) : (
              <div className="w-8 h-8 bg-muted rounded flex items-center justify-center text-sm font-bold">
                {whiteLabelConfig.company_name?.charAt(0).toUpperCase() || 'T'}
              </div>
            )}
            <div className="text-sm">
              <div className="font-medium">{whiteLabelConfig.company_name}</div>
              <div className="text-muted-foreground text-xs">{whiteLabelConfig.app_name}</div>
            </div>
          </div>
        )}

        <div className="flex items-center gap-4">
          <ThemeToggle />
          
          {profile && (
            <>
              <Separator orientation="vertical" className="h-8" />
              
              <div className="flex items-center gap-2">
                <Avatar>
                  <AvatarImage src={profile.avatar_url} />
                  <AvatarFallback>
                    <User className="h-4 w-4" />
                  </AvatarFallback>
                </Avatar>
                <div className="hidden md:block">
                  <p className="text-sm font-medium">{profile.name}</p>
                  <p className="text-xs text-muted-foreground capitalize">
                    {profile.role}
                  </p>
                </div>
              </div>

              <Separator orientation="vertical" className="h-8" />

              <Button
                variant="ghost"
                size="icon"
                onClick={handleSignOut}
                title="Sair"
              >
                <LogOut className="h-5 w-5" />
              </Button>
            </>
          )}
        </div>
      </div>
    </header>
  )
}

Header.displayName = 'Header'

