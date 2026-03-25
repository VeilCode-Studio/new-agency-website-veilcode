import React from 'react'
import { motion } from 'framer-motion'


const PrivacyFooter = () => {
    return (
        <motion.div
            initial={{ opacity: 0 }}
            whileInView={{ opacity: 1 }}
            className="mt-24 text-center text-xs text-ink-faint font-mono border-t border-line pt-8"
        >
            © 2026 VeilCode Studio Ltd. All rights reserved.<br />
            Built with precision · Deployed with purpose.
        </motion.div>
    )
}

export default PrivacyFooter