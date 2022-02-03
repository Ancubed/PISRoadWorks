import { useSession } from "next-auth/react"

import { Menu, Transition } from '@headlessui/react'
import { ChevronDownIcon } from '@heroicons/react/solid'

import CustomLink from "./customLink";

function classNames(...classes) {
    return classes.filter(Boolean).join(' ')
}

const UserLoginPanel = () => {
    const { data: session, status } = useSession();

    return (
        <div className='ml-auto'>
            { status === "authenticated" 
            ?
                <Menu as="div" className="relative inline-block text-left">
                    {({ open }) => (
                    <>
                        <Menu.Button className="inline-flex justify-center w-full rounded-m px-4 py-2 bg-white text-sm font-medium text-gray-70 focus:outline-none">
                            {session.user.name}
                            <ChevronDownIcon 
                            className={`-mr-1 ml-2 h-5 w-5 transform duration-100 ${open ? 'rotate-[180deg]' : ''}`} 
                            aria-hidden="true" />
                        </Menu.Button>

                        <Transition
                            show={open}
                            enter="transition ease-out duration-100"
                            enterFrom="transform opacity-0 scale-95"
                            enterTo="transform opacity-100 scale-100"
                            leave="transition ease-in duration-75"
                            leaveFrom="transform opacity-100 scale-100"
                            leaveTo="transform opacity-0 scale-95"
                        >
                            <Menu.Items static className="origin-top-right absolute right-0 mt-2 w-56 rounded-md shadow-lg bg-white ring-1 ring-black ring-opacity-5 focus:outline-none">
                            <div className="py-1">
                                <Menu.Item>
                                    {({ active }) => (
                                        <CustomLink href='/profile' className={`block px-4 py-2 text-sm 
                                        ${active 
                                        ? 'bg-gray-100 text-gray-900' 
                                        : 'text-gray-700'}`}>
                                            Личный кабинет
                                        </CustomLink>
                                    )}
                                </Menu.Item>
                                <Menu.Item>
                                    {({ active }) => (
                                        <CustomLink href='/api/auth/signout' className={`block px-4 py-2 text-sm 
                                        ${active 
                                        ? 'bg-gray-100 text-gray-900' 
                                        : 'text-gray-700'}`}>
                                            Выйти
                                        </CustomLink>
                                    )}
                                </Menu.Item>
                            </div>
                            </Menu.Items>
                        </Transition>
                    </>)}
                </Menu>
            : 
                <CustomLink href='/api/auth/signin'>
                    <h2>Вход</h2>
                </CustomLink>
            }
        </div>
    )
}

export default UserLoginPanel;