import React from "react";

const Footer: React.FC = () => {
    return (
        <footer className="py-4 px-6 text-center">
            <p className="text-sm text-gray-800 font-medium m-0">
                {new Date().getFullYear()} Jitsi Meet. Secure video conferencing for everyone.
            </p>
        </footer>
    );
};

export default Footer;
