import React from 'react'
import * as m from "framer-motion/m";


const PrivacyFooter = () => {
    return (
        <m.div
            initial={{ opacity: 0 }}
            whileInView={{ opacity: 1 }}
            className="mt-24 text-center text-xs text-ink-faint font-mono border-t border-line pt-8"
        >
            © 2026 VeilCode Studio Ltd. All rights reserved.<br />
            Built with precision · Deployed with purpose.
        </m.div>
    )
}

export default PrivacyFooter