import React from 'react'
import { ArrowLeft, Sparkles } from 'lucide-react'
import { Card, CardContent } from '../ui/card'
import Link from 'next/link'
import { Button } from '../ui/button'
import { PrimaryButton } from './Primitives'

const NotFoundLinks = () => {
    return (
        <Card className="mt-20 bg-surface border-line mx-auto max-w-md">
            <CardContent className="pt-8 pb-8">
                <div className="flex items-center gap-2 mb-6 justify-center">
                    <Sparkles className="w-5 h-5 text-brand" />
                    <p className="uppercase text-xs tracking-[1px] font-medium text-ink-faint">Quick Navigation</p>
                </div>

                <div className="grid grid-cols-2 gap-3 text-sm">
                    <Button
                        variant="ghost"
                        className="justify-start text-left h-auto py-3 px-4 text-ink-muted hover:text-brand hover:bg-surface-hi"
                        asChild
                    >
                        <Link href="/services">Services</Link>
                    </Button>
                    <Button
                        variant="ghost"
                        className="justify-start text-left h-auto py-3 px-4 text-ink-muted hover:text-brand hover:bg-surface-hi"
                        asChild
                    >
                        <Link href="/work">Our Work</Link>
                    </Button>
                    <Button
                        variant="ghost"
                        className="justify-start text-left h-auto py-3 px-4 text-ink-muted hover:text-brand hover:bg-surface-hi"
                        asChild
                    >
                        <Link href="/careers">Careers</Link>
                    </Button>
                    <Button
                        variant="ghost"
                        className="justify-start text-left h-auto py-3 px-4 text-ink-muted hover:text-brand hover:bg-surface-hi"
                        asChild
                    >
                        <Link href="/privacy-policy">Privacy Policy</Link>
                    </Button>
                </div>

                <div className="mt-8 pt-6 border-t border-line">
                    <PrimaryButton>
                        <Link href="/" className='flex gap-2 justify-center items-center'>
                            <ArrowLeft className="w-4 h-4" /> Back to VeilCode Studio
                        </Link>
                    </PrimaryButton>
                </div>
            </CardContent>
        </Card>
    )
}

export default NotFoundLinks