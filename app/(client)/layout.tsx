import { Footer } from '@/components/shared/Footer';
import { Nav } from '@/components/shared/Navbar';
import React, { ReactNode } from 'react'

interface ClientLayoutProps {
    children: ReactNode;
}

const ClientLayout: React.FC<ClientLayoutProps> = ({ children }) => {
    return (
        <>
            <Nav />
            <main>
                {children}
            </main>
            <Footer />
        </>
    )
}

export default ClientLayout