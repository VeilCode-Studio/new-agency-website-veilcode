import { Footer } from '@/components/shared/Footer';
import { Nav } from '@/components/shared/Navbar';
import { ChatbotWidget } from '@/components/chatbot/ChatbotWidget';
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
            <ChatbotWidget />
            <Footer />
        </>
    )
}

export default ClientLayout
