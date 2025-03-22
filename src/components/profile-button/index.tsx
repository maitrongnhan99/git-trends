"use client";

import { useAuth } from "@/utils/auth-context";
import {
  Menu,
  MenuButton,
  MenuItem,
  MenuItems,
  Transition,
} from "@headlessui/react";
import Image from "next/image";
import Link from "next/link";
import { FC, Fragment } from "react";
import { Else, If, Then } from "react-if";
import { twMerge } from "tailwind-merge";

interface ProfileButtonProps {
  className?: string;
}

const ProfileButton: FC<ProfileButtonProps> = ({ className }) => {
  const { user, logout } = useAuth();

  if (!user) return null;

  return (
    <Menu as="div" className={twMerge("relative", className)}>
      <MenuButton className="flex items-center focus:outline-none rounded-full hover:ring-2 hover:ring-primary/20 focus-visible:ring-2 focus-visible:ring-primary">
        <If condition={!!user?.image}>
          <Then>
            <Image
              src={user?.image as string}
              alt="User avatar"
              width={32}
              height={32}
              className="rounded-full border border-border"
            />
          </Then>
          <Else>
            <div className="flex items-center justify-center w-8 h-8 rounded-full bg-primary text-primary-foreground">
              {user?.email?.charAt(0)?.toUpperCase() || "U"}
            </div>
          </Else>
        </If>
      </MenuButton>

      <Transition
        as={Fragment}
        enter="transition ease-out duration-100"
        enterFrom="transform opacity-0 scale-95"
        enterTo="transform opacity-100 scale-100"
        leave="transition ease-in duration-75"
        leaveFrom="transform opacity-100 scale-100"
        leaveTo="transform opacity-0 scale-95"
      >
        <MenuItems className="absolute right-0 mt-2 w-56 origin-top-right divide-y divide-border rounded-md bg-popover shadow-lg ring-1 ring-black ring-opacity-5 focus:outline-none">
          <div className="px-4 py-3">
            <p className="text-sm font-medium">{user?.email}</p>
            <If condition={!!user?.name}>
              <Then>
                <p className="text-xs text-muted-foreground truncate">
                  {user?.name}
                </p>
              </Then>
            </If>
          </div>

          <div className="py-1">
            <MenuItem>
              <Link
                href="/profile"
                className={twMerge(
                  "flex w-full items-center px-4 py-2 text-sm",
                  "data-[headlessui-state=active]:bg-accent"
                )}
              >
                Your Profile
              </Link>
            </MenuItem>
            <MenuItem>
              <Link
                href="/settings"
                className={twMerge(
                  "flex w-full items-center px-4 py-2 text-sm",
                  "data-[headlessui-state=active]:bg-accent"
                )}
              >
                Settings
              </Link>
            </MenuItem>
          </div>

          <div className="py-1">
            <MenuItem>
              <button
                onClick={() => logout?.()}
                className={twMerge(
                  "flex w-full items-center px-4 py-2 text-sm text-left",
                  "data-[headlessui-state=active]:bg-accent"
                )}
              >
                Sign out
              </button>
            </MenuItem>
          </div>
        </MenuItems>
      </Transition>
    </Menu>
  );
};

export { ProfileButton };
