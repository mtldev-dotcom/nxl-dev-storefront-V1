import * as React from "react"

export const Pinterest: React.FC<React.ComponentPropsWithoutRef<"svg">> = (props) => {
    return (
        <svg
            xmlns="http://www.w3.org/2000/svg"
            viewBox="0 0 24 24"
            fill="none"
            stroke="currentColor"
            strokeWidth="2"
            strokeLinecap="round"
            strokeLinejoin="round"
            {...props}
        >
            <line x1="8" y1="21" x2="12" y2="13" />
            <circle cx="12" cy="9" r="7" />
            <path d="M12 2C8.13 2 5 5.13 5 9c0 2.25 1.5 6 1.5 6s1.5-1.75 3.5-3.75S12 9 12 9s2 .25 4 2.25S21 15 21 15s1.5-3.75 1.5-6C22.5 5.13 19.37 2 15.5 2H12z" />
        </svg>
    )
} 