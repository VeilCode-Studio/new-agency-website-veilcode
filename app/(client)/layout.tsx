import { MotionProvider } from "@/components/providers/MotionProvider";
import { Footer } from '@/components/shared/Footer';
import { Nav } from '@/components/shared/Navbar';
import { ChatbotGate } from '@/components/chatbot/ChatbotGate';
import React, { ReactNode } from 'react'

interface ClientLayoutProps {
    children: ReactNode;
}

const ClientLayout: React.FC<ClientLayoutProps> = ({ children }) => {
    return (
        <>
            <Nav />
            <main>
                <MotionProvider>{children}</MotionProvider>
            </main>
            <ChatbotGate />
            <Footer />
        </>
    )
}

export default ClientLayout
