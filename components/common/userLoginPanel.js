import { useSession } from 'next-auth/react'

import { Menu, Transition } from '@headlessui/react'
import { ChevronDownIcon } from '@heroicons/react/solid'

import CustomLink from './customLink'

const UserLoginPanel = (props) => {
    const { data: session, status } = useSession()

    return (
        <div className={`${props.className ? props.className : ''}`}>
            {status === 'authenticated' ? (
                <Menu as="div" className="relative inline-block text-left z-10">
                    {({ open }) => (
                        <>
                            <Menu.Button className="inline-flex text-right w-full h-full rounded-m text-sm font-medium focus:outline-none hover:text-blue-500">
                                {session.user.name}
                                <ChevronDownIcon
                                    className={`-mr-1 ml-2 h-5 w-5 transform duration-100 ${
                                        open ? 'rotate-[180deg]' : ''
                                    }`}
                                    aria-hidden="true"
                                />
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
                                <Menu.Items
                                    static
                                    className="origin-top-right absolute right-0 mt-2 w-56 rounded-md drop-shadow-lg focus:outline-none bg-white"
                                >
                                    <div className="py-1">
                                        <Menu.Item>
                                            {({ active }) => (
                                                <CustomLink
                                                    href="/profile"
                                                    className={`block px-4 py-2 text-sm 
                                        ${
                                            active
                                                ? 'text-blue-500'
                                                : ''
                                        }`}
                                                >
                                                    ???????????? ??????????????
                                                </CustomLink>
                                            )}
                                        </Menu.Item>
                                        <Menu.Item>
                                            {({ active }) => (
                                                <CustomLink
                                                    href="/api/auth/signout"
                                                    className={`block px-4 py-2 text-sm 
                                        ${
                                            active
                                                ? 'text-blue-500'
                                                : ''
                                        }`}
                                                >
                                                    ??????????
                                                </CustomLink>
                                            )}
                                        </Menu.Item>
                                    </div>
                                </Menu.Items>
                            </Transition>
                        </>
                    )}
                </Menu>
            ) : (
                <CustomLink href="/api/auth/signin" title='???????????? ?????????????? ?????????????????????? ?? ??????????????????'>
                    <h2>????????</h2>
                </CustomLink>
            )}
        </div>
    )
}

export default UserLoginPanel
