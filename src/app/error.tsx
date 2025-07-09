'use client'

import { useEffect } from 'react'

export default function Error({
    error,
    reset,
}: {
    error: Error & { digest?: string }
    reset: () => void
}) {
    useEffect(() => {
        // Log the error to an error reporting service
        console.error('Application error:', error)
    }, [error])

    return (
        <div className="flex min-h-screen flex-col items-center justify-center p-4">
            <div className="text-center">
                <h2 className="text-2xl font-bold text-gray-900 mb-4">
                    Something went wrong!
                </h2>
                <p className="text-gray-600 mb-6">
                    We're sorry, but there was an error loading this page.
                </p>
                <div className="space-x-4">
                    <button
                        onClick={reset}
                        className="bg-blue-500 hover:bg-blue-600 text-white px-4 py-2 rounded"
                    >
                        Try again
                    </button>
                    <a
                        href="/"
                        className="bg-gray-500 hover:bg-gray-600 text-white px-4 py-2 rounded inline-block"
                    >
                        Go home
                    </a>
                </div>
                {process.env.NODE_ENV === 'development' && (
                    <details className="mt-6 p-4 bg-gray-100 rounded text-left">
                        <summary className="cursor-pointer font-semibold">
                            Error Details (Development Only)
                        </summary>
                        <pre className="mt-2 text-sm overflow-auto">
                            {error.message}
                            {error.digest && `\nDigest: ${error.digest}`}
                        </pre>
                    </details>
                )}
            </div>
        </div>
    )
} 