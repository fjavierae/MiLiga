'use client';

import { useState } from 'react';
import Link from 'next/link';
import {
  IconShield,
  IconClipboardList,
  IconUsers,
  IconClipboardData,
  IconTrophy,
  IconHome2,
  IconChartBar,
  IconCalendarStats,
  IconTarget,
  IconUserCircle,
  IconUserStar,
  IconLogout,
  IconSettings,
  IconMenu2,
  IconBell,
} from '@tabler/icons-react';
import { Center, Stack, Tooltip, UnstyledButton, Group, Box, Drawer } from '@mantine/core';
import { useMediaQuery } from '@mantine/hooks';
import classes from './styles/Navbar.module.css';
import { UserRole } from '@/types';

interface NavbarLinkProps {
  readonly icon: typeof IconHome2;
  readonly label: string;
  readonly href?: string;
  readonly active?: boolean;
  readonly onClick?: () => void;
}

function NavbarLink({ icon: Icon, label, href, active, onClick }: NavbarLinkProps) {
  const content = (
    <Tooltip label={label} position="right" transitionProps={{ duration: 0 }}>
      <UnstyledButton
        onClick={onClick}
        className={classes.link}
        data-active={active || undefined}
        aria-label={label}
      >
        <Icon size={20} stroke={1.5} />
      </UnstyledButton>
    </Tooltip>
  );

  if (href) {
    return <Link href={href}>{content}</Link>;
  }

  return content;
}

/**
 * Menu items for Admin role
 * Dashboard Global, League Management, User Authority, System Audit
 */
const adminMenuItems = [
  { icon: IconHome2, label: 'Dashboard', href: '/admin/dashboard' },
  { icon: IconTrophy, label: 'League Management', href: '/admin/leagues' },
  { icon: IconUsers, label: 'User Authority', href: '/admin/users' },
  { icon: IconClipboardData, label: 'System Audit', href: '/admin/audit' },
  { icon: IconSettings, label: 'Settings', href: '/admin/settings' },
];

/**
 * Menu items for Manager role
 * Team Hub, Roster Management, Match Preparation, Direct Actions
 */
const managerMenuItems = [
  { icon: IconHome2, label: 'Team Hub', href: '/manager/team' },
  { icon: IconBell, label: 'Notifications', href: '/manager/notifications' },
  { icon: IconUsers, label: 'Roster Management', href: '/manager/roster' },
  { icon: IconTarget, label: 'Match Preparation', href: '/manager/matches' },
  { icon: IconClipboardList, label: 'Match Reports', href: '/manager/reports' },
  { icon: IconChartBar, label: 'Team Stats', href: '/manager/stats' },
];

/**
 * Menu items for Player role
 * Personal Stats, Calendar, Standings, Profile
 */
const playerMenuItems = [
  { icon: IconHome2, label: 'Home', href: '/player/dashboard' },
  { icon: IconUserStar, label: 'Personal Stats', href: '/player/stats' },
  { icon: IconCalendarStats, label: 'My Matches', href: '/player/calendar' },
  { icon: IconChartBar, label: 'Standings', href: '/player/standings' },
  { icon: IconUserCircle, label: 'My Profile', href: '/player/profile' },
];

const bottomMenuItems = [
  { icon: IconSettings, label: 'Settings', href: '/settings' },
  { icon: IconLogout, label: 'Logout', href: '/logout' },
];

interface NavbarProps {
  readonly role?: UserRole;
  readonly userName?: string;
}

export function Navbar({ role = UserRole.PLAYER, userName }: NavbarProps) {
  const [active, setActive] = useState(0);
  const [drawerOpened, setDrawerOpened] = useState(false);
  const isMobile = useMediaQuery('(max-width: 768px)');

  const getMenuItems = () => {
    switch (role) {
      case UserRole.ADMIN:
        return adminMenuItems;
      case UserRole.MANAGER:
        return managerMenuItems;
      case UserRole.PLAYER:
      default:
        return playerMenuItems;
    }
  };

  const menuItems = getMenuItems();

  const links = menuItems.map((link, index) => (
    <NavbarLink
      {...link}
      key={link.label}
      active={index === active}
      onClick={() => {
        setActive(index);
        setDrawerOpened(false);
      }}
    />
  ));

  const bottomLinks = bottomMenuItems.map((link) => (
    <NavbarLink
      {...link}
      key={link.label}
      onClick={() => setDrawerOpened(false)}
    />
  ));

  if (isMobile) {
    return (
      <>
        <Group justify="space-between" p="md">
          <Box>
            <UnstyledButton onClick={() => setDrawerOpened(true)}>
              <IconMenu2 size={24} />
            </UnstyledButton>
          </Box>
          <Box>{userName && <span>{userName}</span>}</Box>
        </Group>

        <Drawer
          opened={drawerOpened}
          onClose={() => setDrawerOpened(false)}
          title={`${role.charAt(0).toUpperCase() + role.slice(1)} Menu`}
          padding="md"
          size="xs"
        >
          <Stack justify="center" gap={0}>
            {links}
          </Stack>
          <Stack justify="center" gap={0} mt="xl">
            {bottomLinks}
          </Stack>
        </Drawer>
      </>
    );
  }

  return (
    <nav className={classes.navbar}>
      <Center>
        <Box title={`${role.charAt(0).toUpperCase() + role.slice(1)} Menu`}>
          {role === UserRole.ADMIN && <IconShield size={30} color="white" />}
          {role === UserRole.MANAGER && <IconClipboardList size={30} color="white" />}
          {role === UserRole.PLAYER && <IconUserCircle size={30} color="white" />}
        </Box>
      </Center>

      <div className={classes.navbarMain}>
        <Stack justify="center" gap={0}>
          {links}
        </Stack>
      </div>

      <Stack justify="center" gap={0}>
        {bottomLinks}
      </Stack>
    </nav>
  );
}