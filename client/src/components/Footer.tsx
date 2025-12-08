import React from "react";

const Footer: React.FC = () => {
    return (
        <footer className="py-4 px-6 text-center border-t border-gray-100 bg-white">
            <p className="text-sm text-gray-500 m-0">
                {new Date().getFullYear()} Jitsi Meet. Secure video conferencing for everyone.
            </p>
        </footer>
    );
};

export default Footer;
